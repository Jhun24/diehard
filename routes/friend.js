/**
 * Created by janghunlee on 2017. 11. 10..
 */

module.exports = friend;

function friend(app , friendModel , userModel , acceptFriendModel , randomString) {
    app.get('/friend/list',(req,res)=>{
        "use strict";
        var token = req.query.token;

        friendModel.find({"token":token},(err,model)=>{
            if(err) throw err;

            if(model.length == 0){
                res.send(404,"user not found");
            }
            else{
                res.send(200,model);
            }
        });
    });

    app.get('/friend/acceptList',(req,res)=>{
        "use strict";
        var token = req.query.token;

        userModel.find({"token":token},(err,model)=>{
            if(err) throw err;

            if(model.length == 0){
                res.send(404,"user not found");
            }
            else{
                acceptFriendModel.find({"friendToken":token},(err,model)=>{
                    if(err) throw err;
                    if(model.length == 0){
                        res.send(200, "no accept friend")
                    }
                    else{
                        res.send(200,model);
                    }
                });
            }
        });
    });

    app.post('/friend/add',(req,res)=>{
        "use strict";
        var data = req.body;

        var friendName = data.name.split("#")[0];
        var friendCode = data.name.split("#")[1];

        console.log(friendName + "      "+friendCode);

        var friendToken;

        var acceptToken = randomString.generate();

        userModel.find({"name":friendName,"userCode":friendCode},(err,model)=>{
            if(err) throw err;

            if(model.length == 0){
                res.send(404,"friend not found");
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
                        var saveAcceptFriend = new acceptFriendModel({
                            "token":data.token,
                            "friendToken":friendToken,
                            "acceptToken":acceptToken,
                            "name":userName,
                        });

                        saveAcceptFriend.save((err,model)=>{
                            if(err) throw err;
                            res.send(200);
                        });
                    }
                });
            }
        });
    });

    app.post('/friend/accept',(req,res)=>{
        "use strict";
        var data = req.body;

        acceptFriendModel.find({"acceptToken":data.token},(err,model)=>{
            if(err) throw err;

            if(model.length == 0){
                res.send(400,"accept token not found");
            }
            else{
                if(data.answer == "save"){
                    var userToken = model[0]["token"];
                    var friendToken = model[0]["friendToken"];

                    userModel.find({"token":friendToken},(err,model)=>{
                        if(err) throw err;

                        var friendName = model[0]["name"];
                        var friendCode = model[0]["userCode"];

                        var saveMyFriend = new friendModel({
                            "friendName":friendName,
                            "friendCode":friendCode,
                            "friendToken":friendToken,
                            "token":userToken,
                            "win":0,
                            "lose":0
                        });

                        saveMyFriend.save((err,model)=>{
                            if(err) throw err;


                            userModel.find({"token":userToken},(err,model)=>{
                                if(err) throw err;

                                var userName = model[0]["name"];
                                var userCode = model[0]["userCode"];

                                var saveYouFriend = new friendModel({
                                    "friendName":userName,
                                    "friendToken":userToken,
                                    "friendCode":userCode,
                                    "token":friendToken,
                                    "win":0,
                                    "lose":0
                                });

                                saveYouFriend.save((err,model)=>{
                                    if(err) throw err;
                                    acceptFriendModel.findOneAndRemove({"acceptToken":data.acceptToken},(err,model)=>{
                                        if(err) throw err;

                                        res.send(200,"save success");
                                    });
                                });
                            });
                        });
                    });
                }
                else{
                    acceptFriendModel.findOneAndRemove({"acceptToken":data.token},(err,model)=>{
                        if(err) throw err;

                        res.send(200,"remove success");
                    });
                }
            }
        });
    });
}