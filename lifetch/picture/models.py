from django.db import models


# Create your models here.


class Picture(models.Model):
    url = models.FileField(upload_to='uploads/%Y/%m/%d/')
    name = models.CharField(max_length=128)
    size = models.IntegerField()
    mimetype = models.CharField(max_length=128)
    hash = models.CharField(max_length=128)
