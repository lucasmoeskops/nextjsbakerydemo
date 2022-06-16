from django.conf import settings
from django.urls import re_path

from .utils import pass_through_from_next

urlpatterns = []

if settings.DEBUG:  # TODO: is debug enough or should we validate that is a dev env
    urlpatterns += [re_path("", pass_through_from_next)]
