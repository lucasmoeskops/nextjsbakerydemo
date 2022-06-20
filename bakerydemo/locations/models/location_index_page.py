from django.db import models
from rest_framework.serializers import ModelSerializer
from wagtail.admin.panels import FieldPanel
from wagtail.api import APIField
from wagtail.images.api.fields import ImageRenditionField
from wagtail.images.edit_handlers import ImageChooserPanel
from wagtail.models import Page

from bakerydemo.api.models import ApiPage
from bakerydemo.locations.models import LocationPage


class LocationSerializer(ModelSerializer):
    image = ImageRenditionField('fill-645x480-c75')
    portrait_image = ImageRenditionField('fill-433x487-c100', source='image')

    class Meta:
        fields = ['image', 'portrait_image', 'title', 'url']
        model = LocationPage


class LocationsIndexPage(ApiPage):
    """
    A Page model that creates an index page (a listview)
    """
    api_fields = [
        *ApiPage.api_fields,
        'introduction',
        APIField('locations', serializer=LocationSerializer(many=True, source='get_locations')),
    ]

    introduction = models.TextField(
        help_text='Text to describe the page',
        blank=True)
    image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        help_text='Landscape mode only; horizontal width between 1000px and 3000px.'
    )

    # Only LocationPage objects can be added underneath this index page
    subpage_types = ['LocationPage']

    # Allows children of this indexpage to be accessible via the indexpage
    # object on templates. We use this on the homepage to show featured
    # sections of the site and their child pages
    def children(self):
        return self.get_children().specific().live()

    def get_locations(self):
        return LocationPage.objects.descendant_of(
            self).live().order_by(
            'title')

    # Overrides the context to list all child
    # items, that are live, by the date that they were published
    # https://docs.wagtail.org/en/stable/getting_started/tutorial.html#overriding-context
    def get_context(self, request):
        context = super(LocationsIndexPage, self).get_context(request)
        context['locations'] = self.get_locations()
        return context

    content_panels = Page.content_panels + [
        FieldPanel('introduction', classname="full"),
        ImageChooserPanel('image'),
    ]
