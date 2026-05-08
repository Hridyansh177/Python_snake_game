import tkinter
import random

row = 25
col = 25
tile_size = 25

window_width = col * tile_size
window_height = row * tile_size

speed = 100

window = tkinter.Tk()
window.title("Snake Game")
window.resizable(False, False)

canvas = tkinter.Canvas(
    window,
    bg="#1e1e1e",
    width=window_width,
    height=window_height,
    borderwidth=0,
    highlightthickness=0
)
canvas.pack()

window.update()

screen_width = window.winfo_screenwidth()
screen_height = window.winfo_screenheight()

x = int((screen_width / 2) - (window_width / 2))
y = int((screen_height / 2) - (window_height / 2))

window.geometry(f"{window_width}x{window_height}+{x}+{y}")

class Tile:
    def __init__(self, x, y):
        self.x = x
        self.y = y

snake = Tile(5 * tile_size, 5 * tile_size)
food = Tile(10 * tile_size, 10 * tile_size)

snake_body = []

velocityX = 0
velocityY = 0

game_over = False
score = 0

def place_food():
    while True:
        food.x = random.randint(0, col - 1) * tile_size
        food.y = random.randint(0, row - 1) * tile_size

        collision = False

        for tile in snake_body:
            if food.x == tile.x and food.y == tile.y:
                collision = True
                break

        if food.x == snake.x and food.y == snake.y:
            collision = True

        if not collision:
            break

def change_direction(e):
    global velocityX, velocityY, game_over

    if game_over and e.keysym.lower() == "r":
        reset_game()
        return

    if (e.keysym in ["Up", "w"]) and velocityY != 1:
        velocityX = 0
        velocityY = -1

    elif (e.keysym in ["Down", "s"]) and velocityY != -1:
        velocityX = 0
        velocityY = 1

    elif (e.keysym in ["Left", "a"]) and velocityX != 1:
        velocityX = -1
        velocityY = 0

    elif (e.keysym in ["Right", "d"]) and velocityX != -1:
        velocityX = 1
        velocityY = 0

def reset_game():
    global snake, snake_body
    global velocityX, velocityY
    global game_over, score

    snake = Tile(5 * tile_size, 5 * tile_size)

    snake_body = []

    velocityX = 0
    velocityY = 0

    score = 0
    game_over = False

    place_food()

def move():
    global game_over, score

    if game_over:
        return

    if snake_body:
        snake_body.insert(0, Tile(snake.x, snake.y))
        snake_body.pop()

    snake.x += velocityX * tile_size
    snake.y += velocityY * tile_size

    if (
        snake.x < 0 or
        snake.x >= window_width or
        snake.y < 0 or
        snake.y >= window_height
    ):
        game_over = True
        return

    for tile in snake_body:
        if snake.x == tile.x and snake.y == tile.y:
            game_over = True
            return

    if snake.x == food.x and snake.y == food.y:
        snake_body.append(Tile(food.x, food.y))
        score += 1
        place_food()

def draw():
    move()

    canvas.delete("all")

    canvas.create_rectangle(
        food.x,
        food.y,
        food.x + tile_size,
        food.y + tile_size,
        fill="red",
        outline=""
    )

    canvas.create_rectangle(
        snake.x,
        snake.y,
        snake.x + tile_size,
        snake.y + tile_size,
        fill="lime green",
        outline=""
    )

    for tile in snake_body:
        canvas.create_rectangle(
            tile.x,
            tile.y,
            tile.x + tile_size,
            tile.y + tile_size,
            fill="#9acd32",
            outline=""
        )

    canvas.create_text(
        70,
        20,
        text=f"Score: {score}",
        fill="white",
        font=("Arial", 16, "bold")
    )

    if game_over:
        canvas.create_text(
            window_width / 2,
            window_height / 2 - 20,
            text="GAME OVER",
            fill="red",
            font=("Arial", 30, "bold")
        )

        canvas.create_text(
            window_width / 2,
            window_height / 2 + 20,
            text="Press R to Restart",
            fill="white",
            font=("Arial", 16)
        )

    window.after(speed, draw)

place_food()

window.bind("<KeyPress>", change_direction)

draw()

window.mainloop()