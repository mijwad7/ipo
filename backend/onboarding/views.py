from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import CampaignSubmission, OrganizationSubmission, PillarDescription
from .serializers import CampaignSubmissionSerializer, OrganizationSubmissionSerializer
import random # Stub for OTP generator

class SubmissionCreateView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request):
        submission_type = request.data.get('submission_type', 'campaign')
        
        if submission_type == 'organization':
            serializer = OrganizationSubmissionSerializer(data=request.data)
        else:
            serializer = CampaignSubmissionSerializer(data=request.data)
        
        if serializer.is_valid():
            instance = serializer.save()
            # Add submission_type to response for frontend
            response_data = serializer.data
            response_data['submission_type'] = submission_type
            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MirrorView(APIView):
    """
    Retrieve submission by slug. Supports password protection.
    Accepts password via query parameter (?password=xxx) or POST body.
    Supports template parameter in URL: /mirror/{slug}/{template}/
    Works with both CampaignSubmission and OrganizationSubmission
    """
    def get_object(self, slug):
        # Try campaign first
        try:
            return CampaignSubmission.objects.get(slug=slug), 'campaign'
        except CampaignSubmission.DoesNotExist:
            pass
        
        # Try organization
        try:
            return OrganizationSubmission.objects.get(slug=slug), 'organization'
        except OrganizationSubmission.DoesNotExist:
            return None, None
    
    def get(self, request, slug, template=None):
        submission, sub_type = self.get_object(slug)
        if not submission:
            return Response(
                {'error': 'Submission not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if password protection is enabled
        if submission.is_password_protected:
            # Get password from query parameters
            provided_password = request.query_params.get('password')
            
            if not provided_password:
                return Response(
                    {'error': 'Password required', 'requires_password': True},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Verify password
            if provided_password != submission.password:
                return Response(
                    {'error': 'Incorrect password', 'requires_password': True},
                    status=status.HTTP_401_UNAUTHORIZED
                )
        
        # Use appropriate serializer based on type
        if sub_type == 'organization':
            serializer = OrganizationSubmissionSerializer(submission)
        else:
            serializer = CampaignSubmissionSerializer(submission)
        
        data = serializer.data
        data['submission_type'] = sub_type  # Add type to response
        
        # Override template_style if template parameter is provided
        if template and template in ['modern', 'traditional', 'bold']:
            data['template_style'] = template
        
        return Response(data)
    
    def post(self, request, slug, template=None):
        """Handle password verification via POST"""
        submission, sub_type = self.get_object(slug)
        if not submission:
            return Response(
                {'error': 'Submission not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if password protection is enabled
        if submission.is_password_protected:
            # Get password from request data
            provided_password = request.data.get('password')
            
            if not provided_password:
                return Response(
                    {'error': 'Password required', 'requires_password': True},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Verify password
            if provided_password != submission.password:
                return Response(
                    {'error': 'Incorrect password', 'requires_password': True},
                    status=status.HTTP_401_UNAUTHORIZED
                )
        
        # Use appropriate serializer based on type
        if sub_type == 'organization':
            serializer = OrganizationSubmissionSerializer(submission)
        else:
            serializer = CampaignSubmissionSerializer(submission)
        
        data = serializer.data
        data['submission_type'] = sub_type  # Add type to response
        
        # Override template_style if template parameter is provided
        if template and template in ['modern', 'traditional', 'bold']:
            data['template_style'] = template
        
        return Response(data)

class OTPRequestView(APIView):
    def post(self, request):
        phone = request.data.get('phone')
        # Week 1 stub: Just print code to console
        code = str(random.randint(1000, 9999))
        print(f"STUB OTP SENT TO {phone}: {code}")
        # In real world, save code to session or db. For MVP stateless stub, we might return it?
        # Or store in a temp cache.
        # But wait, verification needs to persist it.
        # Let's simple create a dummy verify that accepts '1234' or prints code.
        return Response({'message': 'OTP Sent', 'stub_code': code}, status=status.HTTP_200_OK)

class OTPVerifyView(APIView):
    def post(self, request):
        code = request.data.get('code')
        # Stub logic
        if code and len(code) == 4:
             return Response({'message': 'Verified', 'verified': True})
        return Response({'message': 'Invalid Code'}, status=status.HTTP_400_BAD_REQUEST)

class PillarDescriptionsView(APIView):
    def get(self, request):
        """Returns a dictionary mapping pillar names to their default descriptions"""
        pillars = PillarDescription.objects.all()
        descriptions_dict = {pillar.pillar_name: pillar.default_description for pillar in pillars}
        return Response(descriptions_dict, status=status.HTTP_200_OK)
