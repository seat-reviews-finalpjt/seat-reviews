# Generated by Django 5.0.6 on 2024-05-27 01:19

from django.db import migrations, models

def create_initial_theaters(apps, schema_editor):
    Theater = apps.get_model('articles', 'Theater')
    initial_theaters = [
        {'name': '유니버설아트센터', 'location': '서울 광진구', 'description': 'test'},

        # 추가로 원하는 데이터를 여기 추가
    ]
    for theater_data in initial_theaters:
        Theater.objects.create(**theater_data)

class Migration(migrations.Migration):

    dependencies = [
        ('articles', '0003_commentlike'),
    ]

    operations = [
        migrations.CreateModel(
            name='Theater',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('location', models.CharField(blank=True, max_length=255, null=True)),
                ('description', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.RunPython(create_initial_theaters),
    ]
