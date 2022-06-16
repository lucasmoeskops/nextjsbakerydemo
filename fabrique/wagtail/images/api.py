from django.http import JsonResponse
from django.urls import path
from wagtail.core.models import Site
from wagtail.images.api.v2.views import ImagesAPIViewSet
from wagtail.images.exceptions import InvalidFilterSpecError
from wagtail.images.models import Filter
from wagtail.images.utils import generate_signature
from wagtail.images.views.serve import ServeView


class ExtendedImagesApiViewSet(ImagesAPIViewSet):
    @classmethod
    def get_urlpatterns(cls):
        """
        This returns a list of URL patterns for the endpoint
        """
        patterns = ImagesAPIViewSet.get_urlpatterns()
        return patterns + [
            path(
                "generate_url/<int:image_id>/<str:filter_spec>/",
                cls.as_view({"get": "generate_url_view"}),
                name="generate",
            ),
        ]

    def generate_url_view(self, request, image_id, filter_spec):
        # Parse the filter spec to make sure its valid
        try:
            Filter(spec=filter_spec).operations
        except InvalidFilterSpecError:
            return JsonResponse({"error": "Invalid filter spec."}, status=400)

        # Generate url
        signature = generate_signature(image_id, filter_spec)
        # Kind of hackish -- this view does what we want, but we don't need it to be
        # a view. It doesn't use request currently, so we just use it as a function.
        res = ServeView(action="redirect").get(None, signature, image_id, filter_spec)
        url = res.url

        # Get site root url
        try:
            site_root_url = Site.objects.get(is_default_site=True).root_url
        except Site.DoesNotExist:
            site_root_url = Site.objects.first().root_url

        return JsonResponse({"url": site_root_url + url}, status=200)
