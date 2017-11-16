/**
 * Created by janghunlee on 2017. 11. 16..
 */

var acceptToken = "";

$(document).ready(function () {
    $.ajax({
        method:"GET",
        url:"/room/acceptList",
        success:function (data) {
            if(data == "user not found"){
                alert("server error : user not found");
                location.href="/"
            }
            else if(data == "no accept list"){

            }
            else{
                $(".friendName").text(data[0]["name"]);
                $(".award-credit").text(data[0]["awardCredit"]+" 원");
                $(".award-distance").text(data[0]["goalDistance"]+" 걸음");
                acceptToken = data[0]["acceptToken"];
                $(".pop-up").css({
                    "display":"flex"
                });
            }
        },
        error:function (err) {
            console.log(err);
        }
    });
});

$(".header-btn").click(function () {
    var text = $(this).text();

    if(text == "친구 관리"){
        location.href="/friend";
    }
    else if(text == "프로필"){
        location.href="/setting";
    }
    else{
        location.href="/";
    }
});

$(".game-start-btn").click(function () {
    location.href="/matchStart"
});

$(".add-friend-btn").click(function () {
    location.href="/friend"
});

$(".fuck-you-btn").click(function () {
    "use strict";

    $.ajax({
        method: "POST",
        url: "/room/accept",
        data: {"acceptToken": acceptToken, "answer": "none"},
        success: function (data) {
            "use strict";
            console.log(data);
        },
        error: function (err) {
            console.log(err);
        }
    });

    $(".pop-up").css({
        "display":"none"
    });
});


$(".ok-btn").click(function () {
    "use strict";
    $.ajax({
        method: "POST",
        url: "/room/accept",
        data: {"acceptToken": acceptToken, "answer": "save"},
        success: function (data) {
            "use strict";
            if(data == "acceptToken not found"){
                alert("server error : can't accept battle");
            }
            else if(data == "please charge your credit"){
                alert("당신의 크레딧이 부족합니다!");
            }
            else if(data == "someone already have battle"){
                alert("사용자가 이미 배틀을 진행중입니다!");
            }
            else{
                location.href="/battle"
            }
        },
        error: function (err) {
            console.log(err);
            alert(err);
        }
    });

    $(".pop-up").css({
        "display":"none"
    });
});


