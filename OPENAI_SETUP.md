# 🤖 OpenAI API Integration - Setup Anleitung

## 🔒 Sichere API-Key-Konfiguration

### Schritt 1: OpenAI API Key erhalten
1. Gehen Sie zu [OpenAI Platform](https://platform.openai.com/)
2. Erstellen Sie ein Konto oder melden Sie sich an
3. Gehen Sie zu "API Keys"
4. Erstellen Sie einen neuen API Key
5. **Wichtig**: Kopieren Sie den Key sofort (er wird nur einmal angezeigt)

### Schritt 2: Netlify Environment Variables setzen

#### Option A: Über Netlify Dashboard
1. Gehen Sie zu Ihrem Netlify Dashboard
2. Wählen Sie Ihr Projekt aus
3. Gehen Sie zu "Site settings" → "Environment variables"
4. Fügen Sie eine neue Variable hinzu:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: Ihr OpenAI API Key
5. Klicken Sie "Save"

#### Option B: Über Netlify CLI
```bash
# Installieren Sie Netlify CLI
npm install -g netlify-cli

# Anmelden
netlify login

# Environment Variable setzen
netlify env:set OPENAI_API_KEY "ihr-api-key-hier"
```

### Schritt 3: Deployment
Nach dem Setzen der Environment Variable:
1. Pushen Sie Ihren Code zu GitHub
2. Netlify wird automatisch neu deployen
3. Die OpenAI Integration ist dann verfügbar

## 🧪 Testen der Integration

1. Füllen Sie ein Spiegel-Angebot aus
2. Klicken Sie auf "✨ Angebots-E-Mail generieren"
3. Die KI generiert automatisch einen professionellen E-Mail-Text
4. Sie können den Text bearbeiten und dann senden

## 🔧 Features

### Angebots-E-Mail
- Professionell und freundlich
- Präsentiert das Angebot klar
- Erwähnt 30 Tage Gültigkeit
- Lädt zu Nachfragen ein

### Vertriebs-E-Mail
- Überzeugend und verkaufsorientiert
- Hebt Vorteile hervor
- Enthält Call-to-Action
- Kürzer und direkter

## 💰 Kosten

- **OpenAI API**: ~$0.002 pro 1K Tokens (sehr günstig)
- **Netlify Functions**: Kostenlos bis 125K Aufrufe/Monat
- **Geschätzte Kosten**: <$1/Monat für normale Nutzung

## 🔒 Sicherheit

✅ **API Key ist sicher** - wird nur auf dem Server gespeichert  
✅ **Keine Frontend-Exposition** - Key ist nie im Browser sichtbar  
✅ **CORS geschützt** - nur erlaubte Domains können zugreifen  
✅ **Rate Limiting** - Netlify schützt vor Missbrauch  

## 🐛 Troubleshooting

### "OpenAI API Key nicht konfiguriert"
- Prüfen Sie die Environment Variable in Netlify
- Stellen Sie sicher, dass der Key korrekt gesetzt ist
- Warten Sie 5 Minuten nach dem Setzen

### "Fehler bei der Textgenerierung"
- Prüfen Sie Ihr OpenAI Guthaben
- Stellen Sie sicher, dass der API Key gültig ist
- Schauen Sie in die Netlify Function Logs

### Funktion funktioniert nicht
- Prüfen Sie die Netlify Function Logs
- Stellen Sie sicher, dass die Dependencies installiert sind
- Testen Sie lokal mit `netlify dev` 