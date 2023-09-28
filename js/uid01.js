// 全域變數
var USERID;   // ID（主Key）
var Username;
var Userpwd;
var Mail;
var Addr;
var Phone;
var level;
$(function () {
  //確認uid是否存在，若存在傳至後端check_uid_api.php確認是否合法
  if (getCookie("uid01") != "") {
    //uid存在，傳至後端check_uid_api.php確認是否合法
    $.ajax({
      type: "POST",
      url: APILINKS + "check_uid_api.php",
      dataType: "json",
      data: { uid01: getCookie("uid01") },
      async: false,
      success: showdata_check_uid,
      error: function () {
        alert("error-" + APILINKS + "check_uid_api.php");
      },
    });
  }

  //按鈕監聽logout_btn
  $("#logout_btn").click(function () {
    logout();
  });

  function showdata_check_uid(data) {
    console.log(data);
    // 全域變數
    USERID = data.data[0].ID;
    Username = data.data[0].userName;
    Userpwd = data.data[0].userPwd;
    Mail = data.data[0].userMail;
    Addr = data.data[0].userAddr;
    Phone = data.data[0].userPhone;
    level = data.data[0].Level;

    if (data.state) {
      $("#login_btn").addClass("d-none");
      if (data.data[0].userAdmin == "1") {
        //管理員
        $("#admin_btn").removeClass("d-none");
        //登入按鈕隱藏
        $("#user_btn").addClass("d-none");
        //重啟瀏覽器後顯示歡迎詞
        $("#toast_msg").text("管理員：" + data.data[0].userName);
      } else if (data.data[0].userAdmin == "2") {
        //一般會員
        $("#car_btn").removeClass("d-none");
        //登入按鈕隱藏
        $("#user_btn").addClass("d-none");

        // 判斷重啟瀏覽器後 如果是高級會員(A)時 會顯示的畫面
        if (getCookie('level') == 'A') {
          //重啟瀏覽器後顯示歡迎詞
          $("#toast_msg").text("歡迎高級會員：" + data.data[0].userName);
        } else {
          //重啟瀏覽器後顯示歡迎詞
          $("#toast_msg").text("歡迎會員：" + data.data[0].userName);
        }


      }

      //顯示會員狀態按鈕
      $("#message_btn").removeClass("d-none");
      //顯示登出按鈕
      $("#logout_btn").removeClass("d-none");
    } else {
      //驗證失敗，需重新登入
      $("#loginModal").modal("show");
    }
  }

  function logout() {
    setCookie("uid01", "", 7);
    setCookie("level", " ", 7);
    location.href = "index.html";
  }
});
