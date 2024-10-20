let words = [];

function loadWords() {
    const sheetId = '2PACX-1vRgJqtsCyz_pbWODZjloPSE7F6HRMaRvVdvK8TpRM5fDSnza5xmeBuUzZxPNoKEAkMRDx7_hCrHWQ1R';
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;

    fetch(sheetUrl)
        .then(response => response.text())
        .then(data => {
            words = data.split('\n').map(line => {
                const [swedish, spanish] = line.split(',');
                return { swedish: swedish.trim(), spanish: spanish.trim() };
            });
            console.log("Words loaded:", words);
            resetTest();
            nextWord();
        })
        .catch(error => {
            console.error("Error loading words:", error);
        });
}

function resetTest() {
    currentWord = 0;
    correctCount = 0;
    wrongCount = 0;
    document.getElementById('correct').textContent = '0';
    document.getElementById('wrong').textContent = '0';
    document.getElementById('answeredWords').innerHTML = '';
    document.getElementById('userInput').style.display = 'inline-block';
    document.getElementById('submitBtn').style.display = 'inline-block';
    document.getElementById('restartBtn').style.display = 'none';
}

function nextWord() {
    console.log("Current word index:", currentWord);
    if (currentWord < 10) {
        const wordIndex = Math.floor(Math.random() * words.length);
        const word = words[wordIndex];
        const isSwedish = Math.random() < 0.5;

        console.log("Selected word:", word);
        console.log("Is Swedish:", isSwedish);

        const promptLanguage = isSwedish ? 'Svenska' : 'Español';
        const targetLanguage = isSwedish ? 'Español' : 'Svenska';
        const promptWord = isSwedish ? word.swedish : word.spanish;

        console.log("Prompt word:", promptWord);

        const wordPromptElement = document.getElementById('wordPrompt');
        wordPromptElement.innerHTML = `
            <p>Översätt från ${promptLanguage} till ${targetLanguage}:</p>
            <p class="word-to-translate">${promptWord}</p>
        `;
        wordPromptElement.dataset.answer = isSwedish ? word.spanish : word.swedish;
        wordPromptElement.dataset.question = promptWord;
        document.getElementById('userInput').value = '';
        document.getElementById('feedback').textContent = '';
        document.getElementById('currentWord').textContent = currentWord + 1;

        console.log("Word prompt updated:", wordPromptElement.innerHTML);
    } else {
        finishTest();
    }
}

function finishTest() {
    document.getElementById('wordPrompt').textContent = 'Övningen är klar!';
    document.getElementById('userInput').style.display = 'none';
    document.getElementById('submitBtn').style.display = 'none';
    document.getElementById('restartBtn').style.display = 'inline-block';
}

function checkAnswer() {
    const userInput = document.getElementById('userInput').value.trim().toLowerCase();
    const correctAnswer = document.getElementById('wordPrompt').dataset.answer.toLowerCase();
    const question = document.getElementById('wordPrompt').dataset.question;

    if (userInput === correctAnswer) {
        document.getElementById('feedback').textContent = 'Rätt!';
        document.getElementById('feedback').style.color = 'green';
        correctCount++;
        addAnsweredWord(question, userInput, true);
    } else {
        document.getElementById('feedback').textContent = `Fel. Rätt svar är: ${correctAnswer}`;
        document.getElementById('feedback').style.color = 'red';
        wrongCount++;
        addAnsweredWord(question, userInput, false);
    }

    document.getElementById('correct').textContent = correctCount;
    document.getElementById('wrong').textContent = wrongCount;

    currentWord++;
    setTimeout(nextWord, 1500);
}

function addAnsweredWord(question, answer, isCorrect) {
    const answeredWords = document.getElementById('answeredWords');
    const li = document.createElement('li');
    li.innerHTML = `${question} <span class="user-answer">${answer}</span>`;
    li.classList.add(isCorrect ? 'correct' : 'incorrect');
    answeredWords.appendChild(li);
}

function checkRequiredElements() {
    const requiredElements = [
        'wordPrompt', 'userInput', 'submitBtn', 'restartBtn', 'feedback',
        'correct', 'wrong', 'currentWord', 'answeredWords'
    ];

    requiredElements.forEach(elementId => {
        if (!document.getElementById(elementId)) {
            console.error(`Required element with id "${elementId}" is missing from the HTML`);
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.getElementById('submitBtn');
    const userInput = document.getElementById('userInput');
    const restartBtn = document.getElementById('restartBtn');

    if (submitBtn) {
        submitBtn.addEventListener('click', checkAnswer);
    } else {
        console.error("Submit button not found in the HTML");
    }

    if (userInput) {
        userInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                checkAnswer();
            }
        });
    } else {
        console.error("User input field not found in the HTML");
    }

    if (restartBtn) {
        restartBtn.addEventListener('click', loadWords);
    } else {
        console.error("Restart button not found in the HTML");
    }

    loadWords();
});
