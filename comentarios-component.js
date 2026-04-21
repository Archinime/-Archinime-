class ComentariosSistema extends HTMLElement {
  connectedCallback() {
    const animeId = this.getAttribute('anime-id');
    const season = this.getAttribute('season');
    const episode = this.getAttribute('episode');
    // Aquí copias toda la lógica de comentarios.js pero sin depender de window
    this.innerHTML = `<div class="comentarios-container">Cargando...</div>`;
    this.cargarComentarios(animeId, season, episode);
  }
}
customElements.define('comentarios-sistema', ComentariosSistema);