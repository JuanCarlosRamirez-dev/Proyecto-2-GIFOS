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

//captura de evento en la lupa
let searchBtn = document.getElementById('searchBtnId');
searchBtn.addEventListener('click', (event) => {
    newSearchBtnRequest();
    removeContainer();
})

//evento en la tecla enter
document.querySelector('.searchbar-input').addEventListener('keyup', (event) => {
    if (event.which === 13) {
        newSearchBtnRequest();
        removeContainer();
    }
});

//funcion para eliminar nodos hijos al realizar nueva busqueda
function removeContainer() {
    while (searchGifContainer.firstChild) {
        searchGifContainer.removeChild(searchGifContainer.firstChild);
    }
}


const loader = document.getElementById('loader'),
    loaderActions = {
        showloader: function () { loader.classList.remove("display-none") },
        hideloader: function () { loader.classList.add("display-none") }
    }

//funcion que conecta con la API
let searchGifContainer = document.querySelector('.gif-container'),
    offsetCounter = 0,
    imagesGotted = [];
function newSearchBtnRequest() {
    const offsetRequestIndex = offsetCounter * 12;
    let searchInput = document.querySelector('.searchbar-input').value,
        searchUrl = `https://api.giphy.com/v1/gifs/search?api_key=HsdndAAeztqsmgGVBlrXavpjIoeADOCf&q=${searchInput}&limit=12&offset=${offsetRequestIndex}&rating=&lang=en`;
    loaderActions.showloader();
    fetch(searchUrl)
        .then(response => response.json())
        .then(data => loadingGifs(data))
        .catch((error) => {
            console.error("Ha habido un error", error);
        })
    //funcion que crea un arreglo de objetos filtrado
    function loadingGifs(response) {
        const wsData = response.data;
        wsData.forEach((image) => {
            let imageWorked = {
                url: image.images.downsized_medium.url,
                user: image.username,
                title: image.title,
                fav: false
            }
            imagesGotted.push(imageWorked);
        })
        //funcion que crea las tarjetas
        newCreateCard();
        function newCreateCard() {
            for (let i = offsetRequestIndex; i < imagesGotted.length; i++) {
                let newGif = document.createElement("img")
                newGif.setAttribute('class', 'gif-container-child')
                newGif.setAttribute('src', imagesGotted[i].url)
                searchGifContainer.appendChild(newGif)
            }
            offsetCounter += 1;
            setTimeout(() => loaderActions.hideloader(), 2000)
        }
    }
    verMasGifs();
    showSearchTitle(searchInput)
}

//funcion que agrega botón "ver más"
let verMasBtn = document.getElementById('ver-mas-btn');
function verMasGifs() {
    if (verMasBtn.firstChild) {
        verMasBtn.removeChild;
    }
    else {
        //crea el boton y le agrega el formato 
        verMasBtn.classList.add('vermas-btn')
        let verMastxt = document.createElement('h2');
        verMastxt.textContent = "VER MÁS";
        verMasBtn.appendChild(verMastxt);
    }
}

//funcion que muestra el texto ingresado
function showSearchTitle(input) {
    let searchTitleContainer = document.getElementById('search-title-container');
    let searchString = input;
    let searchStringCapitalized = searchString.charAt(0).toUpperCase() + searchString.slice(1);
    return searchTitleContainer.innerHTML = "<h2 class=search-title-container>" + searchStringCapitalized + "</h2>";
};

//funcion que conecta con la API para las search suggestions
let dataList = document.getElementById('autocomplete-datalist')
function autocompleteRequest(event) {
    const rootEvent = event.target,
        searchInputValue = rootEvent.value
    let autoCompleteUrl = `https://api.giphy.com/v1/tags/related/${searchInputValue}?api_key=HsdndAAeztqsmgGVBlrXavpjIoeADOCf`;
    fetch(autoCompleteUrl)
        .then(response => response.json())
        .then(data => autoFill(data))
        .catch((error) => {
            console.error("Ha habido un error", error);
        })
    function autoFill(response) {
        const requestResponse = response.data
        requestResponse.forEach((label) => {
            let optionElement = document.createElement('option')
            optionElement.setAttribute("value", label.name)
            dataList.appendChild(optionElement)
        })
    }
}

//funcion que muestra automaticamente los trending gifs
(function trendingGif() {
    let trendingUrl = "https://api.giphy.com/v1/gifs/trending?api_key=HsdndAAeztqsmgGVBlrXavpjIoeADOCf&limit=25&rating=";
    fetch(trendingUrl)
        .then(response => response.json())
        .then(data => createTrendingCard(data))
        .catch((error) => {
            console.error("Ha habido un error", error);
        })
    //funcion que crea las tarjetas trending
    function createTrendingCard(value) {
        let imageURL = value.data;
        imageURL.forEach((image) => {
            let srcImage = image.images.downsized_medium.url;
            let trendingGifContainer = document.getElementById("content");
            trendingGifContainer.innerHTML += "<img src=\"" + srcImage + "\" class=\"item\">";
        });
    }
})();

/*funcionalidad de scroll a la seccion de trending gifs*/
const carousel = document.getElementById("carousel"),
    content = document.getElementById("content"),
    next = document.getElementById("next"),
    prev = document.getElementById("prev"),
    gap = 16;

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

