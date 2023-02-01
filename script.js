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
function searchRecording(){
  const API_KEY = "YXjoaLaiRQERN6y1J";
  const API_SECRET = "gR7zdpAVc9wdXCeNitjYGqscgUewD4tW";

  const formData = new FormData();
  formData.append("audio_data", audioRecorder, "audio/wav");
  formData.append("access_key", API_KEY);
  formData.append("timestamp", Date.now());

  const signature = btoa(API_KEY + ":" + API_SECRET);

  const response =fetch("https://api.acrcloud.com/v1/identify", {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
      "Authorization": `ACRCloud ${signature}`,
    },
    body: formData,
  });

  const data = response.json();
  document.getElementById("results").appendChild(data);

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
