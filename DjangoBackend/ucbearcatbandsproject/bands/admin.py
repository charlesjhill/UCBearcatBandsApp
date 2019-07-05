from django.contrib import admin
from .models import Student, Instrument, UniformPiece, Locker


# Register your models here.
class StudentAdmin(admin.ModelAdmin):
    """Customize the look of the auto-generated admin for the Student model"""
    pass

class InstrumentAdmin(admin.ModelAdmin):
    model = Instrument
    list_display = ['__str__', 'kind', 'condition']
    list_filter = ('kind', 'condition')

class UniformAdmin(admin.ModelAdmin):
    pass

class LockerAdmin(admin.ModelAdmin):
    pass


admin.site.register(Student, StudentAdmin)
admin.site.register(Instrument, InstrumentAdmin)
admin.site.register(UniformPiece, UniformAdmin)
admin.site.register(Locker, LockerAdmin)
