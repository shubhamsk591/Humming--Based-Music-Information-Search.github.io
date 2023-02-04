const recordButton = document.getElementById("record-button");
const stopButton = document.getElementById("stop-button");
const recordedAudio = document.getElementById("recorded-audio");
const hummingAudio = document.getElementById("humming-audio");
const downloadButton = document.getElementById("download-button");
const songFile = document.getElementById("song-file");
const songAudio = document.getElementById("song-audio");
const submitButton = document.getElementById("submit-button");
const progressMessage = document.getElementById("progress-message");

let mediaRecorder;
let audioChunks = [];
recordButton.addEventListener("click", function() {
recordButton.setAttribute("disabled", true);
stopButton.removeAttribute("disabled");

navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
mediaRecorder = new MediaRecorder(stream);
mediaRecorder.start();


mediaRecorder.addEventListener("dataavailable", function(event) {
audioChunks.push(event.data);
});

mediaRecorder.addEventListener("stop", function() {
const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
recordedAudio.src = URL.createObjectURL(audioBlob);
hummingAudio.src = recordedAudio.src;
});
});
});

stopButton.addEventListener("click", function() {
recordButton.removeAttribute("disabled");
stopButton.setAttribute("disabled", true);
mediaRecorder.stop();
});

downloadButton.addEventListener("click", function() {
const blob = new Blob(audioChunks, { type: "audio/wav" });
const url = URL.createObjectURL(blob);
const link = document.createElement("a");
link.style.display = "none";
link.href = url;
link.download = "recorded-audio.wav";
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
});

songFile.addEventListener("change", function() {
const file = songFile.files[0];
songAudio.src = URL.createObjectURL(file);
});

submitButton.addEventListener("click", function() {
progressMessage.style.display = "block";
})