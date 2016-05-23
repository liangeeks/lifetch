import json

from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
from django.views.generic import View


def index(request):
    return render(request, 'picture/index.html')


class UploadView(View):
    def post(self, request):
        data = json.dumps({})
        return HttpResponse(data, mimetype='application/json')
