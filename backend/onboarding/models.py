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

class CampaignSubmission(models.Model):
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
    primary_color = models.CharField(max_length=7, default='#0d6efd')
    secondary_color = models.CharField(max_length=7, default='#6c757d')
    
    pillar_1 = models.CharField(max_length=100)
    pillar_1_desc = models.TextField(blank=True, null=True)
    pillar_2 = models.CharField(max_length=100)
    pillar_2_desc = models.TextField(blank=True, null=True)
    pillar_3 = models.CharField(max_length=100)
    pillar_3_desc = models.TextField(blank=True, null=True)
    
    bio_text = models.TextField(max_length=1000)
    donation_url = models.URLField(blank=True, null=True)
    event_calendar_url = models.CharField(max_length=200, blank=True, null=True) # Changed to char for flexibility
    
    headshot = models.ImageField(upload_to='headshots/')
    # Action shots - keeping simple for MVP
    action_shot_1 = models.ImageField(upload_to='action_shots/', blank=True, null=True)
    action_shot_2 = models.ImageField(upload_to='action_shots/', blank=True, null=True)
    action_shot_3 = models.ImageField(upload_to='action_shots/', blank=True, null=True)
    
    slug = models.SlugField(unique=True, blank=True)
    
    # Election details
    riding_zone_name = models.CharField(max_length=200, blank=True, null=True)
    election_date = models.DateField(blank=True, null=True)
    
    # Custom URL and password protection
    custom_slug = models.CharField(max_length=100, blank=True, null=True)
    is_password_protected = models.BooleanField(default=False)
    password = models.CharField(max_length=100, blank=True, null=True)
    
    otp_code = models.CharField(max_length=6, blank=True, null=True)
    otp_verified = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            # Use custom_slug if provided, otherwise generate from first_name + last_name (no hyphens)
            if self.custom_slug:
                # Clean the custom_slug: lowercase, remove spaces and special chars except alphanumeric
                base_slug = re.sub(r'[^a-zA-Z0-9]', '', self.custom_slug.lower())
            else:
                # Generate from first_name + last_name (no hyphens, just concatenate)
                base_slug = f"{self.first_name}{self.last_name}".lower()
                # Remove any spaces or special characters
                base_slug = re.sub(r'[^a-zA-Z0-9]', '', base_slug)
            
            slug = base_slug
            counter = 1
            while CampaignSubmission.objects.filter(slug=slug).exists():
                slug = f"{base_slug}{counter}"
                counter += 1
            self.slug = slug
        
        # Set default password if password protection is enabled but password is not set
        if self.is_password_protected and not self.password:
            self.password = "run"
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.slug})"
