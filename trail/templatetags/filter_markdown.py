import bleach

from django import template
from markdown2 import Markdown

register = template.Library()
md = Markdown()


@register.filter
def markdown(text):
    return bleach.clean(
        md.convert(text),
        tags=['p', 'strong', 'em', 'ul', 'ol', 'li', 'h2', 'h3'],
        strip=True,
    )
