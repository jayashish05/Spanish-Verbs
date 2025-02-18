function conjugateVerb() {
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
        return;
    }

    const verbEnding = verb.slice(-2);
    const stem = verb.slice(0, -2);

    if (verbEnding !== 'ar' && verbEnding !== 'er' && verbEnding !== 'ir') {
        resultsDiv.innerHTML = '<p>Invalid verb. Please enter a regular verb ending in -ar, -er, or -ir.</p>';
        return;
    }

    const conjugations = {
        ar: [`${stem}o`, `${stem}as`, `${stem}a`, `${stem}amos`, `${stem}áis`, `${stem}an`],
        er: [`${stem}o`, `${stem}es`, `${stem}e`, `${stem}emos`, `${stem}éis`, `${stem}en`],
        ir: [`${stem}o`, `${stem}es`, `${stem}e`, `${stem}imos`, `${stem}ís`, `${stem}en`]
    };

    displayConjugation('Present Tense', conjugations[verbEnding]);

    // Add the active class to trigger the animation
    mainElement.classList.add('active');
}

function displayConjugation(tense, forms) {
    const resultsDiv = document.getElementById('results');
    const tenseDiv = document.createElement('div');
    tenseDiv.classList.add('tense');

    const tenseTitle = document.createElement('h3');
    tenseTitle.textContent = tense;
    tenseDiv.appendChild(tenseTitle);

    const formsList = document.createElement('ul');
    const pronouns = ['Yo', 'Tú', 'Él/Ella/Usted', 'Nosotros/as', 'Vosotros/as', 'Ellos/Ellas/Ustedes'];
    forms.forEach((form, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${pronouns[index]}: ${form}`;
        formsList.appendChild(listItem);
    });

    tenseDiv.appendChild(formsList);
    resultsDiv.appendChild(tenseDiv);
}