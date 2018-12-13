from django import forms
from django.contrib.auth.forms import UserCreationForm as DefaultUserCreationForm
from django.utils.translation import gettext_lazy as _

from .models import User, resize_avatar


forbidden_username = [
    'superuser',
    'member'
]


class UserCreateForm(DefaultUserCreationForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in ('username', 'email', 'password1', 'password2'):
            self.fields[field].widget.attrs['autocapitalize'] = 'off'
            self.fields[field].widget.attrs['autocorrect'] = 'off'
            self.fields[field].widget.attrs['spellcheck'] = 'false'
            if field.startswith('password'):
                self.fields[field].widget.attrs['autocomplete'] = 'new-password'
            else:
                self.fields[field].widget.attrs['autocomplete'] = field

    class Meta:
        model = User
        fields = DefaultUserCreationForm.Meta.fields + ('email',)

    def clean_username(self):
        username = self.cleaned_data['username']

        if username in forbidden_username or username.startswith('admin'):
            raise forms.ValidationError(_("This username is forbidden."))

        return username


class UserProfileForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in ('username', 'first_name', 'last_name', 'email'):
            self.fields[field].widget.attrs['autocapitalize'] = 'off'
            self.fields[field].widget.attrs['autocorrect'] = 'off'
            self.fields[field].widget.attrs['spellcheck'] = 'false'
            self.fields[field].widget.attrs['autocomplete'] = field
        self.fields['first_name'].widget.attrs['autofocus'] = 'true'
        self.fields['biography'].widget = forms.widgets.Textarea(attrs={'rows': 3})

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'avatar', 'biography', 'email')

    def clean_username(self):
        username = self.cleaned_data['username']

        if username in forbidden_username or username.lower().startswith('admin'):
            raise forms.ValidationError(_("This username is forbidden."))

        if User.objects.filter(username=username).exists() and self.initial['username'] != username:
            raise forms.ValidationError(_("A user with that username already exists."))

        return username

    def save(self, commit=True):
        user = super().save(commit=False)
        if commit:
            if user.avatar:
                user.avatar = resize_avatar(user.avatar)
            user.save()
        return user
