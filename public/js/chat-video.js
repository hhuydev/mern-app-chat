const chatInputBox = document.getElementById("chat_message");
const all_messages = document.getElementById("all_messages");
const main__chat__window = document.getElementById("main__chat__window");
const videoGrid = document.getElementById("video-grid");
const leaveVideoCall = document.getElementById("leave-meeting");
const myVideo = document.createElement("video");
const socket = io("/");
myVideo.muted = true;

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "3030",
});

let myVideoStream;

var getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", (call) => {
      console.log("1");
      call.answer(stream);
      const video = document.createElement("video");

      call.on("stream", (userVideoStream) => {
        console.log("2");

        addVideoStream(video, userVideoStream);
      });
    });
    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  });

peer.on("call", function (call) {
  getUserMedia(
    { video: true, audio: true },
    function (stream) {
      call.answer(stream); // Answer the call with an A/V stream.
      const video = document.createElement("video");
      call.on("stream", function (remoteStream) {
        addVideoStream(video, remoteStream);
      });
    },
    function (err) {
      console.log("Failed to get local stream", err);
    }
  );
});

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

// CHAT

const connectToNewUser = (userId, streams) => {
  console.log(userId);
  var call = peer.call(userId, streams);
  console.log(call);
  var video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    console.log(userVideoStream);
    addVideoStream(video, userVideoStream);
  });
};

const addVideoStream = (videoEl, stream) => {
  videoEl.srcObject = stream;
  videoEl.addEventListener("loadedmetadata", () => {
    videoEl.play();
  });

  videoGrid.append(videoEl);
  let totalUsers = document.getElementsByTagName("video").length;
  if (totalUsers > 1) {
    for (let index = 0; index < totalUsers; index++) {
      document.getElementsByTagName("video")[index].style.width =
        100 / totalUsers + "%";
    }
  }
};

const playStop = () => {
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};

const stopVideoCall = () => {
  peer.on("close", () => {
    console.log("Closed calling video");
  });
};

const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};

const setPlayVideo = () => {
  const html = `<i class="unmute fa fa-pause-circle"></i>
  <span class="unmute">Resume Video</span>`;
  document.getElementById("playPauseVideo").innerHTML = html;
};

const setStopVideo = () => {
  const html = `<i class=" fa fa-video-camera"></i>
  <span class="">Pause Video</span>`;
  document.getElementById("playPauseVideo").innerHTML = html;
};

const setUnmuteButton = () => {
  const html = `<i class="unmute fa fa-microphone-slash"></i>
  <span class="unmute">Unmute</span>`;
  document.getElementById("muteButton").innerHTML = html;
};
const setMuteButton = () => {
  const html = `<i class="fa fa-microphone"></i>
  <span>Mute</span>`;
  document.getElementById("muteButton").innerHTML = html;
};

// let localVideo = document.getElementById("local-video");
// let remoteVideo = document.getElementById("remote-video");

// localVideo.style.opacity = 0;
// remoteVideo.style.opacity = 0;

// localVideo.onplaying = () => {
//   localVideo.style.opacity = 1;
// };
// remoteVideo.onplaying = () => {
//   remoteVideo.style.opacity = 1;
// };

// let peer;
// function init(userId) {
//   peer = new Peer(userId, {
//     path: "/peerjs",
//     host: "/",
//     port: "3030",
//   });

//   listen();
// }

// let localStream;
// function listen() {
//   peer.on("call", (call) => {
//     navigator.getUserMedia(
//       {
//         audio: true,
//         video: true,
//       },
//       (stream) => {
//         localVideo.srcObject = stream;
//         localStream = stream;

//         call.answer(stream);
//         call.on("stream", (remoteStream) => {
//           remoteVideo.srcObject = remoteStream;

//           remoteVideo.className = "primary-video";
//           localVideo.className = "secondary-video";
//         });
//       }
//     );
//   });
// }

// function startCall(otherUserId) {
//   navigator.getUserMedia(
//     {
//       audio: true,
//       video: true,
//     },
//     (stream) => {
//       localVideo.srcObject = stream;
//       localStream = stream;

//       const call = peer.call(otherUserId, stream);
//       call.on("stream", (remoteStream) => {
//         remoteVideo.srcObject = remoteStream;

//         remoteVideo.className = "primary-video";
//         localVideo.className = "secondary-video";
//       });
//     }
//   );
// }

// function toggleVideo(b) {
//   if (b == "true") {
//     localStream.getVideoTracks()[0].enabled = true;
//   } else {
//     localStream.getVideoTracks()[0].enabled = false;
//   }
// }

// function toggleAudio(b) {
//   if (b == "true") {
//     localStream.getAudioTracks()[0].enabled = true;
//   } else {
//     localStream.getAudioTracks()[0].enabled = false;
//   }
// }
