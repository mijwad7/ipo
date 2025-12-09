from django.db import models
from django.utils.text import slugify

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
    
    otp_code = models.CharField(max_length=6, blank=True, null=True)
    otp_verified = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(f"{self.first_name}-{self.last_name}")
            slug = base_slug
            counter = 1
            while CampaignSubmission.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.slug})"
