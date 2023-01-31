//const recordButton = document.querySelector("#record-button");
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

function startRecording() {
  recordButton.setAttribute("disabled", "disabled");
  stopButton.removeAttribute("disabled");

  const stream = navigator.mediaDevices.getUserMedia({ audio: true });
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.start();
  mediaRecorder.addEventListener("dataavailable", (event) => {
    chunks.push(event.data);
  });
}
function stopRecording() {
  //recordButton.removeAttribute("disabled");
  stopButton.setAttribute("disabled", "disabled");
  searchButton.removeAttribute("disabled");

  mediaRecorder.stop();
  audioBlob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
  chunks = [];
}


async function searchSong() {
  const API_KEY = "XjoaLaiRQERN6y1J";
  const API_SECRET = "gR7zdpAVc9wdXCeNitjYGqscgUewD4tW";

  const formData = new FormData();
  formData.append("audio_data", audioBlob, "audio.ogg");
  formData.append("access_key", API_KEY);
  formData.append("timestamp", Date.now());
  formData.append("signature", createSignature(API_SECRET, formData));

  const response = await fetch("https://api.acrcloud.com/v1/identify", {
    method: "POST",
    body: formData,
  });
  const json = await response.json();

  if (json.status.code === 0) {
    const song = json.metadata.music[0];
    resultsContainer.innerHTML = `
      <h2>Song Information</h2>
      <p>Title: ${song.title}</p>
      <p>Artist: ${song.artists[0].name}</p>
      <p>Album: ${song.album.name}</p>
    `;
  } else {
    resultsContainer.innerHTML = "<p>No song found</p>";
  }
}

function createSignature(apiSecret, formData) {
  const message = Array.from(formData.entries())
    .map((entry) => entry.join("="))
    .join("&");

  return btoa(apiSecret + message);
}
