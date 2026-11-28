
import requests


from django.conf import settings
from apps.donations.models import Donation



# ==========================================
# CHAPA CONFIGURATION
# ==========================================

CHAPA_TIMEOUT = 30

# ==========================================
# CUSTOM EXCEPTION
# ==========================================

class ChapaError(Exception):
    """Raised when a Chapa API request fails."""


# ==========================================
# API HEADERS
# ==========================================


def get_headers():
    if not settings.CHAPA_SECRET_KEY:
        raise ChapaError("Chapa is not configured.")

    return {
        "Authorization": f"Bearer {settings.CHAPA_SECRET_KEY}",
        "Content-Type": "application/json",
    }

# ==========================================
# INITIALIZE PAYMENT
# ==========================================

def initialize_payment(donation: Donation) -> dict:
    """
    Initialize a donation payment with Chapa.

    Returns the Chapa API response containing
    the hosted checkout URL.
    """

    tx_ref = str(donation.reference)

    payload = {
        "amount": format(donation.amount, "f"),
        "currency": donation.currency,
        "email": donation.email,
        "first_name": donation.first_name,
        "last_name": donation.last_name,
        "phone_number": donation.phone_number,
        "tx_ref": tx_ref,
        "callback_url": settings.CHAPA_CALLBACK_URL,
        "return_url": settings.CHAPA_RETURN_URL,
        "customization": {
            "title": "Fellowship Fund",
            "description": "Donation to Fellowship Fund",
        },
    }

    url = f"{settings.CHAPA_BASE_URL}/v1/transaction/initialize"

    try:
        response = requests.post(
            url,
            json=payload,
            headers=get_headers(),
            timeout=CHAPA_TIMEOUT,
        )

        response.raise_for_status()

        result = response.json()

    except requests.exceptions.Timeout as exc:
        raise ChapaError(
            "Chapa payment initialization timed out."
        ) from exc

    except requests.exceptions.RequestException as exc:
        raise ChapaError(
            "Unable to connect to Chapa."
        ) from exc

    except ValueError as exc:
        raise ChapaError(
            "Chapa returned an invalid JSON response."
        ) from exc

    if result.get("status") != "success":
        raise ChapaError(
            result.get("message", "Payment initialization failed.")
        )

    checkout_url = result.get("data", {}).get("checkout_url")

    if not checkout_url:
        raise ChapaError(
            "Chapa did not return a checkout URL."
        )

    return result


# ==========================================
# VERIFY PAYMENT
# ==========================================

def verify_payment(tx_ref: str) -> dict:
    """
    Verify a transaction using its merchant reference.

    Never trust the frontend redirect as proof
    of successful payment.
    """

    url = (
        f"{settings.CHAPA_BASE_URL}/v1/transaction/verify/{tx_ref}"
    )

    try:
        response = requests.get(
            url,
            headers=get_headers(),
            timeout=CHAPA_TIMEOUT,
        )

        response.raise_for_status()

        result = response.json()

    except requests.exceptions.Timeout as exc:
        raise ChapaError(
            "Chapa payment verification timed out."
        ) from exc

    except requests.exceptions.RequestException as exc:
        raise ChapaError(
            "Unable to verify payment with Chapa."
        ) from exc

    except ValueError as exc:
        raise ChapaError(
            "Chapa returned an invalid verification response."
        ) from exc

    if result.get("status") != "success":
        raise ChapaError(
            result.get("message", "Payment verification failed.")
        )

    return result
