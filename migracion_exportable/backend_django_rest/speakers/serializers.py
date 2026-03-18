from rest_framework import serializers

from .models import Discurso, Discursante


class DiscursoLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discurso
        fields = ["Fecha", "Tema"]


class DiscursanteSerializer(serializers.ModelSerializer):
    discursos = DiscursoLiteSerializer(many=True, read_only=True)

    class Meta:
        model = Discursante
        fields = ["id", "Nombres", "Apellidos", "Llamamiento", "discursos"]


class DiscursanteSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discursante
        fields = ["id", "Nombres", "Apellidos", "Llamamiento"]


class DiscursoSerializer(serializers.ModelSerializer):
    discursante = DiscursanteSimpleSerializer(source="Discursante", read_only=True)
    DiscursanteId = serializers.PrimaryKeyRelatedField(source="Discursante", queryset=Discursante.objects.all())

    class Meta:
        model = Discurso
        fields = ["id", "Fecha", "Tema", "DiscursanteId", "discursante"]
