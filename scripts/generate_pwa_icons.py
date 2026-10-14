import os
import math
from PIL import Image, ImageDraw

OUTPUT_DIR = os.path.join(os.getcwd(), "public", "icons")
os.makedirs(OUTPUT_DIR, exist_ok=True)

def draw_modern_logo(size, is_maskable=False):
    # High-resolution super-sampling (2x)
    img_size = size * 2
    img = Image.new("RGBA", (img_size, img_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Margin and padding
    padding = img_size * 0.12 if is_maskable else img_size * 0.05
    box = [padding, padding, img_size - padding, img_size - padding]
    corner_radius = img_size * 0.22

    # Draw rounded squircle background
    # Gradient simulation from deep navy to slate black
    draw.rounded_rectangle(box, radius=corner_radius, fill=(11, 27, 54, 255), outline=(255, 255, 255, 45), width=int(img_size * 0.012))

    # Inner glow rim
    inner_box = [padding + 4, padding + 4, img_size - padding - 4, img_size - padding - 4]
    draw.rounded_rectangle(inner_box, radius=corner_radius - 4, outline=(56, 189, 248, 60), width=int(img_size * 0.008))

    # Center coordinates & scale
    cx = img_size / 2
    cy = img_size / 2
    scale = (img_size - padding * 2) / 48.0

    # 4 Ascending Statistical Cadre Intelligence Bars
    # Bar 1 (Cyan 70%)
    b1_x0 = padding + 10 * scale
    b1_y0 = padding + 27 * scale
    b1_x1 = b1_x0 + 4.8 * scale
    b1_y1 = padding + 38 * scale
    draw.rounded_rectangle([b1_x0, b1_y0, b1_x1, b1_y1], radius=scale * 2.2, fill=(2, 132, 199, 210))

    # Bar 2 (Cyan 90%)
    b2_x0 = padding + 17 * scale
    b2_y0 = padding + 21 * scale
    b2_x1 = b2_x0 + 4.8 * scale
    b2_y1 = padding + 38 * scale
    draw.rounded_rectangle([b2_x0, b2_y0, b2_x1, b2_y1], radius=scale * 2.2, fill=(14, 165, 233, 240))

    # Bar 3 (Sky Blue 100%)
    b3_x0 = padding + 24 * scale
    b3_y0 = padding + 15 * scale
    b3_x1 = b3_x0 + 4.8 * scale
    b3_y1 = padding + 38 * scale
    draw.rounded_rectangle([b3_x0, b3_y0, b3_x1, b3_y1], radius=scale * 2.2, fill=(56, 189, 248, 255))

    # Bar 4 (Saffron / Gold - Breakthrough Bar)
    b4_x0 = padding + 31 * scale
    b4_y0 = padding + 9 * scale
    b4_x1 = b4_x0 + 4.8 * scale
    b4_y1 = padding + 38 * scale
    draw.rounded_rectangle([b4_x0, b4_y0, b4_x1, b4_y1], radius=scale * 2.2, fill=(251, 133, 0, 255))

    # AI Summit Star at top of Bar 4
    star_x = b4_x0 + 2.4 * scale
    star_y = b4_y0 + 1 * scale
    star_r = 3.6 * scale
    draw.ellipse([star_x - star_r, star_y - star_r, star_x + star_r, star_y + star_r], fill=(255, 255, 255, 255))
    draw.ellipse([star_x - star_r * 0.5, star_y - star_r * 0.5, star_x + star_r * 0.5, star_y + star_r * 0.5], fill=(251, 133, 0, 255))

    # Spark rays
    ray_len = 6.0 * scale
    draw.line([star_x, star_y - ray_len, star_x, star_y + ray_len], fill=(255, 255, 255, 230), width=int(scale * 1.5))
    draw.line([star_x - ray_len, star_y, star_x + ray_len, star_y], fill=(255, 255, 255, 230), width=int(scale * 1.5))

    # Diagonal AI trajectory curve
    points = [
        (b1_x0 + 2.4 * scale, b1_y0),
        (b2_x0 + 2.4 * scale, b2_y0),
        (b3_x0 + 2.4 * scale, b3_y0),
        (star_x, star_y)
    ]
    for i in range(len(points) - 1):
        draw.line([points[i], points[i+1]], fill=(255, 183, 3, 200), width=int(scale * 1.6))

    # Core data nodes
    for pt in points[:-1]:
        draw.ellipse([pt[0] - 2 * scale, pt[1] - 2 * scale, pt[0] + 2 * scale, pt[1] + 2 * scale], fill=(255, 255, 255, 255))

    # Tricolor corner accents
    accent_w = int(scale * 3.0)
    # Saffron top-left
    draw.arc([padding + 3, padding + 3, padding + 28 * scale, padding + 28 * scale], start=180, end=270, fill=(251, 133, 0, 255), width=accent_w)
    # Emerald bottom-right
    draw.arc([img_size - padding - 28 * scale, img_size - padding - 28 * scale, img_size - padding - 3, img_size - padding - 3], start=0, end=90, fill=(16, 185, 129, 255), width=accent_w)

    # Downsample with anti-aliasing Lanczos filter
    final_img = img.resize((size, size), Image.Resampling.LANCZOS)
    return final_img

# Generate icons
print("Generating modernized 2026 StatSkill AI PWA Icons...")
draw_modern_logo(192).save(os.path.join(OUTPUT_DIR, "icon-192.png"), "PNG")
draw_modern_logo(512).save(os.path.join(OUTPUT_DIR, "icon-512.png"), "PNG")
draw_modern_logo(512, is_maskable=True).save(os.path.join(OUTPUT_DIR, "icon-maskable.png"), "PNG")
draw_modern_logo(180).save(os.path.join(OUTPUT_DIR, "apple-touch-icon.png"), "PNG")

# Also write icon.svg
svg_path = os.path.join(OUTPUT_DIR, "icon.svg")
with open(svg_path, "w", encoding="utf-8") as f:
    f.write('''<svg viewBox="0 0 48 48" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f2b5c"/>
      <stop offset="100%" stop-color="#040b17"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffb703"/>
      <stop offset="100%" stop-color="#fb8500"/>
    </linearGradient>
    <linearGradient id="cyan" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#38bdf8"/>
    </linearGradient>
  </defs>
  <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#bg)" stroke="rgba(255,255,255,0.18)" stroke-width="1.5"/>
  <path d="M 12 3 Q 3 3 3 12" stroke="#fb8500" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M 36 45 Q 45 45 45 36" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"/>
  <rect x="10" y="27" width="4.5" height="11" rx="2" fill="url(#cyan)" opacity="0.75"/>
  <rect x="17" y="21" width="4.5" height="17" rx="2" fill="url(#cyan)" opacity="0.9"/>
  <rect x="24" y="15" width="4.5" height="23" rx="2" fill="url(#cyan)"/>
  <rect x="31" y="9" width="4.5" height="29" rx="2" fill="url(#gold)"/>
  <circle cx="33.25" cy="9" r="3.2" fill="#ffffff"/>
  <circle cx="33.25" cy="9" r="1.8" fill="#fb8500"/>
  <path d="M 33.25 4 L 33.25 14 M 28.25 9 L 38.25 9" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round"/>
  <circle cx="26.25" cy="15" r="1.5" fill="#ffffff"/>
  <circle cx="19.25" cy="21" r="1.5" fill="#ffffff"/>
  <circle cx="12.25" cy="27" r="1.5" fill="#ffffff"/>
</svg>''')

print("All modernized icons generated successfully.")
