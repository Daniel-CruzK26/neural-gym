from rest_framework.routers import DefaultRouter
from apps.PuzzlesVisuales.views import GenerarPuzzleViewSet

router = DefaultRouter()
router.register(r'', GenerarPuzzleViewSet, basename='Puzzles_test')
urlpatterns = router.urls