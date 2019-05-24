from django.contrib import admin
from .models import Student


# Register your models here.
class StudentAdmin(admin.ModelAdmin):
    """Customize the look of the auto-generated admin for the Student model"""
    pass


admin.site.register(Student, StudentAdmin)
