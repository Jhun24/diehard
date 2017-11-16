/**
 * Created by janghunlee on 2017. 11. 16..
 */
$(document).ready(function () {
    $.ajax({
        method:"GET",
        url:"/user/userData",
        success:function (data) {
            "use strict";
            if(data == "token not defined"){
                alert("server error : token not defined");
            }
            else{
                $(".user-name").text(data[0]["name"] +" # "+data[0]["userCode"]);
                $(".name-change").val(data[0]["name"]);
                $(".now-credit").text("현재 크래딧 : "+data[0]["credit"]);

                if(data[0]["cardNumber"] != undefined){
                    $(".card").css({
                        "display":"none"
                    });

                    $(".has-card").css({
                        "display":"block"
                    });

                    $(".input-card-number").text(data[0]["cardNumber"]);
                    $(".input-card-expiry").text(data[0]["cardExpiry"]);
                }
            }
        },
        error:function (err) {
            console.log(err);
        }
    });
});

$(".card").click(function () {
    $(".pop-up").css({
        "display":"flex"
    });
});

$(".card-cancel-btn").click(function () {
    $(".pop-up").css({
        "display":"none"
    });
});

$(".card-add-btn").click(function () {
    var cardNumber = $(".card-number").val();
    var cardExpiry = $(".card-expiry").val();
    var cardBirthday = $(".card-birthday").val();
    var cardPassword = $(".card-password").val();

    $.ajax({
        method:"POST",
        url:"/user/update/card",
        data:{"cardNumber":cardNumber,"cardPassword":cardPassword,"cardExpiry":cardExpiry,"cardBirthday":cardBirthday},
        success:function (data) {
            if(data == "user not found"){
                alert("server error : user not found");
                location.href="/"
            }
            else{
                $(".card").css({
                    "display":"none"
                });

                $(".has-card").css({
                    "display":"block"
                });
                console.log(data)
                $(".input-card-number").text(data[0]["cardNumber"]);
                $(".input-card-expiry").text(data[0]["cardExpiry"]);
            }
        },
        error:function (err) {
            console.log(err);
        }
    })

    $(".pop-up").css({
        "display":"none"
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

$(".credit-btn").click(function () {
    $(".credit-pop-up").css({
        "display":"flex"
    });
});

$(".credit-ok-btn").click(function () {
    var amount = $(".add-credit-number").val();

    $.ajax({
        method:"POST",
        url:"/user/charge",
        data:{"amount":amount},
        success:function (data) {
            if(data  == "user not found"){
                alert("server error : user not found");
                location.href="/"
            }
            else{
                $(".now-credit").text("현재 크래딧 : "+amount);
                $(".credit-pop-up").css({
                    "display":"none"
                });
            }
        },
        error:function (err) {
            console.log(err);
        }
    });
});

$(".credit-cancel-btn").click(function () {
    $(".credit-pop-up").css({
        "display":"none"
    });
});

$(".setting-ok").click(function () {
    var name = $(".name-change").val();

    $.ajax({
        method:"POST",
        url:"/user/update/name",
        data:{"name":name},
        success:function (data) {
            if(data == "user not found"){
                alert("server error : user not found");
                location.href="/"
            }
            else{
                alert(data+"로 이름이 변경되었습니다");

                $.ajax({
                    method:"GET",
                    url:"/room/check",
                    success:function (data) {
                        if(data == "battle"){
                            location.href="/battle"
                        }
                        else if(data == "nobattle"){
                            location.href="/battleNone"
                        }
                        else{
                            alert(data);
                            location.href="/"
                        }
                    },
                    error:function (err) {
                        console.log(err);
                    }

                });
            }
        },
        error:function (err) {
            console.log(err);
        }
    });
});

$(".setting-cancel").click(function () {
    $.ajax({
        method:"GET",
        url:"/room/check",
        success:function (data) {
            if(data == "battle"){
                location.href="/battle"
            }
            else if(data == "nobattle"){
                location.href="/battleNone"
            }
            else{
                alert(data);
                location.href="/"
            }
        },
        error:function (err) {
            console.log(err);
        }

    });
});