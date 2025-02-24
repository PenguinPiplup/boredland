from django.contrib.auth.models import User
from django.db import models

# Create your models here.

class BoredLand_User(User):
    pass

class Game(models.Model):
    game_code = models.CharField(max_length=20)
    game_name = models.CharField(max_length=150)

class Score(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_scores")
    score = models.IntegerField()
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name="game_scores")
    datetime = models.DateTimeField(auto_now_add=False)