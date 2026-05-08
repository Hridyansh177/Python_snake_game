
        if snake.x == tile.x and snake.y == tile.y:
            reset_game()

def reset_game():
    global snake, snake_body, velocityX, velocityY
    snake = Tile(5 * tile_size, 5 * tile_size)
    snake_body = []
    velocityX = 0
    velocityY = 0