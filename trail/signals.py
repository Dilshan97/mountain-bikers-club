from django.db.models.signals import pre_delete
from django.dispatch import receiver

from .models import Trail


@receiver(pre_delete, sender=Trail)
def trail_delete_handler(sender, **kwargs):
    instance = kwargs["instance"]
    instance.file.delete()
    instance.thumbnail.delete()
    instance.hero.delete()
