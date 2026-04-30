function recuperaraTexto(id){ return document.getElementById(id).value; }
function recuperarInt(id){ return parseInt(recuperaraTexto(id)); }
function recuperarFloat(id){ return parseFloat(recuperaraTexto(id)); }
function mostrarTexto(id, m){ document.getElementById(id).innerText = m; }
function mostrarTextoEnCaja(id, m){ document.getElementById(id).value = m; }