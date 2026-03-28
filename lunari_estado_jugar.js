import { PCManager } from './room_pc.js';

export const LunariJugar = {
    enter(system) {
        if (system.models.jugar) system.models.jugar.visible = true;
        system.activeAction = system.actions.jugar_base;
        if (system.activeAction) system.activeAction.reset().fadeIn(0.5).play();
        PCManager.setGamingMode(true);
    },

    exit(system) {
        PCManager.setGamingMode(false);
    },

    update(system, delta) {},

    onFinished(system, event) {},

    getDialogue(isDay, weatherCode) {
        return "¡Estoy en plena partida en Survev.io!<br>¡Cuidado, no me distraigas o perderé!";
    }
};