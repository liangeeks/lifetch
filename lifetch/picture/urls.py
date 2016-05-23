from account.decorators import login_required
from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^json$', views.json_data, name='json'),
    url(r'^upload$', login_required(views.UploadView.as_view()), name='upload'),
]
