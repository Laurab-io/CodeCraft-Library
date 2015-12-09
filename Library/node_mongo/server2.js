(function(express, server, PORT, IP, 
           bodyParser, passport, passportLocal,
          cookieParser, expressSession, mongoConnector){
    
    //use body-parser
    server.use(bodyParser.urlencoded({ extended: true }));
    server.use(cookieParser());
    //set up express's session with a secret and options
    server.use(expressSession({ 
        secret: process.env.secretStuffMan || 'IAMBATMAN!!!!@!@!#@!#!',
        resave: false,
        saveUninitialized: false
    }));
    
    //the above must come before passport middleware is used!!!!
    
    //middleware to initialize passport's functionality
    server.use(passport.initialize());
    //allows us to put passport information into session
    server.use(passport.session());
    
    passport.use(new passportLocal.Strategy(function(username, password, done){
        //hit the database
        var somethingfromthedatabase = "batman";
        if(password == somethingfromthedatabase){
            done(null, { id: username, name: username });
        } else {
            done(null, null);
        }
    }));
    
    //allows us to serialize a user object
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done){
        //query DB and fill in the object below
        var model = { id: id, name: id, sponge: "bob" };
        done(null, model);
    });
    
    function CheckAuth(req, res, next){
        if(req.isAuthenticated()){
            next();
        } else {
            res.redirect("/login");
        }
    }
    
    server.get("/", function(req,res){
        var model = {
            isAuthenticated: req.isAuthenticated(),
            user: req.user
        };
        
        var contents = "<!DOCTYPE html><html><head><title>";
        contents += "Home Page</title></head><body>";
        
        
        if(model.isAuthenticated == true){
            contents += "<h1>" + model.user.name + "</h1>";
            contents += "<p>" + req.user.sponge + "</p>";
        }
        
        contents += "</body></html>";
        
        res.send(contents);
    });
    
    server.get("/login", function(req,res){
        var contents = "<!DOCTYPE html><html><head><title>";
        contents += "Login</title></head><body>";
        
        contents += '<form action="" method="POST">';
        contents += '<input type="text" name="username" />';
        contents += '<input type="password" name="password" />';
        contents += '<input type="submit" value="Login" />';
        contents += '</form>';
        
        contents += "</body></html>";
        res.send(contents);
    });
    
    //use the local strategy middleware 
    server.post("/login", passport.authenticate('local'), function(req,res){
        if(req.user){
            res.redirect("/profile");
        }
    });
    
    
    server.get("/register", function(req, res){
        var contents = "<!DOCTYPE html><html><head><title>Register</title></head><body>";
        
            contents += '<form method="POST" action="">';
                
                contents += '<input type="text" name="username" placeholder="UserName" />';
                contents += '<input type="password" name="password" placeholder="Password" />';
                contents += "<br/><br/>";
                contents += '<textarea name="bio" placeholder="Bio"></textarea>';
                contents += "<br/><br/>";
                contents += '<input type="submit" value="Register" />';
                
            contents += "</form>";
        
        contents += "</body></html>";
        res.send(contents);
    });
    
    server.post("/register", function(req,res){
        
        var model = {
            name: req.body.username,
            password: req.body.password,
            bio: req.body.bio
        };
        
        
        
        res.redirect("/login");
    });
    
    
    server.get("/logout", function(req,res){
        req.logout();
        res.redirect("/");
    });
    
    server.get("/profile", CheckAuth, function(req,res){
        res.send("yaaaaay " + req.user.name);
    });
    
    server.listen(PORT, IP, function(err){
        if(err){
            return console.log(err);
        }
        console.log(" server online ");
    });

})(
    require("express"),
    require("express")(),
    (process.env.PORT || 1337),
    (process.env.IP || 'localhost'),
    require('body-parser'),
    require('passport'),
    require('passport-local'),
    require('cookie-parser'),
    require('express-session'),
    require('./mongo_repo')
);