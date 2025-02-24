from django.urls import path
from . import views

urlpatterns = [
    path("", views.guessthenumber, name="guessthenumber"),
    path("leaderboards/", views.leaderboards, name="leaderboards"),
    path("leaderboards/redirect/", views.redirect, name="redirect")
]