# Generated by Django 2.1.1 on 2018-09-06 15:58

from django.db import migrations, models
import trail.models


class Migration(migrations.Migration):

    dependencies = [
        ('trail', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='trail',
            name='thumbnail',
            field=models.FileField(null=True, upload_to=trail.models.user_directory_path),
        ),
        migrations.AlterField(
            model_name='trail',
            name='location',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]