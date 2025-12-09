from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import CampaignSubmission
from .serializers import CampaignSubmissionSerializer
import random # Stub for OTP generator

class SubmissionCreateView(generics.CreateAPIView):
    queryset = CampaignSubmission.objects.all()
    serializer_class = CampaignSubmissionSerializer
    parser_classes = (MultiPartParser, FormParser)

class MirrorView(generics.RetrieveAPIView):
    queryset = CampaignSubmission.objects.all()
    serializer_class = CampaignSubmissionSerializer
    lookup_field = 'slug'

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
