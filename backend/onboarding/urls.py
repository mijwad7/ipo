from django.urls import path
from .views import SubmissionCreateView, MirrorView, OTPRequestView, OTPVerifyView

urlpatterns = [
    path('submissions/', SubmissionCreateView.as_view(), name='submission-create'),
    path('mirror/<slug:slug>/', MirrorView.as_view(), name='mirror-detail'),
    path('otp/send/', OTPRequestView.as_view(), name='otp-send'),
    path('otp/verify/', OTPVerifyView.as_view(), name='otp-verify'),
]
