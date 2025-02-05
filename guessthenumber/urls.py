from django.urls import path
from . import views

urlpatterns = [
    path("", views.guessthenumber, name="guessthenumber")
]