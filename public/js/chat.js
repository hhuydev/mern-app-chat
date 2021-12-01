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
const messageFileTemplate = document.querySelector(
  "#message-file-template"
).innerHTML;
const messageImgTemplate = document.querySelector(
  "#message-img-template"
).innerHTML;

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
  .on("roomData", ({ users, room, user }) => {
    const html = Mustache.render(sidebarTemplate, {
      users,
      room,
    });
    // console.log(user);
    document.querySelector("#sidebar").innerHTML = html;
  });

socket.on("message", (message) => {
  console.log(message);
  /**Dung mustache de render message ra html */
  const html = Mustache.render(messageTemplate, {
    username: message.user.username,
    message: message.text,
    /**Format ngay thang nam bang thu vien Moment */
    createdAt: moment(message.createdAt).format("h:m a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("file-message", (message) => {
  console.log(message);
  /**Dung mustache de render message ra html */
  const html = Mustache.render(messageFileTemplate, {
    username: message.user.username,
    message: message.file,
    /**Format ngay thang nam bang thu vien Moment */
    createdAt: moment(message.createdAt).format("h:m a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("img-message", (message) => {
  console.log(message);
  /**Dung mustache de render message ra html */
  const html = Mustache.render(messageFileTemplate, {
    username: message.user.username,
    message: message.file,
    /**Format ngay thang nam bang thu vien Moment */
    createdAt: moment(message.createdAt).format("h:m a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

$messageForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  // $messageFormButton.setAttribute("disabled", "disabled");
  /**get gia tri input bang thuoc tinh name trong form */
  const mytext = e.target.textMessage.value;
  socket.emit("sendMessage", mytext, (error) => {
    // $messageFormButton.removeAttribute("disabled");

    // if (error) return console.log(error);
    if (!mytext) return;
    // else console.log(mytext);
  });
  $messageFormInput.value = "";
  $messageFormInput.focus();
  await saveMessage(mytext, "6191260ae9c3e67b7d225217");
});

// $fileSelect.addEventListener(
//   "click",
//   function (e) {
//     if ($fileElem) {
//       $fileElem.click();
//     }
//     e.preventDefault(); // prevent navigation to "#"
//   },
//   false
// );

// $fileElem.addEventListener("change", handleFiles, false);

// async function handleFiles() {
//   if (!this.files.length) {
//     fileList.innerHTML = "<p>No files selected!</p>";
//   } else {
//     // const mytext = e.target.textMessage.value;
//     console.log(this.files);
//     socket.emit("sendMessage", this.files, (error) => {
//       // $messageFormButton.removeAttribute("disabled");

//       // if (error) return console.log(error);
//       if (!mytext) return;
//       // else console.log(mytext);
//     });
//     await saveFileMessage(this.files, "6191260ae9c3e67b7d225217");

//     fileList.innerHTML = "";
//     const list = document.createElement("ul");
//     fileList.appendChild(list);
//     for (let i = 0; i < this.files.length; i++) {
//       const li = document.createElement("li");
//       list.appendChild(li);

//       const img = document.createElement("img");
//       img.src = URL.createObjectURL(this.files[i]);
//       img.height = 60;
//       img.onload = function () {
//         URL.revokeObjectURL(this.src);
//       };
//       li.appendChild(img);
//       const info = document.createElement("span");
//       info.innerHTML =
//         this.files[i].name + ": " + this.files[i].size + " bytes";
//       li.appendChild(info);
//     }
//   }
// }

async function uploadFile() {
  let formData = new FormData();
  formData.append("files", fileupload.files[0]);
  formData.append("conversationId", "6191260ae9c3e67b7d225217");
  console.log(formData);

  console.log(formData.get("files"));
  await fetch("http://localhost:5000/api/messages/create-file-message", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  })
    .then(() => {
      socket.emit(
        "send-file-message",
        {
          file: formData.get("files"),
          conversationId: formData.get("conversationId"),
        },
        (error) => {
          // if (error) return console.log(error);
          if (!formData.get("files")) return;
        }
      );
    })
    .catch((err) => console.log(err));
}

async function uploadImg() {
  let formData = new FormData();
  formData.append("photos", imgupload.files[0]);
  formData.append("conversationId", "6191260ae9c3e67b7d225217");
  console.log(formData);

  console.log(formData.get("photos"));
  await fetch("http://localhost:5000/api/messages/create-img-message", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  })
    .then(() => {
      socket.emit(
        "send-file-message",
        {
          file: formData.get("files"),
          conversationId: formData.get("conversationId"),
        },
        (error) => {
          // if (error) return console.log(error);
          if (!formData.get("files")) return;
        }
      );
    })
    .catch((err) => console.log(err));
}

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

const saveMessage = async (text, conversationId) => {
  try {
    const result = await axios.post(
      "http://localhost:5000/api/messages/create-message",
      {
        conversationId,
        text,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

const saveFileMessage = async (file, conversationId) => {
  try {
    const result = await axios.post(
      "http://localhost:5000/api/messages/create-file-message",
      {
        conversationId,
        files: file,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};
