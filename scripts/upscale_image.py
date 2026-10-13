import os
from PIL import Image, ImageFilter, ImageEnhance

source_path = r"C:/Users/Abhishekh/.gemini/antigravity/brain/9c55db0a-165b-40ea-bb91-fba4c43db498/.user_uploaded/media_1791866289052_d3e0d4ba.jpg"
out_dir = r"g:/new try 1/public/img/hero"
os.makedirs(out_dir, exist_ok=True)

img = Image.open(source_path)
print(f"Original size: {img.size}")

# 2X upscale (2048 x 1456) with high quality Lanczos filter
w, h = img.size
upscaled = img.resize((w * 2, h * 2), Image.Resampling.LANCZOS)

# Multi-scale unsharp masking for crisp cartoon line art edges
# First pass: medium edge definition
upscaled = upscaled.filter(ImageFilter.UnsharpMask(radius=2.0, percent=130, threshold=2))
# Second pass: micro-contrast fine edge details
upscaled = upscaled.filter(ImageFilter.UnsharpMask(radius=1.0, percent=70, threshold=1))

# Enhance contrast and color vibrancy slightly for game arcade pop
enhancer_con = ImageEnhance.Contrast(upscaled)
upscaled = enhancer_con.enhance(1.05)
enhancer_col = ImageEnhance.Color(upscaled)
upscaled = enhancer_col.enhance(1.06)

# Save high-res PNG
out_png = os.path.join(out_dir, "genesis-brawl-hero-highres.png")
upscaled.save(out_png, "PNG", optimize=True)
print(f"Saved high-res PNG: {out_png} ({os.path.getsize(out_png) / 1024:.2f} KB)")

# Save high-res WebP with high quality (88%)
out_webp = os.path.join(out_dir, "genesis-brawl-hero-highres.webp")
upscaled.save(out_webp, "WEBP", quality=88, method=6)
print(f"Saved high-res WebP: {out_webp} ({os.path.getsize(out_webp) / 1024:.2f} KB)")
