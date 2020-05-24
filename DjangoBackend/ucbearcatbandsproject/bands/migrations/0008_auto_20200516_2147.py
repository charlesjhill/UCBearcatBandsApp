# Generated by Django 3.0.6 on 2020-05-17 01:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bands', '0007_auto_20200516_2000'),
    ]

    operations = [
        migrations.AlterField(
            model_name='instrument',
            name='kind',
            field=models.CharField(choices=[('Alto Clarinet', 'Alto Clarinet'), ('Alto Saxophone', 'Alto Saxophone'), ('Baritone Saxophone', 'Baritone Saxophone'), ('Baritone', 'Baritone'), ('Bass Clarinet', 'Bass Clarinet'), ('Bass Trombone', 'Bass Trombone'), ('Bassoon', 'Bassoon'), ('Clarinet', 'Clarinet'), ('Cornet', 'Cornet'), ('Eb Clarinet', 'Eb Clarinet'), ('Electric Piano', 'Electric Piano'), ('Electric Violin', 'Electric Violin'), ('Euphonium', 'Euphonium'), ('Flute', 'Flute'), ('French Horn', 'French Horn'), ('Marching Horn', 'Marching Horn'), ('Mellophone', 'Mellophone'), ('Oboe', 'Oboe'), ('Piano', 'Piano'), ('Piccolo', 'Piccolo'), ('Soprano Saxophone', 'Soprano Saxophone'), ('Sousaphone', 'Sousaphone'), ('Tenor Saxophone', 'Tenor Saxophone'), ('Trombone', 'Trombone'), ('Trumpet', 'Trumpet'), ('Tuba', 'Tuba'), ('Valved Trombone', 'Valved Trombone')], default='Alto Clarinet', max_length=100),
        ),
    ]
