from django.db import models
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
from django.utils import timezone
from ..settings import AUTH_USER_MODEL


# Students and Ensembles
class Student(models.Model):
    user = models.OneToOneField(
        AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        primary_key=True, 
        related_name='student'
    )
    m_number = models.CharField(
        max_length=10,
        unique=True,
        validators=[RegexValidator(
            regex=r'[Mm]\d{8,8}',
            message='Please enter an M followed by 8 digits')]
    )

    def __str__(self):
        return '{} [{}]'.format(self.user.full_name, self.m_number)


class Ensemble(models.Model):
    name = models.CharField(max_length=255)
    term = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    members = models.ManyToManyField(
        Student,
        through='Enrollment',
        through_fields=('ensemble', 'student'),
        related_name='ensembles'
    )

    def __str__(self):
        return "{} ({})".format(self.name, self.term)
    
    class Meta:
        constraints = [
            # Ensure an ensemble must have a unique name/term combination
            models.UniqueConstraint(fields=['name', 'term'], name='unique_ensemble')
        ]


class Enrollment(models.Model):
    ensemble = models.ForeignKey(
        Ensemble, 
        on_delete=models.CASCADE,
        related_name="enrollments"
    )
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="enrollments"
    )
    assets = models.ManyToManyField(
        'Asset',
        through='AssetAssignment',
        through_fields=('enrollment', 'asset'),
        related_name='enrollments'
    )
    
    def __str__(self):
        return "{} - {}".format(self.student, self.ensemble)

    class Meta:
        constraints = [
            # Ensure a student isn't enrolled more than once per ensemble
            models.UniqueConstraint(fields=['ensemble', 'student'], name='unique_enrollment')
        ]


# Assets and Stuff

# Consider looking at using django-polymorphic/django-rest-polymorphic to allow for returning instances of base classes
# (i.e. calling Asset.objects.all() yields <Instrument> AND <UniformPiece> objects)
class Asset(models.Model):
    """
    Model representing any asset that should be tracked
    """
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

    # name *should* be automatically set by any subclass of Asset
    name = models.CharField(max_length=255)
    condition = models.CharField(max_length=10, choices=CONDITION_CHOICES, default='new')
    locker = models.ForeignKey(
        'Locker',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="assets"
    )

    def __str__(self):
        return self.name
    

class AssetAssignment(models.Model):
    """
    A model for an assignment of some asset to some enrollment.

    Prevents assets from being assigned multiple times to an ensemble
    """
    enrollment = models.ForeignKey(
        Enrollment,
        on_delete=models.CASCADE,
        related_name="asset_assignments"
    )
    asset = models.ForeignKey(
        Asset,
        on_delete=models.CASCADE,
        related_name="assignments"
    )

    # Use an is_active flag to track current vs. previous assignments                              
    is_active = models.BooleanField(default=True)

    def validate_unique(self, exclude=None):
        """
        Provide custom validation logic to prevent asset double-assignments to an ensemble.
        
        This would ordinarily be in the Meta.constraints field, but we cannot do any database
        joins there, which we require.
        """
        # See if there are any entries which prevent us from creating an assignment
        # I.e. this asset is already actively assigned to this ensemble
        violations = AssetAssignment.objects.filter(is_active=True)                                 \
                                            .filter(asset=self.asset)                               \
                                            .filter(enrollment__ensemble=self.enrollment.ensemble)
                    
        # If we have any violations, we shouldn't allow this assignment to pass
        if violations.exists():
            raise ValidationError('Active AssetAssignments must be unique per ensemble')

        return super().validate_unique(exclude=exclude)

    def save(self, *args, **kwargs):
        """Override saving to run our custom validation logic"""
        self.validate_unique()
        super().save(*args, **kwargs)


class Instrument(Asset):
    """
    Model representing any instrument the band owns
    """
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

    # Do this work-around to set a name on save
    def get_name(self):
        return f"{self.uc_tag_number} ({self.make} {self.model})"

    def __str__(self):
        return self.get_name()

    def save(self, *args, **kwargs):
        self.name = self.get_name()
        super().save(*args, **kwargs)

    class Meta:
        constraints = [
            # We shouldn't have two instruments where all these properties are shared
            models.UniqueConstraint(fields=['kind', 'make', 'model', 'serial_number'], name='unique_instruments')
        ]
    

class UniformPiece(Asset):
    """
    Model representing marching band uniform pieces
    """
    JACKET = 'jacket'
    PANTS = 'pants'
    UNIFORM_PIECES = ((JACKET, 'JACKET'), 
                      (PANTS, 'PANTS'))

    kind = models.CharField(max_length=6, choices=UNIFORM_PIECES, default=JACKET)
    size = models.CharField(max_length=20)
    number = models.CharField(max_length=20)

    # Same workaround to force saving a name
    def get_name(self):
        return f"{self.kind} {self.number}"

    def __str__(self):
        return self.get_name()

    def save(self, *args, **kwargs):
        self.name = self.get_name()
        super().save(*args, **kwargs)


# Invoices
class Invoice(models.Model):
    date = models.DateField(default=timezone.now)
    cost = models.DecimalField(decimal_places=2,
                               max_digits=20)
    vendor = models.CharField(max_length=255, default="Buddy Rogers")
    invoice_number = models.CharField(max_length=255)
    content = models.TextField(default="")

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['vendor', 'invoice_number'], name='unique_invoice')
        ]
        abstract = True
        

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

    def __str__(self):
        return str(self.number)
