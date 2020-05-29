from django.db import models
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
from django.utils import timezone
from polymorphic.models import PolymorphicModel
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

    class Meta:
        ordering = ['user__full_name']


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
        ordering = ['term', 'name']


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
        ordering = ['student__user__full_name']


# Assets and Stuff
class Asset(PolymorphicModel):
    """
    Model representing any asset that should be tracked
    """
    NEW = 'new'
    GOOD = 'good'
    FAIR = 'fair'
    POOR = 'poor'
    BAD = 'bad'
    UNUSABLE = 'unusable'
    CONDITION_CHOICES = ((NEW, NEW),
                         (GOOD, GOOD),
                         (FAIR, FAIR),
                         (POOR, POOR),
                         (BAD, BAD),
                         (UNUSABLE, UNUSABLE))

    # name *should* be automatically set by any subclass of Asset
    name = models.CharField(max_length=255, blank=True)
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
        violations = AssetAssignment.objects.filter(is_active=True) \
            .filter(asset=self.asset) \
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
    altoClarinet = 'Alto Clarinet'
    altoSaxophone = 'Alto Saxophone'
    bariSaxophone = 'Baritone Saxophone'
    baritone = 'Baritone'
    bassClarinet = 'Bass Clarinet'
    bassTrombone = 'Bass Trombone'
    bassoon = 'Bassoon'
    clarinet = 'Clarinet'
    cornet = 'Cornet'
    eFlatClarinet = 'Eb Clarinet'
    electricPiano = 'Electric Piano'
    electricViolin = 'Electric Violin'
    euphonium = 'Euphonium'
    flute = 'Flute'
    frenchHorn = 'French Horn'
    marchingHorn = 'Marching Horn'
    mellophone = 'Mellophone'
    oboe = 'Oboe'
    piano = 'Piano'
    piccolo = 'Piccolo'
    sopranoSaxophone = 'Soprano Saxophone'
    sousaphone = 'Sousaphone'
    tenorSaxophone = 'Tenor Saxophone'
    trombone = 'Trombone'
    trumpet = 'Trumpet'
    tuba = 'Tuba'
    valvedTrombone = 'Valved Trombone'
    INSTRUMENT_CHOICES = ((altoClarinet, altoClarinet),
                          (altoSaxophone, altoSaxophone),
                          (bariSaxophone, bariSaxophone),
                          (baritone, baritone),
                          (bassClarinet, bassClarinet),
                          (bassTrombone, bassTrombone),
                          (bassoon, bassoon),
                          (clarinet, clarinet),
                          (cornet, cornet),
                          (eFlatClarinet, eFlatClarinet),
                          (electricPiano, electricPiano),
                          (electricViolin, electricViolin),
                          (euphonium, euphonium),
                          (flute, flute),
                          (frenchHorn, frenchHorn),
                          (marchingHorn, marchingHorn),
                          (mellophone, mellophone),
                          (oboe, oboe),
                          (piano, piano),
                          (piccolo, piccolo),
                          (sopranoSaxophone, sopranoSaxophone),
                          (sousaphone, sousaphone),
                          (tenorSaxophone, tenorSaxophone),
                          (trombone, trombone),
                          (trumpet, trumpet),
                          (tuba, tuba),
                          (valvedTrombone, valvedTrombone))

    AVERAGE_LIFE_OF_INSTRUMENT = {
        altoClarinet: 5,
        altoSaxophone: 15,
        bariSaxophone: 15,
        baritone: 15,
        bassClarinet: 5,
        bassTrombone: 10,
        bassoon: 15,
        clarinet: 15,
        cornet: 10,
        eFlatClarinet: 15,
        electricPiano: 10,
        electricViolin: 5,
        euphonium: 15,
        flute: 15,
        frenchHorn: 10,
        marchingHorn: 10,
        mellophone: 10,
        oboe: 15,
        piccolo: 15,
        sopranoSaxophone: 15,
        sousaphone: 15,
        tenorSaxophone: 15,
        trombone: 10,
        trumpet: 10,
        tuba: 15,
        valvedTrombone: 15
    }

    kind = models.CharField(max_length=100, choices=INSTRUMENT_CHOICES, default=altoClarinet)
    make = models.CharField(max_length=255)
    model = models.CharField(max_length=255)
    serial_number = models.CharField(max_length=255)
    uc_tag_number = models.CharField(max_length=255,
                                     blank=True, null=True)
    uc_asset_number = models.CharField(max_length=255, blank=True, null=True)

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
    UNIFORM_PIECES = ((JACKET, JACKET),
                      (PANTS, PANTS))

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
class LineItem(models.Model):
    purchase = "Purchase"
    maintenance = "Maintenance"
    TYPES = ((purchase, purchase),
             (maintenance, maintenance))

    type = models.CharField(max_length=20, choices=TYPES, default=purchase)
    cost = models.DecimalField(decimal_places=2,
                               max_digits=20)
    notes = models.TextField(default="", blank=True)

    asset = models.ForeignKey(
        Asset,
        on_delete=models.SET_NULL,
        null=True,
        related_name="line_items"
    )
    invoice = models.ForeignKey(
        "Invoice",
        on_delete=models.CASCADE,
        related_name="line_items"
    )

    def validate_unique(self, exclude=None):
        """
        Provide custom validation logic to prevent asset from being double purchased
        """
        # See if there are any entries which prevent us from creating a line item
        # I.e. this asset already has a purchase lineitem
        violations = LineItem.objects.filter(type=self.purchase, asset=self.asset)

        # If we have any violations, we shouldn't allow this purchase receipt to pass
        if violations.exists():
            raise ValidationError('An asset can only have one purchase receipt')

        return super().validate_unique(exclude=exclude)

    def save(self, *args, **kwargs):
        """Override saving to run our custom validation logic"""
        self.validate_unique()
        super().save(*args, **kwargs)


class Invoice(models.Model):

    date = models.DateField(default=timezone.now)
    vendor = models.CharField(max_length=255, default="Buddy Rogers")
    invoice_number = models.CharField(max_length=255)
    notes = models.TextField(default="", blank=True)
    assets = models.ManyToManyField(
        Asset,
        related_name="invoices",
        through=LineItem,
        through_fields=("invoice", "asset")
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['vendor', 'invoice_number'], name='%(class)s_unique_number_for_vendor')
        ]


# Other stuff
class Locker(models.Model):
    number = models.PositiveSmallIntegerField()
    combination = models.CharField(max_length=10)

    def __str__(self):
        return str(self.number)
