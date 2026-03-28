export const LunariAfuera = {
    enter(system) {
        // Aseguramos que no haya ninguna animación activa
        system.activeAction = null;
        
        // Revisamos si ya tenía un tiempo de regreso guardado en la memoria
        let returnTime = localStorage.getItem('room_lunari_return_time');
        
        // Si no hay tiempo o ya pasó, calculamos uno nuevo para esta salida
        if (!returnTime || Date.now() >= parseInt(returnTime)) {
            const hours = this.calculateRandomHours();
            returnTime = Date.now() + (hours * 3600 * 1000); // Convertimos horas a milisegundos
            localStorage.setItem('room_lunari_return_time', returnTime.toString());
        }
    },

    exit(system) {
        // Cuando por fin regresa, borramos la memoria de que estaba afuera
        localStorage.removeItem('room_lunari_return_time');
        
        // --- NUEVO: Aplicamos un descanso obligatorio de 2 horas antes de que pueda salir otra vez ---
        const cooldownTime = Date.now() + (2 * 3600 * 1000); 
        localStorage.setItem('room_lunari_cooldown', cooldownTime.toString());
    },

    update(system, delta) {
        // Verificamos en cada frame si ya es hora de que regrese
        const returnTime = parseInt(localStorage.getItem('room_lunari_return_time') || '0');
        
        if (Date.now() >= returnTime) {
            // Ya pasó el tiempo, borramos la memoria y forzamos una re-evaluación
            localStorage.removeItem('room_lunari_return_time');
            system.evaluateState(system.lastIsDay, system.lastWeather);
        }
    },

    calculateRandomHours() {
        // Sistema de pesos basados en tus probabilidades
        // 1h (80), 2h (60), 3h (40), 4h (20), 5h (10). Suma total = 210
        const weights = [80, 60, 40, 20, 10];
        const hours = [1, 2, 3, 4, 5];
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let randomNum = Math.random() * totalWeight;
        
        for (let i = 0; i < weights.length; i++) {
            if (randomNum < weights[i]) {
                return hours[i];
            }
            randomNum -= weights[i];
        }
        return 1; // 1 hora por defecto en caso de error
    },

    getDialogue(isDay, weatherCode) {
        return "<i>(La habitación está vacía...)</i><br>Parece que Lunari salió a dar una vuelta. Volverá más tarde.";
    }
};