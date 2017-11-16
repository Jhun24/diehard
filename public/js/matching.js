/**
 * Created by janghunlee on 2017. 11. 16..
 */
var friendName = "";

$(".game-start").click(function () {
    if(friendName == ""){
        alert("유저명을 입력해주세요");
    }
    else if($(".award-distance") == ""){
        alert("목표 거리를 입력해주세요");
    }
    else if($(".award-credit") == ""){
        alert("목표 금액를 입력해주세요");
    }
    else{
        $.ajax({
            method:"POST",
            url:"/room/add",
            data:{"friendName":$(".find-friend-name").val().split("#")[0],"friendCode":$(".find-friend-name").val().split("#")[1],"awardCredit":$(".award-credit").val(),"goalDistance":$(".award-distance").val()},
            success:function (data) {
                location.href="/battleNone"
            },
            error:function (err) {
                console.log(err)
                if(err["responseText"] == "please charge your credit"){
                    alert("친구의 크래딧이 부족합니다");
                }
                else if(err["responseText"] == "friend already have battle"){
                    alert("친구가 이미 다른 사람과 경쟁중입니다");
                }
                else if(err["responseText"] == "you already have battle"){
                    alert("유저가 이미 경쟁중입니다");
                }
                else if(err["responseText"] == "friend not found"){
                    alert("친구를 찾을수없습니다");
                }
                else if(err["responseText"] == "please charge your credit"){
                    alert("친구의 크래딧이 부족합니다");
                }
                else if(err["responseText"] == "user not found"){
                    alert("server error : user not found");
                    location.href="/";
                }
            }
        });
    }
});


$(".game-delete").click(function () {
    location.href="/battleNone"
});

$(".find").click(function () {
    $(".pop-up").css({
        "display":"flex"
    });
});

$(".delete").click(function () {
    
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

$(".find-ok-btn").click(function () {
    $.ajax({
        method:"GET",
        url:"/friend/find?name="+$(".find-friend-name").val().split("#")[0],
        success:function (data) {

            $(".select-user-name").text($(".find-friend-name").val());
            friendName = $(".find-friend-name").val();
            $(".pop-up").css({
                "display":"none"
            });

        },
        error:function (err) {
            console.log(err);
            if(err["responseText"] == "friend not found"){
                alert("존재하지 않는 친구명입니다");
            }
        }
    });
});

$(".find-cancel-btn").click(function () {
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