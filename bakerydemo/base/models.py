from __future__ import unicode_literals

from django.db import models

from modelcluster.fields import ParentalKey
from modelcluster.models import ClusterableModel
from rest_framework.fields import URLField

from wagtail.admin.panels import (
    FieldPanel,
    FieldRowPanel,
    InlinePanel,
    MultiFieldPanel,
    PageChooserPanel,
    StreamFieldPanel,
)
from wagtail.api import APIField
from wagtail.fields import RichTextField, StreamField
from wagtail.models import Collection, Page
from wagtail.contrib.forms.models import AbstractEmailForm, AbstractFormField
from wagtail.images.api.fields import ImageRenditionField
from wagtail.images.edit_handlers import ImageChooserPanel
from wagtail.search import index
from wagtail.snippets.models import register_snippet

from fabrique.wagtail.core.models import with_preview_support, with_serve_from_next_support
from .blocks import BaseStreamBlock
from .serializers import FeaturedSectionBreadSerializer, FormSerializer


@register_snippet
class People(index.Indexed, ClusterableModel):
    """
    A Django model to store People objects.
    It uses the `@register_snippet` decorator to allow it to be accessible
    via the Snippets UI (e.g. /admin/snippets/base/people/)

    `People` uses the `ClusterableModel`, which allows the relationship with
    another model to be stored locally to the 'parent' model (e.g. a PageModel)
    until the parent is explicitly saved. This allows the editor to use the
    'Preview' button, to preview the content, without saving the relationships
    to the database.
    https://github.com/wagtail/django-modelcluster
    """
    first_name = models.CharField("First name", max_length=254)
    last_name = models.CharField("Last name", max_length=254)
    job_title = models.CharField("Job title", max_length=254)

    image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    panels = [
        MultiFieldPanel([
            FieldRowPanel([
                FieldPanel('first_name', classname="col6"),
                FieldPanel('last_name', classname="col6"),
            ])
        ], "Name"),
        FieldPanel('job_title'),
        ImageChooserPanel('image')
    ]

    search_fields = [
        index.SearchField('first_name'),
        index.SearchField('last_name'),
    ]

    @property
    def thumb_image(self):
        # Returns an empty string if there is no profile pic or the rendition
        # file can't be found.
        try:
            return self.image.get_rendition('fill-50x50').img_tag()
        except:  # noqa: E722 FIXME: remove bare 'except:'
            return ''

    def __str__(self):
        return '{} {}'.format(self.first_name, self.last_name)

    class Meta:
        verbose_name = 'Person'
        verbose_name_plural = 'People'


@register_snippet
class FooterText(models.Model):
    """
    This provides editable text for the site footer. Again it uses the decorator
    `register_snippet` to allow it to be accessible via the admin. It is made
    accessible on the template via a template tag defined in base/templatetags/
    navigation_tags.py
    """
    body = RichTextField()

    panels = [
        FieldPanel('body'),
    ]

    def __str__(self):
        return "Footer text"

    class Meta:
        verbose_name_plural = 'Footer Text'


def with_navigation_support(page_class):
    def top_menu(self):
        from .templatetags.navigation_tags import has_menu_children
        site = self.get_site()
        parent = site.root_page
        menuitems = parent.get_children().live().in_menu()
        for menuitem in menuitems:
            menuitem.show_dropdown = has_menu_children(menuitem)
            # We don't directly check if calling_page is None since the template
            # engine can pass an empty string to calling_page
            # if the variable passed as calling_page does not exist.
            menuitem.active = self.url_path.startswith(menuitem.url_path)
        return {
            'menuitems': [{
                'className': menuitem.title.lower().replace(' ', ''),
                'active': menuitem.active,
                'show_dropdown': menuitem.show_dropdown,
                'children': self.top_menu_children(menuitem) if menuitem.show_dropdown else [],
                'title': menuitem.title,
                'url': menuitem.relative_url(site),
            } for menuitem in menuitems]
        }

    def top_menu_children(self, parent):
        from .templatetags.navigation_tags import has_menu_children
        site = self.get_site()
        menuitems_children = parent.get_children()
        menuitems_children = menuitems_children.live().in_menu()
        for menuitem in menuitems_children:
            menuitem.has_dropdown = has_menu_children(menuitem)
            # We don't directly check if calling_page is None since the template
            # engine can pass an empty string to calling_page
            # if the variable passed as calling_page does not exist.
            menuitem.active = self.url_path.startswith(menuitem.url_path)
            menuitem.children = menuitem.get_children().live().in_menu()
        return {
            'menuitems': [{
                'title': menuitem.title,
                'url': menuitem.relative_url(site),
            } for menuitem in menuitems_children]
        }

    setattr(page_class, 'top_menu', top_menu)
    setattr(page_class, 'top_menu_children', top_menu_children)
    page_class.api_fields = [
        *getattr(page_class, 'api_fields', []),
        'top_menu',
    ]
    return page_class


def with_breadcrumbs_support(page_class):
    def breadcrumbs(self):
        site = self.get_site()
        if self.depth <= 2:
            # When on the home page, displaying breadcrumbs is irrelevant.
            ancestors = ()
        else:
            ancestors = Page.objects.ancestor_of(
                self, inclusive=True).filter(depth__gt=1)
        if ancestors:
            return {
                'ancestors': [{
                    'title': ancestor.title,
                    'url': ancestor.relative_url(site)
                } for ancestor in ancestors],
            }

    setattr(page_class, 'breadcrumbs', breadcrumbs)
    page_class.api_fields = [
        *getattr(page_class, 'api_fields', []),
        'breadcrumbs',
    ]
    return page_class


def api_page(page_class):
    for support in [
        with_breadcrumbs_support,
        with_navigation_support,
        with_serve_from_next_support,
        with_preview_support,
    ][::-1]:
        page_class = support(page_class)
    return page_class


class StandardPage(Page):
    """
    A generic content page. On this demo site we use it for an about page but
    it could be used for any type of page content that only needs a title,
    image, introduction and body field
    """

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
    content_panels = Page.content_panels + [
        FieldPanel('introduction', classname="full"),
        StreamFieldPanel('body'),
        ImageChooserPanel('image'),
    ]


@api_page
class HomePage(Page):
    """
    The Home Page. This looks slightly more complicated than it is. You can
    see if you visit your site and edit the homepage that it is split between
    a:
    - Hero area
    - Body area
    - A promotional area
    - Moveable featured site sections
    """
    api_fields = [
        'body',
        APIField('featured_section_1', serializer=FeaturedSectionBreadSerializer()),
        'featured_section_1_title',
        'hero_text',
        'hero_cta',
        APIField('hero_cta_link', serializer=URLField(source='hero_cta_link.url')),
        APIField('image', serializer=ImageRenditionField('fill-1920x600')),
        APIField('promo_image', serializer=ImageRenditionField('fill-590x413-c100')),
        'promo_title',
        'promo_text',
    ]

    # Hero section of HomePage
    image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        help_text='Homepage image'
    )
    hero_text = models.CharField(
        max_length=255,
        help_text='Write an introduction for the bakery'
    )
    hero_cta = models.CharField(
        verbose_name='Hero CTA',
        max_length=255,
        help_text='Text to display on Call to Action'
    )
    hero_cta_link = models.ForeignKey(
        'wagtailcore.Page',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        verbose_name='Hero CTA link',
        help_text='Choose a page to link to for the Call to Action'
    )

    # Body section of the HomePage
    body = StreamField(
        BaseStreamBlock(), verbose_name="Home content block", blank=True
    )

    # Promo section of the HomePage
    promo_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        help_text='Promo image'
    )
    promo_title = models.CharField(
        blank=True,
        max_length=255,
        help_text='Title to display above the promo copy'
    )
    promo_text = RichTextField(
        null=True,
        blank=True,
        help_text='Write some promotional copy'
    )

    # Featured sections on the HomePage
    # You will see on templates/base/home_page.html that these are treated
    # in different ways, and displayed in different areas of the page.
    # Each list their children items that we access via the children function
    # that we define on the individual Page models e.g. BlogIndexPage
    featured_section_1_title = models.CharField(
        blank=True,
        max_length=255,
        help_text='Title to display above the promo copy'
    )
    featured_section_1 = models.ForeignKey(
        'wagtailcore.Page',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        help_text='First featured section for the homepage. Will display up to '
        'three child items.',
        verbose_name='Featured section 1'
    )

    featured_section_2_title = models.CharField(
        blank=True,
        max_length=255,
        help_text='Title to display above the promo copy'
    )
    featured_section_2 = models.ForeignKey(
        'wagtailcore.Page',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        help_text='Second featured section for the homepage. Will display up to '
        'three child items.',
        verbose_name='Featured section 2'
    )

    featured_section_3_title = models.CharField(
        blank=True,
        max_length=255,
        help_text='Title to display above the promo copy'
    )
    featured_section_3 = models.ForeignKey(
        'wagtailcore.Page',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        help_text='Third featured section for the homepage. Will display up to '
        'six child items.',
        verbose_name='Featured section 3'
    )

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            ImageChooserPanel('image'),
            FieldPanel('hero_text', classname="full"),
            MultiFieldPanel([
                FieldPanel('hero_cta'),
                PageChooserPanel('hero_cta_link'),
            ]),
        ], heading="Hero section"),
        MultiFieldPanel([
            ImageChooserPanel('promo_image'),
            FieldPanel('promo_title'),
            FieldPanel('promo_text'),
        ], heading="Promo section"),
        StreamFieldPanel('body'),
        MultiFieldPanel([
            MultiFieldPanel([
                FieldPanel('featured_section_1_title'),
                PageChooserPanel('featured_section_1'),
            ]),
            MultiFieldPanel([
                FieldPanel('featured_section_2_title'),
                PageChooserPanel('featured_section_2'),
            ]),
            MultiFieldPanel([
                FieldPanel('featured_section_3_title'),
                PageChooserPanel('featured_section_3'),
            ]),
        ], heading="Featured homepage sections", classname="collapsible")
    ]

    def __str__(self):
        return self.title


class GalleryPage(Page):
    """
    This is a page to list locations from the selected Collection. We use a Q
    object to list any Collection created (/admin/collections/) even if they
    contain no items. In this demo we use it for a GalleryPage,
    and is intended to show the extensibility of this aspect of Wagtail
    """

    introduction = models.TextField(
        help_text='Text to describe the page',
        blank=True)
    image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        help_text='Landscape mode only; horizontal width between 1000px and '
        '3000px.'
    )
    body = StreamField(
        BaseStreamBlock(), verbose_name="Page body", blank=True
    )
    collection = models.ForeignKey(
        Collection,
        limit_choices_to=~models.Q(name__in=['Root']),
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        help_text='Select the image collection for this gallery.'
    )

    content_panels = Page.content_panels + [
        FieldPanel('introduction', classname="full"),
        StreamFieldPanel('body'),
        ImageChooserPanel('image'),
        FieldPanel('collection'),
    ]

    # Defining what content type can sit under the parent. Since it's a blank
    # array no subpage can be added
    subpage_types = []


class FormField(AbstractFormField):
    """
    Wagtailforms is a module to introduce simple forms on a Wagtail site. It
    isn't intended as a replacement to Django's form support but as a quick way
    to generate a general purpose data-collection form or contact form
    without having to write code. We use it on the site for a contact form. You
    can read more about Wagtail forms at:
    https://docs.wagtail.org/en/stable/reference/contrib/forms/index.html
    """
    page = ParentalKey('FormPage', related_name='form_fields', on_delete=models.CASCADE)


@api_page
class FormPage(AbstractEmailForm):
    api_fields = [
        APIField('form', serializer=FormSerializer(source='get_form')),
    ]
    image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )
    body = StreamField(BaseStreamBlock())
    thank_you_text = RichTextField(blank=True)

    # Note how we include the FormField object via an InlinePanel using the
    # related_name value
    content_panels = AbstractEmailForm.content_panels + [
        ImageChooserPanel('image'),
        StreamFieldPanel('body'),
        InlinePanel('form_fields', label="Form fields"),
        FieldPanel('thank_you_text', classname="full"),
        MultiFieldPanel([
            FieldRowPanel([
                FieldPanel('from_address', classname="col6"),
                FieldPanel('to_address', classname="col6"),
            ]),
            FieldPanel('subject'),
        ], "Email"),
    ]
