const startRecordingBtn = document.getElementById("record-button");
const stopRecordingBtn = document.getElementById("stop-button");
const downloadRecordingBtn = document.getElementById("download-button");
const audioControl = document.getElementById("humming-audio");
//
const recordedAudio = document.getElementById("recorded-audio");
//
const songFile = document.getElementById("song-file");
const songAudio = document.getElementById("song-audio");
const submitButton = document.getElementById("submit-button");
const progressMessage = document.getElementById("progress-message");
const cancelBtn=document.getElementById("cancel-button");
let audioCtx;
let recorder;
let stream;
let wavesurfer1;
let wavesurfer2;
navigator.mediaDevices
  .getUserMedia({ audio: true, video: false })
  .then((_stream) => {
    stream = _stream;
    audioCtx = new AudioContext();
    const microphone = audioCtx.createMediaStreamSource(stream);
    // Create a new recorder
    recorder = new Recorder(microphone, {numChannels: 1});
    wavesurfer();
    startRecordingBtn.addEventListener("click", startRecording);
    stopRecordingBtn.addEventListener("click", stopRecording);
    downloadRecordingBtn.addEventListener("click", downloadRecording);
    cancelBtn.addEventListener("click",cancelbutton);
  })
  .catch((error) => {
    console.error("Error getting audio stream:", error);
  });
  function wavesurfer(){
    wavesurfer1 = WaveSurfer.create({
      container: "#waveform1",
      waveColor: "violet",
      progressColor: "purple",
      height: 128,
      barWidth: 3,
      cursorWidth: 1,
      cursorColor: "#333",
      responsive: true
    });
    wavesurfer2 = WaveSurfer.create({
      container: "#waveform2",
      waveColor: "violet",
      progressColor: "purple",
      height: 128,
      barWidth: 3,
      cursorWidth: 1,
      cursorColor: "#333",
      responsive: true
    });
  }
  function startRecording() {
    // Start recording
    stopRecordingBtn.removeAttribute("disabled");
    startRecordingBtn.setAttribute("disabled", true);
    cancelBtn.setAttribute("disabled",true);
    downloadRecordingBtn.setAttribute("disabled",true);
    recorder.record();
  }


  
function stopRecording() {
  
  stopRecordingBtn.setAttribute("disabled", true);
  downloadRecordingBtn.removeAttribute("disabled");
  cancelBtn.removeAttribute("disabled");
  recorder.stop();
  recorder.exportWAV(blob => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    audioControl.src=url;
    wavesurfer1.load(audioControl.src);
  });
}
  audioControl.addEventListener("play", function() {
    
    wavesurfer1.playPause();
    
    
  });
  audioControl.addEventListener("pause", function() {
   
  
    wavesurfer1.stop();
    
  });
  function downloadRecording() {
    recorder.exportWAV(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = 'recording.wav';
      document.body.appendChild(link);
      link.click();
      
    });
  }


function cancelbutton(){
  startRecordingBtn.removeAttribute("disabled");
  stopRecordingBtn.setAttribute("disabled", true);
  recorder.clear();
  cancelBtn.setAttribute("disabled",true);
  downloadRecordingBtn.setAttribute("disabled",true);
  wavesurfer1.destroy();

}


songFile.addEventListener("change", function() {
const file = songFile.files[0];
songAudio.src = URL.createObjectURL(file);
wavesurfer2.load(songAudio.src);
});


songAudio.addEventListener("play", function() {
    
   wavesurfer2.playPause();
    
  });

  songAudio.addEventListener("pause", function() {
    wavesurfer2.stop();
   
    
  });
submitButton.addEventListener("click", function() {
progressMessage.style.display = "block";
})