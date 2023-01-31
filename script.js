const recordButton = document.querySelector("#record-button");
const stopButton = document.querySelector("#stop-button");
const searchButton = document.querySelector("#search-button");
const resultsContainer = document.querySelector("#results");

let audioContext;
let mediaRecorder;
let audioBlob;
let chunks = [];

recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
searchButton.addEventListener("click", searchSong);

async function startRecording() {
  recordButton.setAttribute("disabled", "disabled");
  stopButton.removeAttribute("disabled");

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.start();
  mediaRecorder.addEventListener("dataavailable", (event) => {
    chunks.push(event.data);
  });
}

function stopRecording() {
  recordButton.removeAttribute("disabled");
  stopButton.setAttribute("disabled", "disabled");
  searchButton.removeAttribute("disabled");

  mediaRecorder.stop();
  audioBlob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
  chunks = [];
}

async function searchSong() {
  const API_KEY = "YXjoaLaiRQERN6y1J";
  const API_SECRET = "gR7zdpAVc9wdXCeNitjYGqscgUewD4tW";

  const formData = new FormData();
  formData.append("audio_data", audioBlob, "audio.ogg");
  formData.append("access_key", API_KEY);
  formData.append("timestamp", Date.now());

  const signature = btoa(API_KEY + ":" + API_SECRET);

  const response = await fetch("https://api.acrcloud.com/v1/identify", {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
      "Authorization": `ACRCloud ${signature}`,
    },
    body: formData,
  });

  const data = await response.json();

  // Handle response and display results in the "results" container
}
