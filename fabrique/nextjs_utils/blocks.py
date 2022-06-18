from wagtail.blocks import RichTextBlock
from wagtail.images.api.fields import ImageRenditionField
from wagtail.images.blocks import ImageChooserBlock


class APIImageChooserBlock(ImageChooserBlock):
    """ Image Chooser Block that renders to an image rendition in the api. """
    def get_api_representation(self, value, context=None):
        if not value:
            return
        serializer = ImageRenditionField(self.meta.filter_spec)
        return serializer.to_representation(value)


class APIRichTextBlock(RichTextBlock):
    """ Image Chooser Block that renders to an image rendition in the api. """
    def get_api_representation(self, value, context=None):
        return str(value)
