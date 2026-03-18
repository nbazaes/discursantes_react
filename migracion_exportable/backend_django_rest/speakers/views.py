from collections import defaultdict
from datetime import date

from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Discurso, Discursante
from .serializers import DiscursoLiteSerializer, DiscursoSerializer, DiscursanteSerializer


class DiscursanteListCreateView(APIView):
    def get(self, request):
        queryset = Discursante.objects.prefetch_related(
            Prefetch("discursos", queryset=Discurso.objects.only("Fecha", "Tema", "Discursante_id"))
        ).order_by("Apellidos", "Nombres")
        data = DiscursanteSerializer(queryset, many=True).data
        return Response(data)

    def post(self, request):
        serializer = DiscursanteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class DiscursanteDetailView(APIView):
    def get(self, request, pk: int):
        discursante = get_object_or_404(Discursante.objects.prefetch_related("discursos"), pk=pk)
        return Response(DiscursanteSerializer(discursante).data)

    def put(self, request, pk: int):
        discursante = get_object_or_404(Discursante, pk=pk)
        serializer = DiscursanteSerializer(discursante, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk: int):
        discursante = get_object_or_404(Discursante, pk=pk)
        discursante.delete()
        return Response({"mensaje": "Eliminado correctamente"})


class DiscursanteSugerenciaView(APIView):
    def get(self, request):
        discursantes = Discursante.objects.prefetch_related(
            Prefetch("discursos", queryset=Discurso.objects.only("Fecha", "Discursante_id"))
        ).order_by("Apellidos", "Nombres")

        resultado = []
        for d in discursantes:
            fechas = sorted([discurso.Fecha for discurso in d.discursos.all() if discurso.Fecha], reverse=True)
            ultima_fecha = fechas[0] if fechas else None
            resultado.append(
                {
                    "id": d.id,
                    "Nombres": d.Nombres,
                    "Apellidos": d.Apellidos,
                    "Llamamiento": d.Llamamiento,
                    "discursos": DiscursoLiteSerializer(d.discursos.all(), many=True).data,
                    "ultimaFecha": ultima_fecha,
                }
            )

        resultado.sort(key=lambda item: (item["ultimaFecha"] is not None, item["ultimaFecha"] or date.min))
        return Response(resultado)


class DiscursoListCreateView(APIView):
    def get(self, request):
        queryset = Discurso.objects.select_related("Discursante").order_by("-Fecha")
        return Response(DiscursoSerializer(queryset, many=True).data)

    def post(self, request):
        payload = request.data
        if isinstance(payload, dict) and isinstance(payload.get("discursos"), list):
            serializer = DiscursoSerializer(data=payload["discursos"], many=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer = DiscursoSerializer(data=payload)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class DiscursoDomingosView(APIView):
    def get(self, request):
        discursos = Discurso.objects.select_related("Discursante").order_by("-Fecha")
        grupos = defaultdict(list)

        for discurso in discursos:
            grupos[str(discurso.Fecha)].append(DiscursoSerializer(discurso).data)

        resultado = [
            {"fecha": fecha, "discursos": items}
            for fecha, items in sorted(grupos.items(), key=lambda kv: kv[0], reverse=True)
        ]
        return Response(resultado)


class DiscursoTemasView(APIView):
    def get(self, request):
        queryset = Discurso.objects.select_related("Discursante").order_by("-Fecha")
        return Response(DiscursoSerializer(queryset, many=True).data)


class DiscursoPorFechaView(APIView):
    def get(self, request, fecha: str):
        queryset = Discurso.objects.select_related("Discursante").filter(Fecha=fecha).order_by("id")
        return Response(DiscursoSerializer(queryset, many=True).data)

    def put(self, request, fecha: str):
        discursos = request.data.get("discursos", [])
        Discurso.objects.filter(Fecha=fecha).delete()

        nuevos = []
        for item in discursos:
            nuevos.append({"Fecha": fecha, "Tema": item.get("Tema"), "DiscursanteId": item.get("DiscursanteId")})

        if not nuevos:
            return Response([])

        serializer = DiscursoSerializer(data=nuevos, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class DiscursoDeleteView(APIView):
    def delete(self, request, pk: int):
        discurso = get_object_or_404(Discurso, pk=pk)
        discurso.delete()
        return Response({"mensaje": "Eliminado correctamente"})
