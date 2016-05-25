# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-05-24 06:17
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Picture',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('path', models.ImageField(upload_to='')),
                ('name', models.CharField(max_length=128)),
                ('size', models.IntegerField()),
                ('content_type', models.CharField(max_length=128)),
                ('hash', models.CharField(max_length=128)),
                ('date_created', models.DateTimeField(default=django.utils.timezone.now)),
                ('owner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]