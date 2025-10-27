from django.urls import path
from . import views

urlpatterns = [
    path("room/<str:room_name>/", views.room, name="room"),
    path("api/messages/<str:room_name>/", views.get_messages, name="get_messages"),
    path("api/send/<str:room_name>/", views.send_message, name="send_message"),  # NUEVA
]

