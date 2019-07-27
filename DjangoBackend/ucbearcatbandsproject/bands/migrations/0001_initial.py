# Generated by Django 2.2.3 on 2019-07-26 19:35

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Asset',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=255)),
                ('condition', models.CharField(choices=[('new', 'NEW'), ('good', 'GOOD'), ('fair', 'FAIR'), ('poor', 'POOR'), ('bad', 'BAD'), ('unusable', 'UNUSABLE')], default='new', max_length=10)),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
        ),
        migrations.CreateModel(
            name='AssetAssignment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_active', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='Enrollment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='Ensemble',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('term', models.CharField(max_length=50)),
                ('is_active', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='Locker',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.PositiveSmallIntegerField()),
                ('combination', models.CharField(max_length=10)),
            ],
        ),
        migrations.CreateModel(
            name='MaintenanceReport',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(default=django.utils.timezone.now)),
                ('cost', models.DecimalField(decimal_places=2, max_digits=20)),
                ('vendor', models.CharField(default='Buddy Rogers', max_length=255)),
                ('invoice_number', models.CharField(max_length=255)),
                ('content', models.TextField(default='')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PurchaseInfo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(default=django.utils.timezone.now)),
                ('cost', models.DecimalField(decimal_places=2, max_digits=20)),
                ('vendor', models.CharField(default='Buddy Rogers', max_length=255)),
                ('invoice_number', models.CharField(max_length=255)),
                ('content', models.TextField(default='')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]