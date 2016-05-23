import json

from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render
from django.views.generic import View
from lifetch.picture.exceptions import DuplicateUploadError
from lifetch.picture.forms import UploadFileForm
from lifetch.picture.models import Picture


@login_required
def index(request):
    return render(request, 'picture/index.html')


@login_required
def json_data(request):
    page = max(int(request.GET.get('page', '1')), 1)
    size = 20
    offset = 20 * (page - 1)
    return HttpResponse(json.dumps(
        [picture.to_dict() for picture in
         Picture.objects.filter(owner=request.user).order_by('-date_created')[offset:offset + size]]
    ), content_type='application/json')


class UploadView(View):
    def post(self, request, **kwargs):
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            picture = Picture(path=request.FILES['file'], owner=request.user)
            try:
                picture.save()
                data = {
                    'success': True,
                    'data': {
                        'id': picture.id,
                        'url': picture.path.url,
                        'name': picture.name,
                        'content_type': picture.content_type,
                        'size': picture.size,
                        'hash': picture.hash
                    }
                }
                status = 200
            except DuplicateUploadError as e:
                data = {
                    'success': False,
                    'message': "图片不能重复上传"
                }
                status = 400

            return HttpResponse(json.dumps(data), content_type='application/json', status=status)
        else:
            return HttpResponse(json.dumps({
                'success': False,
                'message': '请求数据有误'
            }), content_type='application/json', status=400)
