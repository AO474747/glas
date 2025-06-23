# 🪞 Spiegel-Konfigurator

Ein professioneller Web-basierter Angebotsgenerator für Glasereien mit EmailJS-Integration.

## 📋 Übersicht

Der Spiegel-Konfigurator ist ein vollständig client-seitiges Tool, das es Glasereien ermöglicht:
- Spiegel-Angebote zu konfigurieren
- Preise automatisch zu berechnen
- Angebote per E-Mail zu versenden
- Eine professionelle Vorschau zu generieren

## 🚀 Features

### ✅ Phase 1 (Aktuell)
- **Spiegel-Konfiguration**: Größe, Typ, Randbearbeitung, Bohrungen
- **Automatische Preisberechnung**: Basierend auf Fläche und Optionen
- **E-Mail-Versand**: Über EmailJS mit Template-Integration
- **Responsive Design**: Funktioniert auf Desktop und Mobile
- **Vorschau-System**: Live-Angebotsvorschau und E-Mail-Preview

### 🔜 Phase 2 (Geplant)
- GPT-gestützte Textgenerierung
- Vertriebs-E-Mail-Templates
- PDF-Generierung
- DSGVO-Compliance
- Erweiterte Template-Optionen

## 🛠️ Setup

### 1. Repository klonen
```bash
git clone [IHR_REPO_URL]
cd spiegel-konfigurator
```

### 2. EmailJS konfigurieren

#### EmailJS Account erstellen
1. Gehen Sie zu [EmailJS.com](https://www.emailjs.com/)
2. Erstellen Sie ein kostenloses Konto
3. Verifizieren Sie Ihre E-Mail-Adresse

#### Service einrichten
1. Gehen Sie zu "Email Services"
2. Fügen Sie einen neuen Service hinzu (z.B. Gmail, Outlook)
3. Notieren Sie sich die **Service ID**

#### Template erstellen
1. Gehen Sie zu "Email Templates"
2. Erstellen Sie ein neues Template
3. Verwenden Sie diese Platzhalter:
   ```
   An: {{to_name}} ({{to_email}})
   Betreff: {{subject}}
   
   {{message}}
   
   Spiegel-Details:
   Größe: {{spiegel_groesse}}
   Typ: {{spiegel_typ}}
   Randbearbeitung: {{randbearbeitung}}
   Bohrungen: {{bohrungen}}
   Lieferzeit: {{lieferzeit}}
   Preis: {{gesamtpreis}} €
   Erstellt: {{erstellt_am}}
   ```
4. Notieren Sie sich die **Template ID**

#### User ID finden
1. Gehen Sie zu "Account" → "API Keys"
2. Kopieren Sie Ihre **Public Key**

### 3. Konfiguration einrichten

Öffnen Sie `script.js` und ersetzen Sie die Platzhalter:

```javascript
const EMAILJS_CONFIG = {
    serviceId: 'IHRE_SERVICE_ID',      // z.B. 'service_abc123'
    templateId: 'IHRE_TEMPLATE_ID',    // z.B. 'template_xyz789'
    userId: 'IHRE_USER_ID'             // z.B. 'user_def456'
};
```

### 4. Deployment

#### Option A: Netlify (Empfohlen)
1. Pushen Sie den Code zu GitHub
2. Gehen Sie zu [Netlify.com](https://netlify.com)
3. Verbinden Sie Ihr GitHub-Repository
4. Deploy-Einstellungen:
   - Build command: (leer lassen)
   - Publish directory: `/` (root)
5. Deploy!

#### Option B: Lokaler Server
```bash
# Mit Python
python -m http.server 8000

# Mit Node.js
npx serve .

# Mit PHP
php -S localhost:8000
```

## 📁 Projektstruktur

```
spiegel-konfigurator/
├── index.html          # Haupt-HTML-Datei
├── style.css           # Styling und Responsive Design
├── script.js           # JavaScript-Logik und EmailJS-Integration
├── README.md           # Diese Datei
└── .gitignore          # Git-Ignore-Datei
```

## ⚙️ Konfiguration

### Preise anpassen
Bearbeiten Sie die Preiskonfiguration in `script.js`:

```javascript
const PREISE = {
    'Standard': 45,    // €/m²
    'ESG': 65,
    'VSG': 85,
    'Design': 120
};
```

### E-Mail-Template anpassen
Die Standard-Nachricht kann in der `generateDefaultMessage()` Funktion geändert werden.

## 🔧 Verwendung

### 1. Spiegel konfigurieren
- Kundenname und E-Mail eingeben
- Spiegelgröße (Breite × Höhe) in cm
- Spiegeltyp auswählen
- Randbearbeitung wählen
- Anzahl Bohrungen eingeben
- Lieferzeit auswählen

### 2. Angebot prüfen
- Die Vorschau wird automatisch aktualisiert
- Preis wird live berechnet
- Alle Details werden angezeigt

### 3. E-Mail senden
- Betreff anpassen (optional)
- Nachricht bearbeiten (optional)
- "E-Mail-Vorschau" klicken
- Im Modal prüfen und bestätigen
- "Angebot senden" klicken

## 🎨 Anpassungen

### Design ändern
- Bearbeiten Sie `style.css`
- Farben: Ändern Sie die CSS-Variablen
- Layout: Modifizieren Sie das Grid-System

### Funktionalität erweitern
- Neue Spiegeltypen in `script.js` hinzufügen
- Zusätzliche Preisoptionen implementieren
- Neue Validierungsregeln erstellen

## 🐛 Troubleshooting

### E-Mail wird nicht gesendet
1. EmailJS-Konfiguration prüfen
2. Browser-Konsole auf Fehler prüfen
3. EmailJS-Limits überprüfen (kostenloses Konto: 200 E-Mails/Monat)

### Preise werden nicht berechnet
1. Alle erforderlichen Felder ausgefüllt?
2. JavaScript-Fehler in der Konsole?
3. Preiskonfiguration korrekt?

### Responsive Design funktioniert nicht
1. Viewport-Meta-Tag vorhanden?
2. CSS Media Queries korrekt?
3. Browser-Cache leeren

## 📞 Support

Bei Fragen oder Problemen:
1. GitHub Issues erstellen
2. EmailJS-Dokumentation prüfen
3. Browser-Entwicklertools verwenden

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz veröffentlicht.

## 🔄 Updates

### Version 1.0.0
- Grundlegende Spiegel-Konfiguration
- EmailJS-Integration
- Responsive Design
- Preisberechnung

### Geplante Updates
- PDF-Generierung
- GPT-Integration
- Erweiterte Templates
- DSGVO-Compliance 