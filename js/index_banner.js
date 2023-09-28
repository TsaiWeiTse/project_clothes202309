//banner背景圖片 隨著滑鼠位置晃動
var mouseX = 0;
var mouseY = 0;

$('#s20').mousemove(function(e) {
    var containerWidth = $(this).width();
    var containerHeight = $(this).height();

    // 取得滑鼠座標 相對於容器的中心點
    var moveX = (e.pageX - containerWidth / 2) / containerWidth;
    var moveY = (e.pageY - containerHeight / 2) / containerHeight;

    mouseX = moveX;
    mouseY = moveY;

    updateBackgroundPosition();
});

function updateBackgroundPosition() {
    var moveX = mouseX * 15;
    var moveY = mouseY * 15;

    $('section').css('background-position', moveX + 'px ' + moveY + 'px');
}
// 初始更新一次背景位置 防止往左右移動時出現白色區塊
updateBackgroundPosition();