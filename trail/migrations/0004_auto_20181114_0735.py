# Generated by Django 2.1.3 on 2018-11-14 07:35

from django.db import migrations, models
import trail.models


class Migration(migrations.Migration):

    dependencies = [
        ('trail', '0003_auto_20181112_2252'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trail',
            name='hero',
            field=models.ImageField(null=True, upload_to=trail.models.trail_directory_path),
        ),
        migrations.AlterField(
            model_name='trail',
            name='thumbnail',
            field=models.ImageField(null=True, upload_to=trail.models.trail_directory_path),
        ),
    ]