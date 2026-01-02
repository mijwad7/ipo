from django.contrib import admin
from .models import CampaignSubmission, PillarDescription, OrganizationSubmission

@admin.register(CampaignSubmission)
class CampaignSubmissionAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'campaign_subtype', 'slug', 'created_at')
    list_filter = ('campaign_subtype', 'template_style', 'created_at')
    search_fields = ('first_name', 'last_name', 'email', 'slug')

@admin.register(OrganizationSubmission)
class OrganizationSubmissionAdmin(admin.ModelAdmin):
    list_display = ('organization_name', 'first_name', 'last_name', 'email', 'organization_subtype', 'slug', 'created_at')
    list_filter = ('organization_subtype', 'template_style', 'created_at')
    search_fields = ('organization_name', 'first_name', 'last_name', 'email', 'slug')

@admin.register(PillarDescription)
class PillarDescriptionAdmin(admin.ModelAdmin):
    list_display = ('pillar_name', 'created_at')
    search_fields = ('pillar_name',)
