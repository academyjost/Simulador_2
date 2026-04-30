function recuperaraTexto(idComponente) {
    return document.getElementById(idComponente).value;
}

function recuperarInt(idComponente) {
    return parseInt(recuperaraTexto(idComponente));
}

function recuperarFloat(idComponente) {
    return parseFloat(recuperaraTexto(idComponente));
}

function mostrarTexto(idComponente, mensaje) {
    document.getElementById(idComponente).innerText = mensaje;
}

function mostrarTextoEnCaja(idComponente, mensaje) {
    document.getElementById(idComponente).value = mensaje;
}