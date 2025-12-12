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
    position_running_for = models.CharField(max_length=200, blank=True, null=True)
    tag_line = models.CharField(max_length=200, blank=True, null=True)
    donation_url = models.URLField(blank=True, null=True)
    event_calendar_url = models.CharField(max_length=200, blank=True, null=True) # Changed to char for flexibility
    
    headshot = models.ImageField(upload_to='headshots/')
    # Action shots - keeping simple for MVP
    action_shot_1 = models.ImageField(upload_to='action_shots/', blank=True, null=True)
    action_shot_2 = models.ImageField(upload_to='action_shots/', blank=True, null=True)
    action_shot_3 = models.ImageField(upload_to='action_shots/', blank=True, null=True)
    
    slug = models.SlugField(unique=True, blank=True, max_length=200)
    
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
            # Always generate from first_name + last_name (ignore custom_slug for auto-generation)
            # Simple: first_name + last_name, lowercase, remove non-alphanumeric
            first = (self.first_name or '').strip()
            last = (self.last_name or '').strip()
            combined = f"{first}{last}".lower()
            base_slug = re.sub(r'[^a-zA-Z0-9]', '', combined)
            
            # If custom_slug was manually provided and is valid, use it instead
            if self.custom_slug and self.custom_slug.strip():
                custom_cleaned = re.sub(r'[^a-zA-Z0-9]', '', self.custom_slug.lower())
                if custom_cleaned and len(custom_cleaned) >= 3:  # Only use if it's at least 3 chars
                    base_slug = custom_cleaned
            
            # Ensure we have a valid slug
            if not base_slug:
                base_slug = "campaign"
            
            # If slug exists, add a number
            slug = base_slug
            counter = 1
            while CampaignSubmission.objects.filter(slug=slug).exclude(pk=self.pk if self.pk else None).exists():
                slug = f"{base_slug}{counter}"
                counter += 1
            self.slug = slug
        
        # Set default password if password protection is enabled but password is not set
        if self.is_password_protected and not self.password:
            self.password = "run"
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.slug})"
