from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import CampaignSubmission, PillarDescription
from .serializers import CampaignSubmissionSerializer
from django.conf import settings
import random # Stub for OTP generator
import requests
import logging
import os
import time
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

# Cache for custom field IDs (field_name -> field_id)
# This will be populated when we fetch custom fields from GHL
_custom_field_cache = {}

# Simple in-memory OTP storage (for testing)
# Format: {phone: {'code': '1234', 'expires_at': datetime}}
otp_storage = {}

class SubmissionCreateView(generics.CreateAPIView):
    queryset = CampaignSubmission.objects.all()
    serializer_class = CampaignSubmissionSerializer
    parser_classes = (MultiPartParser, FormParser)
    
    def create(self, request, *args, **kwargs):
        # Create the campaign submission first
        response = super().create(request, *args, **kwargs)
        
        # If submission was successful, create GHL sub-account
        if response.status_code == status.HTTP_201_CREATED:
            submission_data = response.data
            submission_id = submission_data.get('id')
            
            try:
                submission = CampaignSubmission.objects.get(id=submission_id)
                ghl_location_id = self.create_ghl_location(submission)
                
                if ghl_location_id:
                    submission.ghl_location_id = ghl_location_id
                    # Save location_id first
                    submission.save(update_fields=['ghl_location_id'])
                    logger.info(f"GHL location created successfully for submission {submission_id}: {ghl_location_id}")
                    
                    # ALWAYS create/update contact in the static OTP location (from .env)
                    # The contact should always be in the static location, not the newly created subaccount
                    static_location_id = settings.GHL_OTP_LOCATION_ID
                    if not static_location_id:
                        logger.error("GHL_OTP_LOCATION_ID not configured. Cannot create contact.")
                    else:
                        logger.info(f"Creating/updating contact in static location {static_location_id} for submission {submission_id}")
                        
                        # If contact was already created during OTP verification, update it
                        if submission.ghl_contact_id:
                            logger.info(f"Updating existing contact {submission.ghl_contact_id} in static location")
                            contact_updated = self.update_ghl_contact_with_custom_fields(submission, submission.ghl_contact_id)
                            if contact_updated:
                                logger.info(f"✓ Contact updated successfully in static location: {submission.ghl_contact_id}")
                            else:
                                logger.warning(f"⚠ Failed to update contact in static location for submission {submission_id}")
                        else:
                            # Create new contact in static location if it doesn't exist
                            logger.info(f"Creating new contact in static location {static_location_id}")
                            new_contact_id = self.create_ghl_contact(submission, static_location_id)
                            
                            if new_contact_id:
                                logger.info(f"✓ Contact created successfully in static location: {new_contact_id}")
                                # Save the contact ID to the submission
                                submission.ghl_contact_id = new_contact_id
                                submission.save(update_fields=['ghl_contact_id'])
                            else:
                                logger.error(f"✗ Failed to create contact in static location {static_location_id} for submission {submission_id}")
                else:
                    logger.warning(f"Failed to create GHL location for submission {submission_id}")
            except CampaignSubmission.DoesNotExist:
                logger.error(f"Submission {submission_id} not found after creation")
            except KeyError as e:
                logger.error(f"KeyError creating GHL location for submission {submission_id}: {str(e)}")
                logger.exception("Full KeyError traceback:")
            except Exception as e:
                logger.error(f"Error creating GHL location for submission {submission_id}: {str(e)}")
                logger.exception("Full exception traceback:")
        
        return response
    
    def get_custom_field_ids(self, location_id, api_token):
        """
        Fetch custom field IDs from GHL API for the given location
        Returns a dictionary mapping field name -> field id
        """
        global _custom_field_cache
        
        # Check cache first
        cache_key = f"{location_id}_{api_token[:10]}"
        if cache_key in _custom_field_cache:
            logger.info(f"Using cached custom field IDs for location {location_id}")
            return _custom_field_cache[cache_key]
        
        logger.info(f"Fetching custom field IDs from GHL for location {location_id}")
        
        headers = {
            'Authorization': f'Bearer {api_token}',
            'Content-Type': 'application/json',
            'Version': '2021-07-28',
            'Accept': 'application/json'
        }
        
        try:
            # GET /locations/:locationId/customFields?model=contact
            api_url = f"{settings.GHL_API_BASE_URL}/locations/{location_id}/customFields"
            params = {'model': 'contact'}
            
            logger.info(f"GET request URL: {api_url} with model=contact")
            
            response = requests.get(api_url, headers=headers, params=params, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                custom_fields = data.get('customFields', [])
                
                # Create mapping: field name -> field id
                field_mapping = {}
                for field in custom_fields:
                    field_name = field.get('name')
                    field_id = field.get('id')
                    field_key = field.get('fieldKey', '')  # API uses 'fieldKey' not 'key'
                    
                    if field_id and field_name:
                        field_mapping[field_name] = field_id
                        logger.info(f"Found custom field: {field_name} -> {field_id}")
                    
                    # Also map by fieldKey if available (e.g., "contact.pillar_1")
                    if field_id and field_key:
                        # Extract just the field name part after "contact."
                        if '.' in field_key:
                            key_name = field_key.split('.', 1)[1]
                            field_mapping[key_name] = field_id
                        else:
                            field_mapping[field_key] = field_id
                
                # Cache the mapping
                _custom_field_cache[cache_key] = field_mapping
                logger.info(f"✓ Fetched {len(field_mapping)} custom field IDs and cached them")
                return field_mapping
            else:
                logger.error(f"✗ Failed to fetch custom fields: {response.status_code} - {response.text}")
                return {}
                
        except requests.exceptions.RequestException as e:
            logger.error(f"✗ Error fetching custom fields: {str(e)}")
            logger.exception("Full exception traceback:")
            return {}
        except Exception as e:
            logger.error(f"✗ Unexpected error fetching custom fields: {str(e)}")
            logger.exception("Full exception traceback:")
            return {}
    
    def upload_image_to_ghl_custom_field(self, image_field, field_name, location_id, custom_field_id, api_token, contact_id=None):
        """
        Upload an image file to GHL custom field using the upload endpoint
        POST /locations/:locationId/customFields/upload
        
        Args:
            image_field: Django ImageField or file path
            field_name: Name of the field (for logging)
            location_id: GHL location ID
            custom_field_id: GHL custom field ID (for file type fields) or None (to get URL and store in text field)
            api_token: GHL API token
            contact_id: Contact ID (optional, for contact-specific uploads)
        
        Returns:
            URL string if successful, None otherwise
        """
        if not image_field:
            logger.debug(f"No {field_name} image to upload")
            return None
        
        try:
            logger.info(f"Uploading {field_name} to GHL custom field: {custom_field_id}")
            
            # Read the image file
            if hasattr(image_field, 'read'):
                image_field.open('rb')
                file_content = image_field.read()
                file_name = image_field.name
                image_field.close()
            elif hasattr(image_field, 'path'):
                # Django ImageField with path
                file_path = image_field.path
                with open(file_path, 'rb') as f:
                    file_content = f.read()
                file_name = os.path.basename(file_path)
            else:
                # File path string
                file_path = str(image_field)
                with open(file_path, 'rb') as f:
                    file_content = f.read()
                file_name = os.path.basename(file_path)
            
            # Get file extension and content type
            file_ext = os.path.splitext(file_name)[1].lower()
            content_type_map = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.webp': 'image/webp'
            }
            content_type = content_type_map.get(file_ext, 'image/jpeg')
            
            # Prepare multipart form data
            files = {
                'file': (file_name, file_content, content_type)
            }
            
            # Prepare form data
            data = {
                'id': custom_field_id or contact_id,  # Use custom field ID or contact ID
                'maxFiles': '15'
            }
            
            headers = {
                'Authorization': f'Bearer {api_token}',
                'Version': '2021-07-28',
            }
            
            # Upload to GHL custom fields upload endpoint
            api_url = f"{settings.GHL_API_BASE_URL}/locations/{location_id}/customFields/upload"
            
            logger.info(f"Uploading {field_name} to: {api_url}")
            logger.info(f"Custom field ID: {custom_field_id}, Contact ID: {contact_id}")
            
            response = requests.post(
                api_url,
                files=files,
                data=data,
                headers=headers,
                timeout=60  # Longer timeout for file uploads
            )
            
            logger.info(f"Upload response status: {response.status_code}")
            
            if response.status_code in [200, 201]:
                try:
                    response_data = response.json()
                    uploaded_files = response_data.get('uploadedFiles', {})
                    meta = response_data.get('meta', [])
                    
                    # Get the URL from uploadedFiles (it's a dict with filename -> URL)
                    if uploaded_files:
                        # Get the first (and usually only) file URL
                        file_url = list(uploaded_files.values())[0]
                        logger.info(f"✓ {field_name} uploaded successfully: {file_url}")
                        return file_url
                    elif meta and len(meta) > 0:
                        # Fallback to meta array
                        file_url = meta[0].get('url')
                        if file_url:
                            logger.info(f"✓ {field_name} uploaded successfully (from meta): {file_url}")
                            return file_url
                    else:
                        logger.warning(f"⚠ {field_name} uploaded but no URL in response: {response_data}")
                        return None
                except Exception as e:
                    logger.error(f"✗ Error parsing {field_name} upload response: {str(e)}")
                    logger.error(f"Response: {response.text[:500]}")
                    return None
            else:
                logger.error(f"✗ Failed to upload {field_name}: {response.status_code} - {response.text[:500]}")
                return None
                
        except FileNotFoundError as e:
            logger.error(f"✗ File not found for {field_name}: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"✗ Error uploading {field_name}: {str(e)}")
            logger.exception("Full exception traceback:")
            return None
    
    def upload_contact_images(self, submission, contact_id, location_id, api_token, field_id_mapping):
        """
        Upload all contact images and return a dict of field_name -> image_url
        """
        image_urls = {}
        
        # Upload headshot
        if submission.headshot:
            logger.info("Uploading headshot...")
            headshot_url = self.upload_image_to_ghl_custom_field(
                submission.headshot,
                "Headshot",
                location_id,
                None,  # No custom field ID - we'll store URL in text field
                api_token,
                contact_id
            )
            if headshot_url:
                image_urls["Headshot URL"] = headshot_url
        
        # Upload background picture
        if submission.background_picture:
            logger.info("Uploading background picture...")
            background_url = self.upload_image_to_ghl_custom_field(
                submission.background_picture,
                "Background Picture",
                location_id,
                None,
                api_token,
                contact_id
            )
            if background_url:
                image_urls["Background Picture URL"] = background_url
        
        # Upload action shots
        if submission.action_shot_1:
            logger.info("Uploading action shot 1...")
            action1_url = self.upload_image_to_ghl_custom_field(
                submission.action_shot_1,
                "Action Shot 1",
                location_id,
                None,
                api_token,
                contact_id
            )
            if action1_url:
                image_urls["Action Shot 1 URL"] = action1_url
        
        if submission.action_shot_2:
            logger.info("Uploading action shot 2...")
            action2_url = self.upload_image_to_ghl_custom_field(
                submission.action_shot_2,
                "Action Shot 2",
                location_id,
                None,
                api_token,
                contact_id
            )
            if action2_url:
                image_urls["Action Shot 2 URL"] = action2_url
        
        if submission.action_shot_3:
            logger.info("Uploading action shot 3...")
            action3_url = self.upload_image_to_ghl_custom_field(
                submission.action_shot_3,
                "Action Shot 3",
                location_id,
                None,
                api_token,
                contact_id
            )
            if action3_url:
                image_urls["Action Shot 3 URL"] = action3_url
        
        logger.info(f"Uploaded {len(image_urls)} images successfully")
        return image_urls
    
    def update_contact_image_urls(self, contact_id, image_urls, location_id, api_token, field_id_mapping):
        """
        Update contact with image URLs in custom fields
        """
        if not image_urls:
            return False
        
        # Build custom fields array with image URLs
        image_custom_fields = []
        missing_fields = []
        
        for field_name, image_url in image_urls.items():
            field_id = field_id_mapping.get(field_name)
            
            if field_id:
                image_custom_fields.append({
                    "id": field_id,
                    "field_value": image_url
                })
                logger.info(f"Mapped image URL field: {field_name} -> {field_id}")
            else:
                missing_fields.append(field_name)
                logger.warning(f"⚠ Image URL field '{field_name}' not found in GHL. Skipping.")
        
        if missing_fields:
            logger.warning(f"⚠ The following image URL fields are missing in GHL: {', '.join(missing_fields)}")
            logger.warning(f"⚠ Please create these custom fields in GHL for location {location_id}")
        
        if not image_custom_fields:
            logger.warning("No image URL fields to update")
            return False
        
        # Update contact with image URLs
        headers = {
            'Authorization': f'Bearer {api_token}',
            'Content-Type': 'application/json',
            'Version': '2021-07-28',
            'Accept': 'application/json'
        }
        
        try:
            update_url = f"{settings.GHL_API_BASE_URL}/contacts/{contact_id}"
            payload = {
                "customFields": image_custom_fields
            }
            
            logger.info(f"Updating contact {contact_id} with {len(image_custom_fields)} image URL fields")
            response = requests.put(update_url, json=payload, headers=headers, timeout=30)
            
            if response.status_code in [200, 201]:
                logger.info(f"✓ Image URLs updated successfully for contact {contact_id}")
                return True
            else:
                logger.error(f"✗ Failed to update image URLs: {response.status_code} - {response.text[:500]}")
                return False
                
        except Exception as e:
            logger.error(f"✗ Error updating image URLs: {str(e)}")
            logger.exception("Full exception traceback:")
            return False
    
    def create_ghl_location(self, submission):
        """
        Create a GoHighLevel sub-account/location for the campaign submission
        """
        if not settings.GHL_API_TOKEN or not settings.GHL_COMPANY_ID:
            logger.warning("GHL API credentials not configured. Skipping GHL location creation.")
            return None
        
        # Prepare location name
        location_name = f"{submission.first_name} {submission.last_name}"

        # Format phone number (ensure it starts with +)
        phone = submission.phone
        if phone and not phone.startswith('+'):
            # Add + prefix if missing (assumes US numbers, adjust as needed)
            phone = f"+{phone}"
        
        # Build website URL if we have a slug
        website = None
        if submission.slug:
            # You may need to adjust this based on your actual domain
            base_url = os.environ.get('BASE_URL', 'https://thetrumpet.app')
            website = f"{base_url}/temp/{submission.slug}"
        
        # Prepare request payload
        payload = {
            "name": location_name,
            "phone": phone or "",
            "companyId": settings.GHL_COMPANY_ID,
            "website": website,
            "timezone": "US/Central",  # Default timezone, can be made configurable
            "country": "US",  # Default country, can be made configurable
            "prospectInfo": {
                "firstName": submission.first_name,
                "lastName": submission.last_name,
                "email": submission.email
            },
            "settings": {
                "allowDuplicateContact": False,
                "allowDuplicateOpportunity": False,
                "allowFacebookNameMerge": False,
                "disableContactTimezone": False
            }
        }
        
        # Add snapshot ID if configured
        if settings.GHL_SNAPSHOT_ID:
            payload["snapshotId"] = settings.GHL_SNAPSHOT_ID
        
        # Make API request to GHL
        headers = {
            'Authorization': f'Bearer {settings.GHL_API_TOKEN}',
            'Content-Type': 'application/json',
            'Version': '2021-07-28',
            'Accept': 'application/json'
        }
        
        try:
            api_url = f"{settings.GHL_API_BASE_URL}/locations/"
            logger.info(f"Creating GHL location: {api_url}")
            logger.info(f"Payload: name={location_name}, companyId={settings.GHL_COMPANY_ID}")
            
            ghl_response = requests.post(api_url, json=payload, headers=headers, timeout=30)
            
            logger.info(f"GHL location creation response status: {ghl_response.status_code}")
            
            # GHL API returns 201 (Created) for successful location creation
            if ghl_response.status_code in [200, 201]:
                try:
                    ghl_data = ghl_response.json()
                    location_id = ghl_data.get('id')
                    company_id = ghl_data.get('companyId')
                    
                    if not location_id:
                        logger.error(f"GHL location created but no ID in response: {ghl_data}")
                        return None
                    
                    logger.info(f"GHL location created: {location_id} (Company ID: {company_id})")
                    return location_id
                except Exception as e:
                    logger.error(f"Error parsing GHL location creation response: {str(e)}")
                    logger.error(f"Response text: {ghl_response.text[:500]}")
                    return None
            else:
                logger.error(f"GHL API error: {ghl_response.status_code} - {ghl_response.text}")
                return None
                
        except requests.exceptions.RequestException as e:
            logger.error(f"GHL API request failed: {str(e)}")
            logger.exception("Full exception traceback:")
            return None
        except Exception as e:
            logger.error(f"Unexpected error creating GHL location: {str(e)}")
            logger.exception("Full exception traceback:")
            return None
    
    def update_ghl_contact_with_custom_fields(self, submission, contact_id):
        """
        Update existing GHL contact with all custom fields from the submission
        Uses the static OTP location ID
        """
        logger.info(f"=== Starting contact update in OTP location ===")
        logger.info(f"Contact ID: {contact_id}, Submission ID: {submission.id}")
        
        if not contact_id:
            logger.error("Contact ID not provided. Skipping contact update.")
            return False
        
        if not settings.GHL_LOCATION_API_TOKEN or not settings.GHL_OTP_LOCATION_ID:
            logger.error("GHL location token or OTP location ID not configured. Skipping contact update.")
            return False
        
        location_id = settings.GHL_OTP_LOCATION_ID
        logger.info(f"OTP Location ID: {location_id}")
        
        # Format phone number (ensure it starts with +)
        phone = submission.phone
        if phone and not phone.startswith('+'):
            phone = f"+{phone}"
        
        # Prepare contact payload with basic fields
        payload = {
            "firstName": submission.first_name,
            "lastName": submission.last_name,
            "email": submission.email,
            "phone": phone or "",
        }
        
        logger.info(f"Basic contact payload: firstName={submission.first_name}, lastName={submission.last_name}, email={submission.email}")
        
        # Map all form fields to custom fields
        custom_fields = {}
        
        # Election details
        if submission.riding_zone_name:
            custom_fields["Riding Zone Name"] = submission.riding_zone_name
        
        if submission.election_date:
            custom_fields["Election Date"] = str(submission.election_date)
        
        # Bio fields
        if submission.position_running_for:
            custom_fields["Position Running For"] = submission.position_running_for
        
        if submission.tag_line:
            custom_fields["Tag Line"] = submission.tag_line
        
        if submission.bio_text:
            custom_fields["Bio Text"] = submission.bio_text
        
        # Platform/Pillars
        if submission.pillar_1:
            custom_fields["Pillar 1"] = submission.pillar_1
        
        if submission.pillar_1_desc:
            custom_fields["Pillar 1 Description"] = submission.pillar_1_desc
        
        if submission.pillar_2:
            custom_fields["Pillar 2"] = submission.pillar_2
        
        if submission.pillar_2_desc:
            custom_fields["Pillar 2 Description"] = submission.pillar_2_desc
        
        if submission.pillar_3:
            custom_fields["Pillar 3"] = submission.pillar_3
        
        if submission.pillar_3_desc:
            custom_fields["Pillar 3 Description"] = submission.pillar_3_desc
        
        # Customization
        if submission.template_style:
            custom_fields["Template Style"] = submission.template_style
        
        if submission.primary_color:
            custom_fields["Primary Color"] = submission.primary_color
        
        if submission.secondary_color:
            custom_fields["Secondary Color"] = submission.secondary_color
        
        if submission.custom_slug:
            custom_fields["Custom Slug"] = submission.custom_slug
        
        if submission.donation_url:
            custom_fields["Donation URL"] = submission.donation_url
        
        if submission.event_calendar_url:
            custom_fields["Event Calendar URL"] = submission.event_calendar_url
        
        # Add website URL
        if submission.slug:
            base_url = os.environ.get('BASE_URL', 'https://thetrumpet.app')
            website_url = f"{base_url}/temp/{submission.slug}"
            custom_fields["Campaign Website URL"] = website_url
        
        logger.info(f"Prepared {len(custom_fields)} custom fields: {list(custom_fields.keys())}")
        
        # Fetch custom field IDs from GHL API
        field_id_mapping = self.get_custom_field_ids(location_id, settings.GHL_LOCATION_API_TOKEN)
        
        if not field_id_mapping:
            logger.warning("⚠ No custom field IDs found. Custom fields may not be set correctly.")
            logger.warning("⚠ Make sure all custom fields are created in GHL for this location.")
        
        # Convert custom fields to the format required by GHL API
        # Use id and field_value format
        custom_fields_array = []
        missing_fields = []
        
        for field_name, field_value in custom_fields.items():
            if field_value is not None:
                # Get the field ID from the mapping
                field_id = field_id_mapping.get(field_name)
                
                if field_id:
                    field_obj = {
                        "id": field_id,
                        "field_value": str(field_value)
                    }
                    custom_fields_array.append(field_obj)
                    logger.debug(f"Mapped custom field: {field_name} -> {field_id}")
                else:
                    missing_fields.append(field_name)
                    logger.warning(f"⚠ Custom field '{field_name}' not found in GHL. Skipping.")
        
        if missing_fields:
            logger.warning(f"⚠ The following custom fields are missing in GHL: {', '.join(missing_fields)}")
            logger.warning(f"⚠ Please create these custom fields in GHL for location {location_id}")
        
        # Include custom fields in the update payload
        if custom_fields_array:
            payload["customFields"] = custom_fields_array
            logger.info(f"Including {len(custom_fields_array)} custom fields in update request")
        
        # Make API request to GHL
        headers = {
            'Authorization': f'Bearer {settings.GHL_LOCATION_API_TOKEN}',
            'Content-Type': 'application/json',
            'Version': '2021-07-28',
            'Accept': 'application/json'
        }
        
        try:
            # Update existing contact with all fields including custom fields
            api_url = f"{settings.GHL_API_BASE_URL}/contacts/{contact_id}"
            logger.info(f"PUT request URL: {api_url}")
            logger.info(f"Updating contact with basic fields and {len(custom_fields_array)} custom fields")
            
            ghl_response = requests.put(api_url, json=payload, headers=headers, timeout=30)
            
            logger.info(f"Response status code: {ghl_response.status_code}")
            
            if ghl_response.status_code in [200, 201]:
                logger.info(f"✓ GHL contact updated successfully: {contact_id}")
                
                # If custom fields weren't included or failed, try setting them separately
                if custom_fields_array:
                    # Verify custom fields were set
                    try:
                        response_data = ghl_response.json()
                        contact_data = response_data.get('contact', response_data)
                        existing_custom_fields = contact_data.get('customField', {})
                        logger.info(f"Custom fields in response: {len(existing_custom_fields) if isinstance(existing_custom_fields, dict) else 'N/A'}")
                    except:
                        pass
                    
                    # Try to set custom fields separately if needed
                    custom_fields_set = self.set_contact_custom_fields(
                        contact_id, 
                        location_id, 
                        custom_fields_array, 
                        settings.GHL_LOCATION_API_TOKEN
                    )
                    
                    if custom_fields_set:
                        logger.info(f"✓ Custom fields verified/set for contact {contact_id}")
                    else:
                        logger.warning(f"⚠ Custom fields may not have been set correctly for contact {contact_id}")
                
                logger.info(f"=== Contact update completed successfully: {contact_id} ===")
                return True
            else:
                logger.error(f"✗ GHL API error updating contact: {ghl_response.status_code}")
                logger.error(f"Error response: {ghl_response.text[:500]}")
                return False
                
        except requests.exceptions.Timeout as e:
            logger.error(f"✗ GHL API request timed out: {str(e)}")
            return False
        except requests.exceptions.RequestException as e:
            logger.error(f"✗ GHL API request failed for contact update: {str(e)}")
            logger.exception("Full exception traceback:")
            return False
        except Exception as e:
            logger.error(f"✗ Unexpected error during contact update: {str(e)}")
            logger.exception("Full exception traceback:")
            return False
    
    def create_ghl_contact(self, submission, location_id):
        """
        Upsert (create or update) a contact in GoHighLevel using the static location ID from .env
        Uses GHL_LOCATION_API_TOKEN for contact operations
        Always uses GHL_OTP_LOCATION_ID from .env lines 24-25
        Follows GHL API documentation: POST /contacts/upsert with locationId in payload
        If a contact with the same email or phone exists, it will be updated instead of creating a duplicate
        """
        logger.info(f"=== Starting contact upsert ===")
        logger.info(f"Submission ID: {submission.id}, Name: {submission.first_name} {submission.last_name}")
        
        # ALWAYS use the static location ID from .env (lines 24-25)
        static_location_id = settings.GHL_OTP_LOCATION_ID
        if not static_location_id:
            logger.error("GHL_OTP_LOCATION_ID not configured in .env. Cannot create contact.")
            return None
        
        # Use location-specific token for contact creation in the new subaccount
        # This token should have permissions to create contacts in subaccounts
        api_token = settings.GHL_LOCATION_API_TOKEN
        if not api_token:
            logger.error("GHL_API_TOKEN not configured in .env (lines 21-22). Cannot create contact.")
            logger.error("Please set GHL_API_TOKEN in environment variables.")
            return None
        
        logger.info(f"Using GHL_API_TOKEN from .env (lines 21-22) for contact creation")
        logger.info(f"Token preview: {api_token[:10]}... (truncated for security)")
        
        # Format phone number (ensure it starts with +)
        phone = submission.phone
        if phone and not phone.startswith('+'):
            phone = f"+{phone}"
        
        logger.info(f"Formatted phone: {phone}")
        
        # Prepare full name
        full_name = f"{submission.first_name} {submission.last_name}".strip()
        
        # Prepare contact payload exactly as per GHL API documentation
        # POST /contacts/ with locationId in the body
        payload = {
            "firstName": submission.first_name,
            "lastName": submission.last_name,
            "name": full_name,
            "email": submission.email,
            "locationId": static_location_id,  # Always use static location from .env
        }
        
        # Add phone if available
        if phone:
            payload["phone"] = phone
        
        logger.info(f"Contact payload: firstName={submission.first_name}, lastName={submission.last_name}, name={full_name}, email={submission.email}, locationId={static_location_id}")
        
        # Map all form fields to custom fields
        # Note: Custom field names should match what's configured in GHL
        custom_fields = {}
        
        # Election details
        if submission.riding_zone_name:
            custom_fields["Riding Zone Name"] = submission.riding_zone_name
        
        if submission.election_date:
            custom_fields["Election Date"] = str(submission.election_date)
        
        # Bio fields
        if submission.position_running_for:
            custom_fields["Position Running For"] = submission.position_running_for
        
        if submission.tag_line:
            custom_fields["Tag Line"] = submission.tag_line
        
        if submission.bio_text:
            custom_fields["Bio Text"] = submission.bio_text
        
        # Platform/Pillars
        if submission.pillar_1:
            custom_fields["Pillar 1"] = submission.pillar_1
        
        if submission.pillar_1_desc:
            custom_fields["Pillar 1 Description"] = submission.pillar_1_desc
        
        if submission.pillar_2:
            custom_fields["Pillar 2"] = submission.pillar_2
        
        if submission.pillar_2_desc:
            custom_fields["Pillar 2 Description"] = submission.pillar_2_desc
        
        if submission.pillar_3:
            custom_fields["Pillar 3"] = submission.pillar_3
        
        if submission.pillar_3_desc:
            custom_fields["Pillar 3 Description"] = submission.pillar_3_desc
        
        # Customization
        if submission.template_style:
            custom_fields["Template Style"] = submission.template_style
        
        if submission.primary_color:
            custom_fields["Primary Color"] = submission.primary_color
        
        if submission.secondary_color:
            custom_fields["Secondary Color"] = submission.secondary_color
        
        if submission.custom_slug:
            custom_fields["Custom Slug"] = submission.custom_slug
        
        if submission.donation_url:
            custom_fields["Donation URL"] = submission.donation_url
        
        if submission.event_calendar_url:
            custom_fields["Event Calendar URL"] = submission.event_calendar_url
        
        # Add website URL
        if submission.slug:
            base_url = os.environ.get('BASE_URL', 'https://thetrumpet.app')
            website_url = f"{base_url}/temp/{submission.slug}"
            custom_fields["Campaign Website URL"] = website_url
        
        logger.info(f"Prepared {len(custom_fields)} custom fields: {list(custom_fields.keys())}")
        
        # Fetch custom field IDs from GHL API
        field_id_mapping = self.get_custom_field_ids(static_location_id, api_token)
        
        if not field_id_mapping:
            logger.warning("⚠ No custom field IDs found. Custom fields may not be set correctly.")
            logger.warning("⚠ Make sure all custom fields are created in GHL for this location.")
        
        # Convert custom fields to the format required by GHL Upsert API
        # Upsert API format: id (required), key (optional), field_value (required)
        custom_fields_array = []
        missing_fields = []
        
        for field_name, field_value in custom_fields.items():
            # Ensure value is not None
            if field_value is not None:
                # Get the field ID from the mapping
                field_id = field_id_mapping.get(field_name)
                
                if field_id:
                    field_obj = {
                        "id": field_id,
                        "field_value": str(field_value)
                    }
                    custom_fields_array.append(field_obj)
                    logger.debug(f"Mapped custom field: {field_name} -> {field_id}")
                else:
                    missing_fields.append(field_name)
                    logger.warning(f"⚠ Custom field '{field_name}' not found in GHL. Skipping.")
        
        if missing_fields:
            logger.warning(f"⚠ The following custom fields are missing in GHL: {', '.join(missing_fields)}")
            logger.warning(f"⚠ Please create these custom fields in GHL for location {static_location_id}")
        
        # Add custom fields to payload if we have any
        if custom_fields_array:
            payload["customFields"] = custom_fields_array
            logger.info(f"Including {len(custom_fields_array)} custom fields in upsert request")
            logger.info(f"Custom field IDs: {[f.get('id', 'N/A') for f in custom_fields_array]}")
        
        headers = {
            'Authorization': f'Bearer {api_token}',
            'Content-Type': 'application/json',
            'Version': '2021-07-28',
            'Accept': 'application/json'
        }
        
        # Retry logic for connection errors
        max_retries = 3
        retry_delay = 2  # seconds
        
        for attempt in range(max_retries):
            try:
                # GHL API endpoint: POST /contacts/upsert (as per documentation)
                # Upsert will create a new contact or update existing one based on email/phone
                # locationId is included in the payload body, not in the URL
                api_url = f"{settings.GHL_API_BASE_URL}/contacts/upsert"
                logger.info(f"POST request URL: {api_url} (Attempt {attempt + 1}/{max_retries})")
                logger.info(f"Upsert payload: firstName, lastName, name, email, locationId={static_location_id}, phone, {len(custom_fields_array)} customFields")
                
                ghl_response = requests.post(api_url, json=payload, headers=headers, timeout=30)
                
                logger.info(f"Response status code: {ghl_response.status_code}")
                logger.info(f"Response headers: {dict(ghl_response.headers)}")
                
                # Log full response for debugging
                try:
                    response_data = ghl_response.json()
                    logger.info(f"Response data: {response_data}")
                except:
                    logger.warning(f"Response text (not JSON): {ghl_response.text[:500]}")
                
                # GHL Upsert API returns 200 (OK) or 201 (Created) for successful upsert
                if ghl_response.status_code in [200, 201]:
                    try:
                        ghl_data = ghl_response.json()
                        # Check if the upsert succeeded (note: API has typo "succeded" instead of "succeeded")
                        succeeded = ghl_data.get('succeded', ghl_data.get('succeeded', True))
                        
                        if not succeeded:
                            logger.error(f"Upsert API returned success=false: {ghl_data}")
                            return None
                        
                        contact_id = ghl_data.get('contact', {}).get('id') or ghl_data.get('id')
                        is_new = ghl_data.get('new', False)
                        
                        if not contact_id:
                            logger.error(f"Contact upserted but no ID found in response: {ghl_data}")
                            return None
                        
                        action = "created" if is_new else "updated"
                        logger.info(f"✓ GHL contact {action} successfully: {contact_id} (new={is_new}, status={ghl_response.status_code})")
                        
                        # Custom fields should be included in the upsert request
                        # Verify they were set correctly
                        if custom_fields_array:
                            contact_data = ghl_data.get('contact', ghl_data)
                            existing_custom_fields = contact_data.get('customField', {})
                            logger.info(f"Custom fields in response: {len(existing_custom_fields) if isinstance(existing_custom_fields, dict) else 'N/A'}")
                            
                            # If custom fields weren't set, try to update them separately
                            # This is a fallback in case the upsert didn't set them
                            logger.info(f"Verifying custom fields were set correctly...")
                            custom_fields_set = self.set_contact_custom_fields(contact_id, static_location_id, custom_fields_array, api_token)
                            
                            if custom_fields_set:
                                logger.info(f"✓ All custom fields verified/set for contact {contact_id}")
                            else:
                                logger.warning(f"⚠ Custom fields may not have been set correctly for contact {contact_id}")
                        
                        # Upload images and store URLs in custom fields
                        logger.info(f"Uploading images for contact {contact_id}...")
                        image_urls = self.upload_contact_images(submission, contact_id, static_location_id, api_token, field_id_mapping)
                        
                        # If we got image URLs, update the contact with them
                        if image_urls:
                            logger.info(f"Updating contact with {len(image_urls)} image URLs")
                            self.update_contact_image_urls(contact_id, image_urls, static_location_id, api_token, field_id_mapping)
                        
                        logger.info(f"=== Contact upsert completed successfully: {contact_id} (new={is_new}) ===")
                        return contact_id
                        
                    except Exception as e:
                        logger.error(f"Error parsing response: {str(e)}")
                        logger.error(f"Response text: {ghl_response.text[:500]}")
                        return None
                else:
                    # Non-2xx status codes - don't retry for these (auth errors, validation errors, etc.)
                    logger.error(f"✗ GHL API error upserting contact: {ghl_response.status_code}")
                    logger.error(f"Error response: {ghl_response.text}")
                    return None
                    
            except requests.exceptions.ConnectionError as e:
                # Connection errors - retry with exponential backoff
                if attempt < max_retries - 1:
                    wait_time = retry_delay * (2 ** attempt)  # Exponential backoff: 2s, 4s, 8s
                    logger.warning(f"✗ Connection error on attempt {attempt + 1}/{max_retries}: {str(e)}")
                    logger.info(f"Retrying in {wait_time} seconds...")
                    time.sleep(wait_time)
                    continue
                else:
                    logger.error(f"✗ GHL API connection failed after {max_retries} attempts: {str(e)}")
                    logger.exception("Full exception traceback:")
                    return None
                    
            except requests.exceptions.Timeout as e:
                # Timeout errors - retry with exponential backoff
                if attempt < max_retries - 1:
                    wait_time = retry_delay * (2 ** attempt)
                    logger.warning(f"✗ Request timeout on attempt {attempt + 1}/{max_retries}: {str(e)}")
                    logger.info(f"Retrying in {wait_time} seconds...")
                    time.sleep(wait_time)
                    continue
                else:
                    logger.error(f"✗ GHL API request timed out after {max_retries} attempts: {str(e)}")
                    return None
                    
            except requests.exceptions.RequestException as e:
                # Other request exceptions - don't retry (likely auth/validation errors)
                logger.error(f"✗ GHL API request failed: {str(e)}")
                logger.exception("Full exception traceback:")
                return None
                
            except Exception as e:
                # Unexpected errors - don't retry
                logger.error(f"✗ Unexpected error during contact upsert: {str(e)}")
                logger.exception("Full exception traceback:")
                return None
        
        # If we get here, all retries failed
        logger.error(f"✗ Failed to upsert contact after {max_retries} attempts")
        return None
    
    def set_contact_custom_fields(self, contact_id, location_id, custom_fields_array, api_token):
        """
        Set custom fields for a contact using PUT request
        Returns True if successful, False otherwise
        """
        if not contact_id or not custom_fields_array:
            return False
        
        logger.info(f"Setting {len(custom_fields_array)} custom fields for contact {contact_id}")
        
        headers = {
            'Authorization': f'Bearer {api_token}',
            'Content-Type': 'application/json',
            'Version': '2021-07-28',
            'Accept': 'application/json'
        }
        
        try:
            # Try updating with customFields array
            custom_field_payload = {
                "customFields": custom_fields_array
            }
            
            update_url = f"{settings.GHL_API_BASE_URL}/contacts/{contact_id}"
            logger.info(f"PUT request URL: {update_url}")
            logger.info(f"Updating with {len(custom_fields_array)} custom fields")
            
            custom_field_response = requests.put(update_url, json=custom_field_payload, headers=headers, timeout=30)
            
            logger.info(f"Custom fields update response status: {custom_field_response.status_code}")
            
            if custom_field_response.status_code in [200, 201]:
                logger.info(f"✓ Custom fields updated successfully for contact {contact_id}")
                return True
            else:
                logger.warning(f"⚠ Custom fields update failed: {custom_field_response.status_code}")
                logger.warning(f"Error response: {custom_field_response.text[:500]}")
                
                # Try alternative format: customField (singular) as object
                logger.info("Trying alternative custom field format (customField as object)...")
                custom_field_obj = {}
                for field in custom_fields_array:
                    # Handle different formats: id/field_value (new), name/value (old), key/field_value (old)
                    field_id = field.get('id')
                    field_value = field.get('field_value') or field.get('value')
                    
                    if field_id and field_value:
                        # If we have ID, we need to use a different format
                        # For now, skip this alternative format since we're using IDs
                        continue
                    else:
                        # Fallback to name-based format
                        field_name = field.get('name') or field.get('key')
                        if field_name and field_value:
                            custom_field_obj[field_name] = field_value
                
                alt_payload = {"customField": custom_field_obj}
                alt_response = requests.put(update_url, json=alt_payload, headers=headers, timeout=30)
                
                if alt_response.status_code in [200, 201]:
                    logger.info(f"✓ Custom fields updated successfully using alternative format")
                    return True
                else:
                    logger.error(f"✗ Alternative format also failed: {alt_response.status_code} - {alt_response.text[:500]}")
                    return False
                
        except Exception as e:
            logger.error(f"✗ Error setting custom fields: {str(e)}")
            logger.exception("Full exception traceback:")
            return False

class MirrorView(APIView):
    """
    Retrieve campaign by slug. Supports password protection.
    Accepts password via query parameter (?password=xxx) or POST body.
    """
    def get_object(self, slug):
        try:
            return CampaignSubmission.objects.get(slug=slug)
        except CampaignSubmission.DoesNotExist:
            return None
    
    def get(self, request, slug):
        campaign = self.get_object(slug)
        if not campaign:
            return Response(
                {'error': 'Campaign not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if password protection is enabled
        if campaign.is_password_protected:
            # Get password from query parameters
            provided_password = request.query_params.get('password')
            
            if not provided_password:
                return Response(
                    {'error': 'Password required', 'requires_password': True},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Verify password
            if provided_password != campaign.password:
                return Response(
                    {'error': 'Incorrect password', 'requires_password': True},
                    status=status.HTTP_401_UNAUTHORIZED
                )
        
        # Password is correct or no password protection - return the data
        serializer = CampaignSubmissionSerializer(campaign)
        return Response(serializer.data)
    
    def post(self, request, slug):
        """Handle password verification via POST"""
        campaign = self.get_object(slug)
        if not campaign:
            return Response(
                {'error': 'Campaign not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if password protection is enabled
        if campaign.is_password_protected:
            # Get password from request data
            provided_password = request.data.get('password')
            
            if not provided_password:
                return Response(
                    {'error': 'Password required', 'requires_password': True},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Verify password
            if provided_password != campaign.password:
                return Response(
                    {'error': 'Incorrect password', 'requires_password': True},
                    status=status.HTTP_401_UNAUTHORIZED
                )
        
        # Password is correct or no password protection - return the data
        serializer = CampaignSubmissionSerializer(campaign)
        return Response(serializer.data)

class OTPRequestView(APIView):
    def post(self, request):
        phone = request.data.get('phone')
        email = request.data.get('email', '')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')
        
        if not phone:
            return Response({'error': 'Phone number is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Format phone number (ensure it starts with +)
        if phone and not phone.startswith('+'):
            phone = f"+{phone}"
        
        # Generate OTP code (4 digits)
        otp_code = str(random.randint(1000, 9999))
        
        # Store OTP in memory (expires in 10 minutes)
        otp_storage[phone] = {
            'code': otp_code,
            'expires_at': datetime.now() + timedelta(minutes=10)
        }
        
        logger.info(f"OTP generated for {phone}: {otp_code}")
        
        # For testing: log the OTP (remove in production)
        print(f"\n=== OTP FOR TESTING ===")
        print(f"Phone: {phone}")
        print(f"OTP Code: {otp_code}")
        print(f"=======================\n")
        
        return Response({
            'message': 'OTP Sent',
            'otp_code': otp_code  # Remove this in production - only for testing
        }, status=status.HTTP_200_OK)
    
    def create_or_update_ghl_contact_for_otp(self, phone, email, first_name, last_name):
        """
        Create or update contact in GHL static location for OTP verification
        Generates OTP code and sets it in the app_otp custom field using the custom field ID
        Returns dict with contact_id and otp_code if successful
        """
        if not settings.GHL_LOCATION_API_TOKEN or not settings.GHL_OTP_LOCATION_ID:
            logger.warning("GHL location token or OTP location ID not configured")
            return None
        
        location_id = settings.GHL_OTP_LOCATION_ID
        
        # Generate OTP code (4 digits)
        otp_code = str(random.randint(1000, 9999))
        logger.info(f"Generated OTP code: {otp_code} for phone: {phone}")
        
        # Prepare contact payload (without custom fields - set separately)
        payload = {
            "phone": phone,
        }
        
        if email:
            payload["email"] = email
        if first_name:
            payload["firstName"] = first_name
        if last_name:
            payload["lastName"] = last_name
        
        headers = {
            'Authorization': f'Bearer {settings.GHL_LOCATION_API_TOKEN}',
            'Content-Type': 'application/json',
            'Version': '2021-07-28',
            'Accept': 'application/json'
        }
        
        try:
            # Try to create contact first (GHL may handle duplicates automatically)
            create_url = f"{settings.GHL_API_BASE_URL}/contacts/"
            create_payload = {**payload, "locationId": location_id}
            ghl_response = requests.post(create_url, json=create_payload, headers=headers, timeout=30)
            
            contact_id = None
            if ghl_response.status_code in [200, 201]:
                # Contact created successfully
                contact_data = ghl_response.json()
                contact_id = contact_data.get('contact', {}).get('id') or contact_data.get('id')
            elif ghl_response.status_code == 409 or 'duplicate' in ghl_response.text.lower():
                # Contact already exists, try to find and update it
                # Search by phone using query parameter
                search_url = f"{settings.GHL_API_BASE_URL}/contacts/"
                search_params = {
                    "phone": phone,
                    "locationId": location_id
                }
                search_response = requests.get(search_url, params=search_params, headers=headers, timeout=30)
                
                if search_response.status_code == 200:
                    search_data = search_response.json()
                    contacts = search_data.get('contacts', [])
                    if contacts:
                        contact_id = contacts[0].get('id')
                        # Update existing contact (without custom fields)
                        update_url = f"{settings.GHL_API_BASE_URL}/contacts/{contact_id}"
                        ghl_response = requests.put(update_url, json=payload, headers=headers, timeout=30)
                    else:
                        logger.error("Contact exists but could not be found by phone")
                        return None
                else:
                    logger.error(f"Failed to search for contact: {search_response.status_code} - {search_response.text}")
                    return None
            
            # If contact was created/updated successfully, set the custom field separately
            if ghl_response.status_code in [200, 201] and contact_id:
                # Set OTP in custom field using separate endpoint
                custom_field_set = self.set_contact_custom_field(contact_id, settings.GHL_APP_OTP_FIELD_ID or 'app_otp', otp_code)
                if custom_field_set:
                    logger.info(f"GHL contact created/updated for OTP: {contact_id}, OTP: {otp_code}")
                    return {
                        'contact_id': contact_id,
                        'otp_code': otp_code
                    }
                else:
                    logger.warning(f"Contact created but failed to set OTP custom field: {contact_id}")
                    # Still return contact_id even if custom field failed
                    return {
                        'contact_id': contact_id,
                        'otp_code': otp_code
                    }
            else:
                logger.error(f"GHL API error creating/updating contact: {ghl_response.status_code} - {ghl_response.text}")
                return None
                
        except requests.exceptions.RequestException as e:
            logger.error(f"GHL API request failed for contact creation/update: {str(e)}")
            return None
    
    def set_contact_custom_field(self, contact_id, field_id_or_name, value):
        """
        Set a custom field value for a contact using GHL API
        Uses the custom field update endpoint
        """
        if not settings.GHL_LOCATION_API_TOKEN or not contact_id:
            return False
        
        headers = {
            'Authorization': f'Bearer {settings.GHL_LOCATION_API_TOKEN}',
            'Content-Type': 'application/json',
            'Version': '2021-07-28',
            'Accept': 'application/json'
        }
        
        try:
            # Update contact with customFields array format
            # GHL accepts customFields as an array with objects containing "id" or "name" and "value"
            update_url = f"{settings.GHL_API_BASE_URL}/contacts/{contact_id}"
            
            # Try with field ID first (if it looks like an ID)
            if settings.GHL_APP_OTP_FIELD_ID and field_id_or_name == settings.GHL_APP_OTP_FIELD_ID:
                custom_field_payload = {
                    "customFields": [
                        {
                            "id": field_id_or_name,
                            "value": value
                        }
                    ]
                }
            else:
                # Try with field name
                custom_field_payload = {
                    "customFields": [
                        {
                            "name": field_id_or_name,
                            "value": value
                        }
                    ]
                }
            
            update_response = requests.put(update_url, json=custom_field_payload, headers=headers, timeout=30)
            
            if update_response.status_code in [200, 201]:
                logger.info(f"Custom field set successfully for contact {contact_id}")
                return True
            
            # If ID format failed, try name format
            if settings.GHL_APP_OTP_FIELD_ID and field_id_or_name == settings.GHL_APP_OTP_FIELD_ID:
                custom_field_payload = {
                    "customFields": [
                        {
                            "name": "app_otp",
                            "value": value
                        }
                    ]
                }
                update_response = requests.put(update_url, json=custom_field_payload, headers=headers, timeout=30)
                
                if update_response.status_code in [200, 201]:
                    logger.info(f"Custom field set successfully (by name) for contact {contact_id}")
                    return True
            
            logger.error(f"Failed to set custom field: {update_response.status_code} - {update_response.text}")
            return False
            
        except requests.exceptions.RequestException as e:
            logger.error(f"GHL API request failed for custom field update: {str(e)}")
            return False
    
    def send_otp_sms(self, contact_id, phone, otp_code):
        """
        Send OTP code via SMS using GHL API
        """
        if not settings.GHL_LOCATION_API_TOKEN or not settings.GHL_OTP_LOCATION_ID:
            return False
        
        location_id = settings.GHL_OTP_LOCATION_ID
        
        headers = {
            'Authorization': f'Bearer {settings.GHL_LOCATION_API_TOKEN}',
            'Content-Type': 'application/json',
            'Version': '2021-07-28',
            'Accept': 'application/json'
        }
        
        # Format phone number
        formatted_phone = phone if phone.startswith('+') else f"+{phone}"
        
        # Prepare SMS payload
        sms_payload = {
            "phoneNumber": formatted_phone,
            "message": f"Your OTP code is: {otp_code}",
            "contactId": contact_id,
            "locationId": location_id
        }
        
        try:
            # GHL SMS endpoint
            sms_url = f"{settings.GHL_API_BASE_URL}/conversations/messages/"
            sms_response = requests.post(sms_url, json=sms_payload, headers=headers, timeout=30)
            
            if sms_response.status_code in [200, 201]:
                logger.info(f"OTP SMS sent successfully to {formatted_phone}")
                return True
            else:
                logger.error(f"Failed to send OTP SMS: {sms_response.status_code} - {sms_response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            logger.error(f"GHL API request failed for SMS sending: {str(e)}")
            return False

class OTPVerifyView(APIView):
    def post(self, request):
        """
        Simplified OTP verification - accepts any 4-digit number as valid
        """
        code = request.data.get('code')
        phone = request.data.get('phone')
        
        if not code:
            return Response({'error': 'OTP code is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not phone:
            return Response({'error': 'Phone number is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Format phone number
        if phone and not phone.startswith('+'):
            phone = f"+{phone}"
        
        # Simplified verification: accept any 4-digit number
        code_str = str(code).strip()
        
        # Check if it's a 4-digit number
        if code_str.isdigit() and len(code_str) == 4:
            logger.info(f"OTP verified (simplified mode) for {phone} with code: {code_str}")
            return Response({'message': 'Verified', 'verified': True}, status=status.HTTP_200_OK)
        else:
            logger.warning(f"Invalid OTP format for {phone}: code must be 4 digits, got: {code_str}")
            return Response({'message': 'Invalid Code. Please enter a 4-digit number.', 'verified': False}, status=status.HTTP_400_BAD_REQUEST)
    
    def verify_ghl_otp(self, contact_id, phone, code):
        """
        Verify OTP by checking the app_otp custom field in GHL contact
        """
        location_id = settings.GHL_OTP_LOCATION_ID
        
        headers = {
            'Authorization': f'Bearer {settings.GHL_LOCATION_API_TOKEN}',
            'Content-Type': 'application/json',
            'Version': '2021-07-28',
            'Accept': 'application/json'
        }
        
        try:
            # If contact_id provided, use it; otherwise search by phone
            if not contact_id and phone:
                formatted_phone = phone if phone.startswith('+') else f"+{phone}"
                search_url = f"{settings.GHL_API_BASE_URL}/contacts/"
                search_params = {
                    "phone": formatted_phone,
                    "locationId": location_id
                }
                search_response = requests.get(search_url, params=search_params, headers=headers, timeout=30)
                if search_response.status_code == 200:
                    search_data = search_response.json()
                    contacts = search_data.get('contacts', [])
                    if contacts:
                        contact_id = contacts[0].get('id')
            
            if not contact_id:
                logger.error("Contact ID not found for OTP verification")
                return False
            
            # Get contact details to check app_otp custom field
            get_url = f"{settings.GHL_API_BASE_URL}/contacts/{contact_id}"
            get_response = requests.get(get_url, headers=headers, timeout=30)
            
            if get_response.status_code == 200:
                contact_data = get_response.json()
                contact = contact_data.get('contact', contact_data)
                
                # Check custom fields for app_otp
                # GHL may return custom fields as object with field IDs or names as keys
                custom_fields = contact.get('customField', {})
                if isinstance(custom_fields, list):
                    # If it's an array, convert to dict (by name and by ID)
                    custom_fields_dict = {}
                    for field in custom_fields:
                        if isinstance(field, dict):
                            field_id = field.get('id')
                            field_name = field.get('name')
                            field_value = field.get('value')
                            if field_id:
                                custom_fields_dict[field_id] = field_value
                            if field_name:
                                custom_fields_dict[field_name] = field_value
                    custom_fields = custom_fields_dict
                
                # Try to get OTP by custom field ID first, then by name
                app_otp = None
                if settings.GHL_APP_OTP_FIELD_ID:
                    app_otp = custom_fields.get(settings.GHL_APP_OTP_FIELD_ID)
                if not app_otp:
                    app_otp = custom_fields.get('app_otp') or custom_fields.get('App OTP')
                
                if app_otp and str(app_otp).strip() == str(code).strip():
                    logger.info(f"OTP verified successfully for contact {contact_id}")
                    return True
                else:
                    logger.warning(f"OTP mismatch. Expected: {app_otp}, Got: {code}")
                    return False
            else:
                logger.error(f"Failed to get contact: {get_response.status_code} - {get_response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            logger.error(f"GHL API request failed for OTP verification: {str(e)}")
            return False

class PillarDescriptionsView(APIView):
    def get(self, request):
        """Returns a dictionary mapping pillar names to their default descriptions"""
        pillars = PillarDescription.objects.all()
        descriptions_dict = {pillar.pillar_name: pillar.default_description for pillar in pillars}
        return Response(descriptions_dict, status=status.HTTP_200_OK)
