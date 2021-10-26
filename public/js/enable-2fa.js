$(document).ready(() => {
  $("#enable-2fa").bind("click", async () => {
    try {
      // Gọi tới api bật xác thực bảo mật hai lớp
      const token = localStorage.getItem("userToken");
      if (!token) return window.alert("can not get token");
      const data = "test";
      const result = await axios.post(
        "http://localhost:5000/api/users/enable-2fa",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(result);
      // Nhận được kết quả thì hiển thị mã QR Code ra màn hình
      $("#img-qr-code-area").html(result.data.QRCodeImage);
      $(".offset-height").css("height", "0px");
      setTimeout(() => {
        window.location.href = "/verify-2fa.html";
      }, 5000);
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
