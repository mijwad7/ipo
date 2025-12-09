from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import CampaignSubmission, PillarDescription
from .serializers import CampaignSubmissionSerializer
import random # Stub for OTP generator

class SubmissionCreateView(generics.CreateAPIView):
    queryset = CampaignSubmission.objects.all()
    serializer_class = CampaignSubmissionSerializer
    parser_classes = (MultiPartParser, FormParser)

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
