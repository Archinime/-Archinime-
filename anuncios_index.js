// ============================================
// ARCHIVO DE ANUNCIOS PARA ARCHINIME
// ============================================

const listaAnuncios = [
  {
    id: 'banner_nativo_1',
    descripcion: 'Banner nativo 1:2',
    codigo: `
      <script async="async" data-cfasync="false" src="https://pl28551391.profitablecpmratenetwork.com/9cef0d62800a6a4f5bd25c7a50157dba/invoke.js"></script>
      <div id="container-9cef0d62800a6a4f5bd25c7a50157dba"></div>
    `
  }
  // Para añadir otro banner, copia el bloque y cambia el id y el código.
];

function obtenerHTMLAnuncio(anuncioId) {
  const anuncio = listaAnuncios.find(a => a.id === anuncioId);
  if (!anuncio) return '<div>Anuncio no disponible</div>';
  return anuncio.codigo;
}

window.listaAnuncios = listaAnuncios;
window.obtenerHTMLAnuncio = obtenerHTMLAnuncio;