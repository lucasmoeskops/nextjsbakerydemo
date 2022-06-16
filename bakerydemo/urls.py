from django.conf import settings
from django.contrib import admin
from django.urls import include, path

import debug_toolbar
from wagtail.admin import urls as wagtailadmin_urls
from wagtail.documents import urls as wagtaildocs_urls
from wagtail.contrib.sitemaps.views import sitemap
from wagtail import urls as wagtail_urls

from bakerydemo.search import views as search_views
from .api import api_router

from fabrique.wagtail.core import urls as next_urls

urlpatterns = [
    path('django-admin/', admin.site.urls),

    path('admin/', include(wagtailadmin_urls)),
    path('documents/', include(wagtaildocs_urls)),

    path('search/', search_views.search, name='search'),

    path('sitemap.xml', sitemap),
    path("wapi/v2/", api_router.urls),
    path("_next/", include(next_urls)),
    path("api/", include(next_urls)),
    path("preview/", include(next_urls)),
    path('__debug__/', include(debug_toolbar.urls)),
]


if settings.DEBUG:
    from django.conf.urls.static import static
    from django.contrib.staticfiles.urls import staticfiles_urlpatterns
    from django.views.generic import TemplateView
    from django.views.generic.base import RedirectView

    # Serve static and media files from development server
    urlpatterns += staticfiles_urlpatterns()
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += [
        path(
            'favicon.ico', RedirectView.as_view(
                url=settings.STATIC_URL + 'img/bread-favicon.ico'
            )
        )
    ]

    # Add views for testing 404 and 500 templates
    urlpatterns += [
        path('test404/', TemplateView.as_view(template_name='404.html')),
        path('test500/', TemplateView.as_view(template_name='500.html')),
    ]

urlpatterns += [
    path('', include(wagtail_urls)),
]
