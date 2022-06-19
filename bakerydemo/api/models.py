from wagtail.models import Page
from wagtail_headless_preview.models import HeadlessMixin

from bakerydemo.api.plugins import apply_plugins


@apply_plugins
class ApiPage(HeadlessMixin, Page):
    """ Mixin for page with API support. """
    class Meta:
        abstract = True
