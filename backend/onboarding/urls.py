from django.urls import path
from .views import SubmissionCreateView, MirrorView, OTPRequestView, OTPVerifyView, PillarDescriptionsView, ShareCampaignView, SuccessPageView, OTPS

urlpatterns = [
    path('submissions/', SubmissionCreateView.as_view(), name='submission-create'),
    path('mirror/<slug:slug>/', MirrorView.as_view(), name='mirror-detail'),
    path('otp/request/', OTPRequestView.as_view(), name='otp_request'),
    path('otp/verify/', OTPVerifyView.as_view(), name='otp_verify'),
    path('share/', ShareCampaignView.as_view(), name='share_campaign'),
    path('pillars/', PillarDescriptionsView.as_view(), name='pillar-descriptions'),
]
