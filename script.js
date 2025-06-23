// EmailJS Konfiguration
// HINWEIS: Diese Werte müssen mit Ihren tatsächlichen EmailJS-Daten ersetzt werden
const EMAILJS_CONFIG = {
    serviceId: 'service_t0x6h2t', // z.B. 'service_abc123'
    templateId: 'template_4yzhd0q', // z.B. 'template_xyz789'
    userId: 'N-WiC9QPXh158LTC7' // z.B. 'user_def456'
};

// Preiskonfiguration (€/m²)
const PREISE = {
    'Standard': 45,
    'ESG': 65,
    'VSG': 85,
    'Design': 120
};

const RANDBEARBEITUNG_PREISE = {
    'Standard': 0,
    'Poliert': 15,
    'Facettiert': 25,
    'Keine': 0
};

const BOHRUNG_PREIS = 5; // € pro Bohrung
const LIEFERZEIT_AUFZUSCHLAG = {
    'Standard': 0,
    'Express': 20,
    'Premium': 40
};

// DOM-Elemente
const elements = {
    // Formular-Elemente
    customerName: document.getElementById('customerName'),
    customerEmail: document.getElementById('customerEmail'),
    spiegelBreite: document.getElementById('spiegelBreite'),
    spiegelHoehe: document.getElementById('spiegelHoehe'),
    spiegelTyp: document.getElementById('spiegelTyp'),
    randbearbeitung: document.getElementById('randbearbeitung'),
    bohrungen: document.getElementById('bohrungen'),
    lieferzeit: document.getElementById('lieferzeit'),
    
    // Vorschau-Elemente
    previewKunde: document.getElementById('previewKunde'),
    previewGroesse: document.getElementById('previewGroesse'),
    previewTyp: document.getElementById('previewTyp'),
    previewRand: document.getElementById('previewRand'),
    previewBohrungen: document.getElementById('previewBohrungen'),
    previewLieferzeit: document.getElementById('previewLieferzeit'),
    previewPreis: document.getElementById('previewPreis'),
    previewDate: document.querySelector('.preview-date'),
    
    // E-Mail-Elemente
    emailBetreff: document.getElementById('emailBetreff'),
    emailNachricht: document.getElementById('emailNachricht'),
    emailStatus: document.getElementById('emailStatus'),
    
    // Buttons
    previewEmail: document.getElementById('previewEmail'),
    sendEmail: document.getElementById('sendEmail'),
    
    // Modal
    emailModal: document.getElementById('emailModal'),
    modalTo: document.getElementById('modalTo'),
    modalSubject: document.getElementById('modalSubject'),
    modalMessage: document.getElementById('modalMessage'),
    confirmSend: document.getElementById('confirmSend'),
    cancelSend: document.getElementById('cancelSend'),
    closeModal: document.querySelector('.close')
};

// Initialisierung
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    updatePreview();
});

// App-Initialisierung
function initializeApp() {
    // EmailJS initialisieren
    if (typeof emailjs !== 'undefined') {
        try {
            emailjs.init(EMAILJS_CONFIG.userId);
            console.log('EmailJS erfolgreich initialisiert mit User ID:', EMAILJS_CONFIG.userId);
            
            // Test der Konfiguration
            console.log('EmailJS Konfiguration:', {
                serviceId: EMAILJS_CONFIG.serviceId,
                templateId: EMAILJS_CONFIG.templateId,
                userId: EMAILJS_CONFIG.userId
            });
        } catch (error) {
            console.error('Fehler bei EmailJS-Initialisierung:', error);
        }
    } else {
        console.error('EmailJS SDK nicht geladen - prüfen Sie die CDN-Einbindung');
    }
    
    // Datum setzen
    const heute = new Date().toLocaleDateString('de-DE');
    elements.previewDate.textContent = `Erstellt am: ${heute}`;
    elements.emailBetreff.value = `Ihr Spiegel-Angebot - ${heute}`;
    
    // Standard-Nachricht setzen
    elements.emailNachricht.value = generateDefaultMessage();
}

// Event-Listener Setup
function setupEventListeners() {
    // Formular-Änderungen
    const formElements = [
        elements.customerName, elements.customerEmail, elements.spiegelBreite,
        elements.spiegelHoehe, elements.spiegelTyp, elements.randbearbeitung,
        elements.bohrungen, elements.lieferzeit
    ];
    
    formElements.forEach(element => {
        if (element) {
            element.addEventListener('input', updatePreview);
            element.addEventListener('change', updatePreview);
        }
    });
    
    // Button-Events
    if (elements.previewEmail) {
        elements.previewEmail.addEventListener('click', showEmailPreview);
    }
    
    if (elements.sendEmail) {
        elements.sendEmail.addEventListener('click', sendEmail);
    }
    
    // EmailJS Test Button
    const testEmailJSButton = document.getElementById('testEmailJS');
    if (testEmailJSButton) {
        testEmailJSButton.addEventListener('click', testEmailJSConfig);
    }
    
    // Modal-Events
    if (elements.confirmSend) {
        elements.confirmSend.addEventListener('click', confirmAndSendEmail);
    }
    
    if (elements.cancelSend) {
        elements.cancelSend.addEventListener('click', closeModal);
    }
    
    if (elements.closeModal) {
        elements.closeModal.addEventListener('click', closeModal);
    }
    
    // Modal schließen bei Klick außerhalb
    window.addEventListener('click', function(event) {
        if (event.target === elements.emailModal) {
            closeModal();
        }
    });
}

// Angebotsvorschau aktualisieren
function updatePreview() {
    const data = getFormData();
    const preis = calculatePrice(data);
    
    // Vorschau-Elemente aktualisieren
    elements.previewKunde.textContent = data.customerName || '-';
    elements.previewGroesse.textContent = data.groesse || '-';
    elements.previewTyp.textContent = data.spiegelTyp || '-';
    elements.previewRand.textContent = data.randbearbeitung || '-';
    elements.previewBohrungen.textContent = data.bohrungen || '-';
    elements.previewLieferzeit.textContent = data.lieferzeit || '-';
    elements.previewPreis.textContent = preis.toFixed(2);
}

// Formulardaten sammeln
function getFormData() {
    return {
        customerName: elements.customerName.value,
        customerEmail: elements.customerEmail.value,
        spiegelBreite: parseFloat(elements.spiegelBreite.value) || 0,
        spiegelHoehe: parseFloat(elements.spiegelHoehe.value) || 0,
        spiegelTyp: elements.spiegelTyp.value,
        randbearbeitung: elements.randbearbeitung.value,
        bohrungen: parseInt(elements.bohrungen.value) || 0,
        lieferzeit: elements.lieferzeit.value,
        groesse: `${elements.spiegelBreite.value || 0} × ${elements.spiegelHoehe.value || 0}`
    };
}

// Preisberechnung
function calculatePrice(data) {
    if (!data.spiegelBreite || !data.spiegelHoehe || !data.spiegelTyp) {
        return 0;
    }
    
    const flaeche = (data.spiegelBreite * data.spiegelHoehe) / 10000; // m²
    const grundpreis = flaeche * PREISE[data.spiegelTyp];
    const randpreis = RANDBEARBEITUNG_PREISE[data.randbearbeitung];
    const bohrpreis = data.bohrungen * BOHRUNG_PREIS;
    const lieferpreis = LIEFERZEIT_AUFZUSCHLAG[data.lieferzeit];
    
    return grundpreis + randpreis + bohrpreis + lieferpreis;
}

// Standard-Nachricht generieren
function generateDefaultMessage() {
    return `Sehr geehrte Damen und Herren,

vielen Dank für Ihr Interesse an unserem Spiegel-Angebot.

Anbei erhalten Sie Ihr persönliches Angebot für Ihren gewünschten Spiegel. Das Angebot ist 30 Tage gültig.

Bei Fragen stehen wir Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen
Ihr Glaserei-Team`;
}

// E-Mail-Vorschau anzeigen
function showEmailPreview() {
    const data = getFormData();
    
    if (!validateForm(data)) {
        return;
    }
    
    // Modal-Inhalt füllen
    elements.modalTo.textContent = data.customerEmail;
    elements.modalSubject.textContent = elements.emailBetreff.value;
    
    // Nachricht mit Angebotsdetails erweitern
    const fullMessage = generateFullMessage(data);
    elements.modalMessage.innerHTML = fullMessage.replace(/\n/g, '<br>');
    
    // Modal öffnen
    elements.emailModal.style.display = 'block';
}

// Vollständige Nachricht generieren
function generateFullMessage(data) {
    const preis = calculatePrice(data);
    const heute = new Date().toLocaleDateString('de-DE');
    
    return `${elements.emailNachricht.value}

---
ANGEBOTSDETAILS:
Kunde: ${data.customerName}
Spiegel: ${data.groesse} cm
Typ: ${data.spiegelTyp}
Randbearbeitung: ${data.randbearbeitung}
Bohrungen: ${data.bohrungen}
Lieferzeit: ${data.lieferzeit}
Gesamtpreis: ${preis.toFixed(2)} €

Angebot erstellt am: ${heute}
Gültig bis: ${getValidUntilDate()}`;
}

// Gültigkeitsdatum berechnen (30 Tage)
function getValidUntilDate() {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toLocaleDateString('de-DE');
}

// Formular validieren
function validateForm(data) {
    const errors = [];
    
    if (!data.customerName) errors.push('Kundenname ist erforderlich');
    if (!data.customerEmail) errors.push('E-Mail-Adresse ist erforderlich');
    if (!data.spiegelBreite || !data.spiegelHoehe) errors.push('Spiegelgröße ist erforderlich');
    if (!data.spiegelTyp) errors.push('Spiegeltyp ist erforderlich');
    if (!data.lieferzeit) errors.push('Lieferzeit ist erforderlich');
    
    if (errors.length > 0) {
        showStatus('Bitte füllen Sie alle erforderlichen Felder aus: ' + errors.join(', '), 'error');
        return false;
    }
    
    return true;
}

// E-Mail senden
function sendEmail() {
    const data = getFormData();
    
    if (!validateForm(data)) {
        return;
    }
    
    showEmailPreview();
}

// E-Mail bestätigen und senden
function confirmAndSendEmail() {
    const data = getFormData();
    const preis = calculatePrice(data);
    
    showStatus('E-Mail wird gesendet...', 'loading');
    
    // EmailJS Template-Parameter
    const templateParams = {
        to_email: data.customerEmail,
        to_name: data.customerName,
        subject: elements.emailBetreff.value,
        message: generateFullMessage(data),
        spiegel_groesse: data.groesse,
        spiegel_typ: data.spiegelTyp,
        randbearbeitung: data.randbearbeitung,
        bohrungen: data.bohrungen,
        lieferzeit: data.lieferzeit,
        gesamtpreis: preis.toFixed(2),
        erstellt_am: new Date().toLocaleDateString('de-DE')
    };
    
    // Debug-Informationen
    console.log('EmailJS Send-Versuch mit:', {
        serviceId: EMAILJS_CONFIG.serviceId,
        templateId: EMAILJS_CONFIG.templateId,
        userId: EMAILJS_CONFIG.userId,
        templateParams: templateParams
    });
    
    // Prüfen ob EmailJS verfügbar ist
    if (typeof emailjs === 'undefined') {
        showStatus('EmailJS ist nicht verfügbar. Bitte laden Sie die Seite neu.', 'error');
        return;
    }
    
    // EmailJS senden mit verbesserter Fehlerbehandlung
    emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            showStatus('E-Mail erfolgreich gesendet! ✅', 'success');
            closeModal();
            resetForm();
        }, function(error) {
            console.error('EmailJS Fehler:', error);
            console.error('Fehler-Details:', {
                status: error.status,
                text: error.text,
                response: error.response
            });
            
            let errorMessage = 'Fehler beim Senden der E-Mail';
            if (error.status === 404) {
                errorMessage = 'EmailJS-Service nicht gefunden. Bitte prüfen Sie die Service-ID.';
            } else if (error.status === 400) {
                errorMessage = 'Ungültige Template-Parameter. Bitte prüfen Sie die Template-ID.';
            } else if (error.text) {
                errorMessage = 'E-Mail-Fehler: ' + error.text;
            }
            
            showStatus(errorMessage, 'error');
        });
}

// Status-Nachricht anzeigen
function showStatus(message, type) {
    elements.emailStatus.textContent = message;
    elements.emailStatus.className = `status-message ${type}`;
    
    if (type === 'success') {
        setTimeout(() => {
            elements.emailStatus.textContent = '';
            elements.emailStatus.className = 'status-message';
        }, 5000);
    }
}

// Modal schließen
function closeModal() {
    elements.emailModal.style.display = 'none';
}

// Formular zurücksetzen
function resetForm() {
    elements.customerName.value = '';
    elements.customerEmail.value = '';
    elements.spiegelBreite.value = '';
    elements.spiegelHoehe.value = '';
    elements.spiegelTyp.value = '';
    elements.randbearbeitung.value = 'Standard';
    elements.bohrungen.value = '0';
    elements.lieferzeit.value = 'Standard';
    elements.emailNachricht.value = generateDefaultMessage();
    
    updatePreview();
}

// Hilfsfunktion für EmailJS-Konfiguration
function configureEmailJS(serviceId, templateId, userId) {
    EMAILJS_CONFIG.serviceId = serviceId;
    EMAILJS_CONFIG.templateId = templateId;
    EMAILJS_CONFIG.userId = userId;
    
    if (typeof emailjs !== 'undefined') {
        emailjs.init(userId);
        console.log('EmailJS neu konfiguriert');
    }
}

// EmailJS-Konfiguration testen
function testEmailJSConfig() {
    console.log('=== EmailJS Konfiguration Test ===');
    console.log('Service ID:', EMAILJS_CONFIG.serviceId);
    console.log('Template ID:', EMAILJS_CONFIG.templateId);
    console.log('User ID:', EMAILJS_CONFIG.userId);
    
    // Test-E-Mail senden
    const testParams = {
        to_email: 'test@example.com',
        to_name: 'Test User',
        subject: 'EmailJS Test',
        message: 'Dies ist ein Test der EmailJS-Konfiguration.',
        spiegel_groesse: '100 × 80 cm',
        spiegel_typ: 'Standard',
        randbearbeitung: 'Standard',
        bohrungen: '0',
        lieferzeit: 'Standard',
        gesamtpreis: '45.00',
        erstellt_am: new Date().toLocaleDateString('de-DE')
    };
    
    console.log('Sende Test-E-Mail...');
    
    emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, testParams)
        .then(function(response) {
            console.log('✅ EmailJS Test erfolgreich!', response);
            showStatus('EmailJS-Konfiguration ist korrekt! ✅', 'success');
        }, function(error) {
            console.error('❌ EmailJS Test fehlgeschlagen:', error);
            console.error('Fehler-Status:', error.status);
            console.error('Fehler-Text:', error.text);
            
            if (error.status === 404) {
                showStatus('❌ Service ID oder Template ID nicht gefunden. Bitte prüfen Sie Ihre EmailJS-Konfiguration.', 'error');
            } else {
                showStatus('❌ EmailJS-Fehler: ' + (error.text || 'Unbekannter Fehler'), 'error');
            }
        });
}

// Export für externe Nutzung
window.SpiegelKonfigurator = {
    configureEmailJS,
    getFormData,
    calculatePrice,
    updatePreview,
    testEmailJSConfig
}; 