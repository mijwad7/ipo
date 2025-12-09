# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('onboarding', '0004_populate_pillar_descriptions'),
    ]

    operations = [
        migrations.AddField(
            model_name='campaignsubmission',
            name='riding_zone_name',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='campaignsubmission',
            name='election_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='campaignsubmission',
            name='custom_slug',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='campaignsubmission',
            name='is_password_protected',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='campaignsubmission',
            name='password',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]

