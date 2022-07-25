// Simulador de Seguro de Autos:
// El usuario debe ingresar sus datos personales mediante un input y los datos de su auto mediante un select.
// Se hacen calculos según la selección del año, marca, version, uso y tipo de cobertura. Se crean clientes y se agregan al DOM.
// Los clientes agregados se pueden ordenar por precio, eliminar o seleccionar.

// Variables
let formulario = document.querySelector("#formulario");
let divResultado = document.querySelector("#divResultado");
let divEquipo = document.querySelector("#divEquipo");
let selectOrdenar = document.querySelector("#selectOrdenar");
let btnEnviar = document.querySelector("#btnEnviar");

let precioBase = 2000;
let arregloClientes = [];

// Clases
class Cliente {
  constructor(
    nombre,
    apellido,
    email,
    dni,
    tel,
    base,
    anio,
    marca,
    version,
    uso,
    cobertura
  ) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.dni = dni;
    this.tel = tel;
    this.base = base;
    this.anio = anio;
    this.marca = marca;
    this.version = version;
    this.uso = uso;
    this.cobertura = cobertura;
    this.totalSeguro = this.calcularSeguro();
    this.id = this.crearID();
  }
  calcularSeguro() {
    let total = 0;
    // Segun marca:
    switch (this.marca) {
      case "Wolkswagen":
        total = this.base * 2;
        break;
      case "Ford":
        total = this.base * 2.5;
        break;
      case "Chevrolet":
        total = this.base * 3;
        break;
      case "Audi":
        total = this.base * 4;
        break;
      case "BMW":
        total = this.base * 4.5;
        break;

      default:
        break;
    }
    // Segun año:
    // Obtener la diferencia entre 2022 y el año seleccionado:
    const diferencia = 2022 - parseInt(this.anio);

    // El valor aumenta un 5% cada año:
    total = total - (diferencia * 5 * total) / 100;

    // Segun version:
    this.version === "Manual" ? (total = total * 1.2) : (total = total * 1.5);

    // Segun tipo de uso:
    this.uso === "Particular" ? (total = total * 1.2) : (total = total * 1.5);

    // Segun cobertura:
    this.cobertura === "Terceros"
      ? (total = total * 1.2)
      : (total = total * 1.5);
    return Math.round(total);
  }
  crearID() {
    return Date.now();
  }
}

// Eventos
document.addEventListener("DOMContentLoaded", cargarStorage);
document.addEventListener("DOMContentLoaded", cargarDatosEquipo);

formulario.addEventListener("submit", enviarFormulario);
divResultado.addEventListener("click", eliminarCliente);
divResultado.addEventListener("click", seleccionarCliente);
selectOrdenar.addEventListener("change", ordenarResultado);

// Cargar arregloClientes en localStorage:
function cargarStorage() {
  // Obtener del localStorage:
  let arregloStorage = JSON.parse(localStorage.getItem("arregloClientes"));
  arregloStorage === null
    ? actualizarStorage()
    : (arregloClientes = arregloStorage);

  // CrearHTML:
  crearHTML();
}

// Funcion para el submit del formulario:
function enviarFormulario(e) {
  // Detener submit
  e.preventDefault();

  // Obtener del DOM
  const nombre = document.querySelector("#nombre").value;
  const apellido = document.querySelector("#apellido").value;
  const email = document.querySelector("#email").value;
  const dni = document.querySelector("#dni").value;
  const tel = document.querySelector("#tel").value;
  const anio = document.querySelector("#anio").value;
  const marca = document.querySelector("#marca").value;
  const version = document.querySelector("#version").value;
  const uso = document.querySelector("#uso").value;
  const cobertura = document.querySelector("#cobertura").value;

  // Validar
  const validacionCliente = validarCliente(nombre, apellido, email, dni, tel);
  const validacionAuto = validarAuto(anio, marca, version, uso, cobertura);

  // Si se cumple la validacion:
  if (validacionCliente && validacionAuto) {
    // Desactivar btnEnviar:
    btnEnviarDesactivar();

    // Mostrar msj:
    msjAgregarCliente("success", "Cliente agregado a la lista");

    // Instanciar objeto cliente
    const cliente = new Cliente(
      formatearString(nombre),
      formatearString(apellido),
      email.toLowerCase(),
      dni,
      tel,
      precioBase,
      anio,
      marca,
      version,
      uso,
      cobertura
    );

    // Crear ID:
    cliente.crearID();

    // Calcular seguro de auto:
    cliente.calcularSeguro();

    // Agregar cliente al arreglo de clientes:
    agregarClientes(arregloClientes, cliente);

    // Limpiar consola:
    console.clear();

    // Mostrar arreglo:
    mostrarArreglo(arregloClientes);

    // Limpiar formulario:
    formulario.reset();

    // Limpiar html:
    limpiarHTML(divResultado);

    // Crear html:
    crearHTML();

    // Actualizar storage
    actualizarStorage();
  } else {
    // Mostrar msj de error:
    btnEnviarDesactivar();
    msjAgregarCliente(
      "error",
      "Error! Campo incompleto o dato no válido"
      //"Error! Debe completar todos los campos correctamente"
    );
  }
}

// Funciones:
// Validar datos ingresados del auto:
function validarAuto(anio, marca, version, uso, cobertura) {
  return (
    anio != "" && marca != "" && version != "" && uso != "" && cobertura != ""
  );
}

// Validar datos ingresados de la persona:
function validarCliente(nombre, apellido, email, dni, tel) {
  // Expresión regular que valida los nombres y/o apellidos. Permite letras en mayúsculas y minúsculas con tilde, espacios y apostrofes.
  const expresion = new RegExp("^[A-ZÑa-zñáéíóúÁÉÍÓÚ'° ]+$");

  // Validar que los campos no esten vacios:
  if (nombre != "" && apellido != "" && email != "" && dni != "" && tel != "") {
    // Validar que que se cumpla la expresion:
    if (expresion.test(nombre) && expresion.test(apellido)) {
      return true;
    }
  }
  return false;
}

// Eliminar espacios al principio y final, dejar solo un espacio entra palabras, convertir primer letra a mayuscula:
function formatearString(datos) {
  return datos
    .trim()
    .replace(/\s\s+/g, " ")
    .replace(/\b\w/g, (letra) => letra.toUpperCase());
}

// Agregar un cliente al arreglo:
function agregarClientes(arreglo, cliente) {
  arreglo.push(cliente);
}

// Mostrar datos del cliente:
function mostrarCliente(objeto) {
  console.clear();
  for (const propiedad in objeto) {
    console.log(propiedad + ":" + objeto[propiedad]);
  }
}

//  Mostrar datos del arreglo:
function mostrarArreglo(arreglo) {
  console.clear();
  console.log(`Largo actual del arreglo de clientes:${arreglo.length}`);
  arreglo.map((elemento) => console.log(elemento));
}

// Limpiar html:
function limpiarHTML(nombreDiv) {
  while (nombreDiv.firstChild) {
    nombreDiv.removeChild(nombreDiv.firstChild);
  }
}

// Desactivar/Activar btnEnviar:
function btnEnviarDesactivar() {
  // Desactivar btnEnviar:
  btnEnviar.disabled = true;

  // Borrar msj dsp de 2 segundos:
  setTimeout(function () {
    // Activar btnEnviar:
    btnEnviar.disabled = false;
  }, 2000);
}

// Crear HTML:
function crearHTML() {
  // Activar select:
  activarSelect();

  // Crear HTML
  arregloClientes.forEach((elemento) => {
    // Destructuring de arregloClientes:
    let {
      nombre,
      apellido,
      email,
      dni,
      tel,
      precioBase,
      anio,
      marca,
      version,
      uso,
      cobertura,
      totalSeguro,
      id,
    } = elemento;

    // Crear divCliente:
    const divCliente = document.createElement("div");

    // Asignar id a divCliente:
    divCliente.id = id;

    // Agregar contenido a divCLiente:
    divCliente.innerHTML = `
      <div class="container ">
              <div class="row justify-content-center mt-2 mb-2">
                <div class="col-md-12 col-xl-10">
                  <div class="card shadow-0 border rounded-3">
                    <div class="card-body">
                      <div class="row">
                        <div class="col-md-12 col-lg-3 col-xl-3 mt-2 mb-3 mb-lg-0">
                          <div class="bg-image hover-zoom ripple rounded ripple-surface">
                            <img src="img/${marca}.jpg"
                              class="w-100" />
                            <a href="#!">
                              <div class="hover-overlay">
                                <div class="mask" style="background-color: rgba(253, 253, 253, 0.15);"></div>
                              </div>
                            </a>
                          </div>
                        </div>
                        <div class="col-md-6 col-lg-6 col-xl-6">
                          <h5 class="mb-0">${marca} ${anio}</h5>
                          <div class="mt-0 mb-1 text-muted small">
                            <span>Versión ${version}</span>
                            <span> • </span>
                            <span>Uso ${uso}<br /></span>
                          </div>
                          <div class="d-flex flex-row">
                            <div class="text-danger mb-0 me-2">
                              <i class='bx bxs-star bx-sm'></i>
                              <i class='bx bxs-star bx-sm'></i>
                              <i class='bx bxs-star bx-sm'></i>
                              <i class='bx bxs-star bx-sm'></i>                           
                            </div>
                          </div>
                          
                          <div class="mb-0 small">
                            <span class="fw-lighter text-muted">Nombre: </span><span class="bold-500">${nombre} ${apellido}</span>                      
                          </div>
                          <div class="mb-0 small">
                            <span class="fw-lighter text-muted">Email: </span><span class="bold-500">${email}</span>                          
                          </div>
                          <div class="mb-2 small ">                             
                            <span class="fw-lighter text-muted">DNI: </span><span class="bold-500">${dni}</span>
                            <span class="fw-lighter text-muted"> • </span>
                            <span class="fw-lighter text-muted">Tel: </span><span class="bold-500">15-${tel}<br /></span>
                          </div>                  
                        </div>
                        <div class="col-md-6 col-lg-3 col-xl-3 border-sm-start-none border-start">
                          <div class="d-flex flex-row align-items-center mb-1">
                            <h4 class="mb-1 me-1">$${totalSeguro}</h4>
                            <span class="text-muted">p/mes</span>                  
                          </div>
                          <h6 class="text-success">Cobertura ${cobertura}</h6>
                          <div class="d-flex flex-column mt-4">
                          <button class="btn btn-primary btn-sm seleccionarCliente" type="button" data-id = ${id}>Seleccionar</button>
                          <button class="btn btn-outline-danger btn-sm mt-2 eliminarCliente" type="button" data-id = ${id}>Eliminar</button> 
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>            
            </div>
      `;
    // Agregar divCliente al divResultado:
    divResultado.appendChild(divCliente);
  });
}

// Actualizar el localStorage:
function actualizarStorage() {
  localStorage.setItem("arregloClientes", JSON.stringify(arregloClientes));
}

// Seleccionar un cliente:
function seleccionarCliente(evento) {
  if (evento.target.classList.contains("seleccionarCliente")) {
    // Limpiar HTML:
    limpiarHTML(divResultado);

    // Obtener ID del DOM:
    const id = evento.target.dataset.id;

    // Actualizar arreglo de clientes segun ID:
    arregloClientes = arregloClientes.filter((elemento) => elemento.id == id);

    // Crear HTML:
    crearHTML(arregloClientes);

    // Actualizar storage:
    actualizarStorage();
    console.log(arregloClientes);

    // Mostrar msj:
    msjConfirmar(
      "Cliente seleccionado!",
      "Gracias, en breve nos pondremos en contacto.",
      "success",
      "#0d6efd",
      undefined,
      true
    );

    // Scroll de pantalla:
    scrollPantalla("center");
  }
}

// Eliminar un cliente:
function eliminarCliente(evento) {
  if (evento.target.classList.contains("eliminarCliente")) {
    // Mostrar msj:
    Swal.fire({
      title: "Estás seguro?",
      text: "No podrás revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC3545",
      cancelButtonColor: "#7F849F",
      confirmButtonText: "Si, eliminar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        msjConfirmar(
          "Eliminado!",
          "El cliente ha sido eliminado.",
          "success",
          "#0d6efd",
          2000,
          false
        );
        // Limpiar HTML:
        limpiarHTML(divResultado);

        // Obtener ID del DOM:
        const id = evento.target.dataset.id;

        // Actualizar arreglo de clientes segun ID:
        arregloClientes = arregloClientes.filter(
          (elemento) => elemento.id != id
        );

        // Crear HTML:
        crearHTML(arregloClientes);

        // Actualizar storage:
        actualizarStorage();
        console.log(arregloClientes);
      }
    });
  }
}

// Ordenar segun el valor de totalSeguro:
function ordenarResultado(evento) {
  if (evento.target.value === "descendente") {
    arregloClientes = arregloClientes.sort(
      (elemento1, elemento2) => elemento1.totalSeguro - elemento2.totalSeguro
    );
  }
  if (evento.target.value === "ascendente") {
    arregloClientes = arregloClientes
      .sort(
        (elemento1, elemento2) => elemento1.totalSeguro - elemento2.totalSeguro
      )
      .reverse();
  }
  limpiarHTML(divResultado);
  actualizarStorage(arregloClientes);
  crearHTML(arregloClientes);
  msjAgregarCliente("success", "Lista ordenada");
  scrollPantalla("nearest");
  evento.target.value = "";
}

// Activar/desactivar selectOrdenar:
function activarSelect() {
  arregloClientes.length > 0
    ? (selectOrdenar.disabled = false)
    : (selectOrdenar.disabled = true);
}

// Msj agregar cliente:
function msjAgregarCliente(icono, title) {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: false,
  });
  Toast.fire({
    icon: icono,
    title: title,
  });
}

// Msj confirmar:
function msjConfirmar(
  title,
  text,
  icon,
  confirmButtonColor,
  timer,
  showConfirmButton
) {
  Swal.fire({
    title: title,
    text: text,
    icon: icon,
    confirmButtonColor: confirmButtonColor,
    timer: timer,
    showConfirmButton: showConfirmButton,
    confirmButtonText: "Aceptar",
  });
}

// Hacer scroll:
function scrollPantalla(posicion) {
  divResultado.scrollIntoView({ block: posicion, behavior: "smooth" });
}

// Funcion asincronica:
async function cargarDatosEquipo() {
  // Cargar db.json desde JSON Server evita el bloqueo CORS que aparece cuando se intenta cargar de forma local.
  // Obtener url:
  const url = `https://my-json-server.typicode.com/diegomerola/JSON/equipo`;

  // Hacer consulta:
  const respuesta = await fetch(url);
  const resultado = await respuesta.json();
  console.log(resultado);

  // Crear html
  crearHtmlEquipo(resultado);
}

// Funcion crearHtmlTestimonios:
function crearHtmlEquipo(data) {
  data.map((elemento) => {
    // Aplicar destructuring:
    let { nombre, puesto, email, tel, imagen } = elemento;

    // Crear div:
    const div = document.createElement("div");
    div.classList.add("team-member", "col-md-4");

    // Agregar contenido a div:
    div.innerHTML = `
      <img class="team-member-img img-fluid rounded-circle p-4 border border-1 border-primary" src="./img/${imagen}.jpg" alt="Card image">
        <ul class="team-member-caption list-unstyled text-center pt-4 text-muted light-300">
            <li class="text-dark semi-bold-500">${nombre}</li>
            <li class="fst-italic">${puesto}</li>
            <li class="fst-italic">${email}</li>
            <li class="fst-italic">${tel}</li>
        </ul>         
    `;
    // Agregar div a divEquipo:
    divEquipo.appendChild(div);
  });
}
