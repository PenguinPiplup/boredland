from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import AnonymousUser
from django.views.decorators.csrf import requires_csrf_token
from django.db import IntegrityError
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from ast import literal_eval
from mainapp.models import BoredLand_User, Score, Game
import datetime

@requires_csrf_token
def save_score(request):
    if request.method == "POST":

        # Turn request body from POST API request into python dictionary
        request_body = literal_eval(request.body.decode('utf-8'))

        # Obtain game object from request body
        game_object = Game.objects.get(game_name=request_body["game_name"])

        # User is logged in
        if not request.user.is_anonymous:
            new_score = Score(user=request.user, score=request_body["score"], game=game_object, datetime=datetime.datetime.now())
            new_score.save()

            return HttpResponse("Score saved")
        
        else:
            anonymous = BoredLand_User.objects.get(username="Anonymous")
            new_score = Score(user=anonymous, score=request_body["score"], game=game_object, datetime=datetime.datetime.now())
            new_score.save()

            return HttpResponse("Score saved")
    
    else:
        return HttpResponseRedirect(reverse("index"))