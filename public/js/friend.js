/**
 * Created by janghunlee on 2017. 11. 14..
 */
var acceptToken = "";
var popupStatus = "";


$(document).ready(function () {
    $.ajax({
        method:"GET",
        url:"/friend/list",
        success:function (data) {
            if(data == "user not found"){
                // alert("server error : user not found");
                // location.href="/"
            }
            else{
                var inputData = "";
                for(var i = 0; i<data.length; i++){
                    inputData += '<div class="friend-box"><div class="friend-img"></div><div class="friend-data-box">';
                    inputData += '<p>친구이름</p><div class="friend-data">';
                    inputData += '<h4>'+data[i]["friendName"]+'</h4><p>'+data[i]["friendCode"]+'</p></div></div><div class="border"></div><div class="battle-data">'
                    inputData += '<p>사용자님과의 전적</p><h4>'+data[i]["win"] +'승'+data[i]["lose"]+'패'+'</h4></div></div>'
                }

                $(".main-content-box").append(inputData);
            }
        },
        error:function (err) {
            console.log(err);
        }
    });

    $.ajax({
        method:"GET",
        url:"/friend/acceptList",
        success:function (data) {
            console.log("acceptList start")
            if(data == "user not found"){
                // alert("server error : user not found");
                // location.href="/"
            }
            else if(data == "no accept friend"){
                console.log(data);
            }
            else{
                for(var i = 0; i<data.length; i++){
                    popupStatus = "add friend";
                    $(".friendName").text(data[i]["name"]);
                    $(".friendCode").text(data[i]["code"]);
                    acceptToken = data[i]["acceptToken"]
                    $(".pop-up").css({
                        "display":"flex"
                    });
                }
            }
        },
        error:function (err) {
            console.log(err);
        }
    });
});

$(".friend-add-btn").click(function () {
    var text = $(".friend-name").val();

    if(text.indexOf("#") == -1){
        alert("정확한 이름과 코드를 입력해주세요");
    }
    else{
        $(".friendName").text(text.split("#")[0]);
        $(".friendCode").text(text.split("#")[1]);

        $(".pop-up").css({
            "display":"flex"
        });
    }
});

$(".fuck-you-btn").click(function () {
    if(popupStatus == "add friend" && acceptToken != "") {
        $.ajax({
            method: "POST",
            url: "/friend/accept",
            data: {"acceptToken": acceptToken, "answer": "none"},
            success: function (data) {
                "use strict";
                console.log(data);
            },
            error: function (err) {
                console.log(err);
            }
        });
    }
    else{

    }
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

$(".ok-btn").click(function () {
    console.log(acceptToken);
    if(popupStatus == "add friend" && acceptToken != ""){
        $.ajax({
            method:"POST",
            url:"/friend/accept",
            data:{"token":acceptToken,"answer":"save"},
            success:function (data) {
                if(data == "accept token not found"){
                    alert("친구 추가 실패")
                }
                else{
                    $.ajax({
                        method:"GET",
                        url:"/friend/list",
                        success:function (data) {
                            if(data == "user not found"){
                                alert("server error : user not found");
                                location.href="/"
                            }
                            else{
                                var inputData = "";

                                inputData += '<div class="friend-box"><div class="friend-img"></div><div class="friend-data-box">';
                                inputData += '<p>친구이름</p><div class="friend-data">';
                                inputData += '<h4>'+data[data.length - 1]["friendName"]+'</h4><p>'+data[data.length - 1]["friendCode"]+'</p></div></div><div class="border"></div><div class="battle-data">'
                                inputData += '<p>사용자님과의 전적</p><h4>'+data[data.length - 1]["win"] +'승'+data[data.length - 1]["lose"]+'패'+'</h4></div></div>'


                                $(".main-content-box").append(inputData);

                                acceptToken = "";
                                popupStatus = "";
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
    }
    else{
        console.log("friend add start")
        var friendName = $(".friend-name").val();
        $.ajax({
            method:"POST",
            url:"/friend/add",
            data:{"name":friendName},
            success:function (data) {
                console.log(data);
                if(data == "friend not found"){
                    alert("정확한 이름과 코드를 입력해주세요");
                }
                else if(data == "user not found"){
                    alert("server error : user not found");
                    location.href="/"
                }
                else{
                    alert("친구 추가 요청에 성공했습니다");
                }
            },
            error:function (err) {
                console.log(err);
            }
        });
    }
    $(".pop-up").css({
        "display":"none"
    });
});
