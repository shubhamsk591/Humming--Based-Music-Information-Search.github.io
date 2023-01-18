// Initialize variables
let audioRecorder;
let audioChunks = [];
// Start recording function
function startRecording() {
  // Set up the media recorder
  navigator.mediaDevices.getUserMedia({audio: true})
  .then(stream => {
    audioRecorder = new MediaRecorder(stream);
    audioRecorder.start();
    audioRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);
    });
  });
}

// Stop recording function
function stopRecording() {
  audioRecorder.stop();
  audioRecorder.stream.getAudioTracks()[0].stop();
}

// Save recording function
function saveRecording() {
  // Get the song name from the input field
  let songName = document.getElementById("song-name").value;

  // Create a new Blob from the audio chunks
  let audioBlob = new Blob(audioChunks, {type: "audio/wav"});

  // Create a new object URL for the audio
  let audioUrl = URL.createObjectURL(audioBlob);

  // Create a new audio element
  let audioElement = new Audio(audioUrl);

  // Add the audio element to the page
  document.getElementById("audio-player").appendChild(audioElement);

  // Create a link to download the audio
  let downloadLink = document.createElement("a");
  downloadLink.href = audioUrl;
  downloadLink.download = songName+".wav";
  downloadLink.innerHTML = "Download " + songName;

  // Add the download link to the page
  document.getElementById("audio-player").appendChild(downloadLink);

  //reset the audio chunks
  audioChunks = [];
}
