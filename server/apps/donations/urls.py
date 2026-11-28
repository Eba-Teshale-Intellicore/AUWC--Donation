from django.urls import path

from .views import (
    DonationCreateView,
    DonationVerifyView,
    ChapaCallbackView,
)

app_name = "donations"

urlpatterns = [
  
    # Create donation and initialize Chapa payment
    path(
        "",
        DonationCreateView.as_view(),
        name="donation-create",
    ),

    # Verify donation payment
    path(
        "verify/",
        DonationVerifyView.as_view(),
        name="donation-verify",
    ),

    # Chapa payment callback
    path(
        "chapa/callback/",
        ChapaCallbackView.as_view(),
        name="chapa-callback", 
    ),
]