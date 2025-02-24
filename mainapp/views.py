from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from .models import BoredLand_User
from .blgames import random_game, games_list

# Create your views here.
def index(request):
    """
    Returns homepage
    """
    return render(request, "mainapp/index.html")

def random(request):
    """
    Redirects user to a random website
    """
    return HttpResponseRedirect(reverse(random_game()))

def games(request):
    """
    Shows list of games on the website
    """
    return render(request, "mainapp/games.html", {
        "games_list": games_list
    })


"""
Functions that login, logout and register users
"""

def login_view(request):
    # Ensure that this function runs only if the users are not logged in
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse("index"))

    if request.method == "POST":

        # Access username and password from form data, and attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # If authentication is successful (user object returned), login and route to index mainpage
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        # If authentication failed, return login page again
        else:
            return render(request, "mainapp/login.html", {
                "error_message": "Invalid username and/or password. Please try again."
            })
    else:
        return render(request, "mainapp/login.html")

@login_required
def logout_view(request):
    logout(request)
    return render(request, "mainapp/login.html", {
        "error_message": "Successfully logged out."
    })

def register(request):
    # Ensure that this function runs only if the users are not logged in
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse("index"))
    
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure strength of password (TO CONTINUE UPDATING)
        password = request.POST["password"]
        if len(password) < 8:
            return render(request, "mainapp/register.html", {
                "error_message": "Error: Password must contain at least 8 characters."
            })

        # Ensure user typed same password twice
        password2 = request.POST["password2"]
        if password != password2:
            return render(request, "mainapp/register.html", {
                "error_message": "Error: Passwords do not match. Please try again."
            })
        
        try:
            newuser = BoredLand_User.objects.create_user(username, email, password)
            newuser.save()
        except IntegrityError:
            return render(request, "mainapp/register.html", {
                "error_message": "Error: Username has already been taken."
            })

        login(request, newuser)
        return HttpResponseRedirect(reverse("index"))
        
    # "GET" request method
    else:
        return render(request, "mainapp/register.html")
