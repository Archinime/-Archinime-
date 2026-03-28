import { State } from './room_state.js';

export const LunariIdle = {
    enter(system) {
        if (system.models.idle) system.models.idle.visible = true;
        system.idleTimer = 0;
        
        if (system.actions.saluda) {
            system.activeAction = system.actions.saluda;
            system.activeAction.reset().fadeIn(0.5).play();
        } else {
            system.activeAction = system.actions.idle_base;
            if (system.activeAction) system.activeAction.reset().fadeIn(0.5).play();
        }
        
        if (system.mixers.idle) system.mixers.idle.addEventListener('finished', system.onIdleFinishedBound);
    },

    exit(system) {
        if (system.mixers.idle) system.mixers.idle.removeEventListener('finished', system.onIdleFinishedBound);
    },

    update(system, delta) {
        // Efectos especiales para interacciones (Click sostenido)
        if (system.activeAction && system.actions.idle_holds.includes(system.activeAction)) {
            if (system.activeAction.userData) {
                const fileName = system.activeAction.userData.fileName;
                const time = system.activeAction.time;

                if (fileName === 'lunari_beso.glb' && time >= 1.0 && !system.activeAction.userData.triggered) {
                    system.activeAction.userData.triggered = true;
                    if (window.startCameraZoom) window.startCameraZoom(2.0);
                    if (window.showHeartEffect) window.showHeartEffect();
                    system.audioBeso.volume = (State.gameSettings.volumenEfectos || 50) / 100;
                    system.audioBeso.currentTime = 0;
                    system.audioBeso.play().catch(()=>{});
                }
                else if (fileName === 'lunari_beso_volado.glb' && time >= 2.0 && !system.activeAction.userData.triggered) {
                    system.activeAction.userData.triggered = true;
                    if (window.showMultiHeartEffect) window.showMultiHeartEffect();
                    system.audioCorazon.volume = (State.gameSettings.volumenEfectos || 50) / 100;
                    system.audioCorazon.currentTime = 0;
                    system.audioCorazon.play().catch(()=>{});
                }
            }
        }

        // Animaciones aleatorias en espera
        if (system.activeAction === system.actions.idle_base) {
            system.idleTimer += delta;
            if (system.idleTimer >= 30) {
                system.idleTimer = 0;
                if (system.actions.idle_randoms.length > 0) {
                    const nextAction = system.actions.idle_randoms[system.currentIdleIndex];
                    system.currentIdleIndex = (system.currentIdleIndex + 1) % system.actions.idle_randoms.length;

                    const prevAction = system.activeAction;
                    system.activeAction = nextAction;
                    system.activeAction.reset().play();
                    prevAction.crossFadeTo(system.activeAction, 0.8, false);
                }
            }
        }
    },

    onFinished(system, event) {
        if (event.action === system.actions.saluda || 
            system.actions.idle_randoms.includes(event.action) ||
            event.action === system.actions.idle_click ||
            system.actions.idle_holds.includes(event.action)) {
           
            const prevAction = event.action;
            system.activeAction = system.actions.idle_base;
            if (system.activeAction) {
                system.activeAction.reset().play();
                prevAction.crossFadeTo(system.activeAction, 0.8, false);
            }
            system.idleTimer = 0;
        }
    },

    getDialogue(isDay, weatherCode) {
        if (!isDay) { 
            return "¡Qué noche tan tranquila!<br>¿Deberíamos dormir pronto?";
        } else if ([51,53,55,56,57,61,63,65,66,67,71,73,75,77,80,81,82,85,86,95,96,99].includes(weatherCode)) {
            return "El clima está feo afuera.<br>¡Mejor nos quedamos viendo anime!";
        } else {
            return "¡Hola!<br>Qué bueno verte por aquí.<br>¿Qué hacemos hoy?";
        }
    }
};