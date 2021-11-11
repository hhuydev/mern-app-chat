$(document).ready(() => {
  $("#login").bind("click", async () => {
    try {
      const email = $("#username").val();
      const password = $("#password").val();

      // Gọi tới api login
      const result = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });
      console.log(result);
      // Nếu sai thông tin tài khoản
      if (!result.data.isCorrectIdentifier) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          html: "Lỗi đăng nhập, kiểm tra lại thông tin test đăng nhập ở file <strong>AuthController.js</strong>!",
          footer:
            'Trân trọng, từ tác giả của blog &nbsp; <a href="https://trungquandev.com" target="__blank">trungquandev.com</a>',
          showConfirmButton: false,
          timer: 7000,
        });
        return;
      }
      // Nếu đúng thông tin tài khoản và tài khoản chưa bật xác thực 2 lớp
      if (result.data.isCorrectIdentifier) {
        Swal.fire({
          icon: "success",
          html: "Đăng nhập thành công, tài khoản của bạn <strong>chưa bật xác thực 2 lớp</strong>!",
          footer:
            'Trân trọng, từ tác giả của blog &nbsp; <a href="https://trungquandev.com" target="__blank">trungquandev.com</a>',
          showConfirmButton: false,
          timer: 5000,
        }).then(() => {
          localStorage.setItem("userToken", result.data.token);
          localStorage.setItem("secret", result.data.secret);

          // window.location.href = "/enable-2fa.html";
          window.location.href = "/enable-2fa.html";
        });
      }
      // Nếu tài khoản yêu cầu xác thực 2 lớp, sẽ hiện thông báo sau đó redirect qua trang verify
      // if (result.data.is2FAEnabled) {
      //   Swal.fire({
      //     icon: "success",
      //     html: "Thông tin đăng nhập chính xác, sẽ chuyển qua <strong>trang nhập mã xác thực 2 lớp</strong> sau thông báo này.",
      //     footer:
      //       'Trân trọng, từ tác giả của blog &nbsp; <a href="https://trungquandev.com" target="__blank">trungquandev.com</a>',
      //     showConfirmButton: false,
      //     timer: 5000,
      //   }).then(() => {
      //     window.location.href = "/verify-2fa";
      //   });
      // }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        html: "Lỗi này chỉ hiện khi có khả năng các bạn đã sửa code linh tinh ở đâu đó phía server :v",
        footer:
          'Trân trọng, từ tác giả của blog &nbsp; <a href="https://trungquandev.com" target="__blank">trungquandev.com</a>',
        showConfirmButton: false,
        timer: 7000,
      });
    }
  });
});
