from rest_framework.fields import CharField, SerializerMethodField
from rest_framework.serializers import Serializer
from wagtail.images.api.fields import ImageRenditionField


class FeaturedBreadPageSerializer(Serializer):
    bread_type = CharField(source='bread_type.title')
    image = ImageRenditionField('fill-180x180-c100')
    origin = CharField(source='origin.title')
    title = CharField()
    url = CharField()


class FeaturedSectionBreadSerializer(Serializer):
    featured_items = SerializerMethodField()

    def get_featured_items(self, obj):
        from bakerydemo.breads.models import BreadsIndexPage
        bread_index_page = obj.specific
        if not isinstance(bread_index_page, BreadsIndexPage):
            return
        items = bread_index_page.children().specific()[:3]
        serializer = FeaturedBreadPageSerializer(many=True, instance=items)
        return serializer.data


class FormFieldSerializer(Serializer):
    name = CharField()
    label = CharField()
    initial = CharField()
    widget = CharField(source='widget.__class__.__name__')


class FormSerializer(Serializer):
    form_fields = SerializerMethodField()

    def get_form_fields(self, obj):
        fields = []
        for name, field in obj.fields.items():
            field.name = name
            fields.append(field)
        serializer = FormFieldSerializer(many=True, instance=fields)
        return serializer.data
