from django.middleware.csrf import rotate_token


def ensure_csrf_token_on_request(request):
    if "CSRF_COOKIE" not in request.META:
        rotate_token(request)
