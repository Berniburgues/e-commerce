// Botón del carrito => Mostrar y ocultar carrito.
const carToggle = document.querySelector(".car__toggle");
const carBlock = document.querySelector(".car__block");
// URL para petición AXIOS.
const baseURL = "https://academlo-api-production.up.railway.app/api";
const productsList = document.querySelector("#products-container");
// Carrito de compras
const car = document.querySelector("#car");
const carList = document.querySelector("#car__list");
const emptyCar = document.querySelector("#empty__car");
let carProducts = [];

// Lógica para mostrar y ocultar el carrito.
carToggle.addEventListener("click", () => {
    carBlock.classList.toggle("nav__car__visible")
})

//! LOCAL STORAGE 
// Obtener el carrito del LocalStorage (si existe).
if (localStorage.getItem("carProducts")) {
    carProducts = JSON.parse(localStorage.getItem("carProducts"));
    carElementsHTML();
  }
  
// Actualizar el LocalStorage cada vez que el carrito cambie.
  function updateLocalStorage() {
    localStorage.setItem("carProducts", JSON.stringify(carProducts));
  };

//! LISTENERS 
eventListenersLoader();

function eventListenersLoader() {
    //Agregar producto al carrrito.
    productsList.addEventListener("click", addProduct);
    //Vaciar carrito por completo.
    emptyCar.addEventListener("click", (e) => {
        carProducts = [];
        carElementsHTML()
        updateLocalStorage()
    });
    //Eliminar un producto del carrito.
    carList.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete__product")) {
        const productId = e.target.getAttribute("data-id");
        carProducts = carProducts.filter((product) => product.id !== productId);
        carElementsHTML();
        updateLocalStorage()
      }
    });
    };

// Petición GET.
function getProducts() {
    axios.get(`${baseURL}/products`)
        .then(function(response){
            const products = response.data
            printProducts(products)
        })
        .catch(function (error){
            console.log(error)
        })
};
getProducts()

//Imprimir products 
function printProducts (products) {
    let html = '';
    for (let i = 0; i < products.length; i++) {
        html += `
        <div class="product__container">
            <div class="product__container__img">
                <img src="${products[i].images.image1}" alt="">
            </div>
            <div class="product__container__name">
                <p>${products[i].name}</p>
            </div>
            <div class="product__container__price">
                <p>$${products[i].price.toFixed(2)}</p>
            </div>
            <div class="product__container__button">
                <button class="car__button add__to__car" id="add__to__car" data-id="${products[i].id}">Add to car</button>
            </div>
        </div>
        `;
    }
    productsList.innerHTML = html;
};

// Agregar productos al carrito.
//* 1. Capturar información del producto que se clickea.
function addProduct(e)  {
    if(e.target.classList.contains("add__to__car")) {
        const product = e.target.parentElement.parentElement
        carProductsElements(product)
        updateLocalStorage()
    }
}

//* 2. Transformar la informacion en un array.
function carProductsElements(product) {
    const infoProduct = {
        id: product.querySelector("button").getAttribute("data-id"),
        image: product.querySelector("img").src,
        name: product.querySelector(".product__container__name p").textContent,
        price: product.querySelector(".product__container__price p").textContent,
        quantity: 1
    }
    
    //Agregar contador.
    if(carProducts.some(product => product.id === infoProduct.id)) {
        const product = carProducts.map(product => {
            if(product.id === infoProduct.id) {
                product.quantity++;
                return product
            } else {
                return product
            }
        })
        carProducts = [...product]
    } else {
        carProducts = [...carProducts, infoProduct]
    }

    carElementsHTML()
}

//* 3. Imprimir los productos dentro del carrito.
function carElementsHTML() {
    carList.innerHTML = "";
    carProducts.forEach(product => {
        const div = document.createElement("div");
        div.innerHTML = `
        <div class="car__product">
        <div class="car__product__image">
            <img src="${product.image}" alt="">
        </div>
        <div class="car__product__description">
            <div>
                <p>${product.name}</p>
            </div>
            <div>
                <p>Precio: ñ${product.price}</p>
            </div>
            <div>
                <p>Cantidad: ${product.quantity}</p>
            </div>
            <div class="car__product__button">
                <button class="delete__product" data-id="${product.id}">Delete</button>
            </div>
        </div>
    </div>
    <hr>
    `
    carList.appendChild(div);
    })
}