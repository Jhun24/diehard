module.exports = auth;

function auth(app , userModel , randomString) {

    app.post('/auth/register',(req,res)=>{
        "use strict";
        var data = req.body;

        userModel.find({"id":data.id},(err,model)=>{
            if(err) throw err;

            if(model.length == 0){
                userModel.find({},(err,model)=>{
                    if(err) throw err;
                    data.token = randomString.generate();
                    data.userCode = model.length + 1;
                    var saveUser = new userModel(data);
                    saveUser.save((err,model)=>{
                        if(err) throw err;

                        res.send(200,model);
                    });
                });
            }
            else{
                res.send(400,"user already exist");
            }
        });
    });

    app.post('/auth/login',(req,res)=>{
        "use strict";
        var data = req.body;

        userModel.find({"id":data.id,"password":data.password},(err,model)=>{
            if(err) throw err;

            if(model.length == 0){
                res.send(404,"user not found");
            }
            else{
                res.send(200,model);
            }
        });
    });
}