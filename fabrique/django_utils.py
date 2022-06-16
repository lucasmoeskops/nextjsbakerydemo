from django.db import models
from django.db.models import QuerySet
from django.forms import NumberInput
from django.middleware.csrf import rotate_token
from django.utils.functional import classproperty
from wagtail.admin.edit_handlers import FieldPanel


class AdminTitleMixin(models.Model):
    admin_title = models.CharField(blank=True, max_length=140)

    admin_title_panels = [FieldPanel("admin_title")]

    def __str__(self):
        return self.admin_title or "No title"

    class Meta:
        abstract = True


class RangeInput(NumberInput):
    input_type = "range"


class cached_classproperty(classproperty):
    # https://stackoverflow.com/a/62139534
    def get_result_field_name(self):
        return self.fget.__name__ + "_property_result" if self.fget else None

    def __get__(self, instance, cls=None):
        result_field_name = self.get_result_field_name()

        if hasattr(cls, result_field_name):
            return getattr(cls, result_field_name)

        if not cls or not result_field_name:
            return self.fget(cls)

        setattr(cls, result_field_name, self.fget(cls))
        return getattr(cls, result_field_name)


def ensure_csrf_token_on_request(request):
    if "CSRF_COOKIE" not in request.META:
        rotate_token(request)


def find_unused_string_value(field_name: str, base_value: str, qs: QuerySet) -> str:
    proposal = base_value
    counter = 0

    while qs.filter(**{field_name: proposal}).exists():
        counter += 1
        proposal = f"{base_value}-{counter}"

    return proposal


def find_unused_slug(slug: str, qs: QuerySet) -> str:
    return find_unused_string_value("slug", slug, qs)
