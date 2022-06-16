from typing import Sequence, Tuple, Union
from urllib.parse import urlparse, parse_qsl, urlencode, urlunparse

from bcrypt import gensalt, hashpw
from django.conf import settings
from requests import get
from wagtail.contrib.frontend_cache.backends import BaseBackend

# from fabrique.log.models import Log


def add_query_parameters(
    url: str,
    params: Sequence[Tuple[str, str]] = (),
    dispose_params: Sequence[Union[Tuple[str], Tuple[str, str]]] = ()
) -> str:
    """Add query parameters to a url."""
    nt = urlparse(url)

    new_params = [
        *(
            (k, v)
            for k, v in parse_qsl(nt.query)
            if k not in dispose_params and (k, v) not in dispose_params
        ),
        *params,
    ]

    query_string = urlencode(new_params)

    return urlunparse(nt._replace(query=query_string))


class NextJSBackend(BaseBackend):
    def __init__(self, params):
        pass

    def purge(self, url):
        # Nextjs in development doesn't cache
        if settings.DEBUG:
            return

        path = urlparse(url).path
        if path.endswith("/"):
            path = path[:-1]
        secret = hashpw((settings.SECRET_KEY + path).encode("utf-8"), gensalt())
        purge_url = f"{settings.NEXTJS_URL}/api/revalidate"
        purge_url = add_query_parameters(
            purge_url, [("path", path), ("secret", secret.decode("utf-8"))]
        )
        response = get(purge_url)
        response.raise_for_status()
        result = response.json()
        # if not result["revalidated"]:
        #     Log.objects.create(message=result.get("message", "-"))
