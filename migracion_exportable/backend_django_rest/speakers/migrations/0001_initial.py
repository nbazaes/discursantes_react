from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Discursante",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("Nombres", models.CharField(max_length=100)),
                ("Apellidos", models.CharField(max_length=100)),
                ("Llamamiento", models.CharField(blank=True, max_length=150, null=True)),
            ],
            options={"ordering": ["Apellidos", "Nombres"]},
        ),
        migrations.CreateModel(
            name="Discurso",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("Fecha", models.DateField()),
                ("Tema", models.CharField(max_length=255)),
                (
                    "Discursante",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="discursos", to="speakers.discursante"),
                ),
            ],
            options={"ordering": ["-Fecha", "id"]},
        ),
    ]
