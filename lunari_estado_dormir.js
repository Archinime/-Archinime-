export const LunariDormir = {
    enter(system) {
        if (system.models.dormir) system.models.dormir.visible = true;
        system.activeAction = system.actions.dormir_base;
        if (system.activeAction) system.activeAction.reset().fadeIn(0.5).play();
        system.dormirTimer = 0;
        
        if (system.mixers.dormir) system.mixers.dormir.addEventListener('finished', system.onDormirFinishedBound);
    },

    exit(system) {
        if (system.mixers.dormir) system.mixers.dormir.removeEventListener('finished', system.onDormirFinishedBound);
    },

    update(system, delta) {
        if (system.activeAction === system.actions.dormir_base) {
            system.dormirTimer += delta;
            if (system.dormirTimer >= 60) {
                system.dormirTimer = 0;
                if (system.actions.dormir_random) {
                    system.activeAction.fadeOut(0.5);
                    system.activeAction = system.actions.dormir_random;
                    system.activeAction.reset().fadeIn(0.5).play();
                }
            }
        }
    },

    onFinished(system, event) {
        if (event.action === system.actions.dormir_random) {
            event.action.fadeOut(0.5);
            system.activeAction = system.actions.dormir_base;
            if (system.activeAction) system.activeAction.reset().fadeIn(0.5).play();
            system.dormirTimer = 0;
        }
    },

    getDialogue(isDay, weatherCode) {
        return "Zzz...<br>(Lunari está profundamente dormida)";
    }
};