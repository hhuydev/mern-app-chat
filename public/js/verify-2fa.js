$(document).ready(() => {
  $("#verify-2fa").bind("click", async () => {
    try {
      // Lưu ý tuy rằng chuỗi token trông giống dãy số nhưng chúng ta sẽ phải đẩy nó lên dạng string nhé
      const otpToken = $("#otp-token").val();
      // Gọi tới api kiểm tra mã OTP
      const result = await axios.post(
        "http://localhost:5000/api/users/verify-2fa",
        { otpToken },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      console.log(result);
      // Nếu token sai
      if (!result.data.isValid) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          html: "Token không hợp lệ",
          footer:
            'Trân trọng, từ tác giả của blog &nbsp; <a href="https://trungquandev.com" target="__blank">trungquandev.com</a>',
          showConfirmButton: false,
          timer: 5000,
        });
        return;
      }
      // Ngược lại, nếu đúng token thì sẽ verify thành công.
      if (result.data.isValid) {
        Swal.fire({
          icon: "success",
          html: "Token hợp lệ, đã xong quá trình xác thực bảo mật 2 lớp!",
          footer:
            'Trân trọng, từ tác giả của blog &nbsp; <a href="https://trungquandev.com" target="__blank">trungquandev.com</a>',
          showConfirmButton: false,
          timer: 5000,
        });
        setTimeout(() => {
          window.location.href = "/trangchu.html";
        }, 3000);
      }
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
