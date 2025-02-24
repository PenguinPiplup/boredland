from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import AnonymousUser
from django.views.decorators.csrf import requires_csrf_token
from django.db import IntegrityError
from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.urls import reverse
from lbs.game_leaderboards import gen_lbs

game_name = "guessthenumber"

# Create your views here.
def guessthenumber(request):
    return render(request, game_name + "/guessthenumber.html")


def leaderboards(request):
    return gen_lbs(request, game_name)


def redirect(request):
    return HttpResponseRedirect(reverse(game_name))