const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");
/**get query param from url tu form */
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

/**Template */
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector(
  "#location-message-template"
).innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;
const autoscroll = () => {
  /**Lấy tin nhắn mới */
  const $newMessage = $messages.lastElementChild;
  /**Lấy chiều cao tin nhắn mới */
  const newMessageStyles = getComputedStyle($newMessage);

  const newMessageMargin = parseInt(newMessageStyles.marginBottom);

  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  /**Chiều cao thấy dc tin nhắn */
  const visibleHeight = $messages.offsetHeight;

  /**Chiều cao tổng đoạn chat*/
  const containerHeight = $messages.scrollHeight;

  /**Chiều cao khi phải scrolled */
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};
const socket = io
  .connect("http://localhost:5000", {
    query: { token: localStorage.getItem("userToken") },
  })
  .on("roomData", ({ users, room }) => {
    const html = Mustache.render(sidebarTemplate, {
      users,
      room,
    });
    document.querySelector("#sidebar").innerHTML = html;
  });

socket.on("message", (message) => {
  console.log(message);
  /**Dung mustache de render message ra html */
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    /**Format ngay thang nam bang thu vien Moment */
    createdAt: moment(message.createdAt).format("h:m a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  $messageFormButton.setAttribute("disabled", "disabled");
  /**get gia tri input bang thuoc tinh name trong form */
  const mytext = e.target.textMessage.value;
  socket.emit("sendMessage", mytext, (error) => {
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();
    if (error) return console.log(error);
    if (!mytext) return;
    // else console.log(mytext);
  });
});

// socket.on("updatedText", (message) => {
//   if (!message) return;
//   // console.log("This text has been arrived");
// });

socket.on("locationMessage", (locationLink) => {
  // console.log(locationText);
  const html = Mustache.render(locationTemplate, {
    username: locationLink.username,
    locationLink: locationLink.location,
    createdAt: moment(locationLink.createdAt).format("h:m a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

$sendLocationButton.addEventListener("click", () => {
  if (!navigator.geolocation)
    return alert("Geolocation is not support for your browser!");
  $sendLocationButton.setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition(async (position) => {
    const location = await position;

    socket.emit(
      "sendLocation",
      {
        latitude: location.coords.latitude,
        longtitude: location.coords.longitude,
      },
      /**Thiet lap event Acknowledgement -> de biet dc client nao dk su kien  */
      (callbackText) => {
        $sendLocationButton.removeAttribute("disabled");
        console.log(callbackText);
      }
    );
  });
});

socket.emit("join", { username, room }, (err) => {
  if (err) {
    alert(err);
    location.href = "/";
  }
});
