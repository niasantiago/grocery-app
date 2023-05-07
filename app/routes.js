module.exports = function (app, passport, db) {
  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get("/", function (req, res) {
    res.render("index.ejs");
  });

  // PROFILE SECTION =========================
  app.get("/profile", isLoggedIn, function (req, res) {
    const grocery = [
  {
    item: 'Apples',
    price:'$4.99',
    
  },
  {
    item: 'Milk',
    price:'$3.99',
  
  },
  {
    item: 'Bread',
    price:'$4.99',
    
  },
  {
    item: 'Eggs',
    price: '$5.99',
  },
  {
    item: 'Chicken',
    price:'$12.99',
    
  },
  {
    item: 'Bananas',
    price: '$4.99',
  },
  {
    item: 'Cheese',
    price: '$3.99',
  },
  {
    item: 'Potatoes',
    price: '$6.99',
  },
  {
    item: 'Spinach',
    price: '$4.99',
  },
  {
    item: 'Salmon',
    price: '$6.99',
  },
];
    

    db.collection("grocery")
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.render("profile.ejs", {
          user: req.user,
          saved: result,
          grocery,
        });
      });
  });

  // LOGOUT ==============================
  app.get("/logout", function (req, res) {
    req.logout(() => {
      console.log("User has logged out!");
    });
    res.redirect("/");
  });

  // message board routes ===============================================================

  app.post("/save", (req, res) => {
    console.log(req.body, "saving");
    db.collection("grocery").save(
      {
        item: req.body.item,
        price: req.body.price,
        user: req.user.local.email, 
      },
      (err, result) => {
        console.log("saved to database");
        res.redirect("/profile");
      }
    );
  });


  app.delete("/clearAll", (req, res) => {
    db.collection("grocery").deleteMany({}, (err, result) => {
      if (err) return res.send(500, err);
    });
  });

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get("/login", function (req, res) {
    res.render("login.ejs", { message: req.flash("loginMessage") });
  });

  // process the login form
  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // SIGNUP =================================
  // show the signup form
  app.get("/signup", function (req, res) {
    res.render("signup.ejs", { message: req.flash("signupMessage") });
  });

  // process the signup form
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/signup", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get("/unlink/local", isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect("/profile");
    });
  });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/");
}
