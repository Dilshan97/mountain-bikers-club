from django import forms

from .models import Trail
from shell.widgets import MarkdownWidget


class GpxUploadForm(forms.ModelForm):
    class Meta:
        model = Trail
        fields = ('file',)

    def save(self, commit=True):
        trail = super().save(commit=False)
        if commit:
            trail.save()
        return trail


class GpxEditForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['name'].widget.attrs['autofocus'] = 'true'
        self.fields['description'].widget = MarkdownWidget()

    class Meta:
        model = Trail
        fields = ('name', 'description')

    def save(self, commit=True):
        trail = super().save(commit=False)
        if commit:
            trail.save()
        return trail
