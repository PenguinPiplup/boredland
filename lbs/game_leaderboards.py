from mainapp.models import BoredLand_User, Score, Game
from django.shortcuts import render

def gen_lbs(request, game_name):
    """
    Given a game name, helps to generate the leaderboards page for that game
    """
    
    # Get all scores from database for given game name
    gameobject = Game.objects.get(game_name = game_name)
    highscores_queryset = Score.objects.filter(game=gameobject).order_by("score").reverse()

    # Generate leaderboards (Top 10 scores) and store it in highscores_arr
    highscores_arr = []
    number_of_rankings = min(10, len(highscores_queryset))
    for ranking in range(number_of_rankings):
        highscores_arr += [{"ranking": ranking + 1, "score": highscores_queryset[ranking]}]

    # Initialise some variables for calculating user's ranking
    user_highscores_arr = []
    user_ranking = None
    user_highscore = None
    current_ranking = 0

    # Generate user's personal leaderboards (Top 10 scores), together with global ranking of user's scores
    for score in highscores_queryset:
        current_ranking += 1
        if score.user == request.user: 
            # Record user's highest ranking/score
            if user_ranking == None:
                user_ranking = current_ranking
                user_highscore = score.score

            user_highscores_arr += [{"ranking": current_ranking, "score": score}]

        # Limit user scores shown to top 10 scores
        if len(user_highscores_arr) >= 10:
            break

    return render(request, game_name + "/leaderboards.html", {
        "scores": highscores_arr,
        "user_ranking": user_ranking,
        "user_highscore": user_highscore,
        "user_scores": user_highscores_arr
    })