# Generated manually - Data migration to populate default pillar descriptions

from django.db import migrations

def create_pillar_descriptions(apps, schema_editor):
    PillarDescription = apps.get_model('onboarding', 'PillarDescription')
    
    pillar_data = {
        "Lower Taxes": """Lowering taxes is essential for fostering economic growth and allowing families and businesses to keep more of their hard-earned money. By reducing the tax burden, we can stimulate investment, create jobs, and improve the overall quality of life for our community members.

A comprehensive tax reduction strategy will focus on eliminating wasteful spending, streamlining government operations, and ensuring that tax dollars are used efficiently. This approach will not only benefit individual taxpayers but also make our area more attractive to new businesses and residents.""",

        "Safer Streets": """Public safety is the foundation of a thriving community. Every resident deserves to feel safe in their neighborhood, whether they're walking to work, playing in the park, or simply going about their daily lives. We need to invest in our police force, improve street lighting, and strengthen community-police relationships.

Creating safer streets requires a multi-faceted approach that includes increased police presence, better emergency response times, and community engagement programs. We must also address the root causes of crime through education, job opportunities, and social services that support at-risk individuals and families.""",

        "Better Schools": """Education is the cornerstone of opportunity and the key to our children's future success. We must invest in our schools to ensure every student has access to quality education, modern facilities, and dedicated teachers who are equipped with the resources they need to excel.

This means not only improving infrastructure and technology in our classrooms but also supporting our educators with competitive compensation and professional development opportunities. We need to create an environment where students can thrive academically, socially, and emotionally, preparing them for success in college, careers, and life.""",

        "Community Safety": """Community safety extends beyond law enforcement to include emergency preparedness, public health initiatives, and neighborhood watch programs. We need a comprehensive approach that brings together residents, local organizations, and government agencies to create a safer, more secure environment for everyone.

This includes improving emergency response systems, enhancing disaster preparedness, and fostering stronger connections between neighbors. When communities work together, we can prevent problems before they start and respond more effectively when challenges arise.""",

        "Economic Growth": """Economic growth creates opportunities for everyone in our community. By attracting new businesses, supporting local entrepreneurs, and investing in infrastructure, we can create jobs, increase property values, and improve the overall prosperity of our area.

A strong economy means more resources for public services, better schools, improved infrastructure, and a higher quality of life for all residents. We need to create a business-friendly environment while ensuring that growth benefits everyone, not just a select few.""",

        "Healthcare Access": """Access to quality healthcare is a fundamental right that should be available to all residents, regardless of their income or circumstances. We need to expand healthcare services, reduce wait times, and ensure that everyone can receive the medical attention they need when they need it.

This includes supporting local clinics, improving mental health services, and ensuring that our community has adequate healthcare facilities and professionals. We must also work to make healthcare more affordable and accessible, particularly for seniors, families, and those with limited resources.""",

        "Support Seniors": """Our senior citizens have contributed so much to building our community, and they deserve our respect, support, and care. We need to ensure that seniors have access to quality healthcare, affordable housing, transportation services, and programs that keep them active and engaged in community life.

This includes expanding senior centers, improving home care services, and creating programs that address the unique needs of our aging population. We must honor their contributions by ensuring they can age with dignity and remain active members of our community.""",

        "Youth Programs": """Investing in our youth is investing in our future. We need comprehensive programs that provide young people with positive outlets, educational support, job training, and mentorship opportunities. These programs help prevent crime, improve academic outcomes, and prepare the next generation for success.

By providing safe spaces, engaging activities, and supportive adults, we can help young people develop the skills, confidence, and character they need to become productive citizens and future leaders of our community.""",

        "Infrastructure": """Modern, well-maintained infrastructure is essential for economic growth, public safety, and quality of life. We need to invest in roads, bridges, water systems, broadband internet, and public transportation to ensure our community can thrive in the 21st century.

This includes not only repairing and maintaining existing infrastructure but also planning for future needs and growth. Smart infrastructure investments today will pay dividends for generations to come, making our community more attractive to residents and businesses alike.""",

        "Environmental Protection": """Protecting our environment is not just about preserving natural beauty—it's about ensuring a healthy, sustainable future for our children and grandchildren. We need to balance economic development with environmental stewardship, protecting our air, water, and natural resources.

This includes promoting renewable energy, improving waste management, protecting green spaces, and ensuring that development projects consider their environmental impact. A healthy environment supports public health, attracts residents and businesses, and preserves our community's quality of life for future generations."""
    }
    
    for pillar_name, description in pillar_data.items():
        PillarDescription.objects.get_or_create(
            pillar_name=pillar_name,
            defaults={'default_description': description}
        )

def reverse_pillar_descriptions(apps, schema_editor):
    PillarDescription = apps.get_model('onboarding', 'PillarDescription')
    PillarDescription.objects.all().delete()

class Migration(migrations.Migration):

    dependencies = [
        ('onboarding', '0003_pillardescription'),
    ]

    operations = [
        migrations.RunPython(create_pillar_descriptions, reverse_pillar_descriptions),
    ]

