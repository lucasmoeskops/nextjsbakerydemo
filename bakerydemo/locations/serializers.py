from rest_framework.serializers import ModelSerializer

from bakerydemo.locations.models import LocationOperatingHours


class OperatingHoursSerializer(ModelSerializer):
    class Meta:
        fields = ['closed', 'closing_time', 'day', 'opening_time']
        model = LocationOperatingHours
