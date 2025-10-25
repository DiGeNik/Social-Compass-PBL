// --- КОНСТАНТИ ---
        
// Секция I: Мотота
const MOTTOES = [
    "Спазвай дисциплина",
    "По-приятно с човек до теб",
    "Човек с човек",
    "Трудът спасява",
    "Винаги има как"
];

// Секция II: STEM Данни
// ВАЖНО: Настроено е на 3 минути за лесно тестване. 
// За финална версия, променете на 40: const CRUSOE_ALARM_THRESHOLD_MINUTES = 40;
const CRUSOE_ALARM_THRESHOLD_MINUTES = 40; 
const CORTISOL_CORRECTION = -15; // Корекция на кортизол (-15)
const ENDORPHIN_CORRECTION = 20; // Корекция на ендорфини (+20)

// Секция III: ФВС Мисии
const FVS_MISSIONS = [
    "Скачане на въже (на място): Направи 50 повдигания на пръсти, имитирайки скачане на въже.",
    "Клякания (Режим): Направи 20 клякания с изпънати ръце, спазвайки режим.",
    "Кръгови движения (Издръжливост): Седни изправен и направи 10 кръгови движения с главата и направи 10 кръгови движения с раменете.",
    "Гребане: Седни изправен и направи 20 повдигания на коленете към гърдите, имитирайки гребане."
];

// Секция IV: Етичен филтър (Казус Адам Рейн)
const ETHICAL_QUESTIONS = [
    "Предпочитате ли да си говорите с AI вместо с жив човек?",
    "Пропускате ли хранене заради това, че не ви се става от компютъра?",
    "Намирате ли утеха в дигиталния свят, когато сте тъжни или самотни?"
];

// Кризисни контакти
const CRISIS_CONTACTS = [
    { name: "Национална телефонна линия за деца", number: "116 111", icon: "fas fa-phone-volume", color: "text-red-500" },
    { name: "Български Червен кръст", number: "02 816 4040", icon: "fas fa-hand-holding-heart", color: "text-red-600" }
];

// --- DOM елементи и Състояние на приложението ---

const timerDisplay = document.getElementById('timer-display');
const timerCard = document.getElementById('timer-card');
const alarmStatus = document.getElementById('alarm-status');
const mottoDisplay = document.getElementById('motto-display');
const cortisolValue = document.getElementById('cortisol-value');
const endorphinValue = document.getElementById('endorphin-value');
const messageArea = document.getElementById('message-area');

// Модални прозорци и бутони
const fvsModal = document.getElementById('fvs-mission-modal');
const ethicalFilterModal = document.getElementById('ethical-filter-modal');
const crisisContactsModal = document.getElementById('crisis-contacts-modal');

const completeMissionBtn = document.getElementById('complete-mission-btn');
const refuseMissionBtn = document.getElementById('refuse-mission-btn');
const ethicalForm = document.getElementById('ethical-form');
const submitEthicalBtn = document.getElementById('submit-ethical-btn');
const resetAppBtn = document.getElementById('reset-app-btn');

// Състояние
let timerInterval = null;
let secondsElapsed = 0;
let isAlarmLocked = false;
let cortisol = 100;
let endorphin = 100;
let mottoIndex = 0;

// --- ПОМОЩНИ ФУНКЦИИ ---

function getAlarmSeconds() {
    // Изчислява прага в секунди
    return CRUSOE_ALARM_THRESHOLD_MINUTES * 60;
}

function showMessage(msg, color = 'bg-blue-100 text-blue-800') {
    // Показва временно съобщение на екрана
    messageArea.className = `min-h-[50px] p-3 rounded-xl font-medium ${color}`;
    messageArea.textContent = msg;
    messageArea.style.display = 'block';
    setTimeout(() => {
        messageArea.style.display = 'none';
    }, 5000);
}

function updateHormonesUI() {
    // Актуализира визуалното представяне на хормоналните метрики
    cortisolValue.textContent = cortisol;
    endorphinValue.textContent = endorphin;

    // Смяна на цвета на границата според стойностите
    cortisolValue.parentElement.parentElement.classList.toggle('border-red-500', cortisol > 80);
    cortisolValue.parentElement.parentElement.classList.toggle('border-green-500', cortisol <= 80);

    endorphinValue.parentElement.parentElement.classList.toggle('border-yellow-500', endorphin > 80);
    endorphinValue.parentElement.parentElement.classList.toggle('border-gray-400', endorphin <= 80);
}

function toggleModal(modal, show) {
    // Показва или скрива модален прозорец
    modal.classList.toggle('hidden', !show);
    document.body.style.overflow = show ? 'hidden' : 'auto';
}

function formatTime(totalSeconds) {
    // Форматира секундите в HH:MM:SS
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const s = String(totalSeconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
}

// --- ЛОГИКА НА ТАЙМЕРА ---

function tick() {
    // Функция, която се изпълнява всяка секунда
    if (isAlarmLocked) return;

    secondsElapsed++;
    timerDisplay.textContent = formatTime(secondsElapsed);

    // КЛЮЧОВА ПРОВЕРКА: Заключване, ако е достигнат прагът
    if (secondsElapsed >= getAlarmSeconds()) {
        lockAlarm();
    }
}

function lockAlarm() {
    // Заключва таймера и стартира ФВС Мисия
    clearInterval(timerInterval);
    timerInterval = null;
    isAlarmLocked = true;
    timerCard.classList.add('alarm-locked');
    timerCard.classList.remove('timer-active');
    alarmStatus.textContent = 'КРУЗО АЛАРМ: Време е за ФВС Мисия!';

    // Избира случайна мисия и я показва в модала
    const missionIndex = Math.floor(Math.random() * FVS_MISSIONS.length);
    document.getElementById('current-mission').textContent = FVS_MISSIONS[missionIndex];
    toggleModal(fvsModal, true);
}

function resetTimer(reason) {
    // Нулира таймера и стартира броенето отново
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    secondsElapsed = 0;
    isAlarmLocked = false;
    timerDisplay.textContent = '00:00:00';
    timerCard.classList.remove('alarm-locked');
    timerCard.classList.add('timer-active');
    alarmStatus.textContent = 'Таймерът отброява...';
    startTimer();
    
    // Затваря всички модални прозорци
    toggleModal(fvsModal, false);
    toggleModal(ethicalFilterModal, false);
    toggleModal(crisisContactsModal, false);

    if (reason) {
        showMessage(reason, 'bg-green-100 text-green-800');
    }
}

function startTimer() {
    // Стартира интервала на таймера
    if (timerInterval === null) {
         timerInterval = setInterval(tick, 1000);
    }
}

// --- ЛОГИКА НА ФВС МИСИИ ---

completeMissionBtn.addEventListener('click', () => {
    // Изпълнена мисия
    cortisol += CORTISOL_CORRECTION;
    endorphin += ENDORPHIN_CORRECTION;
    updateHormonesUI();

    resetTimer(`Успех! Кортизолът е намален с ${-CORTISOL_CORRECTION}, а Ендорфините са увеличени с ${ENDORPHIN_CORRECTION}. Трудът спасява!`);
});

refuseMissionBtn.addEventListener('click', () => {
    // Отказана мисия -> Преминаване към Етичен филтър
    toggleModal(fvsModal, false);
    buildEthicalFilter();
    toggleModal(ethicalFilterModal, true);
});

// --- ЕТИЧЕН ФИЛТЪР / КРИЗИСНИ КОНТАКТИ ---

function buildEthicalFilter() {
    // Динамично изгражда формата с въпроси
    ethicalForm.innerHTML = '';
    ETHICAL_QUESTIONS.forEach((question, index) => {
        const qId = `q${index}`;
        ethicalForm.innerHTML += `
            <div class="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm">
                <label for="${qId}" class="text-gray-700 font-medium text-sm md:text-base flex-1 mr-4">${index + 1}. ${question}</label>
                <div class="flex space-x-4">
                    <label class="inline-flex items-center">
                        <input type="radio" name="${qId}" value="yes" class="form-radio text-red-600 h-5 w-5" required>
                        <span class="ml-2 text-red-600 font-bold">Да</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input type="radio" name="${qId}" value="no" class="form-radio text-green-600 h-5 w-5" required>
                        <span class="ml-2 text-green-600 font-bold">Не</span>
                    </label>
                </div>
            </div>
        `;
    });
}

submitEthicalBtn.addEventListener('click', (e) => {
    // Обработва отговорите от Етичния филтър
    let yesCount = 0;
    const answers = new FormData(ethicalForm);

    let isFormValid = true;
    ETHICAL_QUESTIONS.forEach((_, index) => {
        if (!answers.get(`q${index}`)) {
            isFormValid = false;
        }
    });

    if (!isFormValid) {
        showMessage('Моля, отговорете на всички въпроси от Етичния филтър.', 'bg-red-100 text-red-800');
        return;
    }

    ETHICAL_QUESTIONS.forEach((_, index) => {
        if (answers.get(`q${index}`) === 'yes') {
            yesCount++;
        }
    });

    if (yesCount >= 2) {
        // Висок риск (Пътят на Адам Рейн)
        toggleModal(ethicalFilterModal, false);
        buildCrisisContacts();
        toggleModal(crisisContactsModal, true);
    } else {
        // Нисък риск
        resetTimer('Внимание! Отказахте ФВС мисията, но рискът ви е нисък. Продължавайте с режим!');
    }
});

function buildCrisisContacts() {
    // Генерира списъка с контакти за криза
    const contactsList = document.getElementById('contacts-list');
    contactsList.innerHTML = '';

    CRISIS_CONTACTS.forEach(contact => {
        contactsList.innerHTML += `
            <a href="tel:${contact.number.replace(/\s/g, '')}" class="flex items-center p-4 bg-white rounded-xl border-2 border-red-500 shadow-md hover:shadow-lg transition duration-200">
                <i class="${contact.icon} ${contact.color} text-2xl mr-4"></i>
                <div>
                    <p class="font-bold text-gray-800">${contact.name}</p>
                    <p class="text-lg font-mono text-red-600">${contact.number}</p>
                </div>
            </a>
        `;
    });
}

resetAppBtn.addEventListener('click', () => {
    // Нулира хормоните и рестартира таймера
    cortisol = 100;
    endorphin = 100;
    updateHormonesUI();
    resetTimer('Компасът е рестартиран. Започнете да наваксвате с физическа активност!');
});

// --- РОТИРАЩИ МОТОТА ---

function rotateMotto() {
    // Анимирано сменя мотото
    mottoDisplay.style.opacity = 0;
    setTimeout(() => {
        mottoDisplay.querySelector('h2').textContent = MOTTOES[mottoIndex];
        mottoDisplay.style.opacity = 1;
        mottoIndex = (mottoIndex + 1) % MOTTOES.length;
    }, 700);
}

// --- ИНИЦИАЛИЗАЦИЯ И РЕГИСТРАЦИЯ НА SERVICE WORKER ---

function registerServiceWorker() {
    // Проверява дали браузърът поддържа Service Workers
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js')
                .then(registration => {
                    console.log('Service Worker регистриран успешно:', registration.scope);
                    showMessage('PWA готово за офлайн работа.', 'bg-blue-100 text-blue-800');
                })
                .catch(error => {
                    console.error('Регистрацията на Service Worker не бе успешна:', error);
                    showMessage('Грешка при подготовката за офлайн режим.', 'bg-red-100 text-red-800');
                });
        });
    } else {
        console.warn('Вашият браузър не поддържа Service Workers.');
    }
}


function init() {
    // Стартира приложението
    updateHormonesUI();
    startTimer();
    rotateMotto();
    setInterval(rotateMotto, 8000); // Сменя мотото на всеки 8 секунди
    
    // Нова стъпка: Регистриране на Service Worker
    registerServiceWorker(); 
}
