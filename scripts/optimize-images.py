#!/usr/bin/env python3
"""Convert source PNGs from assets/ into web-ready WebP files in public/img/.

Each interior/adv photo gets a large (1600px) and a small (800px) variant;
the window view gets a dedicated crop used as a texture in the 3D room.
"""
from pathlib import Path
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets"
OUT = ROOT / "public" / "img"


def save(im: Image.Image, path: Path, max_side: int, quality: int = 80) -> None:
    im = im.copy()
    im.thumbnail((max_side, max_side), Image.LANCZOS)
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, "WEBP", quality=quality, method=6)


def main() -> None:
    for folder in ("interior", "adv"):
        for src in sorted((SRC / folder).glob("*.png")):
            im = Image.open(src).convert("RGB")
            save(im, OUT / folder / f"{src.stem}.webp", 1600)
            save(im, OUT / folder / f"{src.stem}-sm.webp", 800, 75)

    # View through the arched window onto the National Library (texture for the 3D room).
    # 21.png shows the library without window frames; keep sky + skyline, drop the road and the facade.
    view = Image.open(SRC / "interior" / "21.png").convert("RGB")
    w, h = view.size
    crop = view.crop((0, 0, int(w * 0.68), int(h * 0.66)))
    save(crop, OUT / "view-library.webp", 2048, 85)

    # Padded version for the 3D window: the photo sits in the middle of a 2.4×2 canvas whose
    # surroundings are a heavily blurred stretch of the same photo (reads as depth of field).
    cw, ch = crop.size
    pad_w, pad_h = int(cw * 2.4), int(ch * 2.0)
    bg = crop.resize((pad_w, pad_h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(60))
    mask = Image.new("L", (cw, ch), 255)
    feather = 70
    px = mask.load()
    for y in range(ch):
        for x in range(cw):
            d = min(x, y, cw - 1 - x, ch - 1 - y)
            if d < feather:
                px[x, y] = int(255 * d / feather)
    bg.paste(crop, ((pad_w - cw) // 2, (pad_h - ch) // 2), mask)
    save(bg, OUT / "view-library-wide.webp", 4096, 82)

    # Brooch / favicon source.
    icon = Image.open(SRC / "logo" / "logo_icon.png").convert("RGBA")
    save(icon, OUT / "logo-icon.webp", 512, 90)

    total = sum(p.stat().st_size for p in OUT.rglob("*.webp"))
    print(f"done: {len(list(OUT.rglob('*.webp')))} files, {total / 1e6:.1f} MB")


if __name__ == "__main__":
    main()
