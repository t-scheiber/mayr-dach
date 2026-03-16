---
stylesheet:
  - https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap
body_class: report
css: |-
  body.report {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #1a1a2e;
    line-height: 1.7;
    font-size: 11pt;
  }
  h1 {
    color: #8b1e23;
    font-size: 22pt;
    border-bottom: 3px solid #8b1e23;
    padding-bottom: 8px;
    margin-top: 0;
  }
  h2 {
    color: #8b1e23;
    font-size: 15pt;
    margin-top: 28px;
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 4px;
  }
  h3 {
    color: #2a2a2a;
    font-size: 12pt;
    margin-top: 20px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    font-size: 10pt;
  }
  th {
    background: #8b1e23;
    color: white;
    padding: 8px 12px;
    text-align: left;
    font-weight: 600;
  }
  td {
    padding: 7px 12px;
    border-bottom: 1px solid #e5e5e5;
  }
  tr:nth-child(even) td {
    background: #fafafa;
  }
  strong {
    color: #1a1a2e;
  }
  .subtitle {
    color: #666;
    font-size: 10pt;
    margin-top: -8px;
  }
  hr {
    border: none;
    border-top: 1px solid #ddd;
    margin: 24px 0;
  }
  ul {
    padding-left: 20px;
  }
  li {
    margin-bottom: 4px;
  }
pdf_options:
  format: A4
  margin:
    top: 25mm
    bottom: 25mm
    left: 22mm
    right: 22mm
  displayHeaderFooter: true
  headerTemplate: '<div style="width:100%;font-size:8pt;color:#999;padding:0 22mm;font-family:Inter,sans-serif;"><span>Karl Mayr GmbH & Co. KG — Website-Bericht</span></div>'
  footerTemplate: '<div style="width:100%;font-size:8pt;color:#999;text-align:center;font-family:Inter,sans-serif;"><span>Seite <span class="pageNumber"></span> von <span class="totalPages"></span></span></div>'
---

# Website-Bericht: Neuer Webauftritt

<!-- markdownlint-disable MD033 MD036 -->

**Karl Mayr GmbH & Co. KG**

<div class="subtitle">

Erstellt am 16. März 2026 · Thomas Scheiber
Alt: [www.mayr-dach.at](https://www.mayr-dach.at) (HEROLD Website-Baukasten) · Neu: [mayr-dach.com](https://mayr-dach.com) (Eigenentwicklung)

</div>

<!-- markdownlint-enable MD033 MD036 -->

---

## Zusammenfassung

Die neue Website **mayr-dach.com** ersetzt den bestehenden HEROLD-Webauftritt durch eine moderne, maßgeschneiderte Lösung. Sie ist schneller, sicherer, barrierefreier und besser für Suchmaschinen und KI-Assistenten optimiert. Alle vier Google-Lighthouse-Kategorien erreichen **Bestwerte: 93 / 100 / 100 / 100**.

---

## Google Lighthouse Vergleich

Google Lighthouse ist der Industriestandard für die Bewertung von Webseiten (Skala 0–100).

| Kategorie | Alt (mayr-dach.at) | Neu (mayr-dach.com) | Verbesserung |
| --- | --- | --- | --- |
| **Leistung (Performance)** | 71 | **93** | +22 Punkte |
| **Barrierefreiheit** | 95 | **100** | +5 Punkte |
| **Best Practices** | 92 | **100** | +8 Punkte |
| **SEO** | 92 | **100** | +8 Punkte |

### Ladezeiten im Detail

| Messwert | Alt | Neu | Verbesserung |
| --- | --- | --- | --- |
| Erste Inhaltsanzeige (FCP) | 2,7 Sek. | **1,6 Sek.** | 41 % schneller |
| Größtes Element geladen (LCP) | 32,4 Sek. | **3,5 Sek.** | 89 % schneller |
| Vollständig interaktiv (TTI) | 34,4 Sek. | **3,5 Sek.** | 90 % schneller |
| Layout-Verschiebung (CLS) | 0,006 | **0,003** | 50 % besser |

> Die neue Seite ist **vollständig interaktiv in 3,5 Sekunden** — die alte benötigt über 34 Sekunden.

---

## Sicherheit

| Sicherheitsmerkmal | Alt | Neu |
| --- | --- | --- |
| HTTPS-Verschlüsselung | ✓ | ✓ |
| HSTS (Preload) | ✗ | **✓** |
| Clickjacking-Schutz (X-Frame-Options) | ✗ | **DENY** |
| Content-Type-Schutz | ✗ | **nosniff** |
| Referrer-Policy | ✗ | **strict-origin** |
| Permissions-Policy | ✗ | **Kamera/Mikro/GPS blockiert** |
| Server-Informationen versteckt | ✗ (HEROLD sichtbar) | **✓** |

Die alte Website hat **keine Sicherheitsheader**. Die neue hat alle empfohlenen Sicherheitsmaßnahmen implementiert.

---

## Leistung & Optimierung

| Merkmal | Alt | Neu |
| --- | --- | --- |
| Bildformat | Nur JPEG | **WebP/AVIF (automatisch)** |
| Hero-Videos | Keine | **10 Videos, optimiert (13 MB)** |
| Schriftarten | Extern geladen (blockiert Anzeige) | **Lokal optimiert** |
| Browser-Caching | Keines | **1 Jahr für statische Dateien** |
| Code-Splitting | Nein | **Automatisch pro Seite** |
| Lazy Loading | Teilweise | **Vollständig** |

---

## SEO & Suchmaschinen

| Merkmal | Alt | Neu |
| --- | --- | --- |
| Seitentitel pro Seite | Generisch | **Individuell pro Seite** |
| Meta-Beschreibungen | Generisch | **Individuell pro Seite** |
| Open Graph Tags | Teilweise | **Vollständig** |
| Strukturierte Daten (JSON-LD) | Keine | **LocalBusiness, Service, FAQ, JobPosting** |
| Sitemap | Keine | **Automatisch generiert** |
| Robots.txt | Keine | **Korrekt konfiguriert** |
| Kanonische URLs | Fehlt | **Korrekt mit x-default** |
| Mehrsprachige hreflang-Tags | Keine | **DE + EN + x-default** |

### KI-Sichtbarkeit (ChatGPT, Google Gemini, etc.)

| Merkmal | Alt | Neu |
| --- | --- | --- |
| llms.txt für KI-Crawler | ✗ | **✓** |
| FAQ-Schema für KI-Zitate | ✗ | **✓ (5 häufige Fragen)** |
| KI-Crawler erlaubt | ✗ | **✓ (GPTBot, ClaudeBot, etc.)** |
| Strukturierte Unternehmensdaten | ✗ | **✓** |

> Wenn Kunden ChatGPT oder Google fragen „Wer ist ein guter Dachdecker in Saalfelden?", hat die neue Website die besten Voraussetzungen, empfohlen zu werden.

---

## Neue Funktionen

### Zweisprachig (Deutsch & Englisch)

- Vollständige Übersetzung aller Inhalte
- Sprachumschalter mit Cookie-Speicherung
- Standardsprache Deutsch, Englisch auf Wunsch

### Online-Bewerbungssystem

- Bewerber laden Lebenslauf und optional Motivationsschreiben direkt hoch
- Automatische E-Mail-Benachrichtigung ans Büro
- Magic-Link in der E-Mail für direkten Zugang zur Bewerbung
- Statusverwaltung (Neu → In Prüfung → Angenommen/Abgelehnt)

### Admin-Dashboard

- Sicherer Login mit Einmal-Code per E-Mail (kein Passwort nötig)
- Verwaltung von Bewerbungen, Stellenangeboten und Projekten
- Stellenangebote aktivieren/deaktivieren
- Projekte mit Bildern und Kategorien pflegen

### Projektportfolio

- Projekte werden dynamisch aus der Datenbank geladen
- Bildergalerie mit Vollbild-Lightbox
- Automatische Karussell-Rotation
- Kategorisierung nach Leistungsbereich

### Moderne Animationen

- Ladeanimation mit Dachziegel-Motiv
- Seitenübergänge mit Fade-Animation
- Scroll-Animationen für Abschnitte
- Service-spezifische Ladeanimationen (Ziegel, Metall, Glas, Fassade, Abdichtung, Gründach)

### Automatische Deployments

- Code wird automatisch getestet, gebaut und deployed
- Build-Validierung vor Deployment verhindert kaputte Updates
- Keine manuelle Server-Aktualisierung nötig

---

## Infrastruktur

| Merkmal | Alt | Neu |
| --- | --- | --- |
| Hosting | HEROLD (Shared Hosting) | **Eigener VPS in Frankfurt** |
| Webserver | HEROLD proprietär | **Caddy (automatisches SSL)** |
| Datenbank | Keine | **PostgreSQL** |
| Framework | HEROLD Baukasten | **Next.js 16 (React 19)** |
| Versionskontrolle | Keine | **Git (GitHub)** |
| CI/CD Pipeline | Keine | **GitHub Actions** |

---

## Fehlerbehebungen

Die alte Website hat **12 schwerwiegende technische Fehler** laut Google Lighthouse. Diese wurden in der neuen Website alle behoben:

- ✗ JavaScript-Konsolenfehler im Browser
- ✗ Bilder mit falschem Seitenverhältnis
- ✗ Nicht durchsuchbare Links für Suchmaschinen
- ✗ Kein Browser-Caching (jeder Besuch lädt alles neu)
- ✗ Nicht verwendetes CSS verlangsamt die Seite
- ✗ Schriftarten blockieren die Anzeige
- ✗ Keine Sicherheitsheader
- ✗ Fehlende kanonische URLs
- ✗ Fehlende strukturierte Daten
- ✗ Cookie-Banner mit Fehler

---

## Die 10 wichtigsten Vorteile

1. **10× schneller** — 3,5 statt 34 Sekunden bis zur vollen Interaktivität
2. **Drei perfekte Wertungen** — 100/100 in Barrierefreiheit, Best Practices und SEO
3. **Sicher** — Alle empfohlenen Sicherheitsheader implementiert
4. **Zweisprachig** — Deutsch und Englisch
5. **Online-Bewerbungen** — Direkt über die Website mit Statusverwaltung
6. **Admin-Dashboard** — Eigenständige Verwaltung ohne Programmierer
7. **KI-optimiert** — Sichtbar für ChatGPT, Google Gemini und Co.
8. **Automatische Updates** — Code pushen, Website aktualisiert sich selbst
9. **Eigene Infrastruktur** — Keine Abhängigkeit von HEROLD
10. **Zukunftssicher** — Moderne Technologie (Next.js, React, PostgreSQL)
