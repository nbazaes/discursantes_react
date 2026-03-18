from django.contrib import admin
from django.urls import include, path
from core.healthcheck import HealthcheckView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("health", HealthcheckView.as_view(), name="health"),
    path("api/", include("speakers.urls")),
]
