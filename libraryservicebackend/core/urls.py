from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from .views import BookViewSet, MemberViewSet, LoanViewSet

from . import views

# Registering the viewsets with the router
router = DefaultRouter()
router.register(r'books', BookViewSet, basename='book')
router.register(r'members', MemberViewSet, basename='member')
router.register(r'loans', LoanViewSet, basename='loan')

urlpatterns = [
    path('', include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)