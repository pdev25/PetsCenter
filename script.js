document.addEventListener("DOMContentLoaded", () => {
  // --- MENÚ HAMBURGUESA ---
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");
  if (hamburger && menu) {
    hamburger.addEventListener("click", () => {
      menu.classList.toggle("active");
    });
  }

  // --- LÓGICA DE ALMACENAMIENTO (LOCALSTORAGE) ---
  let carrito = JSON.parse(localStorage.getItem("items-carrito")) || [];

  // Actualiza la burbuja del número de items en el nav si existe
  function actualizarBurbujaNav() {
    const cartCountEl = document.getElementById("cart-count");
    if (cartCountEl) {
      const totalItems = carrito.reduce((acc, curr) => acc + curr.cantidad, 0);
      cartCountEl.textContent = totalItems;
    }
  }
  actualizarBurbujaNav();

  // --- COMPORTAMIENTO VISTA INDEX (AÑADIR) ---
  const botonesAgregar = document.querySelectorAll(".btn-agregar");
  botonesAgregar.forEach(boton => {
    boton.addEventListener("click", (e) => {
      const id = e.target.getAttribute("data-id");
      const nombre = e.target.getAttribute("data-nombre");
      const precio = parseFloat(e.target.getAttribute("data-precio"));
      const imagen = e.target.getAttribute("data-imagen");

      // Comprobar si ya existe el producto
      const existe = carrito.find(item => item.id === id);
      if (existe) {
        existe.cantidad++;
      } else {
        carrito.push({ id, nombre, precio, imagen, cantidad: 1 });
      }

      localStorage.setItem("items-carrito", JSON.stringify(carrito));
      actualizarBurbujaNav();
      alert(`${nombre} fue añadido al carrito.`);
    });
  });

  // --- COMPORTAMIENTO VISTA CARRITO (RENDER Y CONTROL) ---
  const listaProductosContenedor = document.getElementById("productos-carrito-lista");
  
  function renderizarCarrito() {
    if (!listaProductosContenedor) return; // Rompe si no estamos en la página del carrito

    const msgVacio = document.getElementById("carrito-vacio-msg");
    const contenedorCompleto = document.getElementById("contenedor-carrito-completo");
    const totalEl = document.getElementById("Total");

    if (carrito.length === 0) {
      msgVacio.classList.remove("disabled");
      contenedorCompleto.classList.add("disabled");
      return;
    }

    msgVacio.classList.add("disabled");
    contenedorCompleto.classList.remove("disabled");
    listaProductosContenedor.innerHTML = "";

    let totalAcumulado = 0;

    carrito.forEach(producto => {
      totalAcumulado += producto.precio * producto.cantidad;

      const filaProducto = document.createElement("div");
      filaProducto.classList.add("carrito_container");
      filaProducto.innerHTML = `
        <img class="carrito_imagen" src="${producto.imagen}" alt="${producto.nombre}"/>
        <div class="carrito_producto">
            <h2>Producto</h2>
            <p>${producto.nombre}</p>
        </div>
        <div class="carrito_cantidad">
            <h2>Cantidad</h2>
            <p>${producto.cantidad}</p>
        </div>
        <div class="carrito_precio">
            <h2>Precio</h2>
            <p>$${(producto.precio * producto.cantidad).toLocaleString('es-AR')}</p>
        </div>
        <button class="basura btn-eliminar" data-id="${producto.id}">
          <img src="img/basura.svg" alt="eliminar">
        </button>
      `;
      listaProductosContenedor.appendChild(filaProducto);
    });

    totalEl.textContent = `$${totalAcumulado.toLocaleString('es-AR')}`;
    asignarEventosEliminar();
  }

  function asignarEventosEliminar() {
    const botonesEliminar = document.querySelectorAll(".btn-eliminar");
    botonesEliminar.forEach(boton => {
      boton.addEventListener("click", (e) => {
        const idEliminar = e.currentTarget.getAttribute("data-id");
        // Filtramos para remover el item completo
        carrito = carrito.filter(item => item.id !== idEliminar);
        localStorage.setItem("items-carrito", JSON.stringify(carrito));
        renderizarCarrito();
        actualizarBurbujaNav();
      });
    });
  }

  // Botón Vaciar
  const btnVaciar = document.getElementById("btn-vaciar");
  if (btnVaciar) {
    btnVaciar.addEventListener("click", () => {
      carrito = [];
      localStorage.removeItem("items-carrito");
      renderizarCarrito();
      actualizarBurbujaNav();
    });
  }

  // Botón Comprar
  const btnComprar = document.getElementById("btn-comprar");
  if (btnComprar) {
    btnComprar.addEventListener("click", () => {
      carrito = [];
      localStorage.removeItem("items-carrito");
      actualizarBurbujaNav();
      
      document.getElementById("contenedor-carrito-completo").classList.add("disabled");
      document.getElementById("mensaje-compra").classList.remove("disabled");
    });
  }

  // Inicializar render de tabla si corresponde
  renderizarCarrito();
});