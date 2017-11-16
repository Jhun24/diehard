module.exports = auth;

function auth(app , userModel , randomString , session) {

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
                    data.credit = 0;
                    var saveUser = new userModel(data);
                    saveUser.save((err,model)=>{
                        if(err) throw err;
                        req.session.token = data.token;
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
                req.session.token = model[0]["token"];
                console.log(req.session.token);
                res.send(200,model);
            }
        });
    });
}