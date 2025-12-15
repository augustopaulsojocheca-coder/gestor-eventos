document.addEventListener("DOMContentLoaded", () => {
  /********** DATOS **********/
  const eventos = [
    {id:1,nombre:"Festival Cultural Andino",categoria:"Cultura",descripcion:"Danzas típicas, música y gastronomía regional.",resumen:"Disfruta de danzas tradicionales, música en vivo y comidas típicas de la región andina.",fecha:"20-12-2025",lugar:"Plaza Mayor",cupos:50,imagen:"img/festival_andino.jpg"},
    {id:2,nombre:"Exposición de Arte Peruano",categoria:"Cultura",descripcion:"Obras contemporáneas de artistas nacionales.",resumen:"Explora una colección de arte moderno y contemporáneo de talentosos artistas peruanos.",fecha:"22-12-2025",lugar:"Museo de Arte",cupos:30,imagen:"img/arte-peruano.webp"},
    {id:3,nombre:"Noche de Teatro Clásico",categoria:"Cultura",descripcion:"Presentación de obras clásicas adaptadas.",resumen:"Una velada de teatro con adaptaciones modernas de obras clásicas para todos los públicos.",fecha:"23-12-2025",lugar:"Teatro Municipal",cupos:40,imagen:"img/teatro-clasico.jpg"},
    {id:4,nombre:"Bootcamp Python",categoria:"Tecnología",descripcion:"Aprende Python desde cero hasta nivel intermedio.",resumen:"Curso intensivo de Python para principiantes, con prácticas y proyectos en tiempo real.",fecha:"18-12-2025",lugar:"Centro de Innovación",cupos:25,imagen:"img/python.jpg"},
    {id:5,nombre:"Conferencia de Inteligencia Artificial",categoria:"Tecnología",descripcion:"Tendencias actuales y futuro de la IA.",resumen:"Conferencia sobre las últimas tendencias en IA, machine learning y su impacto en la industria.",fecha:"21-12-2025",lugar:"Auditorio Tecnológico",cupos:60,imagen:"img/ia.jpg"},
    {id:6,nombre:"Taller de Desarrollo Web",categoria:"Tecnología",descripcion:"HTML, CSS y JavaScript práctico.",resumen:"Aprende a crear sitios web desde cero usando HTML, CSS y JavaScript con ejemplos prácticos.",fecha:"23-12-2025",lugar:"Laboratorio Digital",cupos:35,imagen:"img/desarrollo-web.png"},
    {id:7,nombre:"Charla de Emprendimiento",categoria:"Negocios",descripcion:"Cómo iniciar tu propio negocio.",resumen:"Aprende estrategias y consejos prácticos para iniciar tu emprendimiento exitosamente.",fecha:"19-12-2025",lugar:"Sala de Conferencias",cupos:40,imagen:"img/charla-emprendimiento.jpg"},
    {id:8,nombre:"Marketing Digital 2025",categoria:"Negocios",descripcion:"Estrategias digitales para marcas.",resumen:"Descubre técnicas de marketing digital modernas para mejorar la presencia de tu marca.",fecha:"22-12-2025",lugar:"Auditorio Empresarial",cupos:50,imagen:"img/marketin-digital.jpg"},
    {id:9,nombre:"Finanzas Personales",categoria:"Negocios",descripcion:"Aprende a manejar tus finanzas.",resumen:"Sesión práctica para organizar tu presupuesto, ahorrar y planificar inversiones personales.",fecha:"27-12-2025",lugar:"Centro Financiero",cupos:30,imagen:"img/finanzas-personales.jpg"},
    {id:10,nombre:"Torneo Interescolar de Fútbol",categoria:"Deportes",descripcion:"Competencia deportiva entre instituciones.",resumen:"Vive la emoción de un torneo de fútbol con equipos de diferentes colegios de la ciudad.",fecha:"20-12-2025",lugar:"Estadio Municipal",cupos:100,imagen:"img/futbol.jpg"},
    {id:11,nombre:"Clase Abierta de Yoga",categoria:"Deportes",descripcion:"Sesión de yoga para todos los niveles.",resumen:"Clase de yoga al aire libre para mejorar tu flexibilidad y bienestar físico y mental.",fecha:"21-12-2025",lugar:"Parque Central",cupos:25,imagen:"img/yoga.jpg"},
    {id:12,nombre:"Maratón 5K",categoria:"Deportes",descripcion:"Evento deportivo para toda la comunidad.",resumen:"Participa en una carrera de 5 km abierta para corredores de todas las edades.",fecha:"26-12-2025",lugar:"Av. Principal",cupos:200,imagen:"img/maraton.webp"}
  ];

  let inscripciones = JSON.parse(localStorage.getItem("inscripciones")) || [];
  let eventoACancelar = null;

  /********** DOM **********/
  const eventosGrid = document.getElementById("eventosGrid");
  const inscripcionesGrid = document.getElementById("inscripcionesGrid");
  const filtro = document.getElementById("filtroCategoria");
  const busquedaInput = document.getElementById("busquedaInput");
  const limpiarBtn = document.getElementById("limpiarFiltros");
  const toast = document.getElementById("toast");
  const btnEventos = document.getElementById("btnEventos");
  const btnInscripciones = document.getElementById("btnInscripciones");
  const eventosSection = document.getElementById("eventosSection");
  const inscripcionesSection = document.getElementById("inscripcionesSection");
  const confirmModal = document.getElementById("confirmModal");
  const btnYes = document.getElementById("btnYes");
  const btnNo = document.getElementById("btnNo");

  /********** FUNCIONES **********/
  function mostrarToast(msg, tipo="normal"){
    toast.textContent = msg;
    toast.classList.remove("show","cancelar");
    if(tipo==="cancelar") toast.classList.add("cancelar");
    void toast.offsetWidth;
    toast.classList.add("show");
    setTimeout(()=>{toast.classList.remove("show","cancelar"); toast.textContent="";},3500);
  }

  function renderEventos(){
    eventosGrid.innerHTML = "";
    const categoria = filtro.value;
    const texto = busquedaInput.value.toLowerCase();

    eventos.filter(e => (!categoria || e.categoria === categoria) && e.nombre.toLowerCase().includes(texto))
      .forEach(e => {
        const estaInscrito = inscripciones.some(i => i.id === e.id);
        eventosGrid.innerHTML += `
          <div class="card">
            <img src="${e.imagen}">
            <div class="card-content">
              <span class="badge">Disponible</span>
              <h3>${e.nombre}</h3>
              <p>${e.descripcion}</p>
              <p><strong>Fecha:</strong> ${e.fecha}</p>
              <p><strong>Lugar:</strong> ${e.lugar}</p>
              <p><strong>Cupos:</strong> ${e.cupos}</p>
              <div class="card-buttons">
                <button class="detalles" onclick="verDetalles(${e.id})">Ver detalles</button>
                <button class="inscribir" onclick="inscribir(${e.id}, this)" ${estaInscrito||e.cupos===0?'disabled':''}>
                  ${estaInscrito?"Inscrito":(e.cupos===0?"Cupos agotados":"Inscribirse")}
                </button>
              </div>
            </div>
          </div>
        `;
      });
  }

  function renderInscripciones(){
    inscripcionesGrid.innerHTML = "";
    inscripciones.forEach(e => {
      inscripcionesGrid.innerHTML += `
        <div class="card inscripcion-card">
          <img src="${e.imagen}">
          <div class="card-content">
            <span class="badge">Disponible</span>
            <h3>${e.nombre}</h3>
            <p>${e.descripcion}</p>
            <p><strong>Fecha:</strong> ${e.fecha}</p>
            <p><strong>Lugar:</strong> ${e.lugar}</p>
            <p><strong>Cupos:</strong> ${e.cupos}</p>
            <div class="card-buttons">
              <button class="cancelar" onclick="solicitarCancelacion(${e.id})">Cancelar</button>
            </div>
          </div>
        </div>
      `;
    });
  }

  window.inscribir = function(id, btn){
    const evento = eventos.find(e => e.id === id);
    if(evento.cupos===0){mostrarToast("No hay cupos disponibles ❌","cancelar");return;}
    if(inscripciones.some(i=>i.id===id)) return;
    inscripciones.push(evento);
    evento.cupos--;
    localStorage.setItem("inscripciones",JSON.stringify(inscripciones));
    btn.textContent="Inscrito";
    btn.disabled=true;
    mostrarToast("Te has inscrito correctamente ✅");
    renderEventos();
    renderInscripciones();
  }

  window.solicitarCancelacion = function(id){
    eventoACancelar = inscripciones.find(e => e.id === id);
    confirmModal.classList.remove("hidden");
  }

  btnYes.onclick = function(){
    if(!eventoACancelar) return;
    const eventoOriginal = eventos.find(e => e.id === eventoACancelar.id);
    if(eventoOriginal) eventoOriginal.cupos++;
    inscripciones = inscripciones.filter(e => e.id !== eventoACancelar.id);
    localStorage.setItem("inscripciones", JSON.stringify(inscripciones));
    renderInscripciones();
    renderEventos();
    mostrarToast("Inscripción cancelada ❌","cancelar");
    confirmModal.classList.add("hidden");
    eventoACancelar = null;
  }

  btnNo.onclick = function(){
    confirmModal.classList.add("hidden");
    eventoACancelar = null;
  }

  window.verDetalles = function(id){
  const e = eventos.find(ev => ev.id === id);
  document.getElementById("modalBody").innerHTML = `
    <h3>${e.nombre}</h3>
    <p>${e.resumen}</p>
  `;
  document.getElementById("modal").classList.remove("hidden");
}


  document.getElementById("cerrarModal").onclick = ()=>{document.getElementById("modal").classList.add("hidden");}

  btnEventos.onclick = ()=>{eventosSection.classList.remove("hidden"); inscripcionesSection.classList.add("hidden"); btnEventos.classList.add("active"); btnInscripciones.classList.remove("active");}
  btnInscripciones.onclick = ()=>{inscripcionesSection.classList.remove("hidden"); eventosSection.classList.add("hidden"); btnInscripciones.classList.add("active"); btnEventos.classList.remove("active");}

  filtro.onchange = renderEventos;
  busquedaInput.addEventListener("input", renderEventos);
  limpiarBtn.addEventListener("click", ()=>{busquedaInput.value=""; filtro.value=""; renderEventos();});

  [...new Set(eventos.map(e=>e.categoria))].forEach(cat => {filtro.innerHTML += `<option value="${cat}">${cat}</option>`;});

  renderEventos();
  renderInscripciones();

  document.getElementById("whatsappBtn").onclick = ()=>{window.open("https://wa.me/1234567890","_blank");}
});
