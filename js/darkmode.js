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

let gifContainer = document.querySelector('.gif-container');
let searchBtn = document.getElementById('searchBtnId');
searchBtn.addEventListener('click', () => {
    var searchInput = document.querySelector('.searchbar-input').value;
    while (gifContainer.firstChild) {
        gifContainer.removeChild(gifContainer.firstChild);
    }
    let url = "https://api.giphy.com/v1/gifs/search?api_key=HsdndAAeztqsmgGVBlrXavpjIoeADOCf&q=" + searchInput + "&limit=12&offset=0&rating=g&lang=en";
    let giphyAjaxCall = new XMLHttpRequest();
    giphyAjaxCall.open('GET', url);
    giphyAjaxCall.send();

    giphyAjaxCall.addEventListener('load', (event) => {
        let data = event.target.response;
        pushToDom(data);
    });
});

function pushToDom(value) {
    let response = JSON.parse(value);
    let imageURL = response.data;

    imageURL.forEach((image) => {
        let srcImage = image.images.fixed_height.url;
        console.log(srcImage);
        gifContainer.innerHTML += "<img src=\"" + srcImage + "\" class=\"gif-container-child\">";
    });
}