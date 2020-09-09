
//funcionalidad al boton de crear Gif
/*----------------------------------------*/
let createGifContainderId = document.getElementById('createGifContainderId'),
    hideWhenCreateGif = document.getElementById('hideWhenCreateGif'),
    video = document.getElementById('videoCoverId'),
    createGIF = document.querySelector('.createGIF');

createGIF.setAttribute('onclick', 'hideBodyContent()');

function hideBodyContent() {
    createGifContainderId.style.display = 'block';
    hideWhenCreateGif.style.display = 'none';
}
/*----------------------------------------*/

//accion del primer paso 'COMENZAR'
/*----------------------------------------*/
let comenzarBtn = document.getElementById('btnStartId'),
    btn1 = document.getElementById('btn1'),
    btn2 = document.getElementById('btn2'),
    btn3 = document.getElementById('btn3'),
    pasoUnoId = document.getElementById('pasoUnoId'),
    btnRecordId = document.getElementById('btnRecordId'),
    videoCoverId = document.getElementById('videoCoverId');

comenzarBtn.setAttribute('onclick', 'getAccess()');

function getAccess() {
    initWebcam()
    comenzarBtn.style.display = 'none';
    videoCoverId.style.display = 'none';
    btn1.style.backgroundColor = '#572EE5';
    btn1.style.color = '#FFF';
    pasoUnoId.style.display = 'block';
}
/*----------------------------------------*/

let stream = null;
const constraints = {
    audio: false,
    video: {
        width: 640,
        height: 360,
    },
};

async function initWebcam() {
    try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);

        handleSuccess(stream);

        return Promise.resolve(stream);
    } catch (err) {
        throw new Error('Algo salió mal');
    }
}

const initRecorder = () =>
    new Promise((resolve, reject) => {
        initWebcam().then((stream) => {
            const recorder = RecordRTC(stream, {
                type: 'gif',
                mimeType: 'video/webm',
                recorderType: GifRecorder,
                disableLogs: true,
                quality: 6,
                width: 640,
                height: 360,
                onGifRecordingStarted: function () {

                    /* estilos 
                     recordBtn.innerText = 'FINALIZAR';
                      stepOne.classList.remove('active');
                      stepTwo.classList.add('active');
            
                      hideComponents(rerecord, recordedContainer, uploadBtn);
                      displayComponents(video, recordBtn);
            
                      setupTimer(); */
                    video.play();
                },
            });

            if (recorder) {
                resolve(recorder);
            } else {
                reject('Cannot create recorder object.');
            }
        });
    });

function handleSuccess(stream) {
    video.srcObject = stream;

    video.onloadedmetadata = () => {
        video.play();
    };
    btnRecordId.style.display = 'inline';
    btn1.style.backgroundColor = '#FFFFFF';
    btn1.style.color = '#572EE5';
    btn2.style.backgroundColor = '#572EE5';
    btn2.style.color = '#FFFFFF';
}

btn2.addEventListener('click', () => {

    //Visualización de botones


})


