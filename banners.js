// banners.js - Gestor de Publicidad para Archinime

const AdManager = {
  adYaInsertado: false,
  
  // Configuración de tu red publicitaria
  config: {
    key: '49281ce83eb56f120e34ad617cfd6996',
    format: 'iframe',
    height: 300,
    width: 160,
    params: {}
  },

  // Verifica si es el momento adecuado para insertar un anuncio
  debeInsertar: function(isAppend, totalAnimes) {
    // Solo inserta si NO es infinite scroll (primera carga), si no se ha insertado ya, y si hay suficientes animes
    return !isAppend && !this.adYaInsertado && totalAnimes > 3;
  },

  // Calcula una posición aleatoria en el grid para camuflar el anuncio
  obtenerIndiceAleatorio: function(totalAnimes) {
    const min = 2; // Aparece después de la 3ra tarjeta (índice 2)
    const max = totalAnimes - 2; // Aparece antes de la penúltima
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // Crea la estructura HTML (la tarjeta) para el anuncio
  crearTarjetaAd: function() {
    const adCard = document.createElement('div');
    adCard.className = 'card ad-card';
    
    // Generamos un ID único para evitar conflictos si en el futuro añades más
    const adContainerId = 'ad-container-' + Date.now();
    
    adCard.innerHTML = `
      <div id="${adContainerId}" class="ad-container"></div>
      <div class="info" style="pointer-events: none;">
        <strong>Patrocinado</strong>
        <span class="rating-value" style="background: var(--neon-pink); color: white;">AD</span>
      </div>
    `;
    
    this.adYaInsertado = true; // Marcamos que ya se insertó
    
    return { adCard, adContainerId };
  },

  // Inyecta los scripts de la red publicitaria de forma segura en el DOM
  inyectarScripts: function(adContainerId) {
    setTimeout(() => {
      const container = document.getElementById(adContainerId);
      if (container) {
        // 1. Script de configuración (atOptions)
        const confScript = document.createElement('script');
        confScript.type = 'text/javascript';
        confScript.innerHTML = `
          atOptions = {
            'key' : '${this.config.key}',
            'format' : '${this.config.format}',
            'height' : ${this.config.height},
            'width' : ${this.config.width},
            'params' : {}
          };
        `;
        container.appendChild(confScript);

        // 2. Script de invocación
        const invokeScript = document.createElement('script');
        invokeScript.type = 'text/javascript';
        invokeScript.src = `https://www.highperformanceformat.com/${this.config.key}/invoke.js`;
        container.appendChild(invokeScript);
      }
    }, 50); // Pequeño retraso para asegurar que el HTML ya se pintó
  },

  // Reinicia el estado (necesario cuando el usuario usa filtros o busca algo nuevo)
  reset: function() {
    this.adYaInsertado = false;
  }
};