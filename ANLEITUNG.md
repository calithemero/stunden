# Stundenbewertung als App auf dem Handy – Anleitung

## Was in diesem Ordner liegt

| Datei | Zweck |
|---|---|
| `index.html` | die App selbst, eine Datei mit allem drin |
| `manifest.webmanifest` | Name, Farbe und Icons für den Home-Bildschirm |
| `sw.js` | Service Worker: macht die App offline nutzbar |
| `icon-180.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | App-Icons für iPhone und Android |
| `ANLEITUNG.md` | diese Anleitung, muss nicht hochgeladen werden |

Die sechs App-Dateien müssen zusammen in einem Ordner auf einem Server liegen, der `https` anbietet. Der Server liefert nur die App aus. Die Dienste der Kollegen bleiben auf ihren Geräten, es wird nichts hochgeladen.

## Weg A: GitHub Pages (kostenlos, dauerhaft, empfohlen)

1. Auf github.com ein Konto anlegen, falls noch keins da ist.
2. Oben rechts auf „+“ und „New repository“. Name zum Beispiel `stunden`. „Public“ lassen (kostenlose Konten bekommen Pages nur für öffentliche Repositories; darin liegt nur die App, keine Daten). Dann „Create repository“.
3. Auf der neuen Seite „uploading an existing file“ anklicken, die sechs App-Dateien hineinziehen (die Dateien, nicht den Ordner), unten „Commit changes“.
4. Im Repository auf „Settings“, links auf „Pages“. Bei „Branch“ `main` und `/ (root)` wählen, „Save“.
5. Nach ein bis zwei Minuten steht oben auf der Pages-Seite die Adresse, etwa `https://DEINNAME.github.io/stunden/`. Diese Adresse bekommen die Kollegen.

Neue Version veröffentlichen: im Repository „Add file“, „Upload files“, die neue `index.html` hineinziehen (gleicher Name ersetzt die alte), „Commit changes“. Wer die App danach mit Internet öffnet, bekommt die neue Version automatisch.

## Weg B: Netlify Drop (am schnellsten, ohne Git)

1. `app.netlify.com/drop` öffnen und ein kostenloses Konto anlegen.
2. Den ganzen Ordner mit den App-Dateien ins Browserfenster ziehen.
3. Netlify zeigt sofort eine Adresse wie `https://zufallsname-1234.netlify.app`. Unter „Site configuration“ lässt sich der Name ändern.

Neue Version: in Netlify unter „Deploys“ den Ordner erneut hineinziehen.

## Weg C: eigener Webserver

Alle sechs Dateien in einen Ordner auf dem Server legen. Pflicht ist `https`, sonst funktionieren Service Worker und Home-Bildschirm-Installation nicht. Der Server muss `.webmanifest` als `application/manifest+json` ausliefern. Bei Apache genügt dafür in einer `.htaccess` die Zeile `AddType application/manifest+json .webmanifest`, nginx kennt den Typ in der Regel schon.

## Auf dem Handy installieren

**iPhone und iPad:** Die Adresse in Safari öffnen (nicht in Chrome und nicht im Browser von WhatsApp). Unten das Teilen-Symbol antippen, dann „Zum Home-Bildschirm“ und „Hinzufügen“. Ab jetzt die App vom Home-Bildschirm starten.

**Android:** Die Adresse in Chrome öffnen, Menü mit den drei Punkten, dann „App installieren“ oder „Zum Startbildschirm hinzufügen“.

Wichtig: Die installierte App und der Browser haben getrennte Speicher. Wer schon im Browser Dienste eingetragen hat, exportiert dort eine Sicherung und importiert sie in der installierten App.

## Was die Kollegen wissen sollten

- Die Daten liegen nur auf dem eigenen Gerät. Beim Handywechsel: „Sicherung exportieren“, die Datei an sich selbst schicken (AirDrop, Mail, WhatsApp) und auf dem neuen Gerät „Sicherung importieren“.
- Offline funktioniert alles. Mit Internet lädt die App beim Start selbst die neueste Version.
- Ab und zu eine Sicherung exportieren schadet nicht, das Gerät ist der einzige Speicherort.

## Neue Version bauen (für dich)

1. `index.html` ändern oder ändern lassen.
2. Im Script oben die Zeile `const APP_VERSION='…'` anpassen. Der Text erscheint in der Fußzeile, so sieht jeder, welche Version läuft.
3. Hochladen wie oben beschrieben. Icons und Manifest bleiben unverändert; falls du sie doch änderst, in `sw.js` den Wert `CACHE` von `v1` auf `v2` setzen, damit die Geräte die neuen Dateien holen.

## Technische Hinweise

- `index.html` wird vom Service Worker „Netz zuerst“ geladen: Mit Internet kommt immer die aktuelle Datei, ohne Internet die zuletzt geladene. Antwortet der Server länger als vier Sekunden nicht, springt die App auf die gespeicherte Fassung.
- Der Speicher-Schlüssel und das Datenformat sind unverändert. Sicherungen aus der alten Einzeldatei lassen sich importieren, alte BR-Tageseinträge werden dabei in Minuten umgerechnet.
- Läuft die Seite als Artefakt in der Claude-App, gleicht sie den Stand zusätzlich zwischen den Geräten desselben Nutzers ab. Auf einem normalen Server ist dieser Teil inaktiv, es erscheint dann keine Cloud-Zeile.
