from PIL import Image
import os

src = r"C:\Users\Sanjana Patil\.gemini\antigravity\brain\1f32312a-e790-47f7-a2d5-1c0f529d6b58\.user_uploaded\media_1792511893200_3f4976e7.png"
img = Image.open(src).convert('RGB')
w, h = img.size
print("Source image size:", w, h)
hw, hh = w // 2, h // 2

colonnade = img.crop((0, 0, hw, hh))
staircase = img.crop((hw, 0, w, hh))
corridor = img.crop((0, hh, hw, h))
shrine = img.crop((hw, hh, w, h))

dirs = [
    r"C:\Users\Sanjana Patil\.gemini\antigravity\scratch\case-013-the-13th-room\public\assets",
    r"C:\Users\Sanjana Patil\.gemini\antigravity\scratch\case-013-the-13th-room\assets"
]

for d in dirs:
    os.makedirs(d, exist_ok=True)
    colonnade.save(os.path.join(d, "room_colonnade.jpg"), quality=95)
    staircase.save(os.path.join(d, "room_staircase.jpg"), quality=95)
    corridor.save(os.path.join(d, "room_corridor.jpg"), quality=95)
    shrine.save(os.path.join(d, "room_shrine.jpg"), quality=95)

print("Successfully sliced and saved 4 interior rooms!")
