from django.forms import widgets
from django.utils.safestring import mark_safe


class MarkdownWidget(widgets.Textarea):
    def render(self, name, value, attrs=None, renderer=None):
        output = '<markdown-editor>' +\
                 super().render(name, value, attrs, renderer) +\
                 '</markdown-editor>'

        return mark_safe(output)
