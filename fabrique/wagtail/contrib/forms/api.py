from django.apps import apps
from django.urls import path
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST
from wagtail.api.v2.utils import BadRequestError
from wagtail.api.v2.views import PagesAPIViewSet
from wagtail.contrib.forms.models import AbstractForm
from wagtail.models import Page

from fabrique.django_utils import ensure_csrf_token_on_request


class FormsApiEndpoint(PagesAPIViewSet):
    model = Page

    @classmethod
    def get_body_fields(cls, model):
        return cls._convert_api_fields(
            cls.body_fields + list(getattr(model, "landing_api_fields", ()))
        )

    @classmethod
    def get_urlpatterns(cls):
        """
        This returns a list of URL patterns for the endpoint
        """
        return [
            path("obtain_csrf/", cls.as_view({"get": "obtain_csrf_view"}), name="obtain_csrf"),
            path("<int:pk>/submit/", cls.as_view({"post": "submit_form_view"}), name="submit_form"),
        ]

    def obtain_csrf_view(self, request):
        ensure_csrf_token_on_request(request)
        return Response({})

    def submit_form_view(self, request, pk):
        page = self.get_object()
        form = page.get_form(
            request.data, request.FILES, page=page, user=request.user
        )
        if form.is_valid():
            form_submission = page.process_form_submission(form)
            return self.detail_view(request, pk)
        else:
            return Response(form.errors, status=HTTP_400_BAD_REQUEST)

    def get_object(self):
        page = super().get_object()

        if not isinstance(page, AbstractForm):
            raise BadRequestError('Page is not a form page.')

        return page
    #
    # def get_queryset(self):
    #     """ Get all form pages """
    #     form_types = [model for model in apps.get_models() if issubclass(model, AbstractForm)]
    #     return Page.objects.live().type(*form_types)

