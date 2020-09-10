
//funcionalidad al boton de crear Gif
/*----------------------------------------*/
let createGifContainderId = document.getElementById('createGifContainderId'),
    hideWhenCreateGif = document.getElementById('hideWhenCreateGif'),
    video = document.getElementById('screenRecordId'),
    createGIF = document.querySelector('.createGIF');

createGIF.setAttribute('onclick', 'hideBodyContent()');

function hideBodyContent() {
    createGifContainderId.style.display = 'block';
    hideWhenCreateGif.style.display = 'none';
}
/*----------------------------------------*/

//accion del primer paso 'COMENZAR'
/*----------------------------------------*/
let btn1 = document.getElementById('btn1'),
    btn2 = document.getElementById('btn2'),
    btn3 = document.getElementById('btn3'),
    pasoUnoId = document.getElementById('pasoUnoId'),
    pasoTresId = document.getElementById('pasoTresId'),
    comenzarBtn = document.getElementById('btnStartId'),
    btnRecordId = document.getElementById('btnRecordId'),
    btnFinishId = document.getElementById('btnFinishId'),
    btnUploadId = document.getElementById('btnUploadId'),
    repetirCapturaId = document.getElementById('repetirCapturaId'),
    videoCoverId = document.getElementById('videoCoverId');

comenzarBtn.setAttribute('onclick', 'stepOne()');

function stepOne() {

    comenzarBtn.style.display = 'none';
    videoCoverId.style.display = 'none';
    btn2.style.backgroundColor = '#fff';
    btn2.style.color = '#572EE5';
    btn1.style.backgroundColor = '#572EE5';
    btn1.style.color = '#fff';
    pasoUnoId.style.display = 'block';
    getAccess();

}
/*----------------------------------------*/

//solicitar acceso a la camara del usuario
/*----------------------------------------*/
let stream = null;
const constraints = {
    audio: false,
    video: {
        width: 640,
        height: 360,
    },
};

function getAccess() {
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (mediaStream) {

            video.srcObject = mediaStream;
            video.onloadedmetadata = function (e) {
                video.play();
            };

            //Visualización de botones
            btnRecordId.style.display = 'inline';
            btn1.style.backgroundColor = '#FFFFFF';
            btn1.style.color = '#572EE5';
            btn2.style.backgroundColor = '#572EE5';
            btn2.style.color = '#FFFFFF';

        })
        .catch(function (err) { console.log(err.name + ": " + err.message); alert('No se pudo acceder a tu cámara') });

}
/*----------------------------------------*/

//accion de comenzar a grabar
/*----------------------------------------*/
let blob = null;
btnRecordId.setAttribute('onclick', 'stepTwo()');

function stepTwo() {


    timer.style.display = 'inline';
    btnRecordId.style.display = 'none';
    btnFinishId.style.display = 'inline';
    setUpTimer();
    recordingGif();

}

let recorder;
function recordingGif() {

    navigator.mediaDevices.getUserMedia(constraints)
        .then(async function (stream) {
            recorder = new RecordRTC(stream, {
                type: 'gif',
                mimeType: 'video/webm',
                recorderType: GifRecorder,
                disableLogs: true,
                quality: 10,
                width: 640,
                height: 360,
            });

            recorder.startRecording();
            recorder.stream = stream;
        });
}
/*----------------------------------------*/

//accion detener grabacion
/*----------------------------------------*/
btnFinishId.setAttribute('onclick', 'stopMakingGif()');

function stopMakingGif() {

    btnFinishId.style.display = 'none';
    btnUploadId.style.display = 'inline';
    timer.style.display = 'none';
    repetirCapturaId.style.display = 'inline';

    stopTimer();

    recorder.stopRecording(stopRecordingCallBack);

}

gifRecorded = document.getElementById('gifRecorded');
function stopRecordingCallBack() {

    blob = recorder.getBlob();

    video.src = video.srcObject = null;
    gifRecorded.src = URL.createObjectURL(blob)
    video.style.display = 'none'
    gifRecorded.style.display = 'inline';

    recorder.stream.stop();
    recorder.destroy();
    recorder = null

    //invokeSaveAsDialog(blob);
}
/*----------------------------------------*/

//funcionalidad al boton repetir captura
/*----------------------------------------*/
repetirCapturaId.setAttribute('onclick', 'repeatGif()');

function repeatGif() {

    video.style.display = 'inline'
    gifRecorded.style.display = 'none';
    repetirCapturaId.style.display = 'none';
    btnUploadId.style.display = 'none';

    stepOne();
}
/*----------------------------------------*/


//funcionalidad para el boton subir gif
/*----------------------------------------*/
let margen3 = document.getElementById('marginThreeId'),
    pasoCuatroId = document.getElementById('pasoCuatroId'),
    margen4 = document.getElementById('marginFourId');
btnUploadId.addEventListener('click', () => {

    if (blob.type === 'image/gif' && blob.size !== 0) {

        let form = new FormData();
        form.append('file', blob, 'MyGif.gif');


        repetirCapturaId.style.display = 'none';
        btnUploadId.style.display = 'none';
        btn2.style.backgroundColor = '#FFFFFF';
        btn2.style.color = '#572EE5';
        btn3.style.backgroundColor = '#572EE5';
        btn3.style.color = '#FFFFFF';
        pasoUnoId.style.display = 'none';
        pasoTresId.style.display = 'inline';
        gifRecorded.style.bottom = '265px';
        margen3.style.top = '-285px';
        margen4.style.top = '-328px';

        gifRecorded.classList.add('uploading');
        uploadGif(form)
            .then(() => {
                pasoTresId.style.display = 'none';
                pasoCuatroId.style.display = 'inline';
                alert("Felicidades! Creaste un gif. Presiona F5 si quieres crear otro gif.");
            })

    } else { alert('No se grabó nada. Reinicia la página') }
})


 async function uploadGif(gif) {
     const res = await fetch('https://upload.giphy.com/v1/gifs?api_key=HsdndAAeztqsmgGVBlrXavpjIoeADOCf', {
        method: 'POST',
        body: gif
    });

    const uploadResults = await verificarUpload(res);

    if (uploadResults.meta.status === 200) {
        sendToLocalStorage(uploadResults.data.id)
        return Promise.resolve(uploadResults.data.id)
    }
    return Promise.reject('Algo malo sucedio'); 
    
} 



let ArrayDeMisGifos = [];
function sendToLocalStorage(gifId) {
    const sinGifPrevio = localStorage.getItem('misGifos')
    if(sinGifPrevio==null){
        ArrayDeMisGifos.push(gifId);
        localStorage.setItem('misGifos',ArrayDeMisGifos);
    }else{
        ArrayDeMisGifos.push(localStorage.getItem('misGifos'));
        ArrayDeMisGifos.push(gifId);
        localStorage.setItem('misGifos',(ArrayDeMisGifos))
    }
}

const verificarUpload = (res) => {
    if (!res.ok) {
        throw { status: res.status, msg: "Algo salió mal" };
    }
    return res.json();
}
/*----------------------------------------*/

//funcionalidad al temporizador
/*----------------------------------------*/
let timer = document.getElementById('cronometroId'),
    counter = 0,
    interval;

const counterFormat = (num) => (num < 10 ? "0" + num : num);

function convertSeconds(seconds) {
    let hours = Math.floor(seconds / 3600);
    let min = Math.floor((seconds % 3600) / 60);
    let sec = seconds % 60;
    return `${counterFormat(hours)}:${counterFormat(min)}:${counterFormat(sec)}`;
}

function timeIt() {
    counter++;
    timer.innerText = convertSeconds(counter);
}

function setUpTimer() {
    counter = 0;
    timer.innerText = "00:00:00";
    interval = setInterval(timeIt, 1000);
}

function stopTimer() {
    clearInterval(interval);
}
/*----------------------------------------*/

//funcionalidad para mostrar mis gifos
/*----------------------------------------*/
let myGifsGotted = [],
    misGifsSinContenido = document.getElementById('misGifsSinContenido'),
    misGifosId = document.getElementById('misGifosId'),
    misGifosContainer = document.getElementById('misGifosContainer');

misGifosId.setAttribute('onclick', 'mostrarSeccion()')

function mostrarSeccion() {
    
    containerSustituido.style.display = 'none';
    misGifosContainer.style.display = 'block';
    misFavoritosContainerId.style.display = 'none';
    returToHome();
    
    let recuperarIds = localStorage.getItem('misGifos');

    recuperarIds ? misGifsSinContenido.style.display = 'none' : misGifosId.style.display = 'block';

    console.log("[CP316]=> recuperarIds",recuperarIds)

    let urlForIds = `https://api.giphy.com/v1/gifs?api_key=HsdndAAeztqsmgGVBlrXavpjIoeADOCf&ids=${recuperarIds}`;
    fetch(urlForIds)
        .then(response => response.json())
        .then(data => loadingMyGifs(data))
        .catch((error) => {
            console.error("Ha habido un error", error);
        })
    //funcion que crea un arreglo de objetos filtrado
    function loadingMyGifs(response) {
        
        if (response.data.length) {
            const requestResponse = response.data;
            requestResponse.forEach((image) => {
                let myGifInfo = {
                    url: image.images.downsized_medium.url,
                    user: image.username,
                    title: image.title,
                    fav: false
                }
                myGifsGotted.push(myGifInfo);
            })
            myGifsGotted=eliminarGifsDuplicados(myGifsGotted,'url')
            createNewCard(myGifsGotted, searchGifContainer, 0, 'gif-container-child');
        }
    }
    
}


    
    

/*----------------------------------------*/