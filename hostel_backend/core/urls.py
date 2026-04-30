from django.urls import path
from . import views

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('login/', views.login),
    path('add-complaint/', views.add_complaint),
    path('complaints/', views.get_complaints),
    
    path('rooms/', views.get_rooms),
    path('book-room/', views.book_room),
    path('complaints/<int:id>/', views.update_status),
    path('my-room/<int:user_id>/', views.my_room),
    path('match-roommate/<int:user_id>/', views.find_roommate),
]

# 👇 ADD THIS AT THE END (DO NOT CREATE NEW urlpatterns)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)