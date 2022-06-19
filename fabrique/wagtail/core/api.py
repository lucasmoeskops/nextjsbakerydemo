from django.urls import path
from rest_framework.response import Response
from wagtail.api.v2.views import PagesAPIViewSet

from fabrique.wagtail.core.serializers import WagtailUserBarSerializer


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
