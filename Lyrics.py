import time
import pygame # type: ignore


pygame.mixer.init()


song_path = "C:\\Users\\Dell\\Downloads\\reflections_the_nbhd.mp3"
pygame.mixer.music.load(song_path)
pygame.mixer.music.play()

print("🎵 Reflections - The Neighbourhood 🎵")
print("-" * 45)
print("▶️ Playing... (lyrics will appear in sync)\n")
time.sleep(2)


lyrics_timed = [
    (1.5, "We were too close to the stars"),
    (5.3, "I never knew somebody like you, somebody"),
    (10.1, "Fallin' just as hard"),
    (13.3, "I'd rather lose somebody than use somebody"),
    (18.5, "Maybe it's....."),
]

start_time = time.time()

for t, line in lyrics_timed:
    while time.time() - start_time < t:
        time.sleep(0.1)
    print(line)


while pygame.mixer.music.get_busy():
    time.sleep(1)

print("\n🎶 End of song 🎶")
