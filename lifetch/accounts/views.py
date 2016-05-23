from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from django.shortcuts import render, render_to_response

# Create your views here.


# Create your views here.
from django.template import RequestContext

from lifetch.accounts.forms import RegistrationForm


def index(request):
    return render(request, 'accounts/index.html')


def profile(request):
    return render(request, 'accounts/profile.html')


def join(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            User.objects.create_user(
                username=form.cleaned_data['username'],
                password=form.cleaned_data['password1'],
                email=form.cleaned_data['email']
            )
            return HttpResponseRedirect('/accounts/join/success/')
    else:
        form = RegistrationForm()
    variables = RequestContext(request, {'form': form})
    return render_to_response('accounts/join.html', variables, )
