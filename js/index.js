
//captura de evento en la lupa
/*------------------------------------------*/
let searchBtn = document.getElementById('searchBtnId'),
    searchInput;

searchBtn.addEventListener('click', (event) => {
    searchInput = document.querySelector('.searchbar-input').value
    newSearchBtnRequest(searchInput);
    removeSearchContent(searchbar, "searchbar-filled");
    removeContainer(searchGifContainer);

});
/*------------------------------------------*/

//evento en la tecla enter
/*------------------------------------------*/
document.querySelector('.searchbar-input').addEventListener('keyup', (event) => {
    if (event.which === 13) {
        console.log("tecla enter")
        searchInput = document.querySelector('.searchbar-input').value
        newSearchBtnRequest(searchInput, "searchbar-filled");
        removeContainer(searchGifContainer);
        searchInput = '';
    }
});
/*------------------------------------------*/

//funcion para eliminar nodos hijos para cualquier contenedor
/*------------------------------------------*/
function removeContainer(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}
/*------------------------------------------*/

//elemento loader cuando cargan los gifs
/*------------------------------------------*/
const loader = document.getElementById('loader'),
    loaderActions = {
        showloader: function () { loader.classList.remove("display-none") },
        hideloader: function () { loader.classList.add("display-none") }
    }
/*------------------------------------------*/

//funcion que conecta con la API
/*------------------------------------------*/
let searchGifContainer = document.querySelector('.gif-container'),

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

        showSearchTitle(value)
        if (response.data.length) {
            const requestResponse = response.data;
            requestResponse.forEach((image, index) => {
                let imageWorked = {
                    id: index,
                    url: image.images.downsized_medium.url,
                    user: image.username,
                    title: image.title,
                    fav: false
                }
                imagesGotted.push(imageWorked);
            })
            createNewCard(imagesGotted, searchGifContainer, offsetRequestIndex, 'gif-container-child');
            // sendToFavs(imagesGotted);
            offsetCounter += 1;
            verMasGifs();
        }
        else if (!response.data.length) {
            let noSearchImg = document.createElement('div'),
                verMasBtnId = document.getElementById('verMasBtnId'),
                noSearchText = document.createElement('p');

            noSearchImg.innerHTML = '<img src="imagenes/icon-busqueda-sin-resultado.svg"/>';
            noSearchImg.style.textAlign = 'center';
            noSearchText.innerHTML = 'Intenta con otra búsqueda.';
            noSearchText.setAttribute('class', 'sin-resultados-text');

            document.getElementById('search-title-container').appendChild(noSearchImg);
            document.getElementById('search-title-container').appendChild(noSearchText);

            if (verMasBtn.firstChild) {
                verMasBtnId.remove();
                verMasBtn.classList.remove('vermas-btn');
            }

        }
        setTimeout(() => loaderActions.hideloader(), 1000);
    }
}
/*------------------------------------------*/

//funcion que muestra automaticamente los trending gifs
/*------------------------------------------*/
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
        imageURL.forEach((image, index) => {
            let gifWorked = {
                id: index,
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
/*------------------------------------------*/

//funcion que crea las tarjetas
/*------------------------------------------*/
function createNewCard(arr, node, index, extraclass) {

    for (let i = index; i < arr.length; i++) {

        /*creacion de las tarjetas Gif con sus respectivos atributos*/
        /*------------------------------------------*/
        let anchorForNewCard = document.createElement('a'),
            favBtn = document.createElement('button'),
            downloadBnt = document.createElement('a'),
            fullscreenBtn = document.createElement('button'),
            showGifUser = document.createElement('p'),
            showGifTitle = document.createElement('p'),
            urlImage = arr[i].url,
            newGif = document.createElement('img');

        favBtn.innerHTML = '<img src="imagenes/icon-fav-hover.svg"/>';
        favBtn.setAttribute('class', 'favButton cardBtn');

        let arregloApasar = JSON.stringify(arr[i]);
        favBtn.setAttribute('onclick', `agregarFavoritos(${arregloApasar})`);

        downloadBnt.innerHTML = '<img src="imagenes/icon-download.svg"/>';
        downloadBnt.setAttribute('class', 'downloadBtn cardBtn');

        fullscreenBtn.innerHTML = '<img src="imagenes/icon-max.svg"/>';
        fullscreenBtn.setAttribute('class', 'fullsizeBtn cardBtn');

        showGifUser.textContent = arr[i].user;
        showGifUser.setAttribute('class', 'gif-text-element gif-user');

        showGifTitle.textContent = arr[i].title;
        showGifTitle.setAttribute('class', 'gif-text-element gif-title');

        newGif.setAttribute('class', extraclass);
        newGif.setAttribute('src', arr[i].url);

        anchorForNewCard.setAttribute('class', 'anchor-card');

        node.appendChild(anchorForNewCard);

        anchorForNewCard.appendChild(newGif);
        anchorForNewCard.appendChild(showGifUser);
        anchorForNewCard.appendChild(showGifTitle);
        anchorForNewCard.appendChild(favBtn);
        anchorForNewCard.appendChild(downloadBnt);
        anchorForNewCard.appendChild(fullscreenBtn);
        /*------------------------------------------*/

        /*Diseño responsivo de pantalla completa en version movil*/
        /*------------------------------------------*/
        let intViewportWidth = window.matchMedia('(max-width: 1220px)');
        if (intViewportWidth.matches) {
            anchorForNewCard.addEventListener('click', () => { fullSizeInOut() })
        }
        /*------------------------------------------*/

        /*función para botones de pantalla completa*/
        /*------------------------------------------*/
        fullscreenBtn.addEventListener('click', () => { fullSizeInOut() });

        function fullSizeInOut() {

            let fullSizeModalId = document.getElementById('FullSizeModal'),
                gifContainerForModalId = document.getElementById('gifContainerForModalId'),
                gifUserForModalId = document.getElementById('gifUserForModalId'),
                gifTitleForModalId = document.getElementById('gifTitleForModalId'),
                favoritosModalId = document.getElementById('favoritosModalId'),
                downloadModalId = document.getElementById('downloadModalId'),
                fullSizeImage = document.createElement('img');

            fullSizeImage.setAttribute('class', 'full-size-modal-content');
            fullSizeImage.setAttribute('src', arr[i].url);

            /*Remuevo las clases heredadas del boton de favoritos para mantener
            funcionalidad y usar el mismo botón*/
            favBtn.classList.add('card-btn-full');
            favBtn.classList.add('fav-btn-full');
            favBtn.classList.remove('favButton');
            favBtn.classList.remove('cardBtn');

            /*Remuevo las clases heredadas del boton de descargar para mantener
            funcionalidad y usar el mismo botón*/
            downloadBnt.classList.add('card-btn-full');
            downloadBnt.classList.add('download-btn-full');
            downloadBnt.classList.remove('downloadBtn');
            downloadBnt.classList.remove('cardBtn');

            gifUserForModalId.textContent = arr[i].user;

            gifTitleForModalId.textContent = arr[i].title;

            fullSizeModalId.style.display = 'block';

            removeContainer(gifContainerForModalId);
            removeContainer(favoritosModalId);
            gifContainerForModalId.appendChild(fullSizeImage);
            favoritosModalId.appendChild(favBtn);
            downloadModalId.appendChild(downloadBnt);

            document.getElementById('closeBtnForModalId').addEventListener('click', () => {
                fullSizeModalId.style.display = 'none';
                //regreso las clases removidas para mantener funcionalidad
                downloadBnt.classList.remove('download-btn-full');
                downloadBnt.classList.remove('card-btn-full');
                downloadBnt.classList.add('downloadBtn');
                downloadBnt.classList.add('cardBtn');
                anchorForNewCard.appendChild(downloadBnt);

                //regreso las clases removidas para mantener funcionalidad
                favBtn.classList.remove('card-btn-full');
                favBtn.classList.remove('fav-btn-full');
                favBtn.classList.add('favButton');
                favBtn.classList.add('cardBtn');
                anchorForNewCard.appendChild(favBtn);
            })
        }
        /*----------------------------------------*/

        /*funcion para el boton de descargar gif*/
        /*----------------------------------------*/
        async function getImage(urlImage) {
            let response = await fetch(urlImage),
                gifBlob = await response.blob();
            return gifBlob;
        }
        getImage(urlImage).then(blob => {
            const url = URL.createObjectURL(blob);
            downloadBnt.href = url;
            downloadBnt.download = 'MyGif.gif';
        }).catch(console.error);
        /*----------------------------------------*/
    }
}
/*------------------------------------------*/

//funcion que agrega botón "ver más"
/*------------------------------------------*/
let verMasBtn = document.getElementById('ver-mas-btn');
function verMasGifs() {
    if (verMasBtn.firstChild) {
        verMasBtn.removeChild;
    }
    else {
        //crea el boton y le agrega el formato 
        verMasBtn.classList.add('vermas-btn')
        let verMastxt = document.createElement('h2');
        verMastxt.setAttribute('id', 'verMasBtnId')
        verMastxt.textContent = "VER MÁS";
        verMasBtn.appendChild(verMastxt);
    }
}
/*------------------------------------------*/

//funcionalidad para la seccion Favoritos
/*------------------------------------------*/
let gifsFavoritos = [],
    misFavoritosContainerId = document.getElementById('favoritosContainerId'),
    containerSustituido = document.getElementById('hiddeWhenFavsContainerId'),
    favSinContenidoId = document.getElementById('favSinContenidoId'),
    misFavoritosBtnId = document.getElementById('misFavoritosBtnId');
function agregarFavoritos(arr) {

    gifsFavoritos.push(arr)

    gifsFavoritos = eliminarGifsDuplicados(gifsFavoritos, 'url')

    function eliminarGifsDuplicados(arr, prop) {
        let sinDuplicados = [],
            lookup = {};

        for (let i in arr) {
            lookup[arr[i][prop]] = arr[i];
        }
        for (i in lookup) {
            sinDuplicados.push(lookup[i]);
        }
        return sinDuplicados
    }

    let mandarGifsALocal = JSON.stringify(gifsFavoritos)

    localStorage.setItem('favoritosSeleccionados', mandarGifsALocal)
}

misFavoritosBtnId.addEventListener('click', () => {

    esconderContainerSuperior();
    let recuperarGifsDeLocal = localStorage.getItem('favoritosSeleccionados')
    let gifsRecuperados = JSON.parse(recuperarGifsDeLocal)
    gifsRecuperados ? favSinContenidoId.style.display = 'none' : misFavoritosContainerId.style.display = 'block';
    esconderContainerSuperior();
    createNewCard(gifsRecuperados, searchGifContainer, 0, 'gif-container-child')
    searchGifContainer.style.marginBottom = '20px';

})

function esconderContainerSuperior() {

    containerSustituido.style.display = 'none';
    removeContainer(searchGifContainer);
    removeContainer(verMasBtn);

}

/*------------------------------------------*/

//funcionalidad al logotipo para reiniciar estilos
/*------------------------------------------*/
let topLogoId = document.getElementById('topLogoId'),
    borderSearch = document.getElementById('search-border'),
    searchTitleContainer = document.getElementById('search-title-container');
topLogoId.addEventListener('click', () => {

    removeSearchContent(searchbar, "searchbar-filled");
    removeContainer(searchGifContainer);
    removeContainer(verMasBtn);
    verMasBtn.classList.remove('vermas-btn');
    searchTitleContainer.style.display = 'none';
    borderSearch.style.display = 'none';
    misFavoritosContainerId.style.display = 'none';
    containerSustituido.style.display = 'block';
    hideWhenCreateGif.style.display = 'block';
    createGifContainderId.style.display = 'none';
})
/*------------------------------------------*/

//funcion que muestra el texto ingresado
/*------------------------------------------*/

function showSearchTitle(input) {
    borderSearch.style.display = 'block';
    searchTitleContainer.style.display = 'block';
    let searchString = input;
    let searchStringCapitalized = searchString.charAt(0).toUpperCase() + searchString.slice(1);
    return searchTitleContainer.innerHTML = "<h2 class=search-title-container>" + searchStringCapitalized + "</h2>";
};
/*------------------------------------------*/

//funcionalidad y animacion para barra buscadora y sugerencias de busqueda 
/*------------------------------------------*/
let dataList = document.getElementById('autocomplete-datalist'),
    searchbar = document.querySelector('.searchbar'),
    searchBarImages = document.getElementById('search-images'),
    closeSearchBtn = document.getElementById('closeBtnId');

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
            closeSearchBtn.style.display = "block";
            closeSearchBtn.addEventListener('click', (e) => { removeSearchContent(searchbar, "searchbar-filled") })

            for (let i = 0; i < ArrayForFourSuggestions.length; i++) {
                let optionElement = document.createElement('li');
                optionElement.setAttribute('class', 'autocomplete-elements');
                optionElement.addEventListener('click', (e) => {
                    newSearchBtnRequest(ArrayForFourSuggestions[i].name);
                    removeSearchContent(searchbar, "searchbar-filled");
                    removeContainer(searchGifContainer);
                    searchInput = ArrayForFourSuggestions[i].name;
                })
                dataList.appendChild(optionElement);
                optionElement.innerHTML = "<img src='imagenes/icon-search-suggestion.svg'> " + ArrayForFourSuggestions[i].name;
            }

        }
        else if (response.meta.status == 404) {
            removeSearchContent(searchbar, "searchbar-filled");
        }
    }
}
/*------------------------------------------*/

//funcion que restablece los estilos de la barra buscadora
/*------------------------------------------*/
function removeSearchContent(node, removedClass) {
    console.log("entro a removesearch")
    /* document.querySelector('.title-container').style.display = "block";
    document.querySelector('.hello-img').style.display = "block" */
    node.classList.remove(removedClass);
    removeContainer(dataList);
    document.querySelector('.searchbar-input').style.marginLeft = "7%";
    document.getElementById('searchBtnId').style.float = "right";
    closeSearchBtn.style.display = "none";
    document.querySelector('.searchbar-input').value = "";
}
/*------------------------------------------*/

//funcion que muestra los titulos trending 
/*------------------------------------------*/
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
/*------------------------------------------*/

//funcionalidad de scroll a la seccion de trending gifs
/*------------------------------------------*/
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
/*------------------------------------------*/
