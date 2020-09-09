
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
    comenzarBtn = document.getElementById('btnStartId'),
    btnRecordId = document.getElementById('btnRecordId'),
    btnFinishId = document.getElementById('btnFinishId'),
    btnUploadId = document.getElementById('btnUploadId'),
    videoCoverId = document.getElementById('videoCoverId');

comenzarBtn.setAttribute('onclick', 'stepOne()');

function stepOne() {
    getAccess();
    comenzarBtn.style.display = 'none';
    videoCoverId.style.display = 'none';
    btn1.style.backgroundColor = '#572EE5';
    btn1.style.color = '#FFF';
    pasoUnoId.style.display = 'block';
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
        .catch(function (err) { console.log(err.name + ": " + err.message); });
}
/*----------------------------------------*/

//accion de comenzar a grabar
/*----------------------------------------*/
let blob = null;
btnRecordId.setAttribute('onclick', 'stepTwo()');

function stepTwo() {

    btnRecordId.style.display = 'none';
    btnFinishId.style.display = 'inline';

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
                quality: 6,
                width: 640,
                height: 360
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

    recorder.stopRecording(stopRecordingCallBack);

}

function stopRecordingCallBack() {

    blob = recorder.getBlob();

    video.src = video.srcObject = null;
    video.src = URL.createObjectURL(blob)

    recorder.stream.stop();
    recorder.destroy();
    recorder = null

    invokeSaveAsDialog(blob);
}
/*----------------------------------------*/

