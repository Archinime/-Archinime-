import { TVManager } from './room_tv.js';
import { State } from './room_state.js';

export const LunariDespertar = {
    enter(system) {
        if (system.models.despertar) system.models.despertar.visible = true;
        system.activeAction = system.actions.despertar_base;
        if (system.activeAction) system.activeAction.reset().fadeIn(0.5).play();
        if (State.isRoomStarted) TVManager.turnOnAutomatically(); 
    },

    exit(system) {
        if (TVManager.isTvOn && !TVManager.tvTransitioning) {
            const tvPowerBtn = document.getElementById('tv-power');
            if (tvPowerBtn) tvPowerBtn.click();
        }
    },

    update(system, delta) {
        // Nada especial en el bucle de la TV por ahora
    },

    onFinished(system, event) {},

    getDialogue(isDay, weatherCode) {
        return "Este anime está muy interesante.<br>¡Shhh! Estoy prestando atención.";
    },

    complainAboutTV(system) {
        const dialogBox = document.getElementById('dialogue-text');
        if (dialogBox) {
            dialogBox.innerHTML = "¡Oye! ¡Estoy viendo mi programa favorito!<br>Déjame ver la tele tranquila... 📺😠";
            
            setTimeout(() => {
                if (system.currentState === 'despertar') {
                    system.updateLunariText(system.lastIsDay, system.lastWeather);
                }
            }, 4000);
        }
    }
};