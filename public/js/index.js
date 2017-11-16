/**
 * Created by janghunlee on 2017. 11. 14..
 */

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

$(".login-choose-btn").click(function () {
    $(".login-box").css({
        "display":"block"
    });

    $(".register-box").css({
        "display":"none"
    });
});

$(".register-choose-btn").click(function () {
    $(".login-box").css({
        "display":"none"
    });

    $(".register-box").css({
        "display":"block"
    });
});

$(".login-btn").click(function () {
    var id = $(".login-id").val();
    var password = $(".login-password").val();

    $.ajax({
        method:"POST",
        url:"/auth/login",
        data:{"id":id,"password":password},
        success:function (data) {
            console.log(data);
            "use strict";
            if(data[0]["id"] == id){
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
            else{
                alert(data[1]);
            }
        },
        error:function (err) {
            console.log(err);
        }
    })
});

$(".register-btn").click(function () {
    var id = $(".regi-id").val();
    var password = $(".regi-password").val();
    var rePassword = $(".regi-re-password").val();
    var name = $(".regi-name").val();

    if(rePassword == password){
        $.ajax({
            method:"POST",
            data:{"id":id,"password":password,"name":name},
            url:"/auth/register",
            success:function (data) {
                if(data != "user already exist"){
                    location.href="/battleNone"
                }
                else{
                    alert(data);
                }
            },
            error:function (err) {
                console.log(err);
            }
        });
    }
    else {
        $(".regi-re-password").val("");
        $(".regi-password").val("");

        alert("비밀번호 확인이 일치하지않습니다");
    }
});