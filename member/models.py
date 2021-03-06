from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from PIL import Image

from trail.models import Trail


def user_directory_path(instance, filename):
    return f'members/{instance.id}/{filename}'


# TODO In a Thread?
def resize_avatar(image_field):
    buffer = BytesIO()
    image = Image.open(image_field)
    image = image.convert('RGB')
    image.thumbnail((400, 400), Image.LANCZOS)
    image.save(buffer, format='JPEG', optimize=True, progressive=True)
    buffer.seek(0)
    return InMemoryUploadedFile(buffer, "ImageField", "avatar.jpg", "image/jpeg", buffer.tell, None)


class User(AbstractUser):
    avatar = models.ImageField(_('Avatar'), upload_to=user_directory_path, help_text=_('Public avatar.'), null=True, blank=True)
    biography = models.CharField(_('Biography'), max_length=255, help_text=_('Tell us about yourself in fewer than 250 characters.'), blank=True)
    email = models.EmailField(
        _('email address'),
        unique=True,
        blank=False,
        help_text=_('Required. No bullshit, I promise.'),
        error_messages={
            'unique': _('A user with that email address already exists.'),
        },
    )
    favorite_trails = models.ManyToManyField(Trail, related_name='favorite_by')
    following_users = models.ManyToManyField('self', symmetrical=False, related_name='followed_by')
    is_premium = models.BooleanField(_('Premium member'), default=False)
    premium_until = models.DateField(_('Premium until'), null=True)
