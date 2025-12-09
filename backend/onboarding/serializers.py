from rest_framework import serializers
from .models import CampaignSubmission

class CampaignSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignSubmission
        fields = '__all__'
        read_only_fields = ('slug', 'created_at', 'otp_verified', 'otp_code')
