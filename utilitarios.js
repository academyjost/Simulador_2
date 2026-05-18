function recuperarTexto(id){ return document.getElementById(id).value; }
function recuperarInt(id){ return parseInt(recuperarTexto(id)); }
function recuperarFloat(id){ return parseFloat(recuperarTexto(id)); }
function mostrarTexto(id, m){ document.getElementById(id).innerText = m; }
function mostrarTextoEnCaja(id, m){ document.getElementById(id).value = m; }