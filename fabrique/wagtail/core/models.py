from django.http.request import HttpRequest
from django.http.response import HttpResponseRedirect

from fabrique.wagtail.core.security import VALID_TODAY, make_secret
from fabrique.wagtail.core.utils import pass_through_from_next


def with_serve_from_next_support(page_class):
    def serve(self, request: HttpRequest, *args, **kwargs):
        return pass_through_from_next(request)

    setattr(page_class, "serve", serve)
    return page_class


def with_preview_support(page_class):
    def serve_preview(self, request, mode_name):
        _, _, path = self.get_url_parts()
        preview_path = f"/preview/{self.pk}"
        secret = make_secret(
            revision_id=self.get_latest_revision().pk,
            validity=VALID_TODAY,
        )
        site_root_url = self.get_site().root_url
        url = f"{site_root_url}{preview_path}?secret={secret}"
        return HttpResponseRedirect(url)

    setattr(page_class, "serve_preview", serve_preview)
    return page_class
