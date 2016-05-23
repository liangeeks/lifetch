# -*- coding: utf-8 -*- 
from __future__ import unicode_literals

from django.db import DataError


class DuplicateUploadError(DataError):
    pass
