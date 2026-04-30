// Estado global de la aplicación[cite: 7]
let clientes = [];
let tasaInteresGlobal = 15;
let clienteSeleccionado = null;

// --- PARTE 1: NAVEGACIÓN ---
function ocultarSecciones() {
    const secciones = document.querySelectorAll("section");
    secciones.forEach(sec => sec.classList.remove("activa"));
}

function mostrarSeccion(id) {
    ocultarSecciones();
    document.getElementById(id).classList.add("activa");
}

// --- PARTE 2: CONFIGURAR TASA ---
function guardarTasa() {
    let tasa = recuperarFloat("tasaInteres"); // Uso de utilitario
    
    if (tasa >= 10 && tasa <= 20) {
        tasaInteresGlobal = tasa;
        mostrarTexto("mensajeTasa", "Tasa configurada correctamente: " + tasa + "%");
        document.getElementById("mensajeTasa").className = "mensaje-exito";
    } else {
        mostrarTexto("mensajeTasa", "La tasa debe estar entre 10% y 20%");
        document.getElementById("mensajeTasa").className = "mensaje-error";
    }
}

// --- PARTE 3: ADMINISTRACIÓN DE CLIENTES ---
function guardarCliente() {
    const cedula = recuperaraTexto("cedula");
    const nombre = recuperaraTexto("nombre");
    const apellido = recuperaraTexto("apellido");
    const ingresos = recuperarFloat("ingresos");
    const egresos = recuperarFloat("egresos");

    // Buscamos si el cliente ya existe
    let index = clientes.findIndex(c => c.cedula === cedula);

    if (index === -1) {
        // Crear nuevo cliente
        let nuevoCliente = { cedula, nombre, apellido, ingresos, egresos };
        clientes.push(nuevoCliente);
    } else {
        // Actualizar existente
        clientes[index].nombre = nombre;
        clientes[index].apellido = apellido;
        clientes[index].ingresos = ingresos;
        clientes[index].egresos = egresos;
    }

    pintarClientes();
    limpiar();
}

function pintarClientes() {
    const tabla = document.getElementById("tablaClientes");
    tabla.innerHTML = ""; // Limpiar antes de renderizar

    clientes.forEach(cliente => {
        let fila = `<tr>
            <td>${cliente.cedula}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.apellido}</td>
            <td>${cliente.ingresos}</td>
            <td>${cliente.egresos}</td>
            <td>
                <button onclick="seleccionarCliente('${cliente.cedula}')">Actualizar</button>
            </td>
        </tr>`;
        tabla.innerHTML += fila;
    });
}

function seleccionarCliente(cedula) {
    let cliente = clientes.find(c => c.cedula === cedula);
    if (cliente) {
        mostrarTextoEnCaja("cedula", cliente.cedula);
        mostrarTextoEnCaja("nombre", cliente.nombre);
        mostrarTextoEnCaja("apellido", cliente.apellido);
        mostrarTextoEnCaja("ingresos", cliente.ingresos);
        mostrarTextoEnCaja("egresos", cliente.egresos);
        
        // Bloqueamos la cédula para que no se edite el ID único
        document.getElementById("cedula").readOnly = true;
    }
}

function limpiar() {
    mostrarTextoEnCaja("cedula", "");
    mostrarTextoEnCaja("nombre", "");
    mostrarTextoEnCaja("apellido", "");
    mostrarTextoEnCaja("ingresos", "");
    mostrarTextoEnCaja("egresos", "");
    document.getElementById("cedula").readOnly = false;
}