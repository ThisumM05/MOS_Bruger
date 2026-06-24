from .models import User, Delivery, Customer, Staff 
from bike.models import Bike
from rest_framework import serializers

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id']

class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = ['id']

class DeliverySerializer(serializers.ModelSerializer):
    bike = serializers.PrimaryKeyRelatedField(
            queryset=Bike.objects.all(),
            required=False,
            allow_null=True
        )   
    class Meta:
        model = Delivery
        fields = ['license_number', 'bike']

class UserSerializer(serializers.ModelSerializer):
    profile = serializers.JSONField(write_only=True, required=False)
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'password', 'role', 'phone', 'address', 'profile']

    def _resolve_bike(self, bike_value):
        if bike_value in (None, "", 0, "0"):
            return None

        if isinstance(bike_value, Bike):
            return bike_value

        bike = Bike.objects.filter(id=bike_value).first()
        if bike:
            return bike

        raise serializers.ValidationError({
            'profile': {
                'bike': 'Invalid bike selected.'
            }
        })


    def get_profile(self, user):

        if user.role == 'CUSTOMER':
            if hasattr(user, 'customer'):
                return CustomerSerializer(user.customer).data

        elif user.role == 'STAFF':
            if hasattr(user, 'staff'):
                return StaffSerializer(user.staff).data

        elif user.role == 'DELIVERY':
            if hasattr(user, 'delivery'):
                return DeliverySerializer(user.delivery).data

        return None


    def create(self, validated_data):
        profile_data = validated_data.pop('profile', {})
        password = validated_data.pop('password', None)

        user = User.objects.create(**validated_data)

        if password:
            user.set_password(password)
            user.save()

        if user.role == 'CUSTOMER':
            Customer.objects.create(user=user)

        elif user.role == 'STAFF':
            Staff.objects.create(user=user)

        elif user.role == 'DELIVERY':
            Delivery.objects.create(
                user=user,
                license_number=profile_data.get('license_number'),
                bike=self._resolve_bike(profile_data.get('bike'))
            )

        return user


    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', None)
        password = validated_data.pop('password', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()

        if instance.role == 'CUSTOMER':
            Customer.objects.get_or_create(user=instance)

        elif instance.role == 'STAFF':
            Staff.objects.get_or_create(user=instance)

        elif instance.role == 'DELIVERY':
            delivery, _ = Delivery.objects.get_or_create(user=instance)

            if profile_data is not None:
                if 'license_number' in profile_data:
                    delivery.license_number = profile_data.get('license_number')
                if 'bike' in profile_data:
                    delivery.bike = self._resolve_bike(profile_data.get('bike'))
                delivery.save()

        return instance


    def to_representation(self, instance):
        data = super().to_representation(instance)

        if instance.role == 'CUSTOMER' and hasattr(instance, 'customer'):
            data['profile'] = CustomerSerializer(instance.customer).data

        elif instance.role == 'STAFF' and hasattr(instance, 'staff'):
            data['profile'] = StaffSerializer(instance.staff).data

        elif instance.role == 'DELIVERY' and hasattr(instance, 'delivery'):
            data['profile'] = DeliverySerializer(instance.delivery).data

        else:
            data['profile'] = None

        return data
