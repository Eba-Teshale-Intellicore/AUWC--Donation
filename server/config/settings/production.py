import os

from django.core.exceptions import ImproperlyConfigured
from .base import *

# =========================================================
# PRODUCTION
# =========================================================

DEBUG = False

if not ALLOWED_HOSTS:
    raise ImproperlyConfigured(
        "ALLOWED_HOSTS must be configured in production."
    )

if "*" in ALLOWED_HOSTS:
    raise ImproperlyConfigured(
        "Wildcard ALLOWED_HOSTS is not allowed."
    )

for host in ALLOWED_HOSTS:

    if (
        "://" in host
        or "/" in host
        or host.lower() in ("localhost", "127.0.0.1")
    ):
        raise ImproperlyConfigured(
            f"Invalid production ALLOWED_HOSTS entry: {host}"
        )

# =========================================================
# DATABASE
# =========================================================

DATABASES["default"]["CONN_MAX_AGE"] = int(
    os.getenv("DB_CONN_MAX_AGE", "60")
)

EMAIL_BACKEND = (
    "django.core.mail.backends.smtp.EmailBackend"
)

# =========================================================
# FRONTEND VALIDATION
# =========================================================

if not FRONTEND_URL.startswith("https://"):
    raise ImproperlyConfigured(
        "Production FRONTEND_URL must use HTTPS."
    )

if not CORS_ALLOWED_ORIGINS:
    raise ImproperlyConfigured(
        "CORS_ALLOWED_ORIGINS must be configured."
    )

if not CSRF_TRUSTED_ORIGINS:
    raise ImproperlyConfigured(
        "CSRF_TRUSTED_ORIGINS must be configured."
    )

for origin in CORS_ALLOWED_ORIGINS + CSRF_TRUSTED_ORIGINS:

    if not origin.startswith("https://"):
        raise ImproperlyConfigured(
            f"Production origins must use HTTPS: {origin}"
        )

# SECURITY HEADERS

SECURE_SSL_REDIRECT = True

SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True

if DEBUG:
    raise ImproperlyConfigured(
        "Production settings require DEBUG=False."
    )