from django.db import models
from django.core.validators import RegexValidator
from ..settings import AUTH_USER_MODEL


# Create your models here.


class Student(models.Model):
    user = models.OneToOneField(AUTH_USER_MODEL, on_delete=models.CASCADE)

    m_number = models.CharField(max_length=10,
                                validators=[RegexValidator(
                                    regex=r'[Mm]\d{8,8}',
                                    message='Please enter an M followed by 8 digits')])

    def __str__(self):
        return '{} {}'.format(self.first_name, self.last_name)
