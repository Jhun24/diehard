/**
 * Created by janghunlee on 2017. 11. 16..
 */

/**
 * Created by janghunlee on 2017. 11. 16..
 */

var beforeZ = 0;
var beforeY = 0;

var moveTime = 0;
//
// $(document).ready(function () {
//     $.ajax({
//         method:"POST",
//         url:"/room/update/userDistance",
//         data:{"userDistance":1},
//         success:function (data) {
//             "use strict";
//             console.log($(".user-text").text())
//             var userDistance = parseInt($(".user-text").text())+1;
//             alert(userDistance);
//             $(".user-text").text(userDistance);
//         },
//         error:function (err) {
//             console.log(err);
//         }
// //     });
// })

if (window.DeviceMotionEvent != undefined) {
    window.ondevicemotion = function(e) {
        var checkY = e.accelerationIncludingGravity.y;
        var checkZ = e.accelerationIncludingGravity.z;

        var y = parseInt(e.accelerationIncludingGravity.y*100);
        var z = parseInt(e.accelerationIncludingGravity.z*100);

        if(checkY == null && checkZ == null){
            console.log("check not work");
        }
        else{
            var plusZ = beforeZ+20;
            var minusZ = beforeZ-20;

            var plusY = beforeY+20;
            var minusY = beforeY-20;


            if((y < minusY || y > plusY) && (z < minusZ || z > plusZ)){
                beforeY = y;
                beforeZ = z;
                moveTime = moveTime + 1;

                if(moveTime == 10){
                    moveTime = 0;
                    $.ajax({
                        method:"POST",
                        url:"/room/update/userDistance",
                        data:{"userDistance":1},
                        success:function (data) {
                            "use strict";
                            var userDistance = parseInt($(".user-text").text())+1;
                            $(".user-text").text(userDistance);

                            if(data == "you win"){
                                alert("you win");
                                location.href="/battleNone"
                            }
                        },
                        error:function (err) {
                            console.log(err);
                        }
                    });

                }
            }
            else{
                beforeY = y;
                beforeZ = z;
                moveTime = 0;
            }
        }
    }
}
