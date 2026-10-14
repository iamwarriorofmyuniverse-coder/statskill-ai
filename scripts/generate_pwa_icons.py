import os
import math
from PIL import Image, ImageDraw

icons_dir = os.path.join(os.getcwd(), "public", "icons")
os.makedirs(icons_dir, exist_ok=True)

def draw_statskill_icon(size, is_maskable=False):
    # Create image with MoSPI Navy background
    img = Image.new("RGBA", (size, size), (11, 37, 69, 255))
    draw = ImageDraw.Draw(img)

    center = size / 2.0
    # If maskable, safe zone is inner 80%
    radius = (size * 0.38) if not is_maskable else (size * 0.32)

    # 1. Subtle Outer Glow Ring (Saffron to Sky Blue)
    draw.ellipse(
        [center - radius, center - radius, center + radius, center + radius],
        outline=(56, 189, 248, 220), # Sky Blue
        width=max(2, int(size * 0.025))
    )

    inner_radius = radius * 0.72
    draw.ellipse(
        [center - inner_radius, center - inner_radius, center + inner_radius, center + inner_radius],
        outline=(255, 153, 51, 240), # Saffron accent
        width=max(2, int(size * 0.018))
    )

    # 2. Draw 12 Ashoka/Statistical Analytics Spokes
    num_spokes = 12
    spoke_len_outer = radius * 0.95
    spoke_len_inner = radius * 0.35
    for i in range(num_spokes):
        angle = i * (2 * math.pi / num_spokes)
        x1 = center + spoke_len_inner * math.cos(angle)
        y1 = center + spoke_len_inner * math.sin(angle)
        x2 = center + spoke_len_outer * math.cos(angle)
        y2 = center + spoke_len_outer * math.sin(angle)
        draw.line([(x1, y1), (x2, y2)], fill=(224, 242, 254, 180), width=max(1, int(size * 0.012)))

    # 3. Central Hub
    hub_radius = radius * 0.28
    draw.ellipse(
        [center - hub_radius, center - hub_radius, center + hub_radius, center + hub_radius],
        fill=(15, 23, 42, 255),
        outline=(56, 189, 248, 255),
        width=max(2, int(size * 0.02))
    )

    # 4. Central Analytics Core Dot (Emerald Green - Growth/Competency)
    core_radius = hub_radius * 0.45
    draw.ellipse(
        [center - core_radius, center - core_radius, center + core_radius, center + core_radius],
        fill=(19, 136, 8, 255), # India Green
        outline=(255, 255, 255, 230),
        width=max(1, int(size * 0.01))
    )

    # 5. Rising Growth Curve (White / Sky Glow)
    curve_points = [
        (center - radius * 0.55, center + radius * 0.45),
        (center - radius * 0.20, center + radius * 0.20),
        (center + radius * 0.15, center - radius * 0.10),
        (center + radius * 0.55, center - radius * 0.45),
    ]
    draw.line(curve_points, fill=(255, 255, 255, 240), width=max(2, int(size * 0.022)))

    # Arrowhead at end of curve
    ax, ay = curve_points[-1]
    arrow_size = max(4, int(size * 0.035))
    draw.polygon([
        (ax, ay),
        (ax - arrow_size * 1.4, ay + arrow_size * 0.4),
        (ax - arrow_size * 0.4, ay + arrow_size * 1.4)
    ], fill=(56, 189, 248, 255))

    return img

# Generate icons
sizes = {
    "icon-192.png": (192, False),
    "icon-512.png": (512, False),
    "icon-maskable.png": (512, True),
    "apple-touch-icon.png": (180, False)
}

for fname, (s, maskable) in sizes.items():
    dest = os.path.join(icons_dir, fname)
    im = draw_statskill_icon(s, maskable)
    im.save(dest, "PNG")
    print(f"Generated {fname} ({s}x{s})")

# Also generate SVG vector
svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" rx="100" fill="#0b2545" />
  <circle cx="256" cy="256" r="190" stroke="#38BDF8" stroke-width="12" stroke-opacity="0.9" />
  <circle cx="256" cy="256" r="140" stroke="#FF9933" stroke-width="8" stroke-opacity="0.9" />
  <circle cx="256" cy="256" r="50" fill="#0f172a" stroke="#38BDF8" stroke-width="10" />
  <circle cx="256" cy="256" r="22" fill="#138808" stroke="#ffffff" stroke-width="4" />
  <!-- Spokes -->
  <line x1="256" y1="70" x2="256" y2="200" stroke="#E0F2FE" stroke-width="6" stroke-opacity="0.7" />
  <line x1="256" y1="312" x2="256" y2="442" stroke="#E0F2FE" stroke-width="6" stroke-opacity="0.7" />
  <line x1="70" y1="256" x2="200" y2="256" stroke="#E0F2FE" stroke-width="6" stroke-opacity="0.7" />
  <line x1="312" y1="256" x2="442" y2="256" stroke="#E0F2FE" stroke-width="6" stroke-opacity="0.7" />
  <line x1="125" y1="125" x2="217" y2="217" stroke="#E0F2FE" stroke-width="6" stroke-opacity="0.7" />
  <line x1="295" y1="295" x2="387" y2="387" stroke="#E0F2FE" stroke-width="6" stroke-opacity="0.7" />
  <line x1="387" y1="125" x2="295" y2="217" stroke="#E0F2FE" stroke-width="6" stroke-opacity="0.7" />
  <line x1="217" y1="295" x2="125" y2="387" stroke="#E0F2FE" stroke-width="6" stroke-opacity="0.7" />
  <!-- Growth trend vector -->
  <polyline points="150,330 220,290 280,240 360,170" fill="none" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" />
  <polygon points="360,170 335,175 350,195" fill="#38BDF8" />
</svg>'''

with open(os.path.join(icons_dir, "icon.svg"), "w", encoding="utf-8") as f:
    f.write(svg_content)
print("Generated icon.svg")
