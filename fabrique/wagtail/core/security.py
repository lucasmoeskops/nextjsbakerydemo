from datetime import date, datetime, time
from hashlib import sha256

from django.conf import settings

VALID_TODAY = "valid-today"
VALID_FOREVER = "valid-forever"


def make_secret(revision_id, validity=VALID_TODAY):
    # This makes the secret change depending on time
    # We will first try to make it without time-zone, because it should be more
    # logical to users, if the day is equal to their expected day.
    if validity == VALID_TODAY:
        timestamp = datetime.combine(date.today(), time.min).timestamp()
    else:
        timestamp = 0  # Valid forever
    key = settings.SECRET_KEY + str(timestamp) + str(revision_id)
    return sha256(key.encode("utf-8")).hexdigest()


def verify_secret(secret, revision_id):
    return make_secret(revision_id) == secret
