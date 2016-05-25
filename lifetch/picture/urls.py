from django.conf.urls import url
from django.contrib.auth.decorators import login_required

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^json$', views.json_data, name='json'),
    url(r'^upload$', views.upload, name='upload'),
]
