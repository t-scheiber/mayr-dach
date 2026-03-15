#!/bin/bash
# Download ALL project images for carousels
BASE="https://www.mayr-dach.at"
DIR="public/images/projects"
mkdir -p "$DIR"

echo "=== Revier Boutique Hotel Kaprun ==="
curl -sL "$BASE/uploads/KkbZ8FjS/Revier-Kaprun-122025-40__msi___jpg.jpg" -o "$DIR/revier-kaprun-01.jpg"
curl -sL "$BASE/uploads/p4CQOdha/Revier-Kaprun-122025-41__msi___jpg.jpg" -o "$DIR/revier-kaprun-02.jpg"
curl -sL "$BASE/uploads/9lU8leUx/Revier-Kaprun-122025-82__msi___jpg.jpg" -o "$DIR/revier-kaprun-03.jpg"

echo "=== Fort Kniepass Unken ==="
curl -sL "$BASE/uploads/unrFx4Wv/20250731_fortkniepass_kathringollacknerfotografie-202__msi___jpg.jpg" -o "$DIR/fort-kniepass-01.jpg"
curl -sL "$BASE/uploads/9ygTvJxc/IMG_5460__msi___jpg.jpg" -o "$DIR/fort-kniepass-02.jpg"
curl -sL "$BASE/uploads/KARQ7M5L/20250731_fortkniepass_kathringollacknerfotografie-60__msi___jpg.jpg" -o "$DIR/fort-kniepass-03.jpg"

echo "=== Forsthofgut Leogang ==="
curl -sL "$BASE/uploads/SMxkngO4/waldspa-forsthofgut-leogang__msi___jpg.jpg" -o "$DIR/forsthofgut-01.jpg"
curl -sL "$BASE/uploads/2WoA3sl7/whirlpool-waldspa-forsthofgut__msi___jpg.jpg" -o "$DIR/forsthofgut-02.jpg"
curl -sL "$BASE/uploads/munAFXuT/210616_forsthofgut_seehaus_4-9267__msi___jpg.jpg" -o "$DIR/forsthofgut-03.jpg"
curl -sL "$BASE/uploads/yvOMnwoF/210616_forsthofgut_naturhotel_seehaus_12-54_bearbeitet__msi___jpg.jpg" -o "$DIR/forsthofgut-04.jpg"
curl -sL "$BASE/uploads/9MEtCPZP/wellnessurlaub-leogang-salzburgerland__msi___jpg.jpg" -o "$DIR/forsthofgut-05.jpg"

echo "=== Gemeindezentrum Maishofen ==="
curl -sL "$BASE/uploads/flz0ForV/aussen_print018__msi___jpg.jpg" -o "$DIR/gemeindezentrum-maishofen-01.jpg"
curl -sL "$BASE/uploads/MOCWGhqF/aussen_print020__msi___jpg.jpg" -o "$DIR/gemeindezentrum-maishofen-02.jpg"
curl -sL "$BASE/uploads/r2OZwACI/AussenansichtTag__msi___jpg.jpg" -o "$DIR/gemeindezentrum-maishofen-03.jpg"

echo "=== Zentrum f. Visionen Puch Urstein ==="
curl -sL "$BASE/uploads/wpWzq5iH/Location_Zentrum_fur_Visionen_Header-1500x630__msi___jpg.jpg" -o "$DIR/zentrum-visionen-01.jpg"
curl -sL "$BASE/uploads/PeOiCjWv/2025-06-10_Phil29__msi___jpg.jpg" -o "$DIR/zentrum-visionen-02.jpg"

echo "=== Kirche Saalbach ==="
curl -sL "$BASE/uploads/0U9T9eRw/2025-05-21_Dominik27__msi___jpg.jpg" -o "$DIR/kirche-saalbach-01.jpg"
curl -sL "$BASE/uploads/6ViVegdc/2025-05-21_Dominik11__msi___jpg.jpg" -o "$DIR/kirche-saalbach-02.jpg"
curl -sL "$BASE/uploads/NK3KP7fz/2025-06-16_Heini6__msi___jpg.jpg" -o "$DIR/kirche-saalbach-03.jpg"
curl -sL "$BASE/uploads/mb6wkEVo/2025-06-16_Heini11__msi___jpg.jpg" -o "$DIR/kirche-saalbach-04.jpg"

echo "=== Kirche Neumarkt am Wallersee ==="
curl -sL "$BASE/uploads/bl5cikac/2024-10-03_Schurl10__msi___jpg.jpg" -o "$DIR/kirche-neumarkt-01.jpg"
curl -sL "$BASE/uploads/Q1p6JJgi/2024-11-03_Andi17__msi___jpg.jpg" -o "$DIR/kirche-neumarkt-02.jpg"
curl -sL "$BASE/uploads/6f7POvho/2025-03-04_Andi-12__msi___jpg.jpg" -o "$DIR/kirche-neumarkt-03.jpg"

echo "=== Hasenauer ==="
curl -sL "$BASE/uploads/vzunovW9/HasenauerFoto__msi___jpg.jpg" -o "$DIR/hasenauer-01.jpg"

echo "=== Skiweltbahn Brixen im Thale ==="
curl -sL "$BASE/uploads/RHzcHQj9/2024-12-09_FW18__msi___jpg.jpg" -o "$DIR/skiweltbahn-brixen-01.jpg"

echo "=== Singer Kirchberg ==="
curl -sL "$BASE/uploads/0UEmo6tj/2024-05-24_Gerhard1ReschSinger__msi___jpg.jpg" -o "$DIR/singer-kirchberg-01.jpg"

echo "=== Going am Wilden Kaiser ==="
curl -sL "$BASE/uploads/cxi5SPg7/2024-12-09_Gerhard98_web__msi___jpg.jpg" -o "$DIR/going-wilder-kaiser-01.jpg"
curl -sL "$BASE/uploads/1ZWyexIK/2025-03-26_Gerhard10_web__msi___jpg.jpg" -o "$DIR/going-wilder-kaiser-02.jpg"
curl -sL "$BASE/uploads/Nq22WlTB/2025-03-26_Gerhard14_web__msi___jpg.jpg" -o "$DIR/going-wilder-kaiser-03.jpg"

echo "=== Schatzerhof Chalets Kirchberg ==="
curl -sL "$BASE/uploads/8X9j2E8s/2024-08-22_Gerhard5ReschnachFotosfragen__msi___jpg.jpg" -o "$DIR/schatzerhof-chalets-01.jpg"

echo "=== Krallerhof Leogang ==="
curl -sL "$BASE/uploads/d44iWP3e/Krallerhof_Aussenansicht_Atmosphere__msi___jpg.jpg" -o "$DIR/krallerhof-01.jpg"
curl -sL "$BASE/uploads/HmzpvrM1/Krallerhof_Bogen_Rotunde_See__msi___jpg.jpg" -o "$DIR/krallerhof-02.jpg"
curl -sL "$BASE/uploads/HXjSH7x6/Krallerhof_Rotunde_Zengarten__msi___jpg.jpg" -o "$DIR/krallerhof-03.jpg"
curl -sL "$BASE/uploads/SZ7hasfH/Krallerhof_Sauna_Tauchbecken_Nacht__msi___jpg.jpg" -o "$DIR/krallerhof-04.jpg"
curl -sL "$BASE/uploads/vycPmqNg/Krallerhof_Sommer_CafeamSee_Spiegelung01__msi___jpg.jpg" -o "$DIR/krallerhof-05.jpg"
curl -sL "$BASE/uploads/jwpQQnX9/Krallerhof_Tauchbecken_Sauna__msi___jpg.jpg" -o "$DIR/krallerhof-06.jpg"

echo "=== Alpenhotel Kitzbühel ==="
curl -sL "$BASE/uploads/wtlYhFNw/Alpenhotel_09082024-55_web__msi___jpg.jpg" -o "$DIR/alpenhotel-kitzbuehel-01.jpg"
curl -sL "$BASE/uploads/wmhH5y6y/Alpenhotel_Herbst22_06102022-48_web__msi___jpg.jpg" -o "$DIR/alpenhotel-kitzbuehel-02.jpg"
curl -sL "$BASE/uploads/X30ynGko/Alpenhotel_Mai2023-15_web__msi___jpg.jpg" -o "$DIR/alpenhotel-kitzbuehel-03.jpg"

echo "=== Residenzen Reithergasse ==="
curl -sL "$BASE/uploads/vj5LMIF0/rr55AlbinNiederstrasser-24__msi___jpg.jpg" -o "$DIR/residenzen-reithergasse-01.jpg"
curl -sL "$BASE/uploads/lJumFJOi/rr55AlbinNiederstrasser-25__msi___jpg.jpg" -o "$DIR/residenzen-reithergasse-02.jpg"
curl -sL "$BASE/uploads/YpjMW0OB/rr55AlbinNiederstrasser-28__msi___jpg.jpg" -o "$DIR/residenzen-reithergasse-03.jpg"
curl -sL "$BASE/uploads/JmxkidG7/rr55AlbinNiederstrasser-34__msi___jpg.jpg" -o "$DIR/residenzen-reithergasse-04.jpg"

echo "=== Schlossalmbahn Bad Hofgastein ==="
curl -sL "$BASE/uploads/EnG4F4TZ/2020-04-21_FW13__msi___jpg.jpg" -o "$DIR/schlossalmbahn-01.jpg"
curl -sL "$BASE/uploads/y88RbAsa/2020-04-21_FW21__msi___jpg.jpg" -o "$DIR/schlossalmbahn-02.jpg"
curl -sL "$BASE/uploads/RNw1XzRn/2020-04-21_FW46__msi___jpg.jpg" -o "$DIR/schlossalmbahn-03.jpg"
curl -sL "$BASE/uploads/NmBDr7Fh/2020-04-21_FW49__msi___jpg.jpg" -o "$DIR/schlossalmbahn-04.jpg"

echo "=== KVC Salzburg ==="
curl -sL "$BASE/uploads/PHPC9R7s/DSCN0861__msi___jpg.jpg" -o "$DIR/kvc-salzburg-01.jpg"
curl -sL "$BASE/uploads/snoS0SUl/IMG_9765__msi___jpg.jpg" -o "$DIR/kvc-salzburg-02.jpg"

echo "=== Dick Saalfelden ==="
curl -sL "$BASE/uploads/AcMwXMbc/DSC_1135__msi___jpg.jpg" -o "$DIR/dick-saalfelden-01.jpg"

echo "=== Friedl Oberer Bonauweg Salzburg ==="
curl -sL "$BASE/uploads/JaNiMrTK/phelps_1898__msi___jpg.jpg" -o "$DIR/friedl-bonauweg-01.jpg"

echo "=== Schulzentrum Taxenbach ==="
curl -sL "$BASE/uploads/Zpk5SRXR/01_Ansicht__msi___jpg.jpg" -o "$DIR/schulzentrum-taxenbach-01.jpg"
curl -sL "$BASE/uploads/iMMzR8vv/05_Turnhalle_03__msi___jpg.jpg" -o "$DIR/schulzentrum-taxenbach-02.jpg"
curl -sL "$BASE/uploads/9j7r2Pi4/02_Fluchtstiege__msi___jpg.jpg" -o "$DIR/schulzentrum-taxenbach-03.jpg"
curl -sL "$BASE/uploads/i4c7oU9W/03_Turnhalle01__msi___jpg.jpg" -o "$DIR/schulzentrum-taxenbach-04.jpg"

echo "=== Wiesl Saalbach Hinterglemm ==="
curl -sL "$BASE/uploads/srjs5i8Z/IMG_5714__msi___jpg.jpg" -o "$DIR/wiesl-saalbach-01.jpg"
curl -sL "$BASE/uploads/o0YC2GRI/IMG_5717__msi___jpg.jpg" -o "$DIR/wiesl-saalbach-02.jpg"
curl -sL "$BASE/uploads/g2mlv4kZ/IMG_5713__msi___jpg.jpg" -o "$DIR/wiesl-saalbach-03.jpg"

echo "=== Gabler Bräu Linzergasse ==="
curl -sL "$BASE/uploads/ZM6xbLad/GablerBruLinzergasse__msi___jpg.jpg" -o "$DIR/gabler-braeu-01.jpg"
curl -sL "$BASE/uploads/CXAWHDHM/GablerBruLinzergasse2__msi___jpg.jpg" -o "$DIR/gabler-braeu-02.jpg"

echo "=== Nexus Saalfelden ==="
curl -sL "$BASE/uploads/umxpgaFx/Nexus_Saalfelden__msi___jpg.jpg" -o "$DIR/nexus-saalfelden-01.jpg"

echo "=== Übergossene Alm Dienten ==="
curl -sL "$BASE/uploads/s7LBLpoq/bergossenAlmWohnhaus_02__msi___jpg.jpg" -o "$DIR/uebergossene-alm-01.jpg"
curl -sL "$BASE/uploads/hi8i3qlv/bergosseneAlm__msi___jpg.jpg" -o "$DIR/uebergossene-alm-02.jpg"

echo "=== Palais von Andrä Salzburg ==="
curl -sL "$BASE/uploads/TZyolKv9/IMG_9683__msi___jpg.jpg" -o "$DIR/palais-von-andrae-01.jpg"
curl -sL "$BASE/uploads/7srcKvjw/IMG_9687__msi___jpg.jpg" -o "$DIR/palais-von-andrae-02.jpg"
curl -sL "$BASE/uploads/3bpexjzw/IMG_9697__msi___jpg.jpg" -o "$DIR/palais-von-andrae-03.jpg"

echo "=== Interspar Saalfelden ==="
curl -sL "$BASE/uploads/jCL3Xtes/IntersparSaalfelden_01__msi___jpg.jpg" -o "$DIR/interspar-saalfelden-01.jpg"

echo "=== Eurotours Kitzbühel ==="
curl -sL "$BASE/uploads/U6xljY6r/DSC_8924k__msi___jpg.jpg" -o "$DIR/eurotours-kitzbuehel-01.jpg"
curl -sL "$BASE/uploads/BHIugubv/DSC_8927k__msi___jpg.jpg" -o "$DIR/eurotours-kitzbuehel-02.jpg"
curl -sL "$BASE/uploads/o0CG439K/DSC_8929k__msi___jpg.jpg" -o "$DIR/eurotours-kitzbuehel-03.jpg"

echo "=== Additional projects from subpages ==="
# Club Kitzsteinhorn (sealing page)
curl -sL "$BASE/uploads/bV9PcLBf/2025-03-19_Georg25__msi___jpg.jpg" -o "$DIR/club-kitzsteinhorn-01.jpg" 2>/dev/null
# Brandlhof (green roofs page)
curl -sL "$BASE/uploads/S4XOLkyk/Brandlhof1__msi___jpg.jpg" -o "$DIR/brandlhof-01.jpg"
curl -sL "$BASE/uploads/b6uCz4H3/Brandlhof2__msi___jpg.jpg" -o "$DIR/brandlhof-02.jpg"
curl -sL "$BASE/uploads/E1cDRF4b/Brandlhof3__msi___jpg.jpg" -o "$DIR/brandlhof-03.jpg"
# Hochstaufenkaserne (roofing page)
curl -sL "$BASE/uploads/UcDJOtL0/2025-02-24_Georg23__msi___jpg.jpg" -o "$DIR/hochstaufenkaserne-01.jpg"
# Glazing projects
curl -sL "$BASE/uploads/QDiHGWdm/IMG-20250814-WA0001__msi___jpg.jpg" -o "$DIR/hans-hunt-gasse-01.jpg"
curl -sL "$BASE/uploads/QgvOMxY1/2025-03-21-Nermin1__msi___jpg.jpg" -o "$DIR/johanneshof-01.jpg"
curl -sL "$BASE/uploads/I4GNJQiA/IMG-20240124-WA0044__msi___jpg.jpg" -o "$DIR/obersonnberg-01.jpg"
# Alpenhotel green roofs
curl -sL "$BASE/uploads/WREdwlzh/2021-11-16_Gerhard6_web__msi___jpg.jpg" -o "$DIR/alpenhotel-kitzbuehel-greenroof-01.jpg"
curl -sL "$BASE/uploads/HcC39g8l/2021-11-16_Gerhard4_web__msi___jpg.jpg" -o "$DIR/alpenhotel-kitzbuehel-greenroof-02.jpg"

echo ""
echo "=== COMPLETE ==="
echo "Total project images:"
ls "$DIR"/*.jpg 2>/dev/null | wc -l
