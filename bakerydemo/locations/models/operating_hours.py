from django.conf import settings
from django.db import models
from modelcluster.fields import ParentalKey
from wagtail.admin.panels import FieldPanel
from wagtail.models import Orderable

from bakerydemo.locations.choices import DAY_CHOICES


class OperatingHours(models.Model):
    """
    A Django model to capture operating hours for a Location
    """

    day = models.CharField(
        max_length=4,
        choices=DAY_CHOICES,
        default='MON'
    )
    opening_time = models.TimeField(
        blank=True,
        null=True
    )
    closing_time = models.TimeField(
        blank=True,
        null=True
    )
    closed = models.BooleanField(
        "Closed?",
        blank=True,
        help_text='Tick if location is closed on this day'
    )

    panels = [
        FieldPanel('day'),
        FieldPanel('opening_time'),
        FieldPanel('closing_time'),
        FieldPanel('closed'),
    ]

    class Meta:
        abstract = True

    def __str__(self):
        if self.opening_time:
            opening = self.opening_time.strftime('%H:%M')
        else:
            opening = '--'
        if self.closing_time:
            closed = self.closing_time.strftime('%H:%M')
        else:
            closed = '--'
        return '{}: {} - {} {}'.format(
            self.day,
            opening,
            closed,
            settings.TIME_ZONE
        )


class LocationOperatingHours(Orderable, OperatingHours):
    """
    A model creating a relationship between the OperatingHours and Location
    Note that unlike BlogPeopleRelationship we don't include a ForeignKey to
    OperatingHours as we don't need that relationship (e.g. any Location open
    a certain day of the week). The ParentalKey is the minimum required to
    relate the two objects to one another. We use the ParentalKey's related_
    name to access it from the LocationPage admin
    """
    location = ParentalKey(
        'LocationPage',
        related_name='hours_of_operation',
        on_delete=models.CASCADE
    )
