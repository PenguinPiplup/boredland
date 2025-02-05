from django.urls import path
from . import views

urlpatterns = [
    path("", views.cookieclicker, name="cookieclicker")
]