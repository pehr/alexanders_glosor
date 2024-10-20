let words = [];

function loadWords() {
    const webAppUrl = 'https://script.google.com/macros/s/AKfycbwt0TJ9kh7DHml9H4Epd-dWwu4Z23eRVxjEggK8WHftZX2QYBn6MwubbwXgWrXBlTps/exec';
    const script = document.createElement('script');
    script.src = `${webAppUrl}?callback=handleWords`;
    script.onerror = function() {
        console.error("Error loading words from the server.");
    };
    document.body.appendChild(script);
}

function handleWords(data) {
    if (data.error) {
        console.error("Error loading words:", data.error);
        return;
    }
    words = data;
    console.log("Words loaded:", words);
    if (words.length > 0) {
        resetTest();
        nextWord();
    } else {
        console.warn("No words were loaded. Check your Google Sheet.");
    }
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

document.addEventListener('DOMContentLoaded', loadWords);
