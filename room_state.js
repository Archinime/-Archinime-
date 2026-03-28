import { defaultInventoryConfig } from './inventory-data.js';

export const State = {
    playerCoins: parseInt(localStorage.getItem('room_coins')) || 1000,
    inventoryData: JSON.parse(localStorage.getItem('room_inventory')) || defaultInventoryConfig,
    gameSettings: null,
    lightOn: localStorage.getItem('lightState') !== 'off',
    isRoomStarted: false,
    saveGame() {
        localStorage.setItem('room_coins', this.playerCoins);
        localStorage.setItem('room_inventory', JSON.stringify(this.inventoryData));
        const coinAmount = document.getElementById('coin-amount');
        if (coinAmount) coinAmount.innerText = this.playerCoins;
    }
};

if (State.inventoryData.base_foco) delete State.inventoryData.base_foco;
for (let cat in defaultInventoryConfig) {
    if(!State.inventoryData[cat]) State.inventoryData[cat] = defaultInventoryConfig[cat];
    State.inventoryData[cat].emoji = defaultInventoryConfig[cat].emoji;
    State.inventoryData[cat].label = defaultInventoryConfig[cat].label;
    State.inventoryData[cat].type = defaultInventoryConfig[cat].type || 'single';
    if (State.inventoryData[cat].type === 'multiple') {
        if (!Array.isArray(State.inventoryData[cat].equipped)) State.inventoryData[cat].equipped = defaultInventoryConfig[cat].equipped;
    } else {
        if (!State.inventoryData[cat].items[State.inventoryData[cat].equipped]) State.inventoryData[cat].equipped = defaultInventoryConfig[cat].equipped;
    }
    for(let item in defaultInventoryConfig[cat].items) {
        if(!State.inventoryData[cat].items[item]) State.inventoryData[cat].items[item] = defaultInventoryConfig[cat].items[item];
        else {
            State.inventoryData[cat].items[item].file = defaultInventoryConfig[cat].items[item].file;
            State.inventoryData[cat].items[item].name = defaultInventoryConfig[cat].items[item].name;
            if(defaultInventoryConfig[cat].items[item].baseFile) State.inventoryData[cat].items[item].baseFile = defaultInventoryConfig[cat].items[item].baseFile;
            if(defaultInventoryConfig[cat].items[item].preview) State.inventoryData[cat].items[item].preview = defaultInventoryConfig[cat].items[item].preview;
        }
    }
}

const ua = navigator.userAgent;
export const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
const deviceMemory = navigator.deviceMemory || 4;
const cpuCores = navigator.hardwareConcurrency || 4;
let baseTier = 'alta';
if (isMobileUA || deviceMemory <= 4 || cpuCores <= 4) baseTier = 'media';
if (isMobileUA && (deviceMemory <= 2 || cpuCores <= 2)) baseTier = 'baja';

State.gameSettings = JSON.parse(localStorage.getItem('ff_settings')) || {
    calidad: baseTier, 
    sombras: baseTier === 'baja' ? 0 : (baseTier === 'media' ? 1 : 2),
    fps: baseTier === 'baja' ? 30 : 60,
    volumenTV: 50,
    volumenEfectos: 50,
    volumenPC: 50,
    mostrarFps: false,
    mostrarMonedas: false // NUEVA CONFIGURACIÓN: Oculto por defecto
};

// Conversión y seguridad de datos
if(State.gameSettings.mostrarMonedas === undefined) State.gameSettings.mostrarMonedas = false;
if(State.gameSettings.volumen) { 
    State.gameSettings.volumenTV = State.gameSettings.volumen; 
    State.gameSettings.volumenEfectos = State.gameSettings.volumen; 
    delete State.gameSettings.volumen;
}
if(State.gameSettings.volumenPC === undefined) State.gameSettings.volumenPC = 50;

export function checkDailyReward() {
    let lastLogin = localStorage.getItem('room_last_login');
    let today = new Date().toDateString();
    if (lastLogin !== today) {
        State.playerCoins += 100;
        localStorage.setItem('room_last_login', today);
        const toast = document.getElementById('daily-reward-toast');
        if (toast) {
            toast.style.display = 'block';
            setTimeout(() => { toast.style.display = 'none'; }, 4000);
        }
    }
    const coinAmt = document.getElementById('coin-amount');
    if (coinAmt) coinAmt.innerText = State.playerCoins;
}

export function getFreshUrl(url) {
    if (!url) return url;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}nocache=${Date.now()}`;
}

export function disposeThreeJSObject(node) {
    if (!node) return;
    if (node.geometry) node.geometry.dispose();
    if (node.material) {
        if (Array.isArray(node.material)) {
            node.material.forEach(mat => { if(mat.map) mat.map.dispose(); mat.dispose(); });
        } else {
            if(node.material.map) node.material.map.dispose(); node.material.dispose();
        }
    }
    if (node.children) node.children.forEach(child => disposeThreeJSObject(child));
}