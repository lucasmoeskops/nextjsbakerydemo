from wagtail.api.v2.router import WagtailAPIRouter
from wagtail.documents.api.v2.views import DocumentsAPIViewSet

from fabrique.wagtail.contrib.forms.api import FormsApiEndpoint
from fabrique.wagtail.core.api import ExtendedPagesAPIViewSet
from fabrique.wagtail.images.api import ExtendedImagesApiViewSet

# Create the router. "wagtailapi" is the URL namespace
from fabrique.wagtail_headless_preview.api import PagePreviewAPIViewSet

api_router = WagtailAPIRouter("wagtailapi")

# Add the three endpoints using the "register_endpoint" method.
# The first parameter is the name of the endpoint (eg. pages, images). This
# is used in the URL of the endpoint
# The second parameter is the endpoint class that handles the requests
api_router.register_endpoint("pages", ExtendedPagesAPIViewSet)
api_router.register_endpoint("images", ExtendedImagesApiViewSet)
api_router.register_endpoint("documents", DocumentsAPIViewSet)
api_router.register_endpoint("page_preview", PagePreviewAPIViewSet)
api_router.register_endpoint("forms", FormsApiEndpoint)
