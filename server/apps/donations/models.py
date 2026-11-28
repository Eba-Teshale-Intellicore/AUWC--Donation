import uuid

from django.db import models

# Create your models here.

class Donation(models.Model):

  class Status(models.TextChoices):
    PENDING = "PENDING", "Pending"
    PAID = "PAID", "Paid"
    FAILED = "FAILED", "Failed"
    CANCELLED = "CANCELLED", "Cancelled"

  id = models.UUIDField(
    primary_key=True,
    default=uuid.uuid4,
    editable=False
  )

  reference = models.UUIDField(
    default=uuid.uuid4,
    unique=True,
    editable=False,
  )

  first_name = models.CharField(max_length=100)

  last_name = models.CharField(
    max_length=100
  )

  email = models.EmailField()

  phone_number = models.CharField(max_length=16)

  amount = models.DecimalField(
    max_digits=12,
    decimal_places=2,
  )

  currency = models.CharField(
    max_length=3,
    default="ETB",                
  )

  status = models.CharField(
    max_length=10,
    choices=Status.choices,
    default=Status.PENDING,
  )
  chapa_tx_ref = models.CharField(
    max_length=100,
    unique=True,
    null=True,
    blank=True,
  )
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  class Meta:
    db_table = "donations"
    ordering = ["-created_at"]
    verbose_name = "Donation"
    verbose_name_plural = "Donations"

  def __str__(self):
    return f"{self.reference} - {self.amount} {self.currency}"