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
    let telefono = recuperarTexto("telefono");

    if (!cedula || !nombre || !apellido || isNaN(ingresos) || isNaN(egresos)) {
        alert("Por favor, complete todos los campos correctamente.");
        return;
    }

    let index = clientes.findIndex(c => c.cedula === cedula);
    if (index === -1) {
        clientes.push({ cedula, nombre, apellido, ingresos, egresos, telefono });
    } else {
        clientes[index] = { cedula, nombre, apellido, ingresos, egresos, telefono };
    }
    pintarClientes();
    limpiar();
}

// --- ACTUALIZAR TABLA DE CLIENTES (Con botón borrar) ---
function pintarClientes() {
    let tabla = document.getElementById("tablaClientes");
    tabla.innerHTML = "";
    clientes.forEach(c => {
        tabla.innerHTML += `<tr>
            <td>${c.cedula}</td>
            <td>${c.nombre}</td>
            <td>${c.apellido}</td>
            <td>${c.ingresos}</td>
            <td>${c.egresos}</td>
            <td>${c.telefono}</td>
            <td>
                <button onclick="seleccionarCliente('${c.cedula}')">Editar</button>
                <button onclick="eliminarCliente('${c.cedula}')" style="background-color: #e74c3c; color: white; border: none; border-radius: 3px; cursor: pointer;">Borrar</button>
            </td>
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
        mostrarTextoEnCaja("telefono", c.telefono);
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

// --- SOLICITAR CRÉDITO (Con lógica de Aceptado/Rechazado) ---
function solicitarCredito() {
    let monto = recuperarFloat("montoCredito");
    let plazo = recuperarInt("plazoCredito");
    let cuota = (monto + (monto * (tasaInteres / 100))) / plazo;

    // LÓGICA DE VALIDACIÓN:
    // Calculamos la capacidad de pago (Ingresos - Egresos)
    let capacidadPago = clienteSeleccionado.ingresos - clienteSeleccionado.egresos;
    let estado = (cuota <= capacidadPago) ? "Aceptado" : "Rechazado";

    creditos.push({
        cedula: clienteSeleccionado.cedula,
        nombre: clienteSeleccionado.nombre,
        apellido: clienteSeleccionado.apellido, // Importante: incluir apellido
        monto: monto,
        tasa: tasaInteres,
        plazo: plazo, // Importante: incluir plazo
        cuota: cuota.toFixed(2),
        estado: estado
    });

    pintarCreditos();
    mostrarSeccion('listaCreditos');
}
// --- PINTAR HISTORIAL (Asegurando que coincidan las columnas) ---
function pintarCreditos() {
    let tabla = document.getElementById("tablaCreditos");
    tabla.innerHTML = "";
    creditos.forEach(cr => {
        // Estilo visual para el estado
        let colorEstado = (cr.estado === "Aceptado") ? "#2ecc71" : "#e74c3c";

        tabla.innerHTML += `<tr>
            <td>${cr.cedula}</td>
            <td>${cr.nombre}</td>
            <td>${cr.apellido}</td>
            <td>$${cr.monto}</td>
            <td>${cr.tasa}%</td>
            <td>${cr.plazo} meses</td>
            <td>$${cr.cuota}</td>
            <td>$${cr.telefono}</td>
            <td style="color: ${colorEstado}; font-weight: bold;">${cr.estado}</td>
        </tr>`;
    });
}

function limpiar() {
    ["cedula", "nombre", "apellido", "ingresos", "egresos", "telefono"].forEach(id => mostrarTextoEnCaja(id, ""));
    document.getElementById("cedula").readOnly = false;
}
// --- FUNCIÓN PARA ELIMINAR CLIENTES ---
function eliminarCliente(cedula) {
    // Filtramos el arreglo
    clientes = clientes.filter(c => c.cedula !== cedula);
    
    // Si el cliente borrado estaba siendo usado en una simulación, reseteamos
    if (clienteSeleccionado && clienteSeleccionado.cedula === cedula) {
        clienteSeleccionado = null;
        mostrarTexto("datosClienteCredito", "Seleccione un cliente válido");
        document.getElementById("btnSolicitarCredito").disabled = true;
    }
    
    pintarClientes(); // Refrescamos la tabla de clientes
}