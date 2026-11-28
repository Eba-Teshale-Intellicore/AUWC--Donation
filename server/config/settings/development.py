import os
from django.core.exceptions import ImproperlyConfigured
from .base import *

# =========================================================
# DEVELOPMENT
# =========================================================

DEBUG = True

ALLOWED_HOSTS = get_env_list(
    "ALLOWED_HOSTS",
    "localhost,127.0.0.1",
)

EMAIL_BACKEND = (
    "django.core.mail.backends.console.EmailBackend"
)

# =========================================================
# DEVELOPMENT SECURITY
# =========================================================

SECURE_SSL_REDIRECT = False

SESSION_COOKIE_SECURE = False

CSRF_COOKIE_SECURE = False

if not DEBUG:
    raise ImproperlyConfigured(
        "Development settings require DEBUG=True."
    )