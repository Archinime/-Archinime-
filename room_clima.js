import * as THREE from 'three';
import { State, getFreshUrl } from './room_state.js';

export const WeatherSystem = {
    esDeDiaLocal: true,
    lastWeatherCode: 0,
    
    actualizarIluminacion(focoDiaMesh, luzFocoDia, isMobileUA, lunariRef) {
        const hora = new Date().getHours();
        let colorHex, lightInt, emInt, dist;
        if (hora >= 6 && hora < 9) { colorHex = 0xffe4b5; lightInt = 0.8; emInt = 0.8; dist = 35; }
        else if (hora >= 9 && hora < 17) { colorHex = 0xffffff; lightInt = 1.5; emInt = 1.5; dist = 50; }
        else if (hora >= 17 && hora < 19) { colorHex = 0xff8c00; lightInt = 0.7; emInt = 0.7; dist = 40; }
        else { colorHex = 0x5566aa; lightInt = 0.25; emInt = 0.25; dist = 25; }

        if (luzFocoDia) { 
            luzFocoDia.color.setHex(colorHex);
            luzFocoDia.intensity = lightInt; 
            luzFocoDia.distance = dist; 
            luzFocoDia.castShadow = State.gameSettings.sombras > 0;
            // CORRECCIÓN DE SOMBRAS CLIMA: Eliminamos distorsión en la pared opuesta
            luzFocoDia.shadow.bias = -0.002;
            luzFocoDia.shadow.normalBias = 0.05;
        }
        
        if (focoDiaMesh) { 
            const mat = focoDiaMesh.material;
            mat.emissive.setHex(colorHex); 
            mat.emissiveIntensity = emInt; 
            mat.needsUpdate = true; 
        }

        const isDay = hora >= 6 && hora < 19;
        this.esDeDiaLocal = isDay;

        if (lunariRef && typeof lunariRef.evaluateState === 'function') {
            lunariRef.evaluateState(isDay, this.lastWeatherCode);
        }
    },

    setupWeatherVideo(loader, scene, applyMaterialLogic, loadedSlotMeshes, checkLoading) {
        const safeCheckLoading = () => {
            if (typeof checkLoading === 'function') checkLoading();
        };

        const hora = new Date().getHours();
        this.esDeDiaLocal = hora >= 6 && hora < 19;
        if (!navigator.onLine) {
            this.loadCuadro(loader, scene, applyMaterialLogic, loadedSlotMeshes, safeCheckLoading, this.esDeDiaLocal ? 'dia_soleado.mp4' : 'noche_despejada.mp4');
            return;
        }

        // Ya no pedimos geolocalización. Pasamos directo a obtener la ubicación por IP silenciosamente.
        this.fetchWeatherByIP(loader, scene, applyMaterialLogic, loadedSlotMeshes, safeCheckLoading);
    },

    async fetchWeatherByIP(loader, scene, applyMaterialLogic, loadedSlotMeshes, safeCheckLoading) {
        try {
            const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
            const data = await res.json();
            this.fetchWeather(data.latitude, data.longitude, loader, scene, applyMaterialLogic, loadedSlotMeshes, safeCheckLoading);
        } catch(e) {
            this.fetchWeather(-12.0464, -77.0428, loader, scene, applyMaterialLogic, loadedSlotMeshes, safeCheckLoading);
        }
    },

    async fetchWeather(lat, lon, loader, scene, applyMaterialLogic, loadedSlotMeshes, safeCheckLoading) {
        const statusBox = document.getElementById('weather-status');
        let weatherCode = 0; let temperature = "--";
        try {
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`);
            const data = await response.json();
            weatherCode = data.current_weather.weathercode;
            temperature = data.current_weather.temperature;
            this.lastWeatherCode = weatherCode;
        } catch (error) { console.error('Error del clima', error); }

        const hora = new Date().getHours();
        const isDay = hora >= 6 && hora < 19;
        this.esDeDiaLocal = isDay;

        let videoFile = isDay ? 'dia_soleado.mp4' : 'noche_despejada.mp4';
        let weatherEmoji = isDay ? "☀️" : "🌙";
        let weatherName = isDay ? "Soleado" : "Despejado";
        try {
            if ([45, 48].includes(weatherCode)) { 
                weatherEmoji = "🌫️";
                weatherName = "Niebla"; 
                videoFile = isDay ? 'dia_niebla.mp4' : 'noche_niebla.mp4';
            } 
            else if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) { 
                weatherEmoji = "🌧️";
                weatherName = "Lluvioso"; 
                videoFile = isDay ? 'dia_lluvia.mp4' : 'noche_lluvia.mp4';
            } 
            else if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) { 
                weatherEmoji = "❄️";
                weatherName = "Nevado"; 
                videoFile = isDay ? 'dia_nieve.mp4' : 'noche_nieve.mp4';
            } 
            else if ([95, 96, 99].includes(weatherCode)) { 
                weatherEmoji = "⛈️";
                weatherName = "Tormenta"; 
                videoFile = isDay ? 'dia_tormenta.mp4' : 'noche_tormenta.mp4';
            } 
            else if ([1, 2, 3].includes(weatherCode)) { 
                weatherEmoji = "☁️";
                weatherName = "Nublado"; 
                videoFile = isDay ? 'dia_nublado.mp4' : 'noche_nublada.mp4';
            }
        } catch (error) { weatherEmoji = "❌"; weatherName = "Clima offline"; }

        if (statusBox) statusBox.innerHTML = temperature !== "--" ? `${weatherEmoji} ${weatherName} | ${temperature}°C` : `${weatherEmoji} ${weatherName}`;
        
        this.loadCuadro(loader, scene, applyMaterialLogic, loadedSlotMeshes, safeCheckLoading, videoFile);
    },

    loadCuadro(loader, scene, applyMaterialLogic, loadedSlotMeshes, safeCheckLoading, videoFile) {
        const video = document.createElement('video');
        video.loop = true; video.muted = true; video.crossOrigin = 'anonymous'; video.playsInline = true;
        video.src = videoFile; 
        video.play().catch(e => console.log('Autoplay blocked'));
        const videoTexture = new THREE.VideoTexture(video); 
        videoTexture.minFilter = THREE.LinearFilter; 
        videoTexture.magFilter = THREE.LinearFilter; 
        videoTexture.format = THREE.RGBAFormat; 
        videoTexture.encoding = THREE.sRGBEncoding;
        videoTexture.generateMipmaps = false;
        // OPTIMIZACIÓN VRAM

        loader.load(getFreshUrl('cuadro.glb'), (gltf) => {
            const cuadroModel = gltf.scene;
            cuadroModel.traverse((node) => {
                if (node.isMesh && node.material) {
                    if (Array.isArray(node.material)) { node.material.forEach(mat => { mat.map = videoTexture; mat.emissive = new THREE.Color(0xffffff); mat.emissiveMap = videoTexture; mat.emissiveIntensity = 1.0; mat.needsUpdate = true; }); } 
                    else { node.material.map = videoTexture; node.material.emissive = new THREE.Color(0xffffff); node.material.emissiveMap = videoTexture; node.material.emissiveIntensity = 1.0; node.material.needsUpdate = true; }
                }
            });
            applyMaterialLogic(cuadroModel, 'cuadro');
            loadedSlotMeshes['cuadro'] = cuadroModel;
 
            scene.add(cuadroModel);
            safeCheckLoading(); 
        }, undefined, () => {
            safeCheckLoading(); 
        });
    }
};