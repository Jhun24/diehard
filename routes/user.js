/**
 * Created by janghunlee on 2017. 11. 10..
 */

module.exports = user;

function user(app , userModel , iamporter , IamporterError , randomString) {
    app.post('/user/update/name',(req,res)=>{
        "use strict";
        var data = req.body;

        userModel.find({"token":data.token},(err,model)=>{
            if(err) throw err;

            if(model.length == 0){
                res.send(404,"user not found");
            }
            else{
                userModel.update({"token":data.token},{$set:{"name":data.name}},(err,model)=>{
                    if(err) throw err;

                    res.send(200 , data.name);
                });
            }
        });
    });

    app.post('/user/update/card',(req,res)=>{
        "use strict";
        var data = req.body;

        userModel.find({"token":data.token},(err,model)=>{
            if(err) throw err;

            if(model.length == 0){
                res.send(404,"uesr not found");
            }
            else{
                userModel.update({"token":data.token},{$set:{"cardNumber":data.cardNumber,"cardPassword":data.cardPassword,"cardBirthday":data.cardBirthday,"cardExpiry":data.cardExpiry}},(err,model)=>{
                    if(err) throw err;

                    res.send(200 , data.cardNumber);
                });
            }
        });
    });

    app.post('/user/charge',(req,res)=>{
        "use strict";
        var data = req.body;

        userModel.find({"token":data.token},(err,model)=>{
            if(err) throw err;

            if(model.length == 0){
                res.send(404,"user not found");
            }
            else{
                iamporter.payOnetime({
                    'merchant_uid':randomString.generate(10),
                    'amount':data.amount,
                    'card_number': model[0]["cardNumber"],
                    'expiry': model[0]["cardExpiry"],
                    'birth': model[0]["cardBirthday"],
                    'pwd_2digit':model[0]["cardPassword"]
                }).then(result => {
                    console.log(result);
                }).catch(err => {
                    if (err instanceof IamporterError){
                        console.log(err);
                    }
                });

                userModel.update({"token":data.token},{$set:{"credit":data.amount}},(err,model)=>{
                    if(err) throw err;
                    res.send(200,data.amount);
                });
            }
        });
    });

}