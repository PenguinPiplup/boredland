from django.urls import path
from . import views

urlpatterns = [
    path("", views.cookieclicker, name="cookieclicker"),
    path("leaderboards/", views.leaderboards, name="leaderboards"),
    path("leaderboards/redirect/", views.redirect_cookieclicker, name="redirect_cookieclicker")
]