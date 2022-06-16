import requests
from django.conf import settings
from django.http import HttpResponse


def serve_nextjs_static(request):
    if request.method == "GET":
        content = requests.get(f"{settings.NEXTJS_URL}{request.get_full_path()}")
        return HttpResponse(
            content=content.content,
            content_type=content.headers["content-type"],
        )
