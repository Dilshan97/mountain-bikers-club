from django.contrib import messages
from django.http import HttpResponseRedirect, JsonResponse, Http404
from django.shortcuts import render, get_object_or_404
from django.urls import reverse, reverse_lazy
from django.contrib.auth.decorators import login_required
from django.utils.translation import gettext as _
from django.utils import timezone
from django.views.generic import DeleteView

from trail.models import Trail
from .models import User
from .forms import UserCreateForm, UserProfileForm


def main(request, slug):
    current_user = request.user
    member = get_object_or_404(User, username=slug)
    member_trails = Trail.objects.filter(author=member, pub_date__lte=timezone.now(), is_draft=False)
    member_favorite_trails = Trail.objects.filter(favorite_by=member, pub_date__lte=timezone.now(), is_draft=False)
    is_following = False

    if not current_user == member:
        member_trails = member_trails.filter(is_private=False)
        member_favorite_trails = member_favorite_trails.filter(is_private=False)

    if current_user.is_authenticated and member in current_user.following_users.all() and not current_user == member:
        is_following = True

    context = {
        'member': member,
        'member_trails': member_trails,
        'member_favorite_trails': member_favorite_trails,
        'is_following': is_following,
    }

    return render(request, 'member/main.html', context)


def register(request):
    if request.method == 'POST':
        form = UserCreateForm(request.POST)

        if form.is_valid():
            user = User.objects.create_user(
                request.POST['username'],
                request.POST['email'],
                request.POST['password1']
            )
            user.save()

            return HttpResponseRedirect(reverse('member__edit', args=[user.username]))

    else:
        form = UserCreateForm()

    context = {
        'form': form,
    }

    return render(request, 'member/register.html', context)


@login_required
def follow(request, slug):
    current_user = request.user
    following_users = current_user.following_users.all()
    slug_user = get_object_or_404(User, username=slug)
    is_following = True

    if current_user == slug_user:
        HttpResponseRedirect(reverse('member__main', args=[current_user.username]))

    if slug_user in following_users:
        current_user.following_users.remove(slug_user)
        is_following = False
    else:
        current_user.following_users.add(slug_user)

    if request.method == 'PUT':
        return JsonResponse({
            'status': is_following,
            'count': len(slug_user.followed_by.all()),
        })
    else:
        return HttpResponseRedirect(reverse('member__main', args=[slug_user.username]))


@login_required
def edit(request, slug):
    current_user = request.user
    slug_user = get_object_or_404(User, username=slug)

    if current_user != slug_user:
        raise Http404()

    if request.method == 'POST':
        form = UserProfileForm(data=request.POST, files=request.FILES, instance=current_user)

        if form.is_valid():
            form.save()
            messages.success(request, _('User details updated.'))

            return HttpResponseRedirect(reverse('member__main', args=[current_user.username]))

    else:
        form = UserProfileForm(instance=current_user)

    context = {
        'form': form,
    }

    return render(request, 'member/edit.html', context)


class MemberDelete(DeleteView):
    model = User
    slug_field = 'username'
    success_url = reverse_lazy('home')

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(username=self.request.user)
