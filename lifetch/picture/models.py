import hashlib

from django.contrib.auth.models import User
from django.core.files.storage import default_storage
from django.db import models, DataError
from django.utils import timezone

from lifetch.picture.exceptions import DuplicateUploadError


class Picture(models.Model):
    owner = models.ForeignKey(User, null=True)
    path = models.ImageField(storage=default_storage)
    name = models.CharField(max_length=128)
    size = models.IntegerField()
    content_type = models.CharField(max_length=128)
    hash = models.CharField(max_length=128)
    date_created = models.DateTimeField(default=timezone.now)

    def save(self, *args, **kwargs):
        if not self.pk:  # file is new
            md5 = hashlib.md5()
            self.name = self.path.name
            self.size = self.path.size
            self.content_type = self.path.file.content_type
            for chunk in self.path.chunks():
                md5.update(chunk)
            self.hash = md5.hexdigest()
            if Picture.objects.filter(hash=self.hash, owner=self.owner).first():
                raise DuplicateUploadError("图片已经存在")
        super(Picture, self).save(*args, **kwargs)

    def to_dict(self):
        return {
            'id': self.id,
            'url': self.path.url,
            'name': self.name,
            'content_type': self.content_type,
            'size': self.size,
            'hash': self.hash
        }
