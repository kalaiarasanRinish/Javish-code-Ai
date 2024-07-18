const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;
    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    const day = new Date();
    const hour = day.getHours();
    if (hour >= 0 && hour < 12) {
        speak("Good Morning Boss...");
        speak("How Can I Help You kalaiarasan...");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon...");
        speak("How Can I Help You kalaiarasan...");
    } else {
        speak("Good Evening Sir...");
        speak("How Can I Help You kalaiarasan...");
    }

    // Fetch and speak a random fact
    fetchRandomFact();
}

async function fetchRandomFact() {
    const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
    const data = await response.json();
    speak("Here's a fun fact: " + data.text);
}

window.addEventListener('load', () => {
    speak("Initializing JARVIS...");
    wishMe();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};

btn.addEventListener('click', () => {
    content.textContent = "Listening...";
    recognition.start();
});

function takeCommand(message) {
    if (message.includes('hey') || message.includes('hello')) {
        speak(helpText);
    } else if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...");
    } else if (message.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        speak("Opening YouTube...");
    } else if (message.includes("open facebook")) {
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook...");
    } else if (message.includes("open mail")) {
        window.open("https://mail.google.com/mail/u/0/#inbox", "_blank");
        speak("Opening Mail...");
    } else if (message.includes("open chat gpt")) {
        window.open("https://chat.openai.com/", "_blank");
        speak("Opening ChatGPT...");
    } else if (message.includes("open whatsapp")) {
        window.open("https://web.whatsapp.com/", "_blank");
        speak("Opening WhatsApp...");
    } else if (message.includes("weather")) {
        getWeather();
    } else if (message.includes("news")) {
        getNews();
    } else if (message.includes('set reminder')) {
        setReminder(message);
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        const finalText = "This is what I found on the internet regarding " + message;
        speak(finalText);
    } else if (message.includes('wikipedia')) {
        window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "")}`, "_blank");
        const finalText = "This is what I found on Wikipedia regarding " + message;
        speak(finalText);
    } else if (message.includes('time')) {
        const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        const finalText = "The time is " + time;
        speak(finalText);
    } else if (message.includes('date')) {
        const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
        const finalText = "Today's date is " + date;
        speak(finalText);
    } else if (message.includes('calculator')) {
        window.open('Calculator:///');
        const finalText = "Opening Calculator";
        speak(finalText);
    } else {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        const finalText = "I found some information for " + message + " on Google";
        speak(finalText);
    }
}

async function getWeather() {
    const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
    const city = 'hosur';
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    const weather = `The current weather in ${city} is ${data.weather[0].description} with a temperature of ${data.main.temp} degrees Celsius.`;
    speak(weather);
}

async function getNews() {
    const apiKey = 'YOUR_NEWSAPI_KEY';
    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
    const data = await response.json();
    const articles = data.articles.slice(0, 5);
    const news = articles.map((article, index) => `News ${index + 1}: ${article.title}`).join('. ');
    speak("Here are the top 5 news headlines: " + news);
}

function setReminder(message) {
    const reminderText = message.replace("set reminder", "").trim();
    const reminderTime = prompt("Please enter the time for the reminder (HH:MM):");
    const now = new Date();
    const reminderDateTime = new Date(now.toDateString() + ' ' + reminderTime);
    const timeDifference = reminderDateTime - now;

    if (timeDifference > 0) {
        setTimeout(() => {
            speak(`Reminder: ${reminderText}`);
        }, timeDifference);
        speak(`Reminder set for ${reminderTime}.`);
    } else {
        speak("Invalid time for reminder.");
    }
}