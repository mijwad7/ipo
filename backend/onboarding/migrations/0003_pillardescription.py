# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('onboarding', '0002_campaignsubmission_pillar_1_desc_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='PillarDescription',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pillar_name', models.CharField(max_length=100, unique=True)),
                ('default_description', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['pillar_name'],
            },
        ),
    ]
