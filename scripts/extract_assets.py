"""
Asset extraction script for GENESIS 2026.
Crops TEMP assets from the 1440x1024 mockups in design-reference/ and saves them to public/art/ and public/sponsors/.
"""
import os
from PIL import Image, ImageChops

MOCKUP_DIR = r"g:\club website\design-reference"
ART_DIR = r"g:\club website\public\art"
LANDING_ART_DIR = os.path.join(ART_DIR, "landing")
SPONSORS_DIR = r"g:\club website\public\sponsors"

os.makedirs(ART_DIR, exist_ok=True)
os.makedirs(LANDING_ART_DIR, exist_ok=True)
os.makedirs(SPONSORS_DIR, exist_ok=True)

print("Extracting assets from mockups...")

# 1. Telescope from landing-page.png
# Brief: x 0-240, y 570-855
img_landing = Image.open(os.path.join(MOCKUP_DIR, "landing-page.png")).convert("RGBA")
# Let's inspect the bounding area for the telescope
# The telescope is on the left edge: x 0 to ~250, y ~550 to ~860
crop_telescope = img_landing.crop((0, 545, 250, 860))
crop_telescope.save(os.path.join(LANDING_ART_DIR, "telescope.png"))
print("Saved telescope.png")

# 2. Winged skull-star badge from landing-page.png
# Brief: x 620-820, y 228-415
# Let's crop slightly wider then check
crop_badge = img_landing.crop((610, 220, 830, 420))
crop_badge.save(os.path.join(ART_DIR, "badge.png"))
print("Saved badge.png")

# 3. About hero illustration from about.png
# Brief: about, region x >= 700. Avoid the home button baked into top-right corner.
# about.png is 1440x1024.
# Home button is at top right: x ~1300 to 1440, y 0 to ~120.
# The hero art spans roughly x 680 to 1440, y 0 to 1024.
img_about = Image.open(os.path.join(MOCKUP_DIR, "about.png")).convert("RGBA")
# We crop x 600 to 1440, y 0 to 1024, or specifically the robot astronomer and dome
crop_about = img_about.crop((550, 0, 1440, 1024))
crop_about.save(os.path.join(ART_DIR, "about-hero.png"))
print("Saved about-hero.png")

# 4. Collectible character card from timeline.png
# Brief: x 17-432, y 215-870
img_timeline = Image.open(os.path.join(MOCKUP_DIR, "timeline.png")).convert("RGBA")
crop_timeline_card = img_timeline.crop((10, 210, 440, 875))
crop_timeline_card.save(os.path.join(ART_DIR, "timeline-card.png"))
print("Saved timeline-card.png")

# 5. Sponsor logos from sponsor.png
# Title sponsor: GameCloud logo plaque is roughly around x 150-560, y 360-485
# Platform sponsor: Gamedoora logo plaque is roughly around x 860-1315, y 740-850
img_sponsor = Image.open(os.path.join(MOCKUP_DIR, "sponsor.png")).convert("RGBA")
crop_gamecloud = img_sponsor.crop((165, 370, 545, 465))
crop_gamecloud.save(os.path.join(SPONSORS_DIR, "gamecloud.png"))
print("Saved gamecloud.png")

crop_gamedoora = img_sponsor.crop((860, 740, 1315, 840))
crop_gamedoora.save(os.path.join(SPONSORS_DIR, "gamedoora.png"))
print("Saved gamedoora.png")

print("Asset extraction completed successfully.")
