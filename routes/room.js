/**
 * Created by janghunlee on 2017. 11. 10..
 */

module.exports = room;

function room(app , userModel , roomModel , acceptRoomModel , randomString , friendModel , session) {

    app.get('/room/acceptList',(req,res)=>{
        "use strict";
        var token = req.session.token;

        userModel.find({"token":token},(err,model)=>{
            if(err) throw err;

            if(model.length == 0){
                res.send(404,"user not found");
            }
            else{
                acceptRoomModel.find({"friendToken":token},(err,model)=>{
                    if(err) throw err;

                    if(model.length == 0){
                        res.send(200,"no accept list");
                    }
                    else{
                        res.send(200,model);
                    }
                });
            }
        });
    });

    app.get('/room/getRoom',(req,res)=>{
        "use strict";
        var token = req.session.token;

        roomModel.find({"user1Token":token},(err,model)=>{
            if(err) throw err;
            if(model.length == 0){
                roomModel.find({"user2Token":token},(err,model)=>{
                    if(err) throw err;
                    if(model.length == 0){
                        res.send(409,"room not found")
                    }
                    else{
                        res.send(200,model);
                    }
                });
            }
            else{
                res.send(200,model);
            }
        });
    });

    app.post('/room/add',(req,res)=>{
        "use strict";
        var data = req.body;
        data.token = req.session.token;

        var friendToken;

        console.log(data.friendCode);

        userModel.find({"userCode":data.friendCode},(err,model)=>{
            if(err) throw err;
            console.log(model.length);
            if(model.length == 0){
                res.send(404,"friend not found");
            }
            else if(model[0]["credit"] < data.awardCredit){
                res.send(400,"please charge your credit");
            }
            else{
                friendToken = model[0]["token"];
                userModel.find({"token":data.token},(err,model)=>{
                    if(err) throw err;
                    if(model.length == 0){
                        res.send(404,"user not found");
                    }
                    else{
                        var userName = model[0]["name"]
                        acceptRoomModel.find({"token":data.token},(err,model)=>{
                            if(err) throw err;
                            if(model.length == 0){
                                acceptRoomModel.find({"friendToken":data.token},(err,model)=>{
                                    if(err) throw err;
                                    if(model.length == 0){
                                        acceptRoomModel.find({"token":friendToken},(err,model)=>{
                                            if(err) throw err;
                                            if(model.length == 0){
                                                acceptRoomModel.find({"friendToken":friendToken},(err,model)=>{
                                                    if(err) throw err;
                                                    if(model.length == 0){
                                                        var acceptToken = randomString.generate();
                                                        var saveAcceptRoom = new acceptRoomModel({
                                                            "token":data.token,
                                                            "friendToken":friendToken,
                                                            "acceptToken":acceptToken,
                                                            "goalDistance":data.goalDistance,
                                                            "awardCredit":data.awardCredit,
                                                            "name":userName,
                                                            "friendName":data.friendName,
                                                        });

                                                        saveAcceptRoom.save((err,model)=>{
                                                            if(err) throw err;

                                                            res.send(200,"send success");
                                                        });
                                                    }
                                                    else{
                                                        res.send(400,"friend already have battle");
                                                    }
                                                });
                                            }
                                            else{
                                                res.send(400,"friend already have battle");
                                            }
                                        });
                                    }
                                    else{
                                        res.send(400,"you already have battle");
                                    }
                                });
                            }
                            else{
                                res.send(400,"you already have battle");
                            }
                        });
                    }
                });
            }
        });
    });

    app.post('/room/accept',(req,res)=>{
        "use strict";
        var data = req.body;
        data.token = req.session.token;

        acceptRoomModel.find({"acceptToken":data.acceptToken},(err,model)=>{
            if(err) throw err;

            if(model.length == 0){
                res.send(404,"acceptToken not found");
            }
            else{
                var userToken = model[0]["token"];
                var friendToken = model[0]["friendToken"];
                var user1Name = model[0]["name"];
                var user2Name = model[0]["friendName"];

                console.log(userToken + "         "+ friendToken);
                var dataModel = model;
                if(data.answer == "save"){
                    roomModel.find({"user1Token":userToken},(err,model)=>{
                        if(err) throw err;
                        if(model.length == 0){
                            roomModel.find({"user2Token":userToken},(err,model)=>{
                                if(err) throw err;
                                if(model.length == 0){
                                    roomModel.find({"user1Token":friendToken},(err,model)=>{
                                        if(err) throw err;
                                        if(model.length == 0){
                                            roomModel.find({"user2Token":friendToken},(err,model)=>{
                                                if(err) throw err;
                                                if(model.length == 0){
                                                    console.log(dataModel[0]);
                                                    var awardCredit = dataModel[0]["awardCredit"];
                                                    var goalDistance = dataModel[0]["goalDistance"];
                                                    userModel.find({"token":friendToken},(err,model)=>{
                                                        if(err) throw err;
                                                        if(model[0]["credit"] < awardCredit){
                                                            res.send(400,"please charge your credit");
                                                        }
                                                        else{
                                                            var saveRoom = new roomModel({
                                                                user1Token:userToken,
                                                                user2Token:friendToken,
                                                                awardCredit:awardCredit,
                                                                goalDistance:goalDistance,
                                                                user1Distance:0,
                                                                user2Distance:0,
                                                                user1Name:user1Name,
                                                                user2Name:user2Name,
                                                            });

                                                            saveRoom.save((err,model)=>{
                                                                if(err) throw err;
                                                                res.send(200,"save room success");
                                                            });
                                                        }
                                                    })
                                                }
                                                else{
                                                    res.send(400,"someone already have battle");
                                                }
                                            });

                                        }
                                        else{
                                            res.send(400,"someone already have battle");
                                        }
                                    });
                                }
                                else{
                                    res.send(400,"someone already have battle");
                                }
                            });

                        }
                        else{
                            res.send(400,"someone already have battle");
                        }
                    });

                }
                else{
                    acceptRoomModel.remove({"acceptToken":data.acceptToken},(err,model)=>{
                        if(err) throw err;

                        res.send(200,"remove success");
                    });
                }
            }
        });
    });

    app.post('/room/update/userDistance',(req,res)=>{
        "use strict";
        var data = req.body;
        data.token = req.session.token;
        console.log("/room/update/userDistance : " + data.token);
        roomModel.find({"user1Token":data.token},(err,model)=>{
            if(err) throw err;
            if(model.length == 0){
                console.log("first find Pass!")
                roomModel.find({"user2Token":data.token},(err,model)=>{
                    if(err) throw err;
                    if(model.length == 0){
                        res.send(409,"room not found")
                    }
                    else{
                        console.log("awardCredit : "+model[0]["awardCredit"]);
                        var userDistance = parseInt(model[0]["user2Distance"]) + parseInt(data.userDistance);
                        var goalCredit = parseInt(model[0]["awardCredit"]);
                        console.log(goalCredit + "  " + userDistance);
                        if(userDistance >= model[0]["goalDistance"]){
                            friendModel.find({"token":data.token},(err,model)=>{
                                if(err) throw err;

                                var win = model[0]["win"] + 1;

                                friendModel.update({"token":data.token},{$set:{"win":win}},(err,model)=>{
                                    if(err) throw err;
                                    friendModel.find({"friendToken":data.token},(err,model)=>{
                                        if(err) throw err;
                                        var lose = model[0]["lose"] + 1;
                                        var friendToken = model[0]["token"];
                                        friendModel.update({"friendToken":data.token},{$set:{"lose":lose}},(err,model)=>{
                                            if(err) throw err;

                                            userModel.find({"token":data.token},(err,model)=>{
                                                if(err) throw err;
                                                var credit = model[0]["credit"] + goalCredit;
                                                console.log("Credit" + credit)
                                                userModel.update({"token":data.token},{$set:{"credit":credit}},(err,model)=>{
                                                    if(err) throw err;

                                                    userModel.find({"token":friendToken},(err,model)=>{
                                                        if(err) throw err;
                                                        var credit = model[0]["credit"] - goalCredit;
                                                        userModel.update({"token":friendToken},{$set:{"credit":credit}},(err,model)=>{
                                                            if(err) throw err;

                                                            roomModel.remove({"user2Token":data.token},(err,model)=>{
                                                                if(err) throw err;

                                                                res.send(200,"you win")
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        }
                        else{
                            roomModel.update({"user2Token":data.token},{$set:{"user2Distance":userDistance}},(err,model)=>{
                                if(err) throw err;
                                console.log(userDistance);
                                res.send(200 , "userDistance update success");
                            });
                        }
                    }
                });
            }
            else{
                roomModel.find({"user1Token":data.token},(err,model)=>{
                    if(err) throw err;
                    if(model.length == 0){
                        res.send(409,"room not found")
                    }
                    else{
                        console.log("second find Pass!")
                        var userDistance = parseInt(model[0]["user1Distance"]) + parseInt(data.userDistance);
                        var goalCredit = parseInt(model[0]["awardCredit"]);

                        if(userDistance >= model[0]["goalDistance"]){
                            friendModel.find({"token":data.token},(err,model)=>{
                                if(err) throw err;

                                var win = model[0]["win"] + 1;

                                friendModel.update({"token":data.token},{$set:{"win":win}},(err,model)=>{
                                    if(err) throw err;
                                    friendModel.find({"friendToken":data.token},(err,model)=>{
                                        if(err) throw err;
                                        var lose = model[0]["lose"] + 1;
                                        var friendToken = model[0]["token"];
                                        friendModel.update({"friendToken":data.token},{$set:{"lose":lose}},(err,model)=>{
                                            if(err) throw err;

                                            userModel.find({"token":data.token},(err,model)=>{
                                                if(err) throw err;
                                                var credit = model[0]["credit"] + goalCredit;
                                                userModel.update({"token":data.token},{$set:{"credit":credit}},(err,model)=>{
                                                    if(err) throw err;

                                                    userModel.find({"token":friendToken},(err,model)=>{
                                                        if(err) throw err;
                                                        var credit = model[0]["credit"] - goalCredit;
                                                        userModel.update({"token":friendToken},{$set:{"credit":credit}},(err,model)=>{
                                                            if(err) throw err;

                                                            roomModel.remove({"user1Token":data.token},(err,model)=>{
                                                                if(err) throw err;

                                                                res.send(200,"you win")
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        }
                        else{
                            roomModel.update({"user1Token":data.token},{$set:{"user1Distance":userDistance}},(err,model)=>{
                                if(err) throw err;
                                console.log(userDistance);
                                res.send(200 , "userDistance update success");
                            });
                        }
                    }
                });
            }
        });
    });

    app.get('/room/check',(req,res)=>{
        "use strict";
        var token = req.session.token;

        if(token == ""){
            res.send(400,"please login first");
        }
        else{
            roomModel.find({"user1Token":token},(err,model)=>{
                if(err) throw err;
                if(model.length == 0){
                    roomModel.find({"user1Token":token},(err,model)=>{
                        if(err) throw err;
                        if(model.length == 0){
                            res.send(200,"nobattle");
                        }
                        else{
                            res.send(200,"battle");
                        }
                    });
                }
                else{
                    res.send(200,"battle")
                }
            });
        }
    });

    app.get('/room/battleData',(req,res)=>{
        "use strict";
        var token = req.session.token;

        if(token == ""){
            res.send(400,"please login first");
        }
        else{
            roomModel.find({"user1Token":token},(err,model)=>{
                if(err) throw err;
                if(model.length == 0){
                    roomModel.find({"user1Token":token},(err,model)=>{
                        if(err) throw err;

                        if(model.length == 0){
                            res.send(404,"room data not found")
                        }
                        else{
                            res.send(200,model);
                        }
                    });
                }
                else{
                    res.send(200,model);
                }
            });
        }
    });
}