# Generated by Django 2.1.3 on 2018-12-05 18:47

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('member', '0004_auto_20181112_2302'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='following_users',
            field=models.ManyToManyField(related_name='followed_by', to=settings.AUTH_USER_MODEL),
        ),
    ]