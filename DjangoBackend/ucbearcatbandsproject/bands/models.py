from django.db import models
from django.db.models import Q
from django.core.validators import RegexValidator
from django.utils import timezone
from ..settings import AUTH_USER_MODEL



# Students and Ensembles
class Student(models.Model):
    user = models.OneToOneField(AUTH_USER_MODEL,
                                on_delete=models.CASCADE,
                                primary_key=True,
                                related_name='student')

    m_number = models.CharField(max_length=10,
                                unique=True,
                                validators=[RegexValidator(
                                    regex=r'[Mm]\d{8,8}',
                                    message='Please enter an M followed by 8 digits')])

    def __str__(self):
        return '{} [{}]'.format(self.user.full_name, self.m_number)


class Ensemble(models.Model):
    name = models.CharField(max_length=255)
    term = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    members = models.ManyToManyField(
        Student,
        through='Enrollment',
        through_fields=('ensemble', 'student')
    )

    class Meta:
        constraints = [
            # Ensure an ensemble must have a unique name/term combination
            models.UniqueConstraint(fields=['name', 'term'], name='unique_ensemble')
        ]


class Enrollment(models.Model):
    ensemble = models.ForeignKey(Ensemble, 
                                 on_delete=models.CASCADE,
                                 related_name="enrollments"
                                 )
    student = models.ForeignKey(Student,
                                on_delete=models.CASCADE,
                                related_name="enrollments")
    assets = models.ManyToManyField("Asset",
                                    through="AssetAssignment",
                                    through_fields=('enrollment', 'asset'))

    class Meta:
        constraints = [
            # Ensure a student isn't enrolled more than once per ensemble
            models.UniqueConstraint(fields=['ensemble', 'student'], name='unique_enrollment')
        ]                            


class AssetAssignment(models.Model):
    enrollment = models.ForeignKey(Enrollment,
                                   on_delete=models.CASCADE,
                                   related_name="asset_assignments")
    asset = models.ForeignKey("Asset",
                              on_delete=models.CASCADE,
                              related_name="assignments")

    # Use an is_active flag to track current vs. previous assignments                              
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            # Ensure an asset isn't actively assigned more than once to a given ensemble
            models.UniqueConstraint(fields=['enrollment__ensemble', 'asset'], condition=Q(is_active=True), name='unique_asset_per_ensemble')
        ]                           

# Assets and Stuff
class Asset(models.Model):
    NEW = 'new'
    GOOD = 'good'
    FAIR = 'fair'
    POOR = 'poor'
    BAD = 'bad'
    UNUSABLE = 'unusable'
    CONDITION_CHOICES = ((NEW, 'NEW'), 
                         (GOOD, 'GOOD'), 
                         (FAIR, 'FAIR'), 
                         (POOR, 'POOR'),
                         (BAD, 'BAD'), 
                         (UNUSABLE, 'UNUSABLE'))

    locker = models.ForeignKey(
        'Locker',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='assets'
    )

    condition = models.CharField(max_length=10, choices=CONDITION_CHOICES, default='new')


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


    def __str__(self):
        return f"{self.uc_tag_number} ({self.make} {self.model})"

    class Meta:
        constraints = [
            # We shouldn't have two instruments where all these properties are shared
            models.UniqueConstraint(fields=['kind', 'make', 'model', 'serial_number'], name='unique_instruments')
        ]
    

class UniformPiece(Asset):
    JACKET = 'jacket'
    PANTS = 'pants'
    UNIFORM_PIECES = ((JACKET, 'JACKET'), 
                      (PANTS, 'PANTS'))

    kind = models.CharField(max_length=6, choices=UNIFORM_PIECES, default=JACKET)
    size = models.CharField(max_length=20)
    number = models.CharField(max_length=20)


# Invoices
class Invoice(models.Model):
    date = models.DateField(default=timezone.now())
    cost = models.DecimalField(decimal_places=2,
                               max_digits=20)
    vendor = models.CharField(max_length=255, default="Buddy Rogers")
    invoice_number = models.CharField(max_length=255)
    content = models.TextField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['vendor', 'invoice_number'], name='unique_invoice')
        ]


class PurchaseInfo(Invoice):
    asset = models.OneToOneField(
        Asset,
        related_name='purchase_info',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )


class MaintenanceReport(Invoice):
    asset = models.ForeignKey(
        Asset,
        related_name='maintenance_reports',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )


# Other stuff
class Locker(models.Model):
    number = models.PositiveSmallIntegerField()
    combination = models.CharField(max_length=10)
