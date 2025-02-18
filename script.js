async function conjugateVerb() {
    const verb = document.getElementById('verb').value.trim().toLowerCase();
    const resultsDiv = document.getElementById('results');
    const mainElement = document.querySelector('main');
    resultsDiv.innerHTML = '';

    if (!verb) {
        resultsDiv.innerHTML = '<p>Please enter a verb.</p>';
        return;
    }

    const irregularVerbs = {
        ser: ['Soy', 'Eres', 'Es', 'Somos', 'Sois', 'Son'],
        tener: ['Tengo', 'Tienes', 'Tiene', 'Tenemos', 'Tenéis', 'Tienen'],
        estar: ['Estoy', 'Estás', 'Está', 'Estamos', 'Estáis', 'Están']
    };

    if (irregularVerbs[verb]) {
        displayConjugation('Present Tense', irregularVerbs[verb]);
        mainElement.classList.add('active');
        return;
    }

    const verbEnding = verb.slice(-2);
    const stem = verb.slice(0, -2);

    if (!['ar', 'er', 'ir'].includes(verbEnding)) {
        resultsDiv.innerHTML = '<p>Invalid verb. Please enter a regular verb ending in -ar, -er, or -ir.</p>';
        return;
    }

    const conjugations = {
        ar: [`${stem}o`, `${stem}as`, `${stem}a`, `${stem}amos`, `${stem}áis`, `${stem}an`],
        er: [`${stem}o`, `${stem}es`, `${stem}e`, `${stem}emos`, `${stem}éis`, `${stem}en`],
        ir: [`${stem}o`, `${stem}es`, `${stem}e`, `${stem}imos`, `${stem}ís`, `${stem}en`]
    };

    displayConjugation('Present Tense', conjugations[verbEnding]);
    mainElement.classList.add('active');
}

async function displayConjugation(tense, forms) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const tenseDiv = document.createElement('div');
    tenseDiv.classList.add('tense');

    const tenseTitle = document.createElement('h3');
    tenseTitle.textContent = tense;
    tenseDiv.appendChild(tenseTitle);

    const formsList = document.createElement('ul');
    const pronouns = ['Yo', 'Tú', 'Él/Ella/Usted', 'Nosotros/as', 'Vosotros/as', 'Ellos/Ellas/Ustedes'];

    for (let i = 0; i < forms.length; i++) {
        const fullSentence = `${pronouns[i]} ${forms[i]}`;
        const translatedText = await translateToEnglish(fullSentence);

        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${pronouns[i]}</strong>: ${forms[i]} (${translatedText})`;

        // Updated speaker button to speak the full sentence
        const speakerButton = document.createElement('button');
        speakerButton.innerHTML = '<i class="fas fa-volume-up"></i>';
        speakerButton.classList.add('speaker-btn');
        speakerButton.addEventListener('click', () => speak(fullSentence)); // Changed to speak fullSentence

        listItem.appendChild(speakerButton);
        formsList.appendChild(listItem);
    }

    tenseDiv.appendChild(formsList);
    resultsDiv.appendChild(tenseDiv);
}

async function translateToEnglish(text) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|en`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.responseData.translatedText;
    } catch (error) {
        console.error('Translation API Error:', error);
        return text;
    }
}

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES'; 
    utterance.rate = 0.8; 
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    window.speechSynthesis.speak(utterance);
}
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.custom-cursor');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Add hover effect for clickable elements
    const clickables = document.querySelectorAll('a, button');
    clickables.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
});
