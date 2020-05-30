# Generated by Django 3.0.6 on 2020-05-29 03:09

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('bands', '0008_auto_20200516_2147'),
    ]

    operations = [
        migrations.CreateModel(
            name='Invoice',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('Purchase', 'Purchase'), ('Maintenance', 'Maintenance')], default='Purchase', max_length=20)),
                ('date', models.DateField(default=django.utils.timezone.now)),
                ('vendor', models.CharField(default='Buddy Rogers', max_length=255)),
                ('invoice_number', models.CharField(max_length=255)),
                ('notes', models.TextField(blank=True, default='')),
            ],
        ),
        migrations.CreateModel(
            name='LineItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cost', models.DecimalField(decimal_places=2, max_digits=20)),
                ('notes', models.TextField(blank=True, default='')),
            ],
        ),
        migrations.RemoveField(
            model_name='asset',
            name='purchase_info',
        ),
        migrations.DeleteModel(
            name='MaintenanceReport',
        ),
        migrations.DeleteModel(
            name='PurchaseInfo',
        ),
        migrations.AddField(
            model_name='lineitem',
            name='asset',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='line_items', to='bands.Asset'),
        ),
        migrations.AddField(
            model_name='lineitem',
            name='invoice',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='line_items', to='bands.Invoice'),
        ),
        migrations.AddField(
            model_name='invoice',
            name='assets',
            field=models.ManyToManyField(related_name='invoices', through='bands.LineItem', to='bands.Asset'),
        ),
        migrations.AddConstraint(
            model_name='invoice',
            constraint=models.UniqueConstraint(fields=('vendor', 'invoice_number'), name='invoice_unique_number_for_vendor'),
        ),
    ]