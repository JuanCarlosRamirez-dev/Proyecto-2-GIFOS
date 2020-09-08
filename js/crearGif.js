
let createGifContainderId = document.getElementById('createGifContainderId'),
    hideWhenCreateGif = document.getElementById('hideWhenCreateGif'),
    createGIF = document.querySelector('.createGIF');

createGIF.setAttribute('onclick', 'hideBodyContent()');

function hideBodyContent() {
    createGifContainderId.style.display = 'block';
    hideWhenCreateGif.style.display = 'none';
}

