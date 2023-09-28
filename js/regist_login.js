// 全域變數
var USERID;     // ID（主Key）
var Username;
var Userpwd;
var Mail;
var Addr;
var Phone;
var level;
//註冊同意書
var flag_recheckbox = false;
//註冊內容格式
var flag_username = false; //帳號
var flag_userpwd = false; //密碼
var flag_repassword = false; //密碼再確認
var flag_userphone = false; //電話
var flag_useraddr = false; //地址
var flag_usermail = false; //email

$(function () {
  //即時監聽"username"，6~16字
  $("#username").bind("input propertychange", function () {
    if ($(this).val().length >= 6 && $(this).val().length <= 16) {
      // 符合格式
      // 確認帳號名稱是否重複
      $.ajax({
        type: "POST",
        url: APILINKS + "reg_check_uni_api.php",
        data: { username: $("#username").val() },
        dataType: "json",
        success: showdata_check_uni,
        error: function () {
          alert("帳號確認-" + APILINKS + "reg_check_uni_api.php");
        },
      });
    } else {
      //不符合格式
      $("#valid_message").text("帳號字數不符合格式");
      $(this).removeClass("is-valid");
      $(this).addClass("is-invalid");
      flag_username = false;
    }
  });

  //即時監聽"userpwd"，6~16字
  $("#userpwd").bind("input propertychange", function () {
    if ($(this).val().length >= 6 && $(this).val().length <= 16) {
      //符合格式
      $(this).removeClass("is-invalid");
      $(this).addClass("is-valid");
      flag_userpwd = true;
    } else {
      //不符合格式
      $(this).removeClass("is-valid");
      $(this).addClass("is-invalid");
      flag_userpwd = false;
    }
  });

  //即時監聽"repassword"
  $("#repassword").bind("input propertychange", function () {
    if ($(this).val() == $("#userpwd").val()) {
      //符合格式
      $(this).removeClass("is-invalid");
      $(this).addClass("is-valid");
      flag_repassword = true;
    } else {
      //不符合格式
      $(this).removeClass("is-valid");
      $(this).addClass("is-invalid");
      flag_repassword = false;
    }
  });

  //即時監聽"userphone"，1~16字
  $("#userphone").bind("input propertychange", function () {
    if ($(this).val().length >= 1 && $(this).val().length <= 16) {
      //符合格式
      $(this).removeClass("is-invalid");
      $(this).addClass("is-valid");
      flag_userphone = true;
    } else {
      //不符合格式
      $(this).removeClass("is-valid");
      $(this).addClass("is-invalid");
      flag_userphone = false;
    }
  });

  //即時監聽"useraddr"，1~64字
  $("#useraddr").bind("input propertychange", function () {
    if ($(this).val().length >= 1 && $(this).val().length <= 64) {
      //符合格式
      $(this).removeClass("is-invalid");
      $(this).addClass("is-valid");
      flag_useraddr = true;
    } else {
      //不符合格式
      $(this).removeClass("is-valid");
      $(this).addClass("is-invalid");
      flag_useraddr = false;
    }
  });

  //即時監聽"usermail"，1~32字
  $("#usermail").bind("input propertychange", function () {
    if ($(this).val().length >= 1 && $(this).val().length <= 32) {
      //符合格式
      $(this).removeClass("is-invalid");
      $(this).addClass("is-valid");
      flag_usermail = true;
    } else {
      //不符合格式
      $(this).removeClass("is-valid");
      $(this).addClass("is-invalid");
      flag_usermail = false;
    }
  });

  //監聽同意書"recheckbox"
  $("#recheckbox").change(function () {
    if ($("#recheckbox").is(":checked")) {
      $("#recheckbox").removeClass("is-invalid");
      $("#recheckbox").addClass("is-valid");
      flag_recheckbox = true;
    } else {
      $("#recheckbox").removeClass("is-valid");
      $("#recheckbox").addClass("is-invalid");
      flag_recheckbox = false;
    }
  });

  //按鈕監聽reg_btn
  $("#reg_btn").click(function () {
    if (
      flag_username &&
      flag_userpwd &&
      flag_repassword &&
      flag_userphone &&
      flag_useraddr &&
      flag_usermail &&
      flag_recheckbox
    ) {
      // 欄位輸入正確，可傳至API
      $.ajax({
        type: "POST",
        url: APILINKS + "reg_api.php",
        data: {
          username: $("#username").val(),
          userpwd: $("#userpwd").val(),
          userphone: $("#userphone").val(),
          useraddr: $("#useraddr").val(),
          usermail: $("#usermail").val(),
        },
        dataType: "json",
        success: showdata_reg,
        error: function () {
          alert("註冊錯誤-" + APILINKS + "reg_api.php");
        },
      });
    } else {
      //欄位輸入錯誤
      alert("欄位輸入有誤，並請勾選同意書");
    }
  });

  //按鈕監聽login_btn
  $("#login_btn").click(function () {
    $.ajax({
      type: "POST",
      url: APILINKS + "login_api.php",
      data: {
        username: $("#login_username").val(),
        userpwd: $("#login_password").val(),
      },
      dataType: "json",
      async: false,
      success: function (data) {
        showdata_login(data);
        console.log(data.state);

        // 判斷登入狀態為 Ture 作 Toast 顯示
        if (data.state == true) {
          $("#login_toast_windows").removeClass("d-none");
        } else {
          $("#login_toast_windows").addClass("d-none");
        }
      },
      error: function () {
        alert("登入相關錯誤-" + APILINKS + "login_api.php");
      },
    });
  });

  //按鈕監聽logout_btn
  $("#logout_btn").click(function () {
    logout();
  });

  function showdata_reg(data) {
    if (data.state) {
      alert(data.message);
      $("#registerModal").modal("hide");
      $("#loginModal").modal("show");
    } else {
      alert(data.message);
    }
  }

  function showdata_check_uni(data) {
    if (data.state) {
      $("#valid_message").text("此帳號不存在，可以使用");
      $("#username").removeClass("is-invalid");
      $("#username").addClass("is-valid");
      flag_username = true;
    } else {
      $("#invalid_message").text("此帳號存在，不可以使用");
      $("#username").removeClass("is-valid");
      $("#username").addClass("is-invalid");
      flag_username = false;
    }
  }

  function showdata_login(data) {
    console.log(data);
    console.log('test condition:', data.state);

    
    // 全域變數
    USERID = data.data[0].ID;
    Username = data.data[0].userName;
    Userpwd = data.data[0].userPwd;
    Mail = data.data[0].userMail;
    Addr = data.data[0].userAddr;
    Phone = data.data[0].userPhone;
    level = data.data[0].Level;

    if (data.state) {
      //帳號被啟用
      if (data.data[0].userState == "Y") {
        //登入成功
        // alert(data.message);

        //將uid01存入cookie
        setCookie("uid01", data.data[0].Uid, 7);

        // 將level存入cookie
        setCookie('level', data.data[0].Level, 7);

        //loginModal隱藏
        $("#loginModal").modal("hide");
        //登入按鈕隱藏
        $("#user_btn").addClass("d-none");

        if (data.data[0].userAdmin == "1") {
          //管理員
          $("#admin_btn").removeClass("d-none");

          //登入後顯示歡迎詞
          $("#toast_msg").text("歡迎管理員：" + data.data[0].userName);
        } else if (data.data[0].userAdmin == "2") {

          //一般會員
          $("#car_btn").removeClass("d-none");

          // 登入後判斷如果是高級會員(A)時 會顯示的畫面
          if (getCookie('level') == "A") {
            //登入後顯示歡迎詞
            $("#toast_msg").text("歡迎高級會員：" + data.data[0].userName);
          } else {
            $("#toast_msg").text("歡迎普通會員：" + data.data[0].userName);
          }
        }

        //顯示會員狀態按鈕
        $("#message_btn").removeClass("d-none");
        //顯示登出按鈕
        $("#logout_btn").removeClass("d-none");
      } else {
        //帳號被停權
        alert("此帳號被停權，請聯絡管理員");
      }
    } else {
      alert(data.message);
    }
  }

  function logout() {
    setCookie("uid01", "", 7);
    setCookie("level", " ", 7);
    alert("登出成功");
    location.href = "index.html";
  }
});
