# Generated by Django 2.1.2 on 2018-11-12 23:02

from django.db import migrations, models
import member.models


class Migration(migrations.Migration):

    dependencies = [
        ('member', '0003_auto_20180925_2212'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='avatar',
            field=models.ImageField(blank=True, help_text='Public avatar.', null=True, upload_to=member.models.user_directory_path, verbose_name='Avatar'),
        ),
        migrations.AddField(
            model_name='user',
            name='biography',
            field=models.CharField(blank=True, help_text='Tell us about yourself in fewer than 250 characters.', max_length=255, verbose_name='Biography'),
        ),
    ]