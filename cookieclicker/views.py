from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.urls import reverse
from lbs.game_leaderboards import gen_lbs

game_name = "cookieclicker"

# Create your views here.
def cookieclicker(request):
    return render(request, game_name + "/cookieclicker.html")


def leaderboards(request):
    return gen_lbs(request, game_name)


def redirect_cookieclicker(request):
    return HttpResponseRedirect(reverse(game_name))