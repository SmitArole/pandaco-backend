# Generated by Django 5.2 on 2025-04-18 19:47

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='contractor',
            name='rating',
        ),
        migrations.RemoveField(
            model_name='contractor',
            name='total_jobs_completed',
        ),
        migrations.RemoveField(
            model_name='contractor',
            name='years_of_experience',
        ),
        migrations.AddField(
            model_name='contractor',
            name='profile_picture',
            field=models.ImageField(blank=True, null=True, upload_to='profile_pictures/'),
        ),
        migrations.AlterField(
            model_name='contractor',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='contractor',
            name='hourly_rate',
            field=models.DecimalField(decimal_places=2, max_digits=6),
        ),
        migrations.AlterField(
            model_name='contractor',
            name='skills',
            field=models.CharField(blank=True, max_length=500),
        ),
        migrations.AlterField(
            model_name='task',
            name='contractor',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='tasks', to='core.contractor'),
            preserve_default=False,
        ),
    ]
