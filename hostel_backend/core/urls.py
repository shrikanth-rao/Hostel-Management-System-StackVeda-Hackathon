from django.urls import path
from . import views

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('login/', views.login),
    path('add-complaint/', views.add_complaint),
    path('complaints/', views.get_complaints),
    path('complaints/<int:id>/', views.update_status),
]

# 👇 ADD THIS AT THE END (DO NOT CREATE NEW urlpatterns)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)