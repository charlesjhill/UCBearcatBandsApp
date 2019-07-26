# Generated by Django 2.2.3 on 2019-07-26 19:35

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('bands', '0001_initial'),
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Student',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='student', serialize=False, to=settings.AUTH_USER_MODEL)),
                ('m_number', models.CharField(max_length=10, unique=True, validators=[django.core.validators.RegexValidator(message='Please enter an M followed by 8 digits', regex='[Mm]\\d{8,8}')])),
            ],
        ),
        migrations.CreateModel(
            name='Instrument',
            fields=[
                ('asset_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='bands.Asset')),
                ('kind', models.CharField(max_length=255)),
                ('make', models.CharField(max_length=255)),
                ('model', models.CharField(max_length=255)),
                ('serial_number', models.CharField(max_length=255)),
                ('uc_tag_number', models.CharField(max_length=255, validators=[django.core.validators.RegexValidator(message='Tag numbers take the format of 1-2 capital letters followed by 1 or more digits', regex='[A-Z]{1,2}\\d+')])),
                ('uc_asset_number', models.CharField(max_length=255)),
            ],
            bases=('bands.asset',),
        ),
        migrations.CreateModel(
            name='UniformPiece',
            fields=[
                ('asset_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='bands.Asset')),
                ('kind', models.CharField(choices=[('jacket', 'JACKET'), ('pants', 'PANTS')], default='jacket', max_length=6)),
                ('size', models.CharField(max_length=20)),
                ('number', models.CharField(max_length=20)),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
            bases=('bands.asset',),
        ),
        migrations.AddField(
            model_name='purchaseinfo',
            name='asset',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='purchase_info', to='bands.Asset'),
        ),
        migrations.AddField(
            model_name='maintenancereport',
            name='asset',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='maintenance_reports', to='bands.Asset'),
        ),
        migrations.AddField(
            model_name='ensemble',
            name='members',
            field=models.ManyToManyField(related_name='ensembles', through='bands.Enrollment', to='bands.Student'),
        ),
        migrations.AddField(
            model_name='enrollment',
            name='assets',
            field=models.ManyToManyField(related_name='enrollments', through='bands.AssetAssignment', to='bands.Asset'),
        ),
        migrations.AddField(
            model_name='enrollment',
            name='ensemble',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='enrollments', to='bands.Ensemble'),
        ),
        migrations.AddField(
            model_name='enrollment',
            name='student',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='enrollments', to='bands.Student'),
        ),
        migrations.AddField(
            model_name='assetassignment',
            name='asset',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assignments', to='bands.Asset'),
        ),
        migrations.AddField(
            model_name='assetassignment',
            name='enrollment',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='asset_assignments', to='bands.Enrollment'),
        ),
        migrations.AddField(
            model_name='asset',
            name='locker',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='assets', to='bands.Locker'),
        ),
        migrations.AddField(
            model_name='asset',
            name='polymorphic_ctype',
            field=models.ForeignKey(editable=False, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='polymorphic_bands.asset_set+', to='contenttypes.ContentType'),
        ),
        migrations.AddConstraint(
            model_name='purchaseinfo',
            constraint=models.UniqueConstraint(fields=('vendor', 'invoice_number'), name='unique_invoice'),
        ),
        migrations.AddConstraint(
            model_name='maintenancereport',
            constraint=models.UniqueConstraint(fields=('vendor', 'invoice_number'), name='unique_invoice'),
        ),
        migrations.AddConstraint(
            model_name='instrument',
            constraint=models.UniqueConstraint(fields=('kind', 'make', 'model', 'serial_number'), name='unique_instruments'),
        ),
        migrations.AddConstraint(
            model_name='ensemble',
            constraint=models.UniqueConstraint(fields=('name', 'term'), name='unique_ensemble'),
        ),
        migrations.AddConstraint(
            model_name='enrollment',
            constraint=models.UniqueConstraint(fields=('ensemble', 'student'), name='unique_enrollment'),
        ),
    ]
