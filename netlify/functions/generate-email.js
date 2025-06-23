const axios = require('axios');

exports.handler = async function(event, context) {
  // CORS Headers für Browser-Kompatibilität
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // OPTIONS Request für CORS Preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Nur POST Requests erlauben
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Request Body parsen
    const requestData = JSON.parse(event.body);
    const { 
      spiegelTyp, 
      groesse, 
      preis, 
      kundenName,
      anrede,
      emailType = 'angebot' 
    } = requestData;

    // OpenAI API Key aus Umgebungsvariablen (sicher!)
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'OpenAI API Key nicht konfiguriert' })
      };
    }

    // Anrede für E-Mail bestimmen
    let emailAnrede = 'Sehr geehrte Damen und Herren';
    if (anrede && kundenName) {
      if (anrede === 'Herr') {
        emailAnrede = `Sehr geehrter Herr ${kundenName}`;
      } else if (anrede === 'Frau') {
        emailAnrede = `Sehr geehrte Frau ${kundenName}`;
      }
    }

    // E-Mail-Typ bestimmen
    let prompt = '';
    if (emailType === 'angebot') {
      prompt = `Erstelle eine professionelle E-Mail für ein Spiegel-Angebot einer Glaserei.

Anrede: ${emailAnrede}
Spiegel: ${spiegelTyp} (${groesse})
Preis: ${preis} €

Die E-Mail sollte:
- Mit "${emailAnrede}," beginnen
- Professionell und freundlich sein
- Das Angebot klar präsentieren
- Auf Nachfragen hinweisen
- 30 Tage Gültigkeit erwähnen
- Nicht länger als 150 Wörter sein

Antwort nur mit dem E-Mail-Text, ohne zusätzliche Erklärungen.`;
    } else if (emailType === 'vertrieb') {
      prompt = `Erstelle eine überzeugende Vertriebs-E-Mail für einen ${spiegelTyp}-Spiegel.

Anrede: ${emailAnrede}
Spiegel: ${groesse}
Preis: ${preis} €

Die E-Mail sollte:
- Mit "${emailAnrede}," beginnen
- Überzeugend und verkaufsorientiert sein
- Vorteile des Spiegels hervorheben
- Call-to-Action enthalten
- Nicht länger als 120 Wörter sein

Antwort nur mit dem E-Mail-Text, ohne zusätzliche Erklärungen.`;
    }

    // OpenAI API Call
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Du bist ein professioneller E-Mail-Autor für eine Glaserei. Schreibe klare, freundliche und überzeugende E-Mails.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    // Antwort extrahieren
    const generatedText = response.data.choices[0].message.content.trim();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        emailText: generatedText
      })
    };

  } catch (error) {
    console.error('OpenAI API Fehler:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Fehler bei der Textgenerierung',
        details: error.message
      })
    };
  }
}; 