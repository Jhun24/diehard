/**
 * Created by janghunlee on 2017. 11. 17..
 */
$(document).ready(function () {
    $.ajax({
        method:"GET",
        url:"/room/getRoom",
        success:function (data) {
            $(".user-award-credit").text(data[0]["awardCredit"]+" 원");
            $(".goal-distance").text(data[0]["goalDistance"]+" 걸음");

            $(".user-name").text(data[0]["user1Name"]);
            $(".friend-name").text(data[0]["user2Name"]);

            $(".user-text").text(data[0]["user1Distance"]);
            $(".friend-text").text(data[0]["user2Distance"]);

            var userWidth = data[0]["user1Distance"] / data[0]["goalDistance"] * 100;
            var friendWidth = data[0]["user2Distance"] / data[0]["goalDistance"] * 100;

            $(".user-data").css({
                "width":userWidth,
            });

            $(".friend-data").css({
                "width":friendWidth
            })
        },
        error:function (err) {
            console.log(err);
        }
    });
});