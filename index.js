import { getContext } from "../../../extensions.js";
import { eventSource, event_types } from "../../../../script.js";

const extensionName = "Weather Effects Public Fix";

// Пути изменены! Файлы должны лежать строго внутри папки 'public' в корне Таверны.
// Таверна отдает файлы из public, если указать прямой путь.
const EFFECTS = {
    "sunny": {
        url: 'sunny.gif', // Теперь браузер будет искать их относительно текущего адреса
        opacity: '0.15',
        triggers: ["солнышко", "солнце", "ясно", "светло", "день"]
    },
    "room": {
        url: 'room.gif',
        opacity: '0.2',
        triggers: ["комната", "дом", "спальня", "внутри", "помещение"]
    },
    "rain": {
        url: 'rain.gif',
        opacity: '0.15',
        triggers: ["дождь", "ливень", "гроза", "осадки", "капли"]
    },
    "nightorspace": {
        url: 'nightorspace.gif',
        opacity: '0.2',
        triggers: ["космос", "космосс", "ночь", "звезды", "темнота", "мрак"]
    },
    "fog": {
        url: 'fog.gif',
        opacity: '0.15',
        triggers: ["туман", "дымка", "мгла", "пасмурно", "смог"]
    },
    "dystopia": {
        url: 'dystopia.gif',
        opacity: '0.2',
        triggers: ["антиутопия", "киберпанк", "неон", "город", "грязь"]
    }
};

let currentOverlay = null;
let currentEffectKey = null;
let messageCount = 0;

async function initialize() {
    console.log(`${extensionName} initialized`);
    alert("Код загрузился! ПЕРЕЛОЖИ ГИФКИ В ПАПКУ public!");

    eventSource.on(event_types.USER_MESSAGE_RENDERED, (messageId) => {
        const context = getContext();
        const chat = context.chat;
        if (!chat || chat.length === 0) return;

        const lastMessageObj = chat[chat.length - 1];
        if (!lastMessageObj.is_user) return;

        const lastMessageText = lastMessageObj.mes.toLowerCase();

        if (currentOverlay) {
            messageCount++;
            if (messageCount >= 3) {
                stopEffect();
                return;
            }
        }

        let effectFound = false;
        for (const [effectKey, effectData] of Object.entries(EFFECTS)) {
            const hasTrigger = effectData.triggers.some(trigger => lastMessageText.includes(trigger));

            if (hasTrigger) {
                if (currentEffectKey !== effectKey) {
                    startEffect(effectKey, effectData);
                }
                effectFound = true;
                break;
            }
        }
    });
}

function startEffect(effectKey, effectData) {
    stopEffect();
    currentEffectKey = effectKey;
    messageCount = 0;

    currentOverlay = document.createElement('div');
    currentOverlay.id = 'weather-local-overlay';
    currentOverlay.style.position = 'fixed';
    currentOverlay.style.top = '0';
    currentOverlay.style.left = '0';
    currentOverlay.style.width = '100vw';
    currentOverlay.style.height = '100vh';
    currentOverlay.style.pointerEvents = 'none';
    currentOverlay.style.zIndex = '2147483646';
    currentOverlay.style.backgroundImage = `url('${effectData.url}')`;
    currentOverlay.style.backgroundSize = 'cover';
    currentOverlay.style.backgroundPosition = 'center';
    currentOverlay.style.opacity = effectData.opacity;
    document.body.appendChild(currentOverlay);
}

function stopEffect() {
    if (currentOverlay) {
        currentOverlay.remove();
        currentOverlay = null;
        currentEffectKey = null;
    }
    messageCount = 0;
}

jQuery(async () => {
    await initialize();
});
