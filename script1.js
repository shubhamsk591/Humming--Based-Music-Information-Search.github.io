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

    startRecordingBtn.addEventListener("click", startRecording);
    stopRecordingBtn.addEventListener("click", stopRecording);
    downloadRecordingBtn.addEventListener("click", downloadRecording);
  })
  .catch((error) => {
    console.error("Error getting audio stream:", error);
  });

  function startRecording() {
    // Start recording
    stopRecordingBtn.removeAttribute("disabled");
    startRecordingBtn.setAttribute("disabled", true);
    
    recorder.record();
  }


  
function stopRecording() {
  startRecordingBtn.removeAttribute("disabled");
  stopRecordingBtn.setAttribute("disabled", true);
  downloadRecordingBtn.removeAttribute("disabled")
  recorder.stop();
  recorder.exportWAV(blob => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    audioControl.src=url;
    recorder.clear();
  });
}
  audioControl.addEventListener("play", function() {
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
    wavesurfer1.clear();
    wavesurfer1.load(audioControl.src);
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





songFile.addEventListener("change", function() {
const file = songFile.files[0];
songAudio.src = URL.createObjectURL(file);
});


songAudio.addEventListener("play", function() {
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
    
    wavesurfer2.load(songAudio.src);
    
  });


submitButton.addEventListener("click", function() {
progressMessage.style.display = "block";
})