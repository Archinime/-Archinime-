import { State } from './room_state.js';
import { inventoryGroups } from './inventory-data.js';
import { TVManager } from './room_tv.js';

export const UIManager = {
    currentCategory: 'cama', openGroup: 'muebles', applySettingsCallback: null, applyAudioCallback: null, loadItemCallback: null,

    init(applySettingsCallback, applyAudioCallback, loadItemCallback) {
        this.applySettingsCallback = applySettingsCallback;
        this.applyAudioCallback = applyAudioCallback; 
        this.loadItemCallback = loadItemCallback;
        this.setupModals();
        this.syncSettingsUI();
        
        window.equipItem = (category, itemId) => this.equipItem(category, itemId);
        window.buyItem = (category, itemId) => this.buyItem(category, itemId);
    },

    setupModals() {
        const settingsModal = document.getElementById('ff-settings-modal');
        document.getElementById('settings-button').onclick = () => settingsModal.classList.add('active');
        document.getElementById('close-ff-settings').onclick = () => { 
            settingsModal.classList.remove('active');
            localStorage.setItem('ff_settings', JSON.stringify(State.gameSettings)); 
            this.applySettingsCallback(); 
        };
        document.querySelectorAll('.ff-tab').forEach(tab => {
            tab.onclick = () => { 
                document.querySelectorAll('.ff-tab').forEach(t => t.classList.remove('active')); 
                document.querySelectorAll('.ff-tab-pane').forEach(p => p.classList.remove('active')); 
                tab.classList.add('active'); document.getElementById(tab.dataset.target).classList.add('active'); 
            };
        });
        document.getElementById('inventory-button').onclick = () => { document.getElementById('inventory-modal').classList.add('visible'); this.renderInventory(); };
        document.getElementById('close-inv').onclick = () => { document.getElementById('inventory-modal').classList.remove('visible'); };
    },

    syncSettingsUI() {
        // AJUSTES GRÁFICOS
        document.querySelectorAll('#setting-calidad button').forEach(b => {
            b.classList.toggle('active', b.dataset.val === State.gameSettings.calidad);
            b.onclick = () => { 
                State.gameSettings.calidad = b.dataset.val; 
                if(State.gameSettings.calidad === 'baja') { State.gameSettings.sombras = 0; State.gameSettings.fps = 30; } 
                else if(State.gameSettings.calidad === 'media') { State.gameSettings.sombras = 1; State.gameSettings.fps = 60; } 
                else if(State.gameSettings.calidad === 'alta') { State.gameSettings.sombras = 2; State.gameSettings.fps = 60; } 
                
                localStorage.setItem('ff_settings', JSON.stringify(State.gameSettings)); 
                this.syncSettingsUI(); this.applySettingsCallback(); 
            };
        });

        document.querySelectorAll('#setting-fps button').forEach(b => {
            b.classList.toggle('active', parseInt(b.dataset.val) === State.gameSettings.fps);
            b.onclick = () => { 
                State.gameSettings.fps = parseInt(b.dataset.val); 
                localStorage.setItem('ff_settings', JSON.stringify(State.gameSettings)); 
                this.syncSettingsUI(); 
            };
        });

        // AUDIO
        const volTV = document.getElementById('setting-volumen-tv');
        volTV.value = State.gameSettings.volumenTV; 
        document.getElementById('vol-tv-val').innerText = `${State.gameSettings.volumenTV}%`;
        volTV.oninput = (e) => { 
            State.gameSettings.volumenTV = parseInt(e.target.value);
            document.getElementById('vol-tv-val').innerText = `${State.gameSettings.volumenTV}%`; 
            if(this.applyAudioCallback) this.applyAudioCallback(); 
        };
        volTV.onchange = () => { localStorage.setItem('ff_settings', JSON.stringify(State.gameSettings)); };
        
        const volPC = document.getElementById('setting-volumen-pc');
        if(volPC) {
            volPC.value = State.gameSettings.volumenPC; 
            document.getElementById('vol-pc-val').innerText = `${State.gameSettings.volumenPC}%`;
            volPC.oninput = (e) => { 
                State.gameSettings.volumenPC = parseInt(e.target.value);
                document.getElementById('vol-pc-val').innerText = `${State.gameSettings.volumenPC}%`; 
                if(this.applyAudioCallback) this.applyAudioCallback(); 
            };
            volPC.onchange = () => { localStorage.setItem('ff_settings', JSON.stringify(State.gameSettings)); };
        }

        const volEf = document.getElementById('setting-volumen-efectos');
        volEf.value = State.gameSettings.volumenEfectos; 
        document.getElementById('vol-efectos-val').innerText = `${State.gameSettings.volumenEfectos}%`;
        volEf.oninput = (e) => { 
            State.gameSettings.volumenEfectos = parseInt(e.target.value);
            document.getElementById('vol-efectos-val').innerText = `${State.gameSettings.volumenEfectos}%`; 
            if(this.applyAudioCallback) this.applyAudioCallback(); 
        };
        volEf.onchange = () => { localStorage.setItem('ff_settings', JSON.stringify(State.gameSettings)); };

        // SISTEMA (FPS y MONEDAS)
        const fpsCheck = document.getElementById('setting-showfps'); fpsCheck.checked = State.gameSettings.mostrarFps;
        fpsCheck.onchange = (e) => { 
            State.gameSettings.mostrarFps = e.target.checked;
            localStorage.setItem('ff_settings', JSON.stringify(State.gameSettings)); 
            this.applySettingsCallback(); 
        };

        const coinsCheck = document.getElementById('setting-showcoins'); 
        if(coinsCheck) {
            coinsCheck.checked = State.gameSettings.mostrarMonedas;
            coinsCheck.onchange = (e) => { 
                State.gameSettings.mostrarMonedas = e.target.checked;
                localStorage.setItem('ff_settings', JSON.stringify(State.gameSettings)); 
                this.applySettingsCallback(); 
            };
        }
    },

    // --- LÓGICA REDISEÑADA DEL INVENTARIO PARA CHIPS HORIZONTALES ---
    renderInventory() {
        const sidebar = document.getElementById('inv-sidebar'), content = document.getElementById('inv-content');
        sidebar.innerHTML = ''; content.innerHTML = '';
        
        const groupsContainer = document.createElement('div');
        groupsContainer.className = 'groups-container';
        
        const catsContainer = document.createElement('div');
        catsContainer.className = 'cats-container';

        inventoryGroups.forEach(group => {
            const groupBtn = document.createElement('button'); 
            groupBtn.className = `group-btn ${this.openGroup === group.id ? 'active' : ''}`;
            groupBtn.innerHTML = `<span>${group.emoji} <span class="group-name">${group.label}</span></span>`;
            groupBtn.onclick = () => { 
                this.openGroup = group.id; 
                if(group.categories.length > 0) this.currentCategory = group.categories[0];
                this.renderInventory(); 
            };
            groupsContainer.appendChild(groupBtn);
            
            if (this.openGroup === group.id) {
                group.categories.forEach(catKey => {
                    const catData = State.inventoryData[catKey]; if(!catData) return;
                    const btn = document.createElement('button'); 
                    btn.className = `cat-btn ${catKey === this.currentCategory ? 'active' : ''}`;
                    btn.innerHTML = `<span>${catData.label}</span>`;
                    btn.onclick = () => { this.currentCategory = catKey; this.renderInventory(); };
                    catsContainer.appendChild(btn);
                });
            }
        });

        sidebar.appendChild(groupsContainer);
        sidebar.appendChild(catsContainer);

        const catData = State.inventoryData[this.currentCategory];
        if (!catData) return;
        for (let itemId in catData.items) {
            const item = catData.items[itemId];
            let isEq = catData.type === 'multiple' ? catData.equipped.includes(itemId) : catData.equipped === itemId;
            const card = document.createElement('div'); card.className = 'item-card';
            const prev = document.createElement('div'); prev.className = 'item-preview';
            if (item.preview) { 
                const img = document.createElement('img');
                img.src = item.preview; img.alt = item.name;
                img.onerror = () => { prev.innerHTML = `<span>${catData.emoji}</span>`; }; prev.appendChild(img);
            } else prev.innerHTML = `<span>${catData.emoji}</span>`;
            
            let btn = item.owned ?
            (isEq ? `<button class="item-btn btn-equipped" onclick="window.equipItem('${this.currentCategory}', '${itemId}')">${catData.type === 'multiple' ? 'Quitar ✓' : 'Equipado ✓'}</button>` : `<button class="item-btn btn-equip" onclick="window.equipItem('${this.currentCategory}', '${itemId}')">Equipar</button>`) : `<button class="item-btn btn-buy" onclick="window.buyItem('${this.currentCategory}', '${itemId}')">Comprar 🪙${item.price}</button>`;
            
            card.innerHTML = `<div>${prev.outerHTML}<h4>${item.name}</h4><div class="item-price">${item.owned ? 'Adquirido' : `🪙 ${item.price}`}</div></div>${btn}`; content.appendChild(card);
        }
    },

    equipItem(category, itemId) {
        const catData = State.inventoryData[category];
        if (catData.type === 'multiple') { 
            const idx = catData.equipped.indexOf(itemId);
            if (idx > -1) catData.equipped.splice(idx, 1); else catData.equipped.push(itemId); 
            TVManager.updatePlaylist();
        } else { 
            catData.equipped = itemId;
            const itemData = catData.items[itemId];
            this.loadItemCallback(category, itemData.file, false);
            if (category === 'foco' && itemData.baseFile) this.loadItemCallback('base_foco', itemData.baseFile, false);
            if (category === 'tele' && itemData.baseFile) this.loadItemCallback('pantalla_tv', itemData.baseFile, false);
            if (category === 'pc') {
                if (itemData.baseFile) this.loadItemCallback('pantalla_pc', itemData.baseFile, false);
                this.loadItemCallback('pantalla_pc2', 'pantalla_pc2.glb', false); 
            }
        }
        State.saveGame();
        this.renderInventory();
    },

    buyItem(category, itemId) {
        let item = State.inventoryData[category].items[itemId];
        if (State.playerCoins >= item.price) { 
            State.playerCoins -= item.price;
            item.owned = true; State.saveGame(); this.renderInventory(); 
        } else alert("No tienes suficientes monedas.");
    }
};