from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.

# Ideally we'll update this user down the line if we need to make changes
class CustomUser(AbstractUser):
    is_student = models.BooleanField(default=True)
    full_name = models.CharField(blank=False, max_length=255, default='Noname Jones')

    def __str__(self):
        return self.email
