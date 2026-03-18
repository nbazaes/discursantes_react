from django.db import models


class Discursante(models.Model):
    Nombres = models.CharField(max_length=100)
    Apellidos = models.CharField(max_length=100)
    Llamamiento = models.CharField(max_length=150, blank=True, null=True)

    class Meta:
        ordering = ["Apellidos", "Nombres"]

    def __str__(self) -> str:
        return f"{self.Apellidos}, {self.Nombres}"


class Discurso(models.Model):
    Fecha = models.DateField()
    Tema = models.CharField(max_length=255)
    Discursante = models.ForeignKey(Discursante, on_delete=models.CASCADE, related_name="discursos")

    class Meta:
        ordering = ["-Fecha", "id"]

    def __str__(self) -> str:
        return f"{self.Fecha} - {self.Tema}"
