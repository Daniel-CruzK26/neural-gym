from django.urls import path, include
from apps.PuzzlesVisuales.views import GenerarPuzzleAPIView, ReiniciarPuzzleAPIView

urlpatterns = [
    path('generar-puzzle/', GenerarPuzzleAPIView.as_view(), name='GenerarPuzzle'),
    path('reiniciar-puzzle/', ReiniciarPuzzleAPIView.as_view(), name='ReiniciarJuego'),
]
