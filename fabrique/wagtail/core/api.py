from django.contrib.contenttypes.models import ContentType
from django.urls import path
from rest_framework.response import Response
from wagtail.api.v2.views import PagesAPIViewSet
from wagtail_headless_preview.models import PagePreview

from fabrique.wagtail.core.serializers import WagtailUserBarSerializer


class PagePreviewAPIViewSet(PagesAPIViewSet):
    # COPIED FROM: https://github.com/torchbox/wagtail-headless-preview/README.md
    # Added extra view to get the path for a page to preview

    known_query_parameters = PagesAPIViewSet.known_query_parameters.union(
        ["content_type", "token"]
    )

    @classmethod
    def get_urlpatterns(cls):
        patterns = super(PagePreviewAPIViewSet, cls).get_urlpatterns()
        return patterns + [
            path(
                "get_path/",
                cls.as_view({"get": "get_path_view"}),
                name="get_path",
            ),
        ]

    def listing_view(self, request):
        page = self.get_object()
        serializer = self.get_serializer(page)
        return Response(serializer.data)

    def detail_view(self, request, pk):
        page = self.get_object()
        serializer = self.get_serializer(page)
        return Response(serializer.data)

    def get_path_view(self, request):
        page = self.get_object()
        site_id, site_root, relative_page_url = page.get_url_parts(request)
        return Response({'path': relative_page_url})

    def get_object(self):
        app_label, model = self.request.GET["content_type"].split(".")
        content_type = ContentType.objects.get(app_label=app_label, model=model)

        page_preview = PagePreview.objects.get(
            content_type=content_type, token=self.request.GET["token"]
        )
        page = page_preview.as_page()
        if not page.pk:
            # fake primary key to stop API URL routing from complaining
            page.pk = 0

        return page


def pages_viewset_with_admin_user_bar_support(pages_viewset_class: PagesAPIViewSet):
    __class__ = pages_viewset_class

    def get_urlpatterns(cls):
        patterns = super(pages_viewset_class, cls).get_urlpatterns()
        return patterns + [
            path(
                "wagtail_user_bar/<int:pk>/",
                cls.as_view({"get": "wagtail_user_bar_view"}),
                name="wagtail_user_bar",
            ),
        ]

    def wagtail_user_bar_view(self, request, **kwargs):
        serializer = WagtailUserBarSerializer(instance=self.get_object(), request=request)
        return Response(serializer.data)

    setattr(pages_viewset_class, 'get_urlpatterns', classmethod(get_urlpatterns))
    setattr(pages_viewset_class, 'wagtail_user_bar_view', wagtail_user_bar_view)
    return pages_viewset_class


@pages_viewset_with_admin_user_bar_support
class ExtendedPagesAPIViewSet(PagesAPIViewSet):
    pass
