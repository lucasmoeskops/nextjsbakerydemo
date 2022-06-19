from datetime import datetime

from django.conf import settings
from django.core.validators import RegexValidator
from django.db import models
from wagtail.admin.panels import InlinePanel, FieldPanel, StreamFieldPanel
from wagtail.api import APIField
from wagtail.fields import StreamField
from wagtail.images.api.fields import ImageRenditionField
from wagtail.images.edit_handlers import ImageChooserPanel
from wagtail.models import Page
from wagtail.search import index

from bakerydemo.api.models import ApiPage
from bakerydemo.base.blocks import BaseStreamBlock
from bakerydemo.locations.models import LocationOperatingHours
from bakerydemo.locations.serializers import OperatingHoursSerializer


class LocationPage(ApiPage):
    """
    Detail for a specific bakery location.
    """
    api_fields = [
        *ApiPage.api_fields,
        'address',
        'body',
        APIField('image', serializer=ImageRenditionField('fill-1920x600')),
        'introduction',
        'is_open',
        APIField('operating_hours', serializer=OperatingHoursSerializer(many=True)),
        'title',
        'url',
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
    body = StreamField(
        BaseStreamBlock(), verbose_name="Page body", blank=True
    )
    address = models.TextField()
    lat_long = models.CharField(
        max_length=36,
        help_text="Comma separated lat/long. (Ex. 64.144367, -21.939182) \
                   Right click Google Maps and select 'What\'s Here'",
        validators=[
            RegexValidator(
                regex=r'^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)$',
                message='Lat Long must be a comma-separated numeric lat and long',
                code='invalid_lat_long'
            ),
        ]
    )

    # Search index configuration
    search_fields = Page.search_fields + [
        index.SearchField('address'),
        index.SearchField('body'),
    ]

    # Fields to show to the editor in the admin view
    content_panels = [
        FieldPanel('title', classname="full"),
        FieldPanel('introduction', classname="full"),
        ImageChooserPanel('image'),
        StreamFieldPanel('body'),
        FieldPanel('address', classname="full"),
        FieldPanel('lat_long'),
        InlinePanel('hours_of_operation', label="Hours of Operation"),
    ]

    def __str__(self):
        return self.title

    @property
    def operating_hours(self):
        hours = self.hours_of_operation.all()
        return hours

    # Determines if the location is currently open. It is timezone naive
    def is_open(self):
        now = datetime.now()
        current_time = now.time()
        current_day = now.strftime('%a').upper()
        try:
            self.operating_hours.get(
                day=current_day,
                opening_time__lte=current_time,
                closing_time__gte=current_time
            )
            return True
        except LocationOperatingHours.DoesNotExist:
            return False

    # Makes additional context available to the template so that we can access
    # the latitude, longitude and map API key to render the map
    def get_context(self, request):
        context = super(LocationPage, self).get_context(request)
        context['lat'] = self.lat_long.split(",")[0]
        context['long'] = self.lat_long.split(",")[1]
        context['google_map_api_key'] = settings.GOOGLE_MAP_API_KEY
        return context

    # Can only be placed under a LocationsIndexPage object
    parent_page_types = ['LocationsIndexPage']
