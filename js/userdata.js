// （登入後）"消費者"個人訊息按鈕
$("#message_btn").click(function () {
  //設值，值從regist_login.js或uid01.js而來，要看是否有重整頁面
  $("#dataName").text(Username);
  $("#dataMail").text(Mail);

  if (level == "B") {
    // 一般會員
    $(".fa-crown").removeClass("text-warning");
    $(".fa-crown").addClass("text-light");

    $("#memberLV").text("一般會員");
  } else if (level == "A") {
    // 高級會員
    $(".fa-crown").removeClass("text-light");
    $(".fa-crown").addClass("text-warning");

    $("#memberLV").text("高級會員");
  }
});

$("#message_databtn").click(function () {
  $("#u_username").val(Username);
  $("#u_userphone").val(Phone);
  $("#u_usermail").val(Mail);
});

// 監聽資料，因為是從資料庫取出，所以預設是true
var flag_u_userpwd = true;
var flag_u_userphone = true;
var flag_u_useraddr = true;
var flag_u_usermail = true;

//即時監聽"u_userpwd"，6~16字
$("#u_userpwd").bind("input propertychange", function () {
  if ($(this).val().length >= 6 && $(this).val().length <= 16) {
    //符合格式
    $(this).removeClass("is-invalid");
    $(this).addClass("is-valid");
    flag_u_userpwd = true;
  } else {
    //不符合格式
    $(this).removeClass("is-valid");
    $(this).addClass("is-invalid");
    flag_u_userpwd = false;
  }
});

//即時監聽"u_userphone"，1~16字
$("#u_userphone").bind("input propertychange", function () {
  if ($(this).val().length >= 1 && $(this).val().length <= 16) {
    //符合格式
    $(this).removeClass("is-invalid");
    $(this).addClass("is-valid");
    flag_u_userphone = true;
  } else {
    //不符合格式
    $(this).removeClass("is-valid");
    $(this).addClass("is-invalid");
    flag_u_userphone = false;
  }
});

//即時監聽"u_useraddr"，1~64字
$("#u_useraddr").bind("input propertychange", function () {
  if ($(this).val().length >= 1 && $(this).val().length <= 64) {
    //符合格式
    $(this).removeClass("is-invalid");
    $(this).addClass("is-valid");
    flag_u_useraddr = true;
  } else {
    //不符合格式
    $(this).removeClass("is-valid");
    $(this).addClass("is-invalid");
    flag_u_useraddr = false;
  }
});

//即時監聽"u_usermail"，1~32字
$("#u_usermail").bind("input propertychange", function () {
  if ($(this).val().length >= 1 && $(this).val().length <= 32) {
    //符合格式
    $(this).removeClass("is-invalid");
    $(this).addClass("is-valid");
    flag_u_usermail = true;
  } else {
    //不符合格式
    $(this).removeClass("is-valid");
    $(this).addClass("is-invalid");
    flag_u_usermail = false;
  }
});

// 會員資料更新按鈕
$("#data_u_btn").click(function () {
  if (
    flag_u_userpwd &&
    flag_u_userphone &&
    flag_u_useraddr &&
    flag_u_usermail
  ) {
    $.ajax({
      type: "POST",
      url: APILINKS + "userdata_u_api.php",
      data: {
        id: USERID,
        userPwd: $("#u_userpwd").val(),
        userPhone: $("#u_userphone").val(),
        userAddr: Addr,
        userMail: $("#u_usermail").val(),
      },
      dataType: "json",
      success: showdata_update_userchange,
      error: function () {
        alert("error-" + APILINKS + "userdata_u_api.php");
      },
    });
  }
});


// u_recordModal 監聽按鈕
$(".u_recordModal").click(function () {
  console.log("text");
  $.ajax({
    type: "GET",
    url: APILINKS + "car_r_api.php",
    dataType: "json",
    // async: false,
    success: function (data) {
      console.log(data);
      $("#recode_table").empty();

     var totalPrice = 0;  //每次進入會先清空 再計算
      data.data.forEach(function (item) {
        if (item.c_UserName == Username && item.c_Active == "Y") {
          var strHTML =
            '<tr class="text-center"><td>' +
            item.c_Date +
            "</td><td>" +
            item.c_Name +
            "</td><td>" +
            item.c_Num +
            "</td><td>" +
            item.c_Price +
            "</td></tr>";

          $("#recode_table").append(strHTML);

          // 計算每次迴圈出來的價格加到總價格中
          totalPrice += parseInt(item.c_Price * item.c_Num);
        } else {
          // 如果條件不符合，就是前面寫錯了!
        }
      });

      $("#totalPriceDisplay").text("共累積消費 : " + totalPrice + " 元");
    },
    error: function (data) {
      alert(data.message);
    },
  });
});

function showdata_update_userchange(data) {
  console.log(data);
  if (data.state) {
    alert(data.message);
    location.href = "index.html";
  } else {
    alert(data.message);
  }
}
