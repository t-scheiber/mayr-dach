#!/bin/bash
# Download images from the old mayr-dach.at website
# Run from project root: bash scripts/download-images.sh

BASE="https://www.mayr-dach.at"
IMG_DIR="public/images"

mkdir -p "$IMG_DIR"/{hero,services,values,projects,team,partners,logo}

echo "=== Downloading logo ==="
curl -sL "$BASE/uploads/YIWBMxiK/logo__msi___png.png" -o "$IMG_DIR/logo/logo.png"

echo "=== Downloading hero images ==="
curl -sL "$BASE/uploads/6bFDuXxY/AdobeStock_235305251__msi___jpg.jpg" -o "$IMG_DIR/hero/home-hero.jpg"
curl -sL "$BASE/uploads/6RYOxzs0/AdobeStock_435493278__msi___jpg.jpg" -o "$IMG_DIR/hero/about-hero.jpg"
curl -sL "$BASE/uploads/cg8nasRW/AdobeStock_284382532__msi___jpg.jpg" -o "$IMG_DIR/hero/services-hero.jpg"
curl -sL "$BASE/uploads/rwEA7Uw7/AdobeStock_50185034__msi___jpg.jpg" -o "$IMG_DIR/hero/jobs-hero.jpg"
curl -sL "$BASE/uploads/UuAVVBOW/AdobeStock_106443469__msi___jpg.jpg" -o "$IMG_DIR/hero/spenglerei-hero.jpg"
curl -sL "$BASE/uploads/WmfFYPSH/AdobeStock_378966473__msi___jpg.jpg" -o "$IMG_DIR/hero/glaserei-hero.jpg"
curl -sL "$BASE/uploads/cZmPJOWW/AdobeStock_850729757__msi___jpg.jpg" -o "$IMG_DIR/hero/fassade-hero.jpg"
curl -sL "$BASE/uploads/HGp7cT3z/AdobeStock_90303811__msi___jpg.jpg" -o "$IMG_DIR/hero/abdichtung-hero.jpg"
curl -sL "$BASE/uploads/3dt2EgqH/AdobeStock_1507598273__msi___jpg.jpg" -o "$IMG_DIR/hero/gruendaecher-hero.jpg"

echo "=== Downloading service icons ==="
curl -sL "$BASE/uploads/Zb20Uwu5/AdobeStock_602612143-1__msi___png.png" -o "$IMG_DIR/services/dachdeckerei.png"
curl -sL "$BASE/uploads/LC5pLl2p/AdobeStock_602612143__msi___png.png" -o "$IMG_DIR/services/spenglerei.png"
curl -sL "$BASE/uploads/yEwi6yoa/AdobeStock_602612143-4__msi___png.png" -o "$IMG_DIR/services/glaserei.png"
curl -sL "$BASE/uploads/QEksHJir/AdobeStock_602612143-2__msi___png.png" -o "$IMG_DIR/services/fassade.png"
curl -sL "$BASE/uploads/z5iks4zg/AdobeStock_602612143-3__msi___png.png" -o "$IMG_DIR/services/abdichtung.png"
curl -sL "$BASE/uploads/MPCXg5ct/AdobeStock_708265067__msi___png.png" -o "$IMG_DIR/services/gruendaecher.png"

echo "=== Downloading value icons ==="
curl -sL "$BASE/uploads/GfkLzI9S/AdobeStock_486933860__msi___png.png" -o "$IMG_DIR/values/fachkompetenz.png"
curl -sL "$BASE/uploads/kkXHFvMs/AdobeStock_486933860-1__msi___png.png" -o "$IMG_DIR/values/team.png"
curl -sL "$BASE/uploads/Qt5ZJRAi/AdobeStock_486933860-2__msi___png.png" -o "$IMG_DIR/values/qualitaet.png"

echo "=== Downloading team images ==="
curl -sL "$BASE/uploads/Hf6XDcHr/AdobeStock_3667878272__msi___jpg.jpg" -o "$IMG_DIR/team/team-placeholder-1.jpg"
curl -sL "$BASE/uploads/TW4UDrLG/AdobeStock_3667878271__msi___jpg.jpg" -o "$IMG_DIR/team/team-placeholder-2.jpg"

echo "=== Downloading partner logos ==="
curl -sL "$BASE/uploads/ZnxFdjIj/bmi__msi___png.png" -o "$IMG_DIR/partners/bramac.png"
curl -sL "$BASE/uploads/JvpPWjtg/bmi-2__msi___png.png" -o "$IMG_DIR/partners/villas.png"
curl -sL "$BASE/uploads/Sk0Semuz/austrodach__msi___png.png" -o "$IMG_DIR/partners/austrodach.png"
curl -sL "$BASE/uploads/9li4mCk0/lagerhaus__msi___png.png" -o "$IMG_DIR/partners/lagerhaus.png"
curl -sL "$BASE/uploads/nsdMLaA7/steinbacher__msi___png.png" -o "$IMG_DIR/partners/steinbacher.png"
curl -sL "$BASE/uploads/GXhhUDgc/swisspearl__msi___png.png" -o "$IMG_DIR/partners/swisspearl.png"
curl -sL "$BASE/uploads/2EVEOca1/triflex__msi___png.png" -o "$IMG_DIR/partners/triflex.png"
curl -sL "$BASE/uploads/N7QRB0hR/velux__msi___png.png" -o "$IMG_DIR/partners/velux.png"
curl -sL "$BASE/uploads/mNL0w2JO/slama__msi___png.png" -o "$IMG_DIR/partners/slama.png"
curl -sL "$BASE/uploads/hKvvddE5/wrth__msi___png.png" -o "$IMG_DIR/partners/wuerth.png"
curl -sL "$BASE/uploads/klIddY6R/amari__msi___png.png" -o "$IMG_DIR/partners/amari.png"
curl -sL "$BASE/uploads/ZbZKKIJf/bauder__msi___png.png" -o "$IMG_DIR/partners/bauder.png"
curl -sL "$BASE/uploads/8P1WkMGV/bauzentrumhannak__msi___png.png" -o "$IMG_DIR/partners/bauzentrum-hannak.png"
curl -sL "$BASE/uploads/NAsvFsbt/eisenwagner__msi___png.png" -o "$IMG_DIR/partners/eisen-wagner.png"
curl -sL "$BASE/uploads/2A2M2bKf/flaga__msi___png.png" -o "$IMG_DIR/partners/flaga.png"
curl -sL "$BASE/uploads/aDZaTwRH/kingspan__msi___png.png" -o "$IMG_DIR/partners/kingspan.png"
curl -sL "$BASE/uploads/aSFPeFAf/prefa__msi___png.png" -o "$IMG_DIR/partners/prefa.png"
curl -sL "$BASE/uploads/4tGqzSyq/domico__msi___png.png" -o "$IMG_DIR/partners/domico.png"

echo "=== Downloading featured project images (first image per project) ==="
# Revier Boutique Hotel Kaprun
curl -sL "$BASE/uploads/KkbZ8FjS/Revier-Kaprun-122025-40__msi___jpg.jpg" -o "$IMG_DIR/projects/revier-kaprun-01.jpg"
# Fort Kniepass Unken
curl -sL "$BASE/uploads/unrFx4Wv/20250731_fortkniepass_kathringollacknerfotografie-202__msi___jpg.jpg" -o "$IMG_DIR/projects/fort-kniepass-01.jpg"
# Forsthofgut Leogang
curl -sL "$BASE/uploads/SMxkngO4/waldspa-forsthofgut-leogang__msi___jpg.jpg" -o "$IMG_DIR/projects/forsthofgut-01.jpg"
# Gemeindezentrum Maishofen
curl -sL "$BASE/uploads/flz0ForV/aussen_print018__msi___jpg.jpg" -o "$IMG_DIR/projects/gemeindezentrum-maishofen-01.jpg"
# Zentrum f. Visionen
curl -sL "$BASE/uploads/wpWzq5iH/Location_Zentrum_fur_Visionen_Header-1500x630__msi___jpg.jpg" -o "$IMG_DIR/projects/zentrum-visionen-01.jpg"
# Kirche Saalbach
curl -sL "$BASE/uploads/0U9T9eRw/2025-05-21_Dominik27__msi___jpg.jpg" -o "$IMG_DIR/projects/kirche-saalbach-01.jpg"
# Kirche Neumarkt
curl -sL "$BASE/uploads/bl5cikac/2024-10-03_Schurl10__msi___jpg.jpg" -o "$IMG_DIR/projects/kirche-neumarkt-01.jpg"
# Krallerhof Leogang
curl -sL "$BASE/uploads/d44iWP3e/Krallerhof_Aussenansicht_Atmosphere__msi___jpg.jpg" -o "$IMG_DIR/projects/krallerhof-01.jpg"
# Alpenhotel Kitzbühel
curl -sL "$BASE/uploads/wtlYhFNw/Alpenhotel_09082024-55_web__msi___jpg.jpg" -o "$IMG_DIR/projects/alpenhotel-kitzbuehel-01.jpg"
# Residenzen Reithergasse
curl -sL "$BASE/uploads/vj5LMIF0/rr55AlbinNiederstrasser-24__msi___jpg.jpg" -o "$IMG_DIR/projects/residenzen-reithergasse-01.jpg"
# Schlossalmbahn Bad Hofgastein
curl -sL "$BASE/uploads/EnG4F4TZ/2020-04-21_FW13__msi___jpg.jpg" -o "$IMG_DIR/projects/schlossalmbahn-01.jpg"
# Schulzentrum Taxenbach
curl -sL "$BASE/uploads/Zpk5SRXR/01_Ansicht__msi___jpg.jpg" -o "$IMG_DIR/projects/schulzentrum-taxenbach-01.jpg"
# Going am Wilden Kaiser
curl -sL "$BASE/uploads/cxi5SPg7/2024-12-09_Gerhard98_web__msi___jpg.jpg" -o "$IMG_DIR/projects/going-wilder-kaiser-01.jpg"
# Palais von Andrä Salzburg
curl -sL "$BASE/uploads/TZyolKv9/IMG_9683__msi___jpg.jpg" -o "$IMG_DIR/projects/palais-von-andrae-01.jpg"
# Eurotours Kitzbühel
curl -sL "$BASE/uploads/U6xljY6r/DSC_8924k__msi___jpg.jpg" -o "$IMG_DIR/projects/eurotours-kitzbuehel-01.jpg"
# KVC Salzburg
curl -sL "$BASE/uploads/PHPC9R7s/DSCN0861__msi___jpg.jpg" -o "$IMG_DIR/projects/kvc-salzburg-01.jpg"
# Skiweltbahn Brixen
curl -sL "$BASE/uploads/RHzcHQj9/2024-12-09_FW18__msi___jpg.jpg" -o "$IMG_DIR/projects/skiweltbahn-brixen-01.jpg"
# Interspar Saalfelden
curl -sL "$BASE/uploads/jCL3Xtes/IntersparSaalfelden_01__msi___jpg.jpg" -o "$IMG_DIR/projects/interspar-saalfelden-01.jpg"
# Nexus Saalfelden
curl -sL "$BASE/uploads/umxpgaFx/Nexus_Saalfelden__msi___jpg.jpg" -o "$IMG_DIR/projects/nexus-saalfelden-01.jpg"
# Übergossene Alm
curl -sL "$BASE/uploads/s7LBLpoq/bergossenAlmWohnhaus_02__msi___jpg.jpg" -o "$IMG_DIR/projects/uebergossene-alm-01.jpg"
# Gabler Bräu
curl -sL "$BASE/uploads/ZM6xbLad/GablerBruLinzergasse__msi___jpg.jpg" -o "$IMG_DIR/projects/gabler-braeu-01.jpg"

echo "=== Done! ==="
echo "Downloaded images to $IMG_DIR"
ls -la "$IMG_DIR"/logo/ "$IMG_DIR"/hero/ "$IMG_DIR"/services/ "$IMG_DIR"/values/ | head -30
echo "..."
echo "Project images:"
ls "$IMG_DIR"/projects/ | wc -l
echo "Partner logos:"
ls "$IMG_DIR"/partners/ | wc -l
