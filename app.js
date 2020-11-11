var express=require("express");
var mongoose=require("mongoose");
var bodyparser=require("body-parser");
var app=express();
var passport=require("passport");
var localstrategy=require("passport-local");
var user=require("./models/user");

mongoose.connect("mongodb://localhost:27017/dbmsapp",{useNewUrlParser: true,useUnifiedTopology: true});
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
var train =require("./models/train");
var station=require("./models/station");
var avail=require("./models/availability");
var passenger=require("./models/passenger");
var ticket=require("./models/ticket");
app.use(require("express-session")({
    secret:"Isha is the best",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

//Admin routes
//------------------------------------------------------------------------------
app.get("/",function(req,res){
    res.render("landing");
})

app.get("/admin",function(req,res){
    res.render("admin");
})
app.get("/station",function(req,res){
    station.find({},function(err,stations){
        if(err){
            console.log(err);
        }else{
            res.render("station/index",{stations:stations});
        }
    })
})
app.get("/station/new",function(req,res){
    res.render("station/new");
})
app.post("/station",function(req,res){
    var newstation={name:req.body.station};
    station.create(newstation,function(err,newstation){
        if(err){
            console.log(err);
        }else{
            res.redirect("/station");
        }
    })
})
app.get("/train",function(req,res){
    train.find({}).populate('from').populate('to').exec(function(err,trains){
        if(err){
            console.log(err);
        }else{
            //console.log(JSON.stringify(trains, null, "\t"))
            res.render("train/index",{trains:trains});
        }
    })
})
app.get("/train/new",function(req,res){
    station.find({},function(err,stations){
        if(err){
            console.log(err);
        }else{
            res.render("train/new",{stations:stations});
        }
    })
    
})
app.post("/train",function(req,res){
    var name=req.body.name;
    var from=req.body.from;
    var to=req.body.to;
    var newtrain={name:name};
    
    station.findOne({name:from},function(err,foundstation){
        if(err){
            console.log(err);
        }else{
            newtrain.from=foundstation._id;
            station.findOne({name:to},function(err,station){
                if(err){
                    console.log(err);
                }else{
                    newtrain.to=station._id;
                    console.log(newtrain);
                    train.create(newtrain,function(err,newtrain){
                        if(err){
                            console.log(err);
                        }else{
                            /*if(newtrain.mon==true){
                                avail.create({train:newtrain,day:"mon"});
                            }
                            if(newtrain.tue==true){
                                avail.create({train:newtrain,day:"tue"});
                            }
                            if(newtrain.wed==true){
                                avail.create({train:newtrain,day:"wed"});
                            }
                            if(newtrain.thur==true){
                                avail.create({train:newtrain,day:"thur"});
                            }
                            if(newtrain.fri==true){
                                avail.create({train:newtrain,day:"fri"});
                            }
                            if(newtrain.sat==true){
                                avail.create({train:newtrain,day:"sat"});
                            }
                            if(newtrain.sun==true){
                                avail.create({train:newtrain,day:"sun"});
                            }*/
                            if(req.body.mon=="on"){
                                newtrain.week.push('mon');
                            }
                            if(req.body.tue=="on"){
                                newtrain.week.push('tue');
                            }
                            if(req.body.wed=="on"){
                                newtrain.week.push('wed');
                            }
                            if(req.body.thur=="on"){
                                newtrain.week.push('thu');
                            }
                            if(req.body.fri=="on"){
                                newtrain.week.push('fri');
                            }
                            if(req.body.sat=="on"){
                                newtrain.week.push('sat');
                            }
                            if(req.body.sun=="on"){
                                newtrain.week.push('sun');
                            }
                            newtrain.save();
                            res.redirect("/train");
                        }
                    })
                }
            });
        }
    });
})

//------------------------------------------------------------------------------------------------------------


//User Auth Routes
//-------------------------------------------------------------------------------------------------------------
app.get("/home",isloggedin,function(req,res){
    res.render("home");
})

app.get("/register",function(req,res){
    res.render("register");
});
app.post("/register",function(req,res){
    var newuser=new user({username:req.body.username});
    user.register(newuser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/home");
        })
    })
});
app.get("/login",function(req,res){
    res.render("login");
});
app.post("/login",passport.authenticate("local",{
    successRedirect:"/home",
    failureRedirect:"/login"
}));
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});
function isloggedin(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
//--------------------------------------------------------------------------------------------------------------------

//User module
//--------------------------------------------------------------------------------------------------------------------

app.get("/search",function(req,res){
    station.find({},function(err,stations){
        res.render("search",{stations:stations});
    })
    
})
app.post("/search",function(req,res){
    var fromstation=req.body.from;
    var tostation=req.body.to;
    var date=new Date(req.body.dat);
    var day=date.getDay();
    var week1=['sun','mon','tue','wed','thu','fri','sat'];
    var str=week1[day];
    station.find({name:fromstation},function(err,station1){
       station.find({name:tostation},function(err,station2){
           train.find({from:station1,to:station2,week:str}).populate('from').populate('to').exec(function(err,trains){
               res.render("result",{trains:trains,date:date});
           })
       }) 
    })
})
app.get("/search/:id/:date",function(req,res){
    train.findById(req.params.id,function(err,foundtrain){
        var newmodel={train:foundtrain,date:req.params.date};
        avail.findOneAndUpdate({train:foundtrain,date:req.params.date},newmodel,{upsert:true,new:true},function(err, available){
            res.render("show",{train:foundtrain,available:available,date:req.params.date});
        });
        
    })
})
app.post("/search/:id/:date/booking",function(req,res){
    avail.findOne({train:req.params.id,date:req.params.date},function(err,avail){
        res.render("booking",{avail:avail,num:req.body.num,id:req.params.id,date:req.params.date});
    })
})
app.get("/ticket",function(req,res){
    ticket.find({user:req.user}).populate({
        path:'train',populate:[
            {path:'from'},{path:'to'}
        ]
    }).populate('passenger').exec(function(err,tickets){
        if(err){
            console.log(err);
        }
        else{
            console.log(JSON.stringify(tickets, null, "\t"));
            res.render("ticket",{tickets:tickets});
        }
        
    })
})
app.post("/ticket/:id/:num/:date",function(req,res){
    var price={
        "a":100,
        "b":200,
        "c":300
    }
    var totprice=price[req.body.category]*(req.params.num);
    var category=req.body.category;
    var date=new Date(req.params.date);
    date=date.toISOString();
    avail.findOne({train:req.params.id,date:date},function(err,av){
        var num=req.params.num;
        var seat=100-av[category];
        if(seat==100){
            alert("No seats left in this category");
            res.redirect("/search/"+req.params.id+"/booking");
        }
        else{
            ticket.create({
                train:req.params.id,
                date:req.params.date,
                user:req.user,
                price:totprice
            },function(err,tick){
                for(var i=0;i<req.params.num;i++){
                    var j=i+1;
                    var str="p"+j;
                    passenger.create({name:req.body[str],user:req.user},function(err,pass){
                        pass.ticket.push(tick);
                        pass.save();
                        tick.passenger.push(pass);
                        tick.save();
                    });
                }
                
                    for(var i=0;i<num;i++){
                        var str=category+seat;
                        tick.seat.push(str);
                        seat++;
                    }
                    tick.save();
                    av[category]-=num;
                    av.save();
                    res.redirect("/ticket")
            })
        }
    })
})



app.listen(3000,process.env.IP,function(){
    console.log("server has started");
})