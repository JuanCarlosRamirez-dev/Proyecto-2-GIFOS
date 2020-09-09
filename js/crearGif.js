
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
    repetirCapturaId = document.getElementById('repetirCapturaId'),
    videoCoverId = document.getElementById('videoCoverId');

comenzarBtn.setAttribute('onclick', 'stepOne()');

function stepOne() {
    getAccess();
    comenzarBtn.style.display = 'none';
    videoCoverId.style.display = 'none';
    btn2.style.backgroundColor = '#FFFFFF';
    btn2.style.color = '#572EE5';
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

    timer.style.display ='inline';
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
                quality: 6,
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
    stopTimer();
    timer.style.display ='none';
    repetirCapturaId.style.display ='inline';
    
    recorder.stopRecording(stopRecordingCallBack);
    
}

repetirCapturaId.setAttribute('onclick','repeatGif()');

function repeatGif(){

    repetirCapturaId.style.display = 'none';
    btnUploadId.style.display = 'none';

    stepOne();
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

//funcionalidad al temporizador
/*----------------------------------------*/
let timer =document.getElementById('cronometroId'),
    counter =0,
    interval;

const counterFormat = (num)=> (num <10?"0"+num:num);

function convertSeconds (seconds){
    console.log('convertidor')
    let hours = Math.floor(seconds / 3600);
    let min = Math.floor((seconds % 3600) / 60);
    let sec = seconds % 60;
    return `${counterFormat(hours)}:${counterFormat(min)}:${counterFormat(sec)}`;
}

function timeIt(){
    console.log('temporizador')
    counter++;
    timer.innerText = convertSeconds(counter);
}

function setUpTimer(){
    counter = 0;
    timer.innerText = "00:00:00";
    interval = setInterval(timeIt,1000);
}

function stopTimer(){
    clearInterval(interval);
}