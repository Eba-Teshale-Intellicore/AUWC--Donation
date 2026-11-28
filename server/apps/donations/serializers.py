from rest_framework import serializers
from decimal import Decimal
from .models import Donation


class DonationSerializer(serializers.ModelSerializer):

    firstName = serializers.CharField(
        source="first_name",
        max_length=100,
    )

    lastName = serializers.CharField(
        source="last_name",
        max_length=100,
    )

    phoneNumber = serializers.RegexField(
        regex=r"^(?:(?:09|07)[0-9]{8}|\+251[97][0-9]{8})$",
        source="phone_number",
        error_messages={
            "invalid": "Enter a valid Ethiopian phone number."
        },
    )

    amount = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        min_value=Decimal("0.01"),
    )
    currency = serializers.ChoiceField(
        choices=["ETB"],
        default="ETB",
    )

    class Meta:
        model = Donation

        fields = [
            "id",
            "reference",
            "firstName",
            "lastName",
            "email",
            "phoneNumber",
            "amount",
            "currency",
            "status",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "reference",
            "status",
            "created_at",
        ]

# Notice that the serializer controls the fields accepted from the frontend. It doesn't allow the client to submit status=PAID or a Chapa transaction reference.