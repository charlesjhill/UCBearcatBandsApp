# Generated by Django 3.0.6 on 2020-05-17 00:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bands', '0006_auto_20200513_2147'),
    ]

    operations = [
        migrations.AlterField(
            model_name='instrument',
            name='uc_asset_number',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='instrument',
            name='uc_tag_number',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]