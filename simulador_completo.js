let clientes = [];
let creditos = [];
let tasaInteres = 15;
let clienteSeleccionado = null;

// --- NAVEGACIÓN (Corrección del error classList) ---
function ocultarSecciones() {
    const secciones = document.querySelectorAll("section");
    secciones.forEach(sec => sec.classList.remove("activa"));
}

function mostrarSeccion(id) {
    ocultarSecciones();
    let seccion = document.getElementById(id);
    if (seccion) {
        seccion.classList.add("activa");
    } else {
        console.error("No se encontró el ID: " + id);
    }
}

// --- PARÁMETROS ---
function guardarTasa() {
    let tasa = recuperarFloat("tasaInteres");
    if (tasa >= 10 && tasa <= 20) {
        tasaInteres = tasa;
        mostrarTexto("mensajeTasa", "Tasa guardada: " + tasa + "%");
    } else {
        mostrarTexto("mensajeTasa", "Error: Debe ser entre 10 y 20");
    }
}

// --- CLIENTES ---
function guardarCliente() {
    let cedula = recuperarTexto("cedula");
    let nombre = recuperarTexto("nombre");
    let apellido = recuperarTexto("apellido");
    let ingresos = recuperarFloat("ingresos");
    let egresos = recuperarFloat("egresos");

    let index = clientes.findIndex(c => c.cedula === cedula);
    if (index === -1) {
        clientes.push({ cedula, nombre, apellido, ingresos, egresos });
    } else {
        clientes[index] = { cedula, nombre, apellido, ingresos, egresos };
    }
    pintarClientes();
    limpiar();
}

function pintarClientes() {
    let tabla = document.getElementById("tablaClientes");
    tabla.innerHTML = "";
    clientes.forEach(c => {
        tabla.innerHTML += `<tr>
            <td>${c.cedula}</td><td>${c.nombre}</td><td>${c.ingresos}</td><td>${c.egresos}</td>
            <td><button onclick="seleccionarCliente('${c.cedula}')">Editar</button></td>
        </tr>`;
    });
}

function seleccionarCliente(cedula) {
    let c = clientes.find(cli => cli.cedula === cedula);
    if (c) {
        mostrarTextoEnCaja("cedula", c.cedula);
        mostrarTextoEnCaja("nombre", c.nombre);
        mostrarTextoEnCaja("apellido", c.apellido);
        mostrarTextoEnCaja("ingresos", c.ingresos);
        mostrarTextoEnCaja("egresos", c.egresos);
        document.getElementById("cedula").readOnly = true;
    }
}

// --- CRÉDITOS ---
function buscarClienteCredito() {
    let ced = recuperarTexto("buscarCedulaCredito");
    clienteSeleccionado = clientes.find(c => c.cedula === ced);
    if (clienteSeleccionado) {
        mostrarTexto("datosClienteCredito", `Cliente: ${clienteSeleccionado.nombre} ${clienteSeleccionado.apellido}`);
    } else {
        mostrarTexto("datosClienteCredito", "No encontrado");
    }
}

function calcularCredito() {
    let monto = recuperarFloat("montoCredito");
    let plazo = recuperarInt("plazoCredito");
    if (clienteSeleccionado && monto > 0) {
        let cuota = (monto + (monto * (tasaInteres/100))) / plazo;
        mostrarTexto("resultadoCredito", "Cuota mensual estimada: $" + cuota.toFixed(2));
        document.getElementById("btnSolicitarCredito").disabled = false;
    }
}

function solicitarCredito() {
    let monto = recuperarFloat("montoCredito");
    let cuota = (monto + (monto * (tasaInteres/100))) / recuperarInt("plazoCredito");
    creditos.push({
        cedula: clienteSeleccionado.cedula,
        nombre: clienteSeleccionado.nombre,
        monto: monto,
        tasa: tasaInteres,
        cuota: cuota.toFixed(2)
    });
    pintarCreditos();
    mostrarSeccion('listaCreditos');
}

function pintarCreditos() {
    let tabla = document.getElementById("tablaCreditos");
    tabla.innerHTML = "";
    creditos.forEach(cr => {
        tabla.innerHTML += `<tr>
            <td>${cr.cedula}</td><td>${cr.nombre}</td><td>${cr.monto}</td><td>${cr.tasa}%</td><td>${cr.cuota}</td>
        </tr>`;
    });
}

function limpiar() {
    ["cedula", "nombre", "apellido", "ingresos", "egresos"].forEach(id => mostrarTextoEnCaja(id, ""));
    document.getElementById("cedula").readOnly = false;
}