//funcion que carga el body y las imagenes dependiendo del dark mode o light mode
document.addEventListener('DOMContentLoaded', (event) => {
    ((localStorage.getItem('mode') || 'dark') === 'dark') ? (
        document.querySelector('body').classList.add('dark'),
        document.getElementById('logoMobileId').src = "imagenes/logo-mobile-modo-noc.svg",
        document.getElementById('logoDesktopId').src = "imagenes/logo-desktop-modo-noc.svg",
        document.getElementById('searchBtnId').src = "imagenes/icon-search-mod-noc.svg"
    ) : (
            document.querySelector('body').classList.remove('dark'),
            document.getElementById('logoMobileId').src = "imagenes/logo-mobile.svg",
            document.getElementById('logoDesktopId').src = "imagenes/logo-desktop.svg",
            document.getElementById('searchBtnId').src = "imagenes/icon-search.svg"
        );
});

//funcion que intercambia el body entre dark mode y light mode
let darkMode = document.getElementById('darkModeId');
darkMode.addEventListener('click', (event) => {
    localStorage.setItem('mode', (localStorage.getItem('mode') || 'dark') === 'dark' ? 'light' : 'dark');
    localStorage.getItem('mode') === 'dark' ? document.querySelector('body').classList.add('dark')
        : document.querySelector('body').classList.remove('dark');
});

//funcion que intercambia el logotipo de version movil entre dark mode y light mode
darkMode.addEventListener('click', (event) => {
    ((localStorage.getItem('mode') || 'dark') === 'dark') ?
        document.getElementById('logoMobileId').src = "imagenes/logo-mobile-modo-noc.svg"
        : document.getElementById('logoMobileId').src = "imagenes/logo-mobile.svg";
});

//funcion que intercambia el logotipo de version desktop entre dark mode y light mode
darkMode.addEventListener('click', (event) => {
    ((localStorage.getItem('mode') || 'dark') === 'dark') ?
        document.getElementById('logoDesktopId').src = "imagenes/logo-desktop-modo-noc.svg"
        : document.getElementById('logoDesktopId').src = "imagenes/logo-desktop.svg";
});

//funcion que intercambia la lupa de buscar entre dark mode y light mode
darkMode.addEventListener('click', (event) => {
    ((localStorage.getItem('mode') || 'dark') === 'dark') ?
        document.getElementById('searchBtnId').src = "imagenes/icon-search-mod-noc.svg"
        : document.getElementById('searchBtnId').src = "imagenes/icon-search.svg";
});

let searchGifContainer = document.querySelector('.gif-container');
let searchBtn = document.getElementById('searchBtnId');
let verMasBtn = document.getElementById('ver-mas-btn');

searchBtn.addEventListener('click', searchBtnRequest());

document.querySelector('.searchbar-input').addEventListener('keyup', (event) => {
    if (event.which === 13) {
        searchBtnRequest();
    }
});

//funcion que conecta con la API de Giphy
function searchBtnRequest() {
    let searchInput = document.querySelector('.searchbar-input').value;
    //elimina los nodos hijos del contenedor al hacer otra busqueda 
    while (searchGifContainer.firstChild) {
        searchGifContainer.removeChild(searchGifContainer.firstChild);
    };
    let searchUrl = "https://api.giphy.com/v1/gifs/search?api_key=HsdndAAeztqsmgGVBlrXavpjIoeADOCf&q=" + searchInput + "&limit=12&offset=0&rating=&lang=en";
    fetch(searchUrl)
        .then(response => response.json())
        .then(data => createCard(data))
        .catch((error) => {
            console.error("Ha habido un error", error);
        })
    showSearchTitle(searchInput);
    verMas();
};

//funcion que muestra automaticamente los trending gifs
(function trendingGif() {
    let trendingUrl = "https://api.giphy.com/v1/gifs/trending?api_key=HsdndAAeztqsmgGVBlrXavpjIoeADOCf&limit=20&rating=";
    fetch(trendingUrl)
        .then(response => response.json())
        .then(data => createTrendingCard(data))
        .catch((error) => {
            console.error("Ha habido un error", error);
        })
})();

//funcion que muestra el texto ingresado
function showSearchTitle(input) {
    let searchTitleContainer = document.getElementById('search-title-container');
    let searchString = input;
    let searchStringCapitalized = searchString.charAt(0).toUpperCase() + searchString.slice(1);
    return searchTitleContainer.innerHTML = "<h2 class=search-title-container>" + searchStringCapitalized + "</h2>";
};

//funcion que agrega botón "ver más"
function verMas() {
    if (verMasBtn.firstChild) {
        verMasBtn.removeChild;
    }
    else {
        verMasBtn.classList.add('vermas-btn')
        let verMastxt = document.createElement('h2');
        verMastxt.textContent = "VER MÁS";
        verMasBtn.appendChild(verMastxt);
    }
}

//funcion que muestra los gifs 
function createCard(value) {
    let imageURL = value.data;
    imageURL.forEach((image) => {
        let srcImage = image.images.downsized.url;
        searchGifContainer.innerHTML += "<img src=\"" + srcImage + "\" class=\"gif-container-child\">";
    });
};

//funcion que crea las tarjetas
function createTrendingCard(value) {
    let imageURL = value.data;
    imageURL.forEach((image) => {
        let srcImage = image.images.downsized_medium.url;
        let trendingGifContainer = document.getElementById("content");
        trendingGifContainer.innerHTML += "<img src=\"" + srcImage + "\" class=\"item\">";
    });
}


/*funcionalidad de scroll a la seccion de trending gifs*/
const gap = 16;

const carousel = document.getElementById("carousel"),
    content = document.getElementById("content"),
    next = document.getElementById("next"),
    prev = document.getElementById("prev");

next.addEventListener("click", e => {
    carousel.scrollBy(width + gap, 0);
    if (carousel.scrollWidth !== 0) {
        prev.style.display = "flex";
    }
    if (content.scrollWidth - width - gap <= carousel.scrollLeft + width) {
        next.style.display = "none";
    }
});
prev.addEventListener("click", e => {
    carousel.scrollBy(-(width + gap), 0);
    if (carousel.scrollLeft - width - gap <= 0) {
        prev.style.display = "none";
    }
    if (!content.scrollWidth - width - gap <= carousel.scrollLeft + width) {
        next.style.display = "flex";
    }
});

let width = carousel.offsetWidth;
window.addEventListener("resize", e => (width = carousel.offsetWidth));
/*-------------------------------------------*/


/* agregar clase en un if cuando no haya resultados
    searchGifContainer.classList.add("gif-container-margin"); */