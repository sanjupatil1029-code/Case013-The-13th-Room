from PIL import Image
import os

src = r"C:\Users\Sanjana Patil\.gemini\antigravity\scratch\case-013-the-13th-room\public\assets\rathore_family_portrait.jpg"
img = Image.open(src).convert("RGB")
w, h = img.size
print("Portrait size:", w, h)

# Vikram (center-left older patriarch with white hair in cream sherwani)
vikram = img.crop((int(w * 0.31), int(h * 0.12), int(w * 0.48), int(h * 0.45)))

# Kamla Bai (center seated woman in gold/cream sari)
kamla = img.crop((int(w * 0.40), int(h * 0.34), int(w * 0.58), int(h * 0.70)))

# Naina (young woman on left in pink/red saree)
naina = img.crop((int(w * 0.10), int(h * 0.38), int(w * 0.28), int(h * 0.72)))

# Inspector Devendra (man in dark sherwani on right)
devendra = img.crop((int(w * 0.50), int(h * 0.10), int(w * 0.68), int(h * 0.45)))

# Arvind Joshi (man on top left in dark floral sherwani)
arvind = img.crop((int(w * 0.12), int(h * 0.06), int(w * 0.30), int(h * 0.40)))

dirs = [
    r"C:\Users\Sanjana Patil\.gemini\antigravity\scratch\case-013-the-13th-room\public\assets",
    r"C:\Users\Sanjana Patil\.gemini\antigravity\scratch\case-013-the-13th-room\assets"
]

for d in dirs:
    os.makedirs(d, exist_ok=True)
    vikram.save(os.path.join(d, "suspect_vikram.jpg"), quality=95)
    kamla.save(os.path.join(d, "suspect_kamla.jpg"), quality=95)
    naina.save(os.path.join(d, "suspect_naina.jpg"), quality=95)
    devendra.save(os.path.join(d, "suspect_devendra.jpg"), quality=95)
    arvind.save(os.path.join(d, "suspect_arvind.jpg"), quality=95)

print("All 5 suspect portraits cropped and saved directly from the Rathore family photo!")
