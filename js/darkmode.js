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
    removeContainer(searchGifContainer);
})

//evento en la tecla enter
document.querySelector('.searchbar-input').addEventListener('keyup', (event) => {
    if (event.which === 13) {
        newSearchBtnRequest();
        removeContainer(searchGifContainer);
    }
});

//funcion para eliminar nodos hijos al realizar nueva busqueda
function removeContainer(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
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
        const requestResponse = response.data;
        requestResponse.forEach((image) => {
            let imageWorked = {
                url: image.images.downsized_medium.url,
                user: image.username,
                title: image.title,
                fav: false
            }
            imagesGotted.push(imageWorked);
        })
        createNewCard(imagesGotted, searchGifContainer, offsetRequestIndex, 'gif-container-child');
        offsetCounter += 1;
        setTimeout(() => loaderActions.hideloader(), 2000)
    }
    verMasGifs();
    showSearchTitle(searchInput)
}

//funcion que muestra automaticamente los trending gifs
let trendingGifContainer = document.getElementById("content");
let trendingGifsArray = [];
(function trendingGif() {
    let trendingUrl = "https://api.giphy.com/v1/gifs/trending?api_key=HsdndAAeztqsmgGVBlrXavpjIoeADOCf&limit=20&rating=";
    fetch(trendingUrl)
        .then(response => response.json())
        .then(data => loadTrendingCard(data))
        .catch((error) => {
            console.error("Ha habido un error", error);
        })
    //funcion que crea las tarjetas trending
    function loadTrendingCard(value) {
        let imageURL = value.data;
        imageURL.forEach((image) => {
            let gifWorked = {
                url: image.images.downsized_medium.url,
                user: image.user,
                title: image.title,
                fav: false
            }
            trendingGifsArray.push(gifWorked)
        });
        createNewCard(trendingGifsArray, trendingGifContainer, 0, 'item');
    }
})();

//funcion que crea las tarjetas
function createNewCard(arr, node, index, extraclass) {
    for (let i = index; i < arr.length; i++) {
        let anchorForNewCard = document.createElement('a'),
            newGif = document.createElement('img');
        newGif.setAttribute('class', extraclass);
        newGif.setAttribute('src', arr[i].url);
        node.appendChild(anchorForNewCard);
        anchorForNewCard.appendChild(newGif);
    }
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
        let ArrayForFourSuggestions = requestResponse.slice(0, 4);
        console.log(ArrayForFourSuggestions)
        for (let i = 0; i < ArrayForFourSuggestions.length; i++) {
            let optionElement = document.createElement('option')
            optionElement.setAttribute("value", ArrayForFourSuggestions[i].name)
            dataList.appendChild(optionElement)
        }
    }
}

//funcion que muestra los titulos trending
let trendingTextList = document.getElementById('trending-list');
(function trendingTextRequest() {
    let trendingTextUrl = `https://api.giphy.com/v1/trending/searches?api_key=HsdndAAeztqsmgGVBlrXavpjIoeADOCf`;
    fetch(trendingTextUrl)
        .then(response => response.json())
        .then(data => trendingText(data))
        .catch((error) => {
            console.error("Ha habido un error", error);
        })
    function trendingText(response) {
        const requestResponse = response.data
        let arrayForFiveElements = requestResponse.slice(0, 5);
        for (let i = 0; i < arrayForFiveElements.length; i++) {
            let listElement = document.createElement('li');
            listElement.textContent = arrayForFiveElements[i] + ',' + '\u00A0';
            trendingTextList.appendChild(listElement);
        }
    }
})();

//funcionalidad de scroll a la seccion de trending gifs
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
