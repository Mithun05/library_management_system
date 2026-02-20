from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    # This line connects the 'core/urls.py' to the main project
    path('api/', include('core.urls')), 
]
