from django.template import Template, Context
from rest_framework.fields import SerializerMethodField
from rest_framework.serializers import Serializer


class WagtailUserBarSerializer(Serializer):
    html = SerializerMethodField()

    def __init__(self, instance, request, **kwargs):
        super().__init__(instance, **kwargs)
        self.request = request

    def get_html(self, obj):
        context = Context({"request": self.request, "page": obj})
        return Template("{% load wagtailuserbar %}{% wagtailuserbar %}").render(context)
