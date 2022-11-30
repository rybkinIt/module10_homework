const btn = document.querySelector("#location");
const messages = document.querySelector(".messages");
const btnSend = document.querySelector("#start");
const btnEnd = document.querySelector("#end");
const noConnection = document.querySelector(".no-connection");
const msgInpunt = document.getElementById("input");

const socket = new WebSocket("wss://echo-ws-service.herokuapp.com");
socket.onopen = function () {
    noConnection.classList.add("hidden");
    messages.classList.remove("hidden");
};
socket.onclose = socket.onerror = function () {
    messages.classList.add("hidden");
    noConnection.classList.remove("hidden");
};

socket.onmessage = function (event) {
    const message = event.data;
    showRecevedMessage(message);
};

btnSend.addEventListener("click", () => {
    const message = msgInpunt.value;
    msgInpunt.value = "";
    socket.send(message);
    showSentMessage(message);
});

btnEnd.addEventListener("click", () => {
    socket.close();
});

const sendPositionLink = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const locationLink = `<a href="https://www.openstreetmap.org/#map=18/${latitude}/${longitude}" target="_blank">Моя Геолокация</a>`;

    socket.send(locationLink);
    showSentMessage(locationLink);
};

btn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(sendPositionLink);
    }
});
function showRecevedMessage(message) {
    const recevied = document.createElement("div");
    recevied.classList.add("recevied");
    recevied.innerHTML = "Server  message: " + message;
    messages.prepend(recevied);
}
function showSentMessage(message) {
    const sent = document.createElement("div");
    sent.classList.add("sent");
    sent.innerHTML = "User  message: " + message;
    messages.prepend(sent);
}