async function conjugateVerb() {
    const verb = document.getElementById('verb').value.trim().toLowerCase();
    const resultsDiv = document.getElementById('results');
    const mainElement = document.querySelector('main');
    
    // Clear previous results
    resultsDiv.innerHTML = '';
    
    if (!verb) {
        resultsDiv.innerHTML = '<p>Please enter a verb.</p>';
        return;
    }
    
    // Show Lottie animation loading
    showLottieLoading(resultsDiv);
    
    // Make sure results div is visible while loading
    resultsDiv.style.display = 'block';
    mainElement.classList.add('active');
    
    // Irregular verbs data
    const irregularVerbs = {
        ser: ['Soy', 'Eres', 'Es', 'Somos', 'Sois', 'Son'],
        tener: ['Tengo', 'Tienes', 'Tiene', 'Tenemos', 'Tenéis', 'Tienen'],
        estar: ['Estoy', 'Estás', 'Está', 'Estamos', 'Estáis', 'Están']
    };

    // Simulate a slight delay to show loading animation (can be removed in production)
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (irregularVerbs[verb]) {
        // Clear animation and display conjugation
        resultsDiv.innerHTML = '';
        await displayConjugation('Present Tense', irregularVerbs[verb]);
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

    // Clear animation and display conjugation
    resultsDiv.innerHTML = '';
    await displayConjugation('Present Tense', conjugations[verbEnding]);
}

// Function to show Lottie loading animation
function showLottieLoading(container) {
    const lottieHTML = `
        <div class="spinner-container">
            <lottie-player
                src="loading.json"
                background="transparent"
                speed="1"
                style="width: 150px; height: 150px;"
                loop
                autoplay
            ></lottie-player>
        </div>
    `;
    container.innerHTML = lottieHTML;
}

async function displayConjugation(tense, forms) {
    const resultsDiv = document.getElementById('results');
    
    const tenseDiv = document.createElement('div');
    tenseDiv.classList.add('tense');

    const tenseTitle = document.createElement('h3');
    tenseTitle.textContent = tense;
    tenseDiv.appendChild(tenseTitle);

    // Create a div for the loading animation during translation
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('loading-translations');
    loadingDiv.innerHTML = `
        <div class="translations-loading-container">
            <p>Loading translations...</p>
            <lottie-player
                src="loading.json"
                background="transparent"
                speed="1"
                style="width: 100px; height: 100px;"
                loop
                autoplay
            ></lottie-player>
        </div>
    `;
    tenseDiv.appendChild(loadingDiv);
    
    resultsDiv.appendChild(tenseDiv);

    // Create an array to hold all the translation promises
    const translationPromises = [];
    const formsList = document.createElement('ul');
    const pronouns = ['Yo', 'Tú', 'Él/Ella/Usted', 'Nosotros/as', 'Vosotros/as', 'Ellos/Ellas/Ustedes'];

    // Prepare all translations
    for (let i = 0; i < forms.length; i++) {
        const fullSentence = `${pronouns[i]} ${forms[i]}`;
        translationPromises.push(translateToEnglish(fullSentence));
    }

    // Wait for all translations to complete
    const translations = await Promise.all(translationPromises);

    // Now create list items with the translations
    for (let i = 0; i < forms.length; i++) {
        const fullSentence = `${pronouns[i]} ${forms[i]}`;
        const translatedText = translations[i];

        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${pronouns[i]}</strong>: ${forms[i]} (${translatedText})`;

        // Updated speaker button to speak the full sentence
        const speakerButton = document.createElement('button');
        speakerButton.innerHTML = '<i class="fas fa-volume-up"></i>';
        speakerButton.classList.add('speaker-btn');
        speakerButton.addEventListener('click', () => speak(fullSentence));

        listItem.appendChild(speakerButton);
        formsList.appendChild(listItem);
    }

    // Remove the loading animation and add the completed list
    tenseDiv.removeChild(loadingDiv);
    tenseDiv.appendChild(formsList);
}

async function translateToEnglish(text) {
    const API_KEY = 'AIzaSyD8NGfEDxyZ3eLJ56ZW4HWPajM7TvgGH1c';
    const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: text,
                source: 'es',
                target: 'en',
                format: 'text'
            })
        });

        const data = await response.json();
        
        if (data.data && data.data.translations && data.data.translations[0]) {
            return data.data.translations[0].translatedText;
        }

        throw new Error('Translation failed');

    } catch (error) {
        console.error('Google Translation Error:', error);
        
        // Fallback to backup translation if Google Cloud fails
        try {
            const backupUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=en&dt=t&q=${encodeURIComponent(text)}`;
            const backupResponse = await fetch(backupUrl);
            const backupData = await backupResponse.json();
            
            if (backupData && backupData[0] && backupData[0][0]) {
                return backupData[0][0][0];
            }
        } catch (fallbackError) {
            console.error('Fallback Translation Error:', fallbackError);
        }
        
        return text; // Return original text if all attempts fail
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
