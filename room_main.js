import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { State, isMobileUA, checkDailyReward, getFreshUrl, disposeThreeJSObject } from './room_state.js';
import { SceneSetup } from './room_scene.js';
import { TVManager } from './room_tv.js';
import { PCManager } from './room_pc.js';
import { LunariSystem } from './room_lunari.js';
import { WeatherSystem } from './room_clima.js';
import { UIManager } from './room_ui.js';

checkDailyReward();
SceneSetup.init(State.gameSettings, isMobileUA);
const { scene, clock, camera, renderer, controls, ambient, hemiLight, mainLight } = SceneSetup;

const loadedSlotMeshes = {};
let switchMesh = null, focoMesh = null, focoDiaMesh = null, luzFocoDia = null;

let isCameraZooming = false;
let cameraZoomTimer = 0;
const originalCamPos = new THREE.Vector3();
const originalTarget = new THREE.Vector3();
const zoomTargetPos = new THREE.Vector3();
const zoomLookAt = new THREE.Vector3();

window.startCameraZoom = function(distance = 1.2) {
    if (isCameraZooming) return;
    isCameraZooming = true;
    cameraZoomTimer = 0;
    
    originalCamPos.copy(camera.position);
    originalTarget.copy(controls.target);

    let faceX = 0;
    let faceY = 8.8; 
    let faceZ = 0;
    if (LunariSystem.models.idle) {
        const pos = new THREE.Vector3();
        LunariSystem.models.idle.getWorldPosition(pos);
        faceX = pos.x;
        faceZ = pos.z;
    }

    zoomLookAt.set(faceX, faceY, faceZ);
    const dir = new THREE.Vector3().subVectors(originalCamPos, zoomLookAt);
    dir.y = 0;
    if (dir.lengthSq() > 0.001) {
        dir.normalize();
    } else {
        dir.set(0, 0, 1);
    }

    zoomTargetPos.copy(zoomLookAt).addScaledVector(dir, distance);
    zoomTargetPos.y = faceY; 
};

window.showHeartEffect = function() {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'absolute';
    heart.style.left = '50%';
    heart.style.top = '40%';
    heart.style.transform = 'translate(-50%, -50%) scale(0)';
    heart.style.fontSize = '80px';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '1000';
    heart.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 1.5s ease-out';
    heart.style.opacity = '1';
    heart.style.textShadow = '0 0 20px rgba(255, 0, 100, 0.8)';
    document.body.appendChild(heart);
    heart.getBoundingClientRect();
    heart.style.transform = 'translate(-50%, -150px) scale(1.5)';
    setTimeout(() => {
        heart.style.opacity = '0';
        setTimeout(() => heart.remove(), 1500);
    }, 1500);
};

window.showMultiHeartEffect = function() {
    const emojis = ['❤️', '💖', '💜', '💙', '💛', '💚', '✨'];
    const numHearts = 8; 
    
    for (let i = 0; i < numHearts; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            heart.innerHTML = randomEmoji;
            heart.style.position = 'absolute';
            heart.style.left = '50%';
            heart.style.top = '40%';
            heart.style.transform = 'translate(-50%, -50%) scale(0)';
            
            const size = Math.floor(Math.random() * 30) + 40; 
            heart.style.fontSize = size + 'px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '1000';
            heart.style.transition = 'transform 1.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 1.5s ease-out';
            heart.style.opacity = '1';
            
            document.body.appendChild(heart);
            heart.getBoundingClientRect(); 
            
            const xOffset = (Math.random() - 0.5) * 300;
            const yOffset = -150 - Math.random() * 200;
            const rotation = (Math.random() - 0.5) * 60;
            heart.style.transform = `translate(calc(-50% + ${xOffset}px), ${yOffset}px) scale(1.2) rotate(${rotation}deg)`;
            heart.style.opacity = '0';
            
            setTimeout(() => heart.remove(), 1500);
        }, i * 150);
    }
};

const audioPrenderLuz = new Audio('prender_luz.mp3');
const audioApagarLuz = new Audio('apagar_luz.mp3');
const audioAbrirPoster = new Audio('abrir_poster.mp3');
const audioCerrarPoster = new Audio('guardar_poster.mp3');

TVManager.init();
PCManager.init();

function applyAudioSettings() {
    TVManager.setVolumes(State.gameSettings.volumenTV, State.gameSettings.volumenEfectos);
    PCManager.setVolume(State.gameSettings.volumenPC, State.gameSettings.volumenEfectos);
    let volEf = State.gameSettings.volumenEfectos / 100;
    audioPrenderLuz.volume = volEf;
    audioApagarLuz.volume = volEf;
    audioAbrirPoster.volume = volEf; 
    audioCerrarPoster.volume = volEf;
}

function applyCurrentSettings() {
    let pixelRatio = 1;
    let newToneMapping = THREE.ACESFilmicToneMapping;
    if (State.gameSettings.calidad === 'baja') {
        pixelRatio = Math.min(window.devicePixelRatio || 1, 0.7);
        newToneMapping = THREE.NoToneMapping;
    } else if (State.gameSettings.calidad === 'media') {
        pixelRatio = Math.min(window.devicePixelRatio || 1, 1.2);
    } else if (State.gameSettings.calidad === 'alta') {
        pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    }

    renderer.setPixelRatio(pixelRatio);
    
    let needsMaterialUpdate = false;

    if (renderer.toneMapping !== newToneMapping) {
        renderer.toneMapping = newToneMapping;
        needsMaterialUpdate = true;
    }

    let currentShadowType = renderer.shadowMap.type;
    let newShadowType = State.gameSettings.sombras >= 2 ? THREE.PCFSoftShadowMap : THREE.PCFShadowMap;
    
    if (currentShadowType !== newShadowType) {
        renderer.shadowMap.type = newShadowType;
        needsMaterialUpdate = true;
    }

    if (needsMaterialUpdate) {
        scene.traverse((node) => {
            if (node.isMesh && node.material) {
                if (Array.isArray(node.material)) node.material.forEach(m => m.needsUpdate = true);
                else node.material.needsUpdate = true;
            }
        });
    }

    renderer.shadowMap.enabled = State.gameSettings.sombras > 0;
    mainLight.castShadow = State.gameSettings.sombras > 0;
    if (State.gameSettings.sombras > 0) {
        let shadowRes = State.gameSettings.sombras === 2 ? (isMobileUA ? 2048 : 4096) : (isMobileUA ? 512 : 1024);
        if (mainLight.shadow.mapSize.width !== shadowRes) {
            mainLight.shadow.mapSize.set(shadowRes, shadowRes);
            if (mainLight.shadow.map) { mainLight.shadow.map.dispose(); mainLight.shadow.map = null; }
        }
        mainLight.shadow.radius = State.gameSettings.sombras >= 2 ? 4 : 1; 
    }

    for (let cat in loadedSlotMeshes) applyMaterialLogic(loadedSlotMeshes[cat], cat);
    if(focoDiaMesh) WeatherSystem.actualizarIluminacion(focoDiaMesh, luzFocoDia, isMobileUA, LunariSystem);
    
    document.getElementById('fps-counter').style.display = State.gameSettings.mostrarFps ? 'block' : 'none';
    
    // APLICACIÓN DE MONEDAS
    const coinDisplay = document.getElementById('coin-display');
    if (coinDisplay) coinDisplay.style.display = State.gameSettings.mostrarMonedas ? 'flex' : 'none';

    applyAudioSettings();
}

UIManager.init(applyCurrentSettings, applyAudioSettings, loadItemForSlot);

function applyMaterialLogic(model, categoryKey) {
    if(!model) return;
    const isFoco = categoryKey === 'foco', isFocoDia = categoryKey === 'foco_dia';
    const allowShadows = State.gameSettings.sombras > 0;
    const isStructureCategory = ['paredes', 'piso', 'techo', 'puerta'].includes(categoryKey);
    const isBaja = State.gameSettings.calidad === 'baja';
    model.traverse((node) => {
        if (node.isMesh) {
            if (node.name === 'LunariHitbox') return;
            node.frustumCulled = false; 
            if (isFoco || isFocoDia) {
                node.castShadow = false; node.receiveShadow = false;
                if (node.material) {
                    if (isFoco) { node.material.emissive = new THREE.Color(0xffeedd); node.material.emissiveIntensity = State.lightOn ? 1.5 : 0; }
                    if (isFocoDia) node.material.emissive = new THREE.Color(0xffffff);
                }
            } else {
                let nodeIsStructure = isStructureCategory || node.name.toLowerCase().includes('pared') || node.name.toLowerCase().includes('piso') || node.name.toLowerCase().includes('techo');
                node.castShadow = nodeIsStructure ? false : allowShadows;
                node.receiveShadow = allowShadows;
                if(node.material) {
                    let mats = Array.isArray(node.material) ? node.material : [node.material];
                    mats.forEach(m => {
                        m.shadowSide = THREE.FrontSide;
                        m.side = THREE.DoubleSide;
                        if (isBaja && m.isMeshStandardMaterial) {
                            m.roughness = 1.0;
                            m.metalness = 0.0;
                        }
                        m.needsUpdate = true;
                    });
                }
            }
        }
    });
}

// --- SISTEMA OPTIMIZADO DE CARGA DINÁMICA ---
const loader = new GLTFLoader();
let totalModelsToLoad = 0, modelsLoaded = 0;
const originalLoad = loader.load.bind(loader);
loader.load = function(url, onLoad, onProgress, onError) {
    totalModelsToLoad++;
    checkLoadingState();
    originalLoad(url, (gltf) => {
        modelsLoaded++;
        checkLoadingState();
        if(onLoad) onLoad(gltf);
    }, onProgress, (err) => {
        modelsLoaded++;
        checkLoadingState();
        if(onError) onError(err);
    });
};

function checkLoadingState() {
    const loadCount = document.getElementById('loading-count');
    const loadBar = document.getElementById('loading-bar');
    if(loadCount && loadBar && totalModelsToLoad > 0) {
        loadCount.innerText = `${modelsLoaded}/${totalModelsToLoad}`;
        const percent = Math.min((modelsLoaded / totalModelsToLoad) * 100, 100);
        loadBar.style.width = `${percent}%`;
        if (modelsLoaded >= totalModelsToLoad) {
            renderer.compile(scene, camera);
            const startBtn = document.getElementById('cyber-start-btn');
            if(startBtn && startBtn.style.display !== 'block') {
                startBtn.style.display = 'block';
                setTimeout(() => startBtn.style.opacity = '1', 50);
            }
        }
    }
}

function checkLoading() {}

setTimeout(() => {
    const startBtn = document.getElementById('cyber-start-btn');
    if(startBtn && startBtn.style.display === 'none') {
        startBtn.style.display = 'block';
        setTimeout(() => startBtn.style.opacity = '1', 50);
    }
}, 45000);

let pendingDormirRandom = null;
const pendingIdleClips = { saluda: null, click: null, randoms: [], holds: [] };
loader.load(getFreshUrl('lunari_durmiendo1.glb'), (gltf) => {
    const model = gltf.scene; model.visible = false; applyMaterialLogic(model, 'lunari'); scene.add(model); LunariSystem.models.dormir = model;
    LunariSystem.mixers.dormir = new THREE.AnimationMixer(model);
    if (gltf.animations && gltf.animations.length > 0) { 
        LunariSystem.actions.dormir_base = LunariSystem.mixers.dormir.clipAction(gltf.animations[0]); 
    }
    if (pendingDormirRandom) {
        LunariSystem.actions.dormir_random = LunariSystem.mixers.dormir.clipAction(pendingDormirRandom); 
        LunariSystem.actions.dormir_random.loop = THREE.LoopOnce; LunariSystem.actions.dormir_random.clampWhenFinished = true; 
    }
    LunariSystem.evaluateState(WeatherSystem.esDeDiaLocal, WeatherSystem.lastWeatherCode);
});

loader.load(getFreshUrl('Lunari_Duerme_2.glb'), (gltf) => {
    if (gltf.animations && gltf.animations.length > 0) { 
        if (LunariSystem.mixers.dormir) {
            LunariSystem.actions.dormir_random = LunariSystem.mixers.dormir.clipAction(gltf.animations[0]); 
            LunariSystem.actions.dormir_random.loop = THREE.LoopOnce; LunariSystem.actions.dormir_random.clampWhenFinished = true; 
        } else { pendingDormirRandom = gltf.animations[0]; }
    }
});

loader.load(getFreshUrl('lunari_esta_despierta.glb'), (gltf) => {
    const model = gltf.scene; model.visible = false; applyMaterialLogic(model, 'lunari'); scene.add(model); LunariSystem.models.despertar = model;
    if (gltf.animations && gltf.animations.length > 0) { LunariSystem.mixers.despertar = new THREE.AnimationMixer(model); LunariSystem.actions.despertar_base = LunariSystem.mixers.despertar.clipAction(gltf.animations[0]); }
});

loader.load(getFreshUrl('lunari_jugando.glb'), (gltf) => {
    const model = gltf.scene; model.visible = false; applyMaterialLogic(model, 'lunari'); scene.add(model); LunariSystem.models.jugar = model;
    if (gltf.animations && gltf.animations.length > 0) { LunariSystem.mixers.jugar = new THREE.AnimationMixer(model); LunariSystem.actions.jugar_base = LunariSystem.mixers.jugar.clipAction(gltf.animations[0]); }
});

loader.load(getFreshUrl('lunari_idle.glb'), (gltf) => {
    const model = gltf.scene; 
    model.visible = false; 
    model.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3(); box.getSize(size);
    const center = new THREE.Vector3(); box.getCenter(center);
    const scale = new THREE.Vector3(); model.getWorldScale(scale);

    let realY = size.y / scale.y; if (realY < 1.0) realY = 1.6; 
    const localSizeX = 0.55; const localSizeZ = 0.55; const localSizeY = realY * 1.15; 

    const hitboxGeo = new THREE.BoxGeometry(localSizeX, localSizeY, localSizeZ);
    const hitboxMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
    const hitbox = new THREE.Mesh(hitboxGeo, hitboxMat);
    hitbox.name = 'LunariHitbox'; hitbox.frustumCulled = false;

    model.worldToLocal(center);
    hitbox.position.set(0, center.y + (localSizeY * 0.1), 0);
    model.add(hitbox);
    applyMaterialLogic(model, 'lunari'); scene.add(model); LunariSystem.models.idle = model;
    LunariSystem.mixers.idle = new THREE.AnimationMixer(model);
    if (gltf.animations && gltf.animations.length > 0) { LunariSystem.actions.idle_base = LunariSystem.mixers.idle.clipAction(gltf.animations[0]); }
    
    if (pendingIdleClips.saluda) {
        LunariSystem.actions.saluda = LunariSystem.mixers.idle.clipAction(pendingIdleClips.saluda);
        LunariSystem.actions.saluda.loop = THREE.LoopOnce; LunariSystem.actions.saluda.clampWhenFinished = true;
    }
    if (pendingIdleClips.click) {
        LunariSystem.actions.idle_click = LunariSystem.mixers.idle.clipAction(pendingIdleClips.click);
        LunariSystem.actions.idle_click.loop = THREE.LoopOnce; LunariSystem.actions.idle_click.clampWhenFinished = true;
    }
    pendingIdleClips.randoms.forEach(clip => {
        const action = LunariSystem.mixers.idle.clipAction(clip);
        action.loop = THREE.LoopOnce; action.clampWhenFinished = true;
        LunariSystem.actions.idle_randoms.push(action);
    });
    pendingIdleClips.holds.forEach(clip => {
        const action = LunariSystem.mixers.idle.clipAction(clip);
        action.loop = THREE.LoopOnce; action.clampWhenFinished = true;
        if (clip.userData) action.userData = clip.userData;
        LunariSystem.actions.idle_holds.push(action);
    });
    LunariSystem.evaluateState(WeatherSystem.esDeDiaLocal, WeatherSystem.lastWeatherCode);
});

loader.load(getFreshUrl('lunari_saluda.glb'), (gltf) => {
    if (gltf.animations && gltf.animations.length > 0) { 
        if (LunariSystem.mixers.idle) {
            LunariSystem.actions.saluda = LunariSystem.mixers.idle.clipAction(gltf.animations[0]); 
            LunariSystem.actions.saluda.loop = THREE.LoopOnce; LunariSystem.actions.saluda.clampWhenFinished = true;
        } else { pendingIdleClips.saluda = gltf.animations[0]; }
    }
});

loader.load(getFreshUrl('lunari_idle3.glb'), (gltf) => {
    if (gltf.animations && gltf.animations.length > 0) { 
        if (LunariSystem.mixers.idle) {
            LunariSystem.actions.idle_click = LunariSystem.mixers.idle.clipAction(gltf.animations[0]); 
            LunariSystem.actions.idle_click.loop = THREE.LoopOnce; LunariSystem.actions.idle_click.clampWhenFinished = true;
        } else { pendingIdleClips.click = gltf.animations[0]; }
    }
});

const holdFiles = ['lunari_beso.glb', 'lunari_beso_volado.glb'];
holdFiles.forEach(file => {
    loader.load(getFreshUrl(file), (gltf) => {
        if (gltf.animations && gltf.animations.length > 0) {
            if (LunariSystem.mixers.idle) {
                const action = LunariSystem.mixers.idle.clipAction(gltf.animations[0]);
                action.loop = THREE.LoopOnce; action.clampWhenFinished = true;
                action.userData = { fileName: file, triggered: false };
                LunariSystem.actions.idle_holds.push(action);
            } else { 
                gltf.animations[0].userData = { fileName: file, triggered: false };
                pendingIdleClips.holds.push(gltf.animations[0]); 
            }
        }
    });
});

const idleRandomFiles = ['lunari_idle2.glb', 'lunari_idle4.glb', 'lunari_idle5.glb', 'lunari_idle6.glb'];
idleRandomFiles.forEach(file => {
    loader.load(getFreshUrl(file), (gltf) => {
        if (gltf.animations && gltf.animations.length > 0) {
            if (LunariSystem.mixers.idle) {
                const action = LunariSystem.mixers.idle.clipAction(gltf.animations[0]);
                action.loop = THREE.LoopOnce; action.clampWhenFinished = true;
                LunariSystem.actions.idle_randoms.push(action);
            } else { pendingIdleClips.randoms.push(gltf.animations[0]); }
        }
    });
});

loader.load(getFreshUrl('https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/foco_dia.glb'), (gltf) => {
    focoDiaMesh = gltf.scene; applyMaterialLogic(focoDiaMesh, 'foco_dia'); luzFocoDia = new THREE.PointLight(0xffffff, 1, 50);
    const box = new THREE.Box3().setFromObject(focoDiaMesh); const center = new THREE.Vector3(); box.getCenter(center);
    luzFocoDia.position.copy(center); luzFocoDia.position.y -= 0.2; luzFocoDia.shadow.bias = -0.005; luzFocoDia.shadow.normalBias = 0.1;
    scene.add(luzFocoDia); scene.add(focoDiaMesh); focoDiaMesh.visible = false; luzFocoDia.visible = true; 
    WeatherSystem.actualizarIluminacion(focoDiaMesh, luzFocoDia, isMobileUA, LunariSystem);
});

setInterval(() => {
    WeatherSystem.actualizarIluminacion(focoDiaMesh, luzFocoDia, isMobileUA, LunariSystem);
    LunariSystem.evaluateState(WeatherSystem.esDeDiaLocal, WeatherSystem.lastWeatherCode, true);
}, 60000);

function loadItemForSlot(categoryKey, itemFile, isInitialLoad = false) {
    if (!itemFile) return;
    if (loadedSlotMeshes[categoryKey]) { 
        const oldModel = loadedSlotMeshes[categoryKey];
        scene.remove(oldModel); disposeThreeJSObject(oldModel);
        if (PCManager.pcScreenMeshes) {
            oldModel.traverse((node) => {
                const idx = PCManager.pcScreenMeshes.indexOf(node);
                if (idx > -1) PCManager.pcScreenMeshes.splice(idx, 1);
            });
        }
    }
    
    loader.load(getFreshUrl(itemFile), (gltf) => {
        const model = gltf.scene; applyMaterialLogic(model, categoryKey);
        
        if (categoryKey === 'pantalla_tv') {
            model.traverse((node) => {
                if (node.isMesh && node.material) {
                    TVManager.tvScreenMesh = node; 
                    let mats = Array.isArray(node.material) ? node.material : [node.material];
                    mats.forEach(mat => { 
                        if (!TVManager.isTvOn) { 
                            mat.map = null; mat.emissiveMap = null; mat.color = new THREE.Color(0x000000); mat.emissive = new THREE.Color(0x000000); mat.emissiveIntensity = 0; 
                        } else { 
                            mat.map = TVManager.tvTexture; mat.emissiveMap = TVManager.tvTexture; mat.color = new THREE.Color(0xffffff); mat.emissive = new THREE.Color(0xffffff); mat.emissiveIntensity = 1.0; 
                        }
                        mat.needsUpdate = true;
                    });
                }
             });
            if (!TVManager.isTvOn) TVManager.tvVideo.pause();
        }
        
        if (categoryKey === 'pantalla_pc' || categoryKey === 'pantalla_pc2') { 
            if (!PCManager.pcScreenMeshes) PCManager.pcScreenMeshes = [];
            model.traverse((node) => {
                if (node.isMesh && node.material) {
                    if (categoryKey === 'pantalla_pc') node.userData.isMainVideoScreen = true;
                    if (!node.userData.originalMaterials) {
                        const mats = Array.isArray(node.material) ? node.material : [node.material];
                        node.userData.originalMaterials = mats.map(m => m.clone());
                    }
                    if (!PCManager.pcScreenMeshes.includes(node)) { PCManager.pcScreenMeshes.push(node); }
                }
             });
            PCManager.updateScreens();
        }
        
        if (categoryKey === 'foco') { 
            focoMesh = model;
            const box = new THREE.Box3().setFromObject(model); const center = new THREE.Vector3(); box.getCenter(center); mainLight.position.copy(center); mainLight.position.y -= 0.2;
        }
        if (categoryKey === 'interruptor') switchMesh = model;
        
        scene.add(model); loadedSlotMeshes[categoryKey] = model;
    });
}

for (let cat in State.inventoryData) {
    if (State.inventoryData[cat].type === 'multiple') continue; let eqId = State.inventoryData[cat].equipped;
    if (State.inventoryData[cat].items && State.inventoryData[cat].items[eqId]) {
        let it = State.inventoryData[cat].items[eqId];
        if (it.file) loadItemForSlot(cat, it.file, true);
        if (cat === 'foco' && it.baseFile) loadItemForSlot('base_foco', it.baseFile, true);
        if (cat === 'tele' && it.baseFile) loadItemForSlot('pantalla_tv', it.baseFile, true);
        if (cat === 'pc') {
            if (it.baseFile) loadItemForSlot('pantalla_pc', it.baseFile, true);
            loadItemForSlot('pantalla_pc2', 'pantalla_pc2.glb', true);
        }
    }
}

WeatherSystem.setupWeatherVideo(loader, scene, applyMaterialLogic, loadedSlotMeshes, checkLoading);

function updateLighting() {
    if (State.lightOn) {
        mainLight.visible = true;
        ambient.intensity = State.gameSettings.calidad === 'baja' ? 0.8 : 0.3; hemiLight.intensity = State.gameSettings.calidad === 'baja' ? 0.8 : 0.4;
        document.getElementById('light-status').innerText = '💡 Luz encendida';
        if (focoMesh) focoMesh.traverse((n) => { if (n.isMesh && n.material) n.material.emissiveIntensity = 1.5; });
    } else {
        mainLight.visible = false; ambient.intensity = 0.02; hemiLight.intensity = 0.05;
        document.getElementById('light-status').innerText = '💡 Luz apagada';
        if (focoMesh) focoMesh.traverse((n) => { if (n.isMesh && n.material) n.material.emissiveIntensity = 0; });
    }
}

const raycaster = new THREE.Raycaster(); const mouse = new THREE.Vector2();

function toggleLight() {
    State.lightOn = !State.lightOn;
    localStorage.setItem('lightState', State.lightOn ? 'on' : 'off'); updateLighting();
    if (State.lightOn) { audioPrenderLuz.currentTime = 0; audioPrenderLuz.play().catch(e=>{}); } else { audioApagarLuz.currentTime = 0;
    audioApagarLuz.play().catch(e=>{}); }
}

const posterViewModal = document.getElementById('poster-view-modal'), posterEnlargedImage = document.getElementById('poster-enlarged-image');
document.getElementById('close-poster-view').onclick = () => { posterViewModal.classList.remove('visible'); audioCerrarPoster.currentTime = 0; audioCerrarPoster.play().catch(e=>{}); };
posterViewModal.onclick = (e) => { if (e.target === posterViewModal) { posterViewModal.classList.remove('visible'); audioCerrarPoster.currentTime = 0; audioCerrarPoster.play().catch(e=>{}); } };

function handleInteraction(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1; raycaster.setFromCamera(mouse, camera);
    if (switchMesh && raycaster.intersectObject(switchMesh, true).length > 0) { toggleLight(); return; }
    
    const pantallaMesh = loadedSlotMeshes['pantalla_tv'];
    if (pantallaMesh && raycaster.intersectObject(pantallaMesh, true).length > 0) {
        const tvControls = document.getElementById('tv-controls'), currentTime = Date.now();
        document.getElementById('pc-controls').style.display = 'none'; 
        if (currentTime - TVManager.lastTvClickTime < 300) { 
            if (TVManager.isTvOn && !TVManager.tvTransitioning) { 
                if (TVManager.tvVideo.paused) TVManager.tvVideo.play().catch(e=>{});
                else TVManager.tvVideo.pause();
            } 
        } else { 
            if (tvControls.style.display === 'none' || tvControls.style.display === '') tvControls.style.display = 'flex';
            else tvControls.style.display = 'none'; 
        }
        TVManager.lastTvClickTime = currentTime; return;
    }

    // --- CORRECCIÓN LÓGICA DE CLIC EN LA PC ---
    const pcScreenMesh = loadedSlotMeshes['pantalla_pc2'];
    if (pcScreenMesh && raycaster.intersectObject(pcScreenMesh, true).length > 0) {
        // 1. Si está apagada, solo mostramos los controles para que pueda prenderla
        if (!PCManager.isPcOn) {
            document.getElementById('tv-controls').style.display = 'none';
            const pcControls = document.getElementById('pc-controls');
            pcControls.style.display = (pcControls.style.display === 'none' || pcControls.style.display === '') ? 'flex' : 'none';
            return;
        }

        // 2. Si está prendida, ejecuta la lógica normal de enlaces
        if (LunariSystem.currentState === 'jugar') { 
            window.open('https://archinime.github.io/-Archinime-', '_blank');
        } else {
            const pcControls = document.getElementById('pc-controls');
            document.getElementById('tv-controls').style.display = 'none'; 
            if (pcControls.style.display === 'none' || pcControls.style.display === '') pcControls.style.display = 'flex';
            else pcControls.style.display = 'none';
        } 
        return;
    }

    const pc2ScreenMesh = loadedSlotMeshes['pantalla_pc'];
    if (pc2ScreenMesh && raycaster.intersectObject(pc2ScreenMesh, true).length > 0) {
        // 1. Si está apagada, mostramos controles y terminamos
        if (!PCManager.isPcOn) {
            document.getElementById('tv-controls').style.display = 'none';
            const pcControls = document.getElementById('pc-controls');
            pcControls.style.display = (pcControls.style.display === 'none' || pcControls.style.display === '') ? 'flex' : 'none';
            return;
        }

        // 2. Si está prendida, abre el enlace
        document.getElementById('tv-controls').style.display = 'none';
        const pcControls = document.getElementById('pc-controls'); pcControls.style.display = 'none';
        if (LunariSystem.currentState === 'jugar') { window.open('https://survev.io', '_blank');
        } else { window.open('https://archinime.github.io/-Archinime-', '_blank');
        } 
        return;
    }

    const posterCategories = ['poster_1', 'poster_2', 'poster_3', 'poster_4'];
    for (let cat of posterCategories) {
        const pMesh = loadedSlotMeshes[cat];
        if (pMesh && raycaster.intersectObject(pMesh, true).length > 0) {
            const itemData = State.inventoryData[cat].items[State.inventoryData[cat].equipped];
            if (itemData && itemData.preview) { posterEnlargedImage.src = itemData.preview; posterViewModal.classList.add('visible'); audioAbrirPoster.currentTime = 0; audioAbrirPoster.play().catch(e=>{});
            }
            break;
        }
    }
}

let pointerDownPos = { x: 0, y: 0 }; let isDragging = false;
let pointerDownTime = 0; let isLunariTargeted = false;

renderer.domElement.addEventListener('pointerdown', (e) => { 
    pointerDownPos.x = e.clientX; pointerDownPos.y = e.clientY; isDragging = false; pointerDownTime = performance.now();
    const rect = renderer.domElement.getBoundingClientRect(); mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1; mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1; raycaster.setFromCamera(mouse, camera);
    isLunariTargeted = false;
    if (LunariSystem.currentState === 'idle' && LunariSystem.models.idle && LunariSystem.models.idle.visible) {
        if (raycaster.intersectObject(LunariSystem.models.idle, true).length > 0) { isLunariTargeted = true; }
    }
});

renderer.domElement.addEventListener('pointermove', (e) => { 
    const dx = e.clientX - pointerDownPos.x; const dy = e.clientY - pointerDownPos.y; 
    if (Math.sqrt(dx * dx + dy * dy) > 5) isDragging = true; 
});

renderer.domElement.addEventListener('pointerup', (e) => { 
    if (!isDragging && !document.getElementById('inventory-modal').classList.contains('visible') && !document.getElementById('ff-settings-modal').classList.contains('active') && !document.getElementById('pc-modal').classList.contains('visible')) {
        let handledByLunari = false;
        if (isLunariTargeted) {
            const holdDuration = performance.now() - pointerDownTime;
            if (holdDuration >= 400) { LunariSystem.triggerHoldAnimation(); } else { LunariSystem.triggerClickAnimation(); }
            handledByLunari = true;
        }
  
        if (!handledByLunari) { handleInteraction(e); }
    } 
    isDragging = false; isLunariTargeted = false;
});

let then = performance.now(), frames = 0, lastFpsTime = then; let wasStarted = false;
function animate() {
    requestAnimationFrame(animate);
    const now = performance.now(); const elapsed = now - then;
    const fpsInterval = State.gameSettings.fps > 0 ? 1000 / State.gameSettings.fps : 0;
    if (fpsInterval === 0 || elapsed > fpsInterval) {
        if (fpsInterval > 0) then = now - (elapsed % fpsInterval);
        let delta = clock.getDelta();
        if (State.isRoomStarted) {
            if (!wasStarted) {
                wasStarted = true;
                LunariSystem.currentState = null;
                LunariSystem.evaluateState(WeatherSystem.esDeDiaLocal, WeatherSystem.lastWeatherCode);
            }
            LunariSystem.update(delta);
        }

        if (isCameraZooming) {
            cameraZoomTimer += delta;
            let t = 0;
            if (cameraZoomTimer < 1.0) { t = cameraZoomTimer;
            t = t * t * (3 - 2 * t); camera.position.lerpVectors(originalCamPos, zoomTargetPos, t); controls.target.lerpVectors(originalTarget, zoomLookAt, t);
            } else if (cameraZoomTimer < 2.5) { camera.position.copy(zoomTargetPos); controls.target.copy(zoomLookAt);
            } else if (cameraZoomTimer < 3.5) { t = cameraZoomTimer - 2.5;
            t = t * t * (3 - 2 * t); camera.position.lerpVectors(zoomTargetPos, originalCamPos, t); controls.target.lerpVectors(zoomLookAt, originalTarget, t);
            } else { isCameraZooming = false; camera.position.copy(originalCamPos); controls.target.copy(originalTarget); }
            camera.updateProjectionMatrix();
        } else { 
            const maxCameraY = 10.5;
            const dist = camera.position.distanceTo(controls.target);
            let cosPhi = (maxCameraY - controls.target.y) / dist;
            
            cosPhi = Math.max(-1, Math.min(1, cosPhi));
            controls.minPolarAngle = Math.acos(cosPhi);
            controls.update(); 
        }

        renderer.render(scene, camera);
        if (State.gameSettings.mostrarFps) { 
            frames++;
            if (now - lastFpsTime >= 1000) { document.querySelector('#fps-counter span').innerText = frames; frames = 0; lastFpsTime = now;
            } 
        }
    }
}

window.addEventListener('resize', () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); applyCurrentSettings(); });
applyCurrentSettings(); updateLighting(); animate();