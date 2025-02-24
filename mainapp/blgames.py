from random import choice

games_list = [
    {"game_code": "CC1", "game_name": "cookieclicker"},
    {"game_code": "CC2", "game_name": "cookieclicker2"},
    {"game_code": "GTN", "game_name": "guessthenumber"}
]

def random_game():
    return choice(games_list)["game_name"]