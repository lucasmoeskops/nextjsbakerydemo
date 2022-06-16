import requests
from django.conf import settings
from django.http.response import HttpResponse


def pass_through_from_next(request):
    # For local development with same domain for wagtail and next, try to fetch
    # page from next js and pass it through. On servers this can be solved
    # by letting the router (e.g. nginx) directly link non-admin non-api urls to
    # nextjs

    if request.method == "GET":
        content = requests.get(f"{settings.NEXTJS_URL}{request.get_full_path()}")
        return HttpResponse(
            content=content.content,
            content_type=content.headers["content-type"],
        )
