/**
 * Created by janghunlee on 2017. 11. 16..
 */

module.exports = route;

function route(app) {
    app.get('/battle',(req,res)=>{
        "use strict";
        res.render("battle.html");
    });

    app.get('/friend',(req,res)=>{
        "use strict";
        res.render("friend.html");
    });

    app.get('/',(req,res)=>{
        "use strict";
        res.render("index.html");
    });

    app.get('/matchStart',(req,res)=>{
        "use strict";
        res.render("matching.html");
    });

    app.get('/battleNone',(req,res)=>{
        "use strict";
        res.render("main.html");
    });

    app.get('/setting',(req,res)=>{
        "use strict";
        res.render("setting.html");
    });

    app.get('/camera',(req,res)=>{
        "use strict";
        res.render('camera.html');
    });
}