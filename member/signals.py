from django.db.models.signals import pre_delete, pre_save
from django.dispatch import receiver

from .models import User


@receiver(pre_delete, sender=User)
def user_delete_handler(sender, **kwargs):
    instance = kwargs["instance"]
    instance.avatar.delete()


@receiver(pre_save, sender=User)
def avatar_save_handler(sender, **kwargs):
    instance = kwargs["instance"]
    try:
        current_user = User.objects.get(pk=instance.pk)
        old_avatar = current_user.avatar
        new_avatar = instance.avatar

        if not new_avatar == old_avatar:
           old_avatar.delete(False)
    except:
        pass


