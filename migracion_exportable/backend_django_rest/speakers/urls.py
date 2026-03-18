from django.urls import path

from .views import (
    DiscursoDeleteView,
    DiscursoDomingosView,
    DiscursoListCreateView,
    DiscursoPorFechaView,
    DiscursoTemasView,
    DiscursanteDetailView,
    DiscursanteListCreateView,
    DiscursanteSugerenciaView,
)

urlpatterns = [
    path("discursantes", DiscursanteListCreateView.as_view(), name="discursantes-list-create"),
    path("discursantes/", DiscursanteListCreateView.as_view(), name="discursantes-list-create-slash"),
    path("discursantes/<int:pk>", DiscursanteDetailView.as_view(), name="discursantes-detail"),
    path("discursantes/<int:pk>/", DiscursanteDetailView.as_view(), name="discursantes-detail-slash"),
    path("discursantes/accion/sugerencia", DiscursanteSugerenciaView.as_view(), name="discursantes-sugerencia"),
    path("discursantes/accion/sugerencia/", DiscursanteSugerenciaView.as_view(), name="discursantes-sugerencia-slash"),
    path("discursos", DiscursoListCreateView.as_view(), name="discursos-list-create"),
    path("discursos/", DiscursoListCreateView.as_view(), name="discursos-list-create-slash"),
    path("discursos/domingos", DiscursoDomingosView.as_view(), name="discursos-domingos"),
    path("discursos/domingos/", DiscursoDomingosView.as_view(), name="discursos-domingos-slash"),
    path("discursos/temas", DiscursoTemasView.as_view(), name="discursos-temas"),
    path("discursos/temas/", DiscursoTemasView.as_view(), name="discursos-temas-slash"),
    path("discursos/fecha/<str:fecha>", DiscursoPorFechaView.as_view(), name="discursos-fecha"),
    path("discursos/fecha/<str:fecha>/", DiscursoPorFechaView.as_view(), name="discursos-fecha-slash"),
    path("discursos/<int:pk>", DiscursoDeleteView.as_view(), name="discursos-delete"),
    path("discursos/<int:pk>/", DiscursoDeleteView.as_view(), name="discursos-delete-slash"),
]
