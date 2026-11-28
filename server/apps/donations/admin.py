from django.contrib import admin

from .models import Donation
# Register your models here.

@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):

    list_display = [
        "reference",
        "first_name",
        "last_name",
        "amount",
        "currency",
        "status",
        "created_at",
    ]

    list_filter = [
        "status",
        "currency",
        "created_at",
    ]

    search_fields = [
        "reference",
        "first_name",
        "last_name",
        "email",
        "phone_number",
    ]

    readonly_fields = [
        "id",
        "reference",
        "created_at",
        "updated_at",
    ]

    ordering = ["-created_at"]