from django.db import models
from django.core.validators import RegexValidator
from ..settings import AUTH_USER_MODEL

CONDITION = (('new', 'NEW'), ('good', 'GOOD'), ('fair', 'FAIR'), ('poor', 'POOR'),
             ('bad', 'BAD'), ('unusable', 'UNUSABLE'))

# Create your models here.
class Student(models.Model):
    user = models.OneToOneField(AUTH_USER_MODEL,
                                on_delete=models.CASCADE,
                                primary_key=True)

    m_number = models.CharField(max_length=10,
                                validators=[RegexValidator(
                                    regex=r'[Mm]\d{8,8}',
                                    message='Please enter an M followed by 8 digits')])

    def __str__(self):
        return '{} {} [{}]'.format(self.user.first_name, self.user.last_name, self.m_number)


class Asset(models.Model):
    current_owners = models.ManyToManyField(
        Student,
        blank=True,
        related_name='owners'
    )
    previous_owners = models.ManyToManyField(
        Student,
        blank=True,
        related_name='previous_owners'
    )
    condition = models.CharField(max_length=10, choices=CONDITION, default='new')


class Instrument(Asset):
    kind = models.CharField(max_length=255)  # TODO: Make enum
    make = models.CharField(max_length=255)
    model = models.CharField(max_length=255)
    serial_number = models.CharField(max_length=255)
    uc_tag_number = models.CharField(max_length=255,
                                     validators=[RegexValidator(
                                         regex=r'[A-Z]{1,2}\d+',
                                         message='Tag numbers take the format of 1-2 capital letters followed by 1 or more digits'
                                     )])
    uc_asset_number = models.CharField(max_length=255)



class PurchaseInfo(models.Model):
    date = models.DateField()
    cost = models.DecimalField(decimal_places=2,
                               max_digits=20)
    vendor = models.CharField(max_length=255)
    invoice_number = models.CharField(max_length=255)
    asset = models.OneToOneField(
        Asset,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )


class Locker(models.Model):
    number = models.PositiveSmallIntegerField()
    combination = models.CharField(max_length=10)
    asset = models.ForeignKey(
        Asset,
        on_delete=models.PROTECT
    )


class MaintenanceReport(models.Model):
    cost = models.DecimalField(decimal_places=2,
                               max_digits=20)
    service = models.TextField()
    invoice_number = models.CharField(max_length=255)
    asset = models.ForeignKey(
        Asset,
        on_delete=models.SET_NULL,
        null=True
    )


UNIFORM_PIECES = (('jacket', 'JACKET'), ('pants', 'PANTS'))

class UniformPiece(Asset):
    kind = models.CharField(max_length=6, choices=UNIFORM_PIECES, default='jacket')
    size = models.CharField(max_length=20)
    id = models.CharField(max_length=20)
