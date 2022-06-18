from django.http.request import HttpRequest
from django.http.response import HttpResponseRedirect
from django.utils.http import urlencode

from fabrique.wagtail.core.security import VALID_TODAY, make_secret
from fabrique.wagtail.core.utils import pass_through_from_next


def with_serve_from_next_support(page_class):
    def serve(self, request: HttpRequest, *args, **kwargs):
        return pass_through_from_next(request)

    setattr(page_class, "serve", serve)
    return page_class
