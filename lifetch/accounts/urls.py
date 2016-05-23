from django.conf.urls import url
from django.contrib.auth.views import logout_then_login, login
from django.views.generic import TemplateView

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^login/$', login, name='login'),
    url(r'^logout/$', logout_then_login, name='logout'),
    url(r'^profile/$', views.profile, name='profile'),
    url(r'^join/$', views.join, name='join'),
    url(r'^join/success/$', TemplateView.as_view(template_name="accounts/join_success.html"), name='join-success'),
]
