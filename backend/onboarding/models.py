from django.db import models
from django.utils.text import slugify
import re

class PillarDescription(models.Model):
    pillar_name = models.CharField(max_length=100, unique=True)
    default_description = models.TextField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.pillar_name
    
    class Meta:
        ordering = ['pillar_name']

class BaseSubmission(models.Model):
    """Base abstract model for common fields between Campaign and Organization submissions"""
    TEMPLATE_CHOICES = [
        ('modern', 'Modern'),
        ('traditional', 'Traditional'),
        ('bold', 'Bold'),
    ]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    
    template_style = models.CharField(max_length=20, choices=TEMPLATE_CHOICES, default='modern')
    preferred_template = models.CharField(max_length=20, choices=TEMPLATE_CHOICES, default='modern')
    primary_color = models.CharField(max_length=7, default='#0d6efd')
    secondary_color = models.CharField(max_length=7, default='#6c757d')
    
    bio_text = models.TextField(max_length=1000)
    tag_line = models.CharField(max_length=200, blank=True, null=True)
    background_picture = models.ImageField(upload_to='backgrounds/', blank=True, null=True)
    
    slug = models.SlugField(unique=True, blank=True, max_length=200)
    
    # Template URLs for all 3 templates
    template_modern_url = models.CharField(max_length=200, blank=True, null=True)
    template_traditional_url = models.CharField(max_length=200, blank=True, null=True)
    template_bold_url = models.CharField(max_length=200, blank=True, null=True)
    
    # Custom URL and password protection
    custom_slug = models.CharField(max_length=100, blank=True, null=True)
    is_password_protected = models.BooleanField(default=False)
    password = models.CharField(max_length=100, blank=True, null=True)
    
    otp_code = models.CharField(max_length=6, blank=True, null=True)
    otp_verified = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True

    def generate_slug(self, base_name="submission"):
        """Generate a unique slug - implemented in child classes"""
        pass

    def generate_template_urls(self):
        """Generate all 3 template URLs"""
        if self.slug:
            base_url = f"/temp/{self.slug}"
            self.template_modern_url = f"{base_url}/modern"
            self.template_traditional_url = f"{base_url}/traditional"
            self.template_bold_url = f"{base_url}/bold"

class CampaignSubmission(BaseSubmission):
    CAMPAIGN_SUBTYPE_CHOICES = [
        ('campaign', 'Campaign in a Box'),
        ('election', 'Election'),
    ]

    campaign_subtype = models.CharField(max_length=20, choices=CAMPAIGN_SUBTYPE_CHOICES, default='election')
    
    # Campaign-specific fields
    position_running_for = models.CharField(max_length=200, blank=True, null=True)
    donation_url = models.URLField(blank=True, null=True)
    event_calendar_url = models.CharField(max_length=200, blank=True, null=True)
    
    # Campaign images
    headshot = models.ImageField(upload_to='headshots/')
    action_shot_1 = models.ImageField(upload_to='action_shots/', blank=True, null=True)
    action_shot_2 = models.ImageField(upload_to='action_shots/', blank=True, null=True)
    action_shot_3 = models.ImageField(upload_to='action_shots/', blank=True, null=True)
    
    # Election details
    riding_zone_name = models.CharField(max_length=200, blank=True, null=True)
    election_date = models.DateField(blank=True, null=True)
    
    # Platform pillars
    pillar_1 = models.CharField(max_length=100)
    pillar_1_desc = models.TextField(blank=True, null=True)
    pillar_2 = models.CharField(max_length=100)
    pillar_2_desc = models.TextField(blank=True, null=True)
    pillar_3 = models.CharField(max_length=100)
    pillar_3_desc = models.TextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            # Generate slug with cross-model uniqueness check
            first = (self.first_name or '').strip()
            last = (self.last_name or '').strip()
            combined = f"{first}{last}".lower()
            base_slug = re.sub(r'[^a-zA-Z0-9]', '', combined)
            
            if self.custom_slug and self.custom_slug.strip():
                custom_cleaned = re.sub(r'[^a-zA-Z0-9]', '', self.custom_slug.lower())
                if custom_cleaned and len(custom_cleaned) >= 3:
                    base_slug = custom_cleaned
            
            if not base_slug:
                base_slug = "campaign"
            
            slug = base_slug
            counter = 1
            # Check uniqueness across both models
            while (CampaignSubmission.objects.filter(slug=slug).exclude(pk=self.pk if self.pk else None).exists() or
                   OrganizationSubmission.objects.filter(slug=slug).exists()):
                slug = f"{base_slug}{counter}"
                counter += 1
            self.slug = slug
        
        self.generate_template_urls()
        
        if not self.preferred_template:
            self.preferred_template = self.template_style
        
        if self.is_password_protected and not self.password:
            self.password = "run"
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - Campaign ({self.slug})"


class OrganizationSubmission(BaseSubmission):
    ORGANIZATION_SUBTYPE_CHOICES = [
        ('church', 'Church'),
        ('charity', 'Charity'),
        ('eda', 'Economic Development Association'),
        ('ca', 'Community Association'),
    ]

    organization_subtype = models.CharField(max_length=20, choices=ORGANIZATION_SUBTYPE_CHOICES)
    organization_name = models.CharField(max_length=200)
    
    # Organization images
    logo = models.ImageField(upload_to='logos/')
    owner_photo = models.ImageField(upload_to='owners/')
    sales_team_photo = models.ImageField(upload_to='sales_teams/', blank=True, null=True)
    
    # Services (completely custom, no dropdown options)
    service_1 = models.CharField(max_length=200)
    service_1_desc = models.TextField(blank=True, null=True)
    service_2 = models.CharField(max_length=200)
    service_2_desc = models.TextField(blank=True, null=True)
    service_3 = models.CharField(max_length=200)
    service_3_desc = models.TextField(blank=True, null=True)
    
    # Service images (optional)
    service_image_1 = models.ImageField(upload_to='service_images/', blank=True, null=True)
    service_image_2 = models.ImageField(upload_to='service_images/', blank=True, null=True)
    service_image_3 = models.ImageField(upload_to='service_images/', blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            # Generate slug with cross-model uniqueness check
            # Prefer organization_name, fallback to first_name + last_name
            if self.organization_name and self.organization_name.strip():
                base_slug = re.sub(r'[^a-zA-Z0-9]', '', self.organization_name.lower().strip())
            else:
                first = (self.first_name or '').strip()
                last = (self.last_name or '').strip()
                combined = f"{first}{last}".lower()
                base_slug = re.sub(r'[^a-zA-Z0-9]', '', combined)
            
            # Custom slug takes precedence if provided
            if self.custom_slug and self.custom_slug.strip():
                custom_cleaned = re.sub(r'[^a-zA-Z0-9]', '', self.custom_slug.lower().strip())
                if custom_cleaned and len(custom_cleaned) >= 3:
                    base_slug = custom_cleaned
            
            if not base_slug:
                base_slug = "organization"
            
            slug = base_slug
            counter = 1
            # Check uniqueness across both models
            while (CampaignSubmission.objects.filter(slug=slug).exists() or
                   OrganizationSubmission.objects.filter(slug=slug).exclude(pk=self.pk if self.pk else None).exists()):
                slug = f"{base_slug}{counter}"
                counter += 1
            self.slug = slug
        
        self.generate_template_urls()
        
        if not self.preferred_template:
            self.preferred_template = self.template_style
        
        if self.is_password_protected and not self.password:
            self.password = "run"
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.organization_name} - Organization ({self.slug})"
