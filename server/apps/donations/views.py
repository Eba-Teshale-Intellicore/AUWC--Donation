
from decimal import Decimal, InvalidOperation

from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Donation
from .serializers import DonationSerializer
from .services.chapa import (
    ChapaError,
    initialize_payment,
    verify_payment,
)


# ==========================================
# PAYMENT VERIFICATION HELPER
# ==========================================

def process_payment_verification(donation):
    """
    Verify a donation directly with Chapa.

    Validate:
    - Transaction reference
    - Payment status
    - Amount
    - Currency

    Only verified payments can become PAID.
    """

    result = verify_payment(str(donation.reference))

    payment_data = result.get("data") or {}

    # Verify merchant transaction reference.
    if payment_data.get("tx_ref") != str(donation.reference):
        raise ChapaError(
            "Transaction reference does not match."
        )

    # Verify payment amount.
    try:
        verified_amount = Decimal(
            str(payment_data.get("amount"))
        )
    except (InvalidOperation, TypeError):
        raise ChapaError(
            "Invalid payment amount returned by Chapa."
        )

    if verified_amount != donation.amount:
        raise ChapaError(
            "Payment amount does not match the donation."
        )

    # Verify currency.
    if payment_data.get("currency") != donation.currency:
        raise ChapaError(
            "Payment currency does not match."
        )

    # Get the actual transaction status.
    payment_status = str(
        payment_data.get("status", "")
    ).lower()

    # Update donation status only according to
    # Chapa's verified response.
    if payment_status == "success":

        if donation.status != Donation.Status.PAID:
            donation.status = Donation.Status.PAID

            donation.chapa_tx_ref = payment_data.get(
                "reference"
            )

            donation.save(
                update_fields=[
                    "status",
                    "chapa_tx_ref",
                    "updated_at",
                ]
            )

    elif payment_status == "failed":

        if donation.status != Donation.Status.PAID:
            donation.status = Donation.Status.FAILED
            donation.save(
                update_fields=[
                    "status",
                    "updated_at",
                ]
            )

    return donation


# ==========================================
# CREATE DONATION + INITIALIZE PAYMENT
# ==========================================

class DonationCreateView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = DonationSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        # Create donation with PENDING status.
        donation = serializer.save()

        try:
            # Initialize Chapa payment.
            chapa_response = initialize_payment(
                donation
            )

            checkout_url = chapa_response[
                "data"
            ]["checkout_url"]

            return Response(
                {
                    "success": True,
                    "message": (
                        "Donation created successfully. "
                        "Complete your payment."
                    ),
                    "donation": DonationSerializer(
                        donation
                    ).data,
                    "checkout_url": checkout_url,
                },
                status=status.HTTP_201_CREATED,
            )

        # except ChapaError:

        #     # Keep the donation PENDING.
        #     # A network timeout may mean Chapa
        #     # initialized the payment successfully.
        #     return Response(
        #         {
        #             "success": False,
        #             "message": (
        #                 "We could not initialize your payment. "
        #                 "Please try again later."
        #             ),
        #             "reference": str(
        #                 donation.reference
        #             ),
        #             "status": donation.status,
        #         },
        #         status=status.HTTP_502_BAD_GATEWAY,
        #     )
        except ChapaError as exc:

                print("CHAPA INITIALIZATION ERROR:", str(exc))

                return Response(
                    {
                        "success": False,
                        "message": "Payment initialization failed.",
                        "debug_error": str(exc),
                        "reference": str(donation.reference),
                        "status": donation.status,
                    },
                    status=status.HTTP_502_BAD_GATEWAY,
                )


# ==========================================
# VERIFY DONATION PAYMENT
# ==========================================

class DonationVerifyView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        reference = request.data.get("reference")

        if not reference:
            return Response(
                {
                    "success": False,
                    "message": "Donation reference is required.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        donation = get_object_or_404(
            Donation,
            reference=reference,
        )

        # Avoid unnecessary repeated verification.
        if donation.status == Donation.Status.PAID:
            return Response(
                {
                    "success": True,
                    "message": "Donation already verified.",
                    "status": donation.status,
                    "reference": str(donation.reference),
                },
                status=status.HTTP_200_OK,
            )

        try:
            donation = process_payment_verification(
                donation
            )

            return Response(
                {
                    "success": (
                        donation.status == Donation.Status.PAID
                    ),
                    "message": "Payment verification completed.",
                    "reference": str(donation.reference),
                    "status": donation.status,
                    "amount": str(donation.amount),
                    "currency": donation.currency,
                },
                status=status.HTTP_200_OK,
            )

        except ChapaError:
            return Response(
                {
                    "success": False,
                    "message": "Unable to verify payment at this time.",
                    "status": donation.status,
                },
                status=status.HTTP_502_BAD_GATEWAY,
            )


# ==========================================
# CHAPA CALLBACK
# ==========================================

class ChapaCallbackView(APIView):

    permission_classes = [AllowAny]

    def get(self, request):

        # Chapa callback documentation uses trx_ref.
        # tx_ref is accepted as a fallback.
        reference = (
            request.query_params.get("trx_ref")
            or request.query_params.get("tx_ref")
            or request.data.get("trx_ref")
            or request.data.get("tx_ref")
        )

        if not reference:
            return Response(
                {
                    "success": False,
                    "message": "Transaction reference missing.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        donation = get_object_or_404(
            Donation,
            reference=reference,
        )

        try:
            donation = process_payment_verification(
                donation
            )

            return Response(
                {
                    "success": (
                        donation.status == Donation.Status.PAID
                    ),
                    "reference": str(donation.reference),
                    "status": donation.status,
                    "message": "Callback processed.",
                },
                status=status.HTTP_200_OK,
            )

        except ChapaError as exc:

            return Response(
                {
                    "success": False,
                    "message": str(exc),
                    "status": donation.status,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
