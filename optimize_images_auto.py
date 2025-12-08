#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from PIL import Image
import os

# Configuration complète
ICONES = {
    'step1.png': {'dir': 'image/icone', 'width': 150, 'quality': 85},
    'step2.png': {'dir': 'image/icone', 'width': 150, 'quality': 85},
    'step3.png': {'dir': 'image/icone', 'width': 150, 'quality': 85},
    'step4.png': {'dir': 'image/icone', 'width': 150, 'quality': 85},
    'step5.png': {'dir': 'image/icone', 'width': 150, 'quality': 85},
}

SERVICES = {
    'service10.webp': {'dir': 'image', 'width': 738, 'quality': 75},
    'service20.webp': {'dir': 'image', 'width': 738, 'quality': 75},
    'service30.webp': {'dir': 'image', 'width': 738, 'quality': 75},
    'service40.webp': {'dir': 'image', 'width': 738, 'quality': 75},
    'service50.webp': {'dir': 'image', 'width': 738, 'quality': 75},
    'service60.webp': {'dir': 'image', 'width': 738, 'quality': 75},
}

HERO = {
    'heromobile.webp': {'dir': 'image', 'width': 1080, 'quality': 65},
    'chat_edit_image_20251126_144059.webp': {'dir': 'image', 'width': 1920, 'quality': 70},
}

def optimize(input_path, output_path, max_width, quality):
    try:
        img = Image.open(input_path)
        old_size = os.path.getsize(input_path)
        
        print(f"  Original : {img.size[0]}x{img.size[1]}px - {old_size//1024}KB")
        
        if img.width > max_width:
            ratio = max_width / img.width
            new_h = int(img.height * ratio)
            img = img.resize((max_width, new_h), Image.Resampling.LANCZOS)
            print(f"  Redimensionné : {img.size[0]}x{img.size[1]}px")
        
        img.save(output_path, 'WEBP', quality=quality, method=6)
        
        new_size = os.path.getsize(output_path)
        saved = old_size - new_size
        
        print(f"  ✅ {new_size//1024}KB (économie : {saved//1024}KB)")
        return saved
    except Exception as e:
        print(f"  ❌ {e}")
        return 0

print("=" * 60)
print("🚀 OPTIMISATION COMPLÈTE")
print("=" * 60)

total = 0

# Icônes
print("\n📍 ICÔNES")
for png, cfg in ICONES.items():
    input_path = os.path.join(cfg['dir'], png)
    output_path = os.path.join(cfg['dir'], png.replace('.png', '.webp'))
    if os.path.exists(input_path):
        print(f"\n📸 {png}")
        total += optimize(input_path, output_path, cfg['width'], cfg['quality'])

# Services
print("\n📍 SERVICES")
for webp, cfg in SERVICES.items():
    path = os.path.join(cfg['dir'], webp)
    if os.path.exists(path):
        print(f"\n📸 {webp}")
        total += optimize(path, path, cfg['width'], cfg['quality'])

# Hero images (LE PLUS IMPORTANT)
print("\n📍 HERO IMAGES")
for webp, cfg in HERO.items():
    path = os.path.join(cfg['dir'], webp)
    if os.path.exists(path):
        print(f"\n📸 {webp}")
        total += optimize(path, path, cfg['width'], cfg['quality'])

print("\n" + "=" * 60)
print(f"💾 Économie totale : {total//1024} KB")
print("🎯 Score attendu : 72-75")
print("=" * 60)