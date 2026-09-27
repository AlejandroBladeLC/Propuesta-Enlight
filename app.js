const nombresEtapas = [
  "Comercial",
  "Levantamiento",
  "Ingeniería",
  "Compra de materiales",
  "Instalación",
  "Encendido"
];

const proyectos = {
      proyecto0: {
    nombre: "Proyecto nuevo · Cliente Demo",
    etapa: 0,
    actualizacion: "26 de septiembre de 2026",
    porcentaje: 0,
    responsable: "Laura Méndez · Comercial",
    contacto: "Responsable del primer contacto",
    accion: "Confirmar la reunión inicial",
    fechaAccion: "Fecha sugerida: 29 de septiembre de 2026",
    resumen: [
      "Se recibió la solicitud del cliente.",
      "El equipo comercial prepara la reunión inicial.",
      "El levantamiento comenzará después de acordar el alcance."
    ]
  },
  proyecto1: {
    nombre: "Proyecto residencial · Familia García",
    etapa: 2,
    actualizacion: "25 de septiembre de 2026",
    porcentaje: 50,
    responsable: "Mariana Torres · Ingeniería",
    contacto: "Responsable de la propuesta técnica",
    accion: "Validar la propuesta de ingeniería",
    fechaAccion: "Fecha sugerida: 2 de octubre de 2026",
    resumen: [
      "Se completó el levantamiento de información del inmueble.",
      "El equipo preparó la propuesta técnica del proyecto.",
      "El siguiente paso es recibir tu validación para continuar."
    ]
  },

  proyecto2: {
    nombre: "Proyecto empresarial · Oficinas Norte",
    etapa: 4,
    actualizacion: "25 de septiembre de 2026",
    porcentaje: 80,
    responsable: "Daniel Ríos · Instalación",
    contacto: "Responsable de coordinar los trabajos en sitio",
    accion: "Confirmar acceso del equipo a las instalaciones",
    fechaAccion: "Fecha sugerida: 30 de septiembre de 2026",
    resumen: [
      "Se confirmó la recepción de los materiales.",
      "El equipo programó el inicio de la instalación.",
      "Necesitamos tu confirmación de acceso a las instalaciones."
    ]
  }
};

const selector = document.querySelector("#proyecto");

function mostrarProyecto() {
  const datos = proyectos[selector.value];

  document.querySelector("#nombre-proyecto").textContent = datos.nombre;
  document.querySelector("#etapa-actual").textContent =
    nombresEtapas[datos.etapa];
  document.querySelector("#fecha-actualizacion").textContent =
    datos.actualizacion;
  document.querySelector("#porcentaje").textContent =
  `Etapa ${datos.etapa + 1} de ${nombresEtapas.length} · recorrido del proyecto`;
  document.querySelector("#progreso").style.width =
  `${((datos.etapa + 1) / nombresEtapas.length) * 100}%`;
  document.querySelector("#responsable").textContent = datos.responsable;
  document.querySelector("#contacto").textContent = datos.contacto;
  document.querySelector("#accion").textContent = datos.accion;
  document.querySelector("#fecha-accion").textContent = datos.fechaAccion;
  const botonValidar = document.querySelector("#boton-validar");
  const yaConfirmado = localStorage.getItem(
  `validacionEnlightDemo:${selector.value}`
) !== null;

botonValidar.textContent = yaConfirmado
  ? "Confirmado en este navegador"
  : datos.accion;
botonValidar.disabled = yaConfirmado;

  const contenedorEtapas = document.querySelector("#etapas");
  contenedorEtapas.replaceChildren();

  nombresEtapas.forEach((nombre, indice) => {
    const elemento = document.createElement("div");
    elemento.classList.add("etapa");

    if (indice < datos.etapa) {
      elemento.classList.add("completada");
      elemento.textContent = `✓ ${nombre} · Completada`;
    } else if (indice === datos.etapa) {
      elemento.classList.add("actual");
      elemento.textContent = `● ${nombre} · En curso`;
    } else {
      elemento.textContent = `${nombre} · Próxima`;
    }

    contenedorEtapas.appendChild(elemento);
  });

  const listaResumen = document.querySelector("#resumen-semanal");
  listaResumen.replaceChildren();

  datos.resumen.forEach((texto) => {
    const punto = document.createElement("li");
    punto.textContent = texto;
    listaResumen.appendChild(punto);
  });

  document.querySelector("#confirmacion").textContent = "";
}

selector.addEventListener("change", () => {
  mostrarProyecto();
  mostrarHistorial();
});

document.querySelector("#formulario").addEventListener("submit", (evento) => {
  evento.preventDefault();

  const tipo = document.querySelector("#tipo").value;
  const mensaje = document.querySelector("#mensaje").value.trim();

  if (!mensaje) return;

  const registro = {
    folio: `DEMO-${Date.now()}`,
    estado: "Recibido en este navegador",
    proyecto: proyectos[selector.value].nombre,
    tipo: tipo,
    mensaje: mensaje,
    fecha: new Date().toLocaleString("es-MX")
  };

  const anteriores = JSON.parse(
    localStorage.getItem("mensajesEnlightDemo") || "[]"
  );
  anteriores.push(registro);
  localStorage.setItem("mensajesEnlightDemo", JSON.stringify(anteriores));
  mostrarHistorial();

  document.querySelector("#confirmacion").textContent =
    `Registro ${registro.folio} guardado en este navegador. No se envió a Enlight.`;
  document.querySelector("#formulario").reset();
});
function mostrarHistorial() {
  const contenedor = document.querySelector("#historial-mensajes");
  contenedor.replaceChildren();

  const registros = JSON.parse(
  localStorage.getItem("mensajesEnlightDemo") || "[]"
).filter((registro) =>
  registro.proyecto === proyectos[selector.value].nombre
);
  if (registros.length === 0) {
    contenedor.textContent = "Aún no hay mensajes registrados.";
    return;
  }

  registros.slice().reverse().forEach((registro) => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "etapa";

    const titulo = document.createElement("strong");
    titulo.textContent =
      `${registro.tipo} · ${registro.folio || "Registro anterior"}`;

    const detalle = document.createElement("p");
    detalle.textContent = `${registro.proyecto} · ${registro.fecha}`;

    const mensaje = document.createElement("p");
    mensaje.textContent = registro.mensaje;

    const estado = document.createElement("p");
    estado.textContent =
      `Estado: ${registro.estado || "Guardado en este navegador"}`;

    tarjeta.append(titulo, detalle, mensaje, estado);
    contenedor.appendChild(tarjeta);
  });
}
mostrarProyecto();
mostrarHistorial();

document.querySelector("#boton-validar").addEventListener("click", () => {
  const proyectoId = selector.value;
  const accion = proyectos[proyectoId].accion;

  localStorage.setItem(
    `validacionEnlightDemo:${proyectoId}`,
    JSON.stringify({
      accion: accion,
      fecha: new Date().toLocaleString("es-MX")
    })
  );

  const boton = document.querySelector("#boton-validar");
  boton.textContent = "Confirmado en este navegador";
  boton.disabled = true;
});
document.querySelector("#reiniciar-validaciones").addEventListener("click", () => {
  const continuar = confirm("¿Reiniciar las confirmaciones de esta demostración?");
  if (!continuar) return;

  Object.keys(localStorage)
    .filter(clave => clave.startsWith("validacionEnlightDemo:"))
    .forEach(clave => localStorage.removeItem(clave));

  mostrarProyecto();
});
