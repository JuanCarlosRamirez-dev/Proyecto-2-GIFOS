//funcion que carga el body y las imagenes dependiendo del dark mode o light mode
document.addEventListener('DOMContentLoaded', (event) => {
    ((localStorage.getItem('mode') || 'dark') === 'dark') ? (
        document.querySelector('body').classList.add('dark'),
        document.getElementById('logoMobileId').src = "imagenes/logo-mobile-modo-noc.svg",
        document.getElementById('logoDesktopId').src = "imagenes/logo-desktop-modo-noc.svg",
        document.getElementById('searchBtnId').src = "imagenes/icon-search-mod-noc.svg",
        document.getElementById('closeBtnId').src = "imagenes/button-close-white.svg"
    ) : (
            document.querySelector('body').classList.remove('dark'),
            document.getElementById('logoMobileId').src = "imagenes/logo-mobile.svg",
            document.getElementById('logoDesktopId').src = "imagenes/logo-desktop.svg",
            document.getElementById('searchBtnId').src = "imagenes/icon-search.svg",
            document.getElementById('closeBtnId').src = "imagenes/button-close.svg"
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

darkMode.addEventListener('click', (event) => {
    ((localStorage.getItem('mode') || 'dark') === 'dark') ?
        document.getElementById('closeBtnId').src = "imagenes/button-close-white.svg"
        : document.getElementById('closeBtnId').src = "imagenes/button-close.svg";
});



//captura de evento en la lupa
let searchBtn = document.getElementById('searchBtnId'),
    searchInput;

searchBtn.addEventListener('click', (event) => {
    searchInput = document.querySelector('.searchbar-input').value
    newSearchBtnRequest(searchInput);
    removeContainer(searchGifContainer);
});

//evento en la tecla enter
document.querySelector('.searchbar-input').addEventListener('keyup', (event) => {
    if (event.which === 13) {
        searchInput = document.querySelector('.searchbar-input').value
        newSearchBtnRequest(searchInput);
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
    borderSearch = document.getElementById('search-border'),
    offsetCounter = 0,
    imagesGotted = [];

function newSearchBtnRequest(value) {
    const offsetRequestIndex = offsetCounter * 12;
    if (!value) { value = searchInput; }
    console.log(value);
    let searchUrl = `https://api.giphy.com/v1/gifs/search?api_key=HsdndAAeztqsmgGVBlrXavpjIoeADOCf&q=${value}&limit=12&offset=${offsetRequestIndex}&rating=&lang=en`;
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
    borderSearch.style.display = 'block';
    verMasGifs();
    showSearchTitle(value)
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
                user: image.username,
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
            favBtn = document.createElement('button'),
            downloadBnt = document.createElement('button'),
            fullscreenBtn = document.createElement('button'),
            showGifUser = document.createElement('p'),
            showGifTitle = document.createElement('p'),
            newGif = document.createElement('img');

        favBtn.innerHTML = '<img src="imagenes/icon-fav-hover.svg"/>';
        favBtn.setAttribute('class', 'favButton cardBtn');

        downloadBnt.innerHTML = '<img src="imagenes/icon-download.svg"/>';
        downloadBnt.setAttribute('class', 'downloadBtn cardBtn');

        fullscreenBtn.innerHTML = '<img src="imagenes/icon-max.svg"/>';
        fullscreenBtn.setAttribute('class', 'fullsizeBtn cardBtn');

        showGifUser.textContent = arr[i].user;
        showGifUser.setAttribute('class', 'gif-text-element gif-user');

        showGifTitle.textContent = arr[i].title;
        showGifTitle.setAttribute('class', 'gif-text-element gif-title')

        newGif.setAttribute('class', extraclass);
        newGif.setAttribute('src', arr[i].url);

        node.appendChild(anchorForNewCard);

        anchorForNewCard.appendChild(newGif);
        anchorForNewCard.appendChild(favBtn);
        anchorForNewCard.appendChild(downloadBnt);
        anchorForNewCard.appendChild(fullscreenBtn);
        anchorForNewCard.appendChild(showGifUser);
        anchorForNewCard.appendChild(showGifTitle);
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


//funcionalidad y animacion para barra buscadora y sugerencias de busqueda 
let dataList = document.getElementById('autocomplete-datalist'),
    searchbar = document.querySelector('.searchbar'),
    searchBarImages = document.getElementById('search-images'),
    closeSearch = document.getElementById('closeBtnId');

function autocompleteRequest(event) {
    const rootEvent = event.target,
        searchInputValue = rootEvent.value;
    let autoCompleteUrl = `https://api.giphy.com/v1/tags/related/${searchInputValue}?api_key=HsdndAAeztqsmgGVBlrXavpjIoeADOCf`;
    fetch(autoCompleteUrl)
        .then(response => response.json())
        .then(data => autoFill(data))
        .catch((error) => {
            console.error("Ha habido un error", error);
        })

    function autoFill(response) {
        if (response.meta.status == 200) {
            const requestResponse = response.data,
                ArrayForFourSuggestions = requestResponse.slice(0, 4);

            dataList.innerHTML = "";
            /* document.querySelector('.title-container').style.display = "none";
            document.querySelector('.hello-img').style.display = "none" */
            document.querySelector('.searchbar-input').style.marginLeft = "0";
            document.getElementById('searchBtnId').style.float = "left";
            searchbar.classList.add('searchbar-filled');
            closeSearch.style.display = "block";
            closeSearch.addEventListener('click', (e) => { removeSearchContent() })

            for (let i = 0; i < ArrayForFourSuggestions.length; i++) {
                let optionElement = document.createElement('li');
                optionElement.setAttribute('class', 'autocomplete-elements');
                optionElement.addEventListener('click', (e) => {
                    newSearchBtnRequest(ArrayForFourSuggestions[i].name);
                    removeSearchContent();
                    removeContainer(searchGifContainer);
                    searchInput = ArrayForFourSuggestions[i].name;
                })
                dataList.appendChild(optionElement);
                optionElement.innerHTML = "<img src='imagenes/icon-search-suggestion.svg'> " + ArrayForFourSuggestions[i].name;
            }

        }
        else if (response.meta.status == 404) {
            removeSearchContent();
        }
        function removeSearchContent() {
            /* document.querySelector('.title-container').style.display = "block";
            document.querySelector('.hello-img').style.display = "block" */
            searchbar.classList.remove('searchbar-filled');
            removeContainer(dataList);
            document.querySelector('.searchbar-input').style.marginLeft = "7%";
            document.getElementById('searchBtnId').style.float = "right";
            closeSearch.style.display = "none";
            document.querySelector('.searchbar-input').value = "";
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
            listElement.addEventListener('click', (e) => {
                newSearchBtnRequest(arrayForFiveElements[i]);
                removeContainer(searchGifContainer);
                searchInput = arrayForFiveElements[i];
                console.log(searchInput);
            })
            listElement.textContent = arrayForFiveElements[i] + ',' + '\u00A0';
            trendingTextList.appendChild(listElement);
        }
    }
})();

/* let sendToSearchbar = document.querySelectorAll('.trending-list li');
sendToSearchbar.addEventListener('click', () => {
    console.log(hola)
}); */

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
