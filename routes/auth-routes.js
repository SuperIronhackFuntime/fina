const express     = require("express");
const authRoutes  = express.Router();
const passport    = require("passport");
// User model
const User        = require("../models/user");
const Cart        = require("../models/cart");
const flash       = require("connect-flash");
const ensureLogin = require("connect-ensure-login");



// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// authRoutes.get("/signup", (req, res, next) => {
//   res.render("auth/signup");
// });

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const currentCart = req.body.cart;
  const email = req.body.email;

  if (username === "" || password === "" || email === "" ) {
    res.status(400).json({ message: 'Provide valid Username, Password, or Email' });
    return;
  }

  User.findOne({ username:username }, "username", (err, user) => {
    if (user !== null) {
      res.status(400).json({ message: 'The username already exists' });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username:username,
      password: hashPass,
      email:email
    });

    newUser.save((err) => {
      if (err) {
        res.status(400).json({ message: 'Could not save user' });
        return;
      }
      req.login(newUser, (err) => {
        if (err) {
          res.status(500).json({ message: 'Could not login new user' });
          return;
        } 
        res.status(200).json(req.user);
    });
  });
});
});


// authRoutes.get("/login", (req, res, next) => {
//   res.render("auth/login", { "message": req.flash("error") });
// });

authRoutes.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {
    if (err) {
      res.status(500).json({ message: 'Could not login' });
      return;
    }

    if (!theUser) {
      res.status(401).json(failureDetails);
      return;
    }

    req.login(theUser, (err) => {
      if (err) {
        res.status(500).json({ message: 'Could not authenticate the user' });
        return;
      }

      // We are now logged in (notice req.user)
      res.status(200).json(req.user);
    });
  })(req, res, next);
});



// authRoutes.get('/userdata', isLoggedIn, function(req, res) {
//   User.findById(req.user, function(err, fulluser){
//     if (err) throw err;
//     res.json(fulluser);
//   })
// })


authRoutes.delete("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.status(200).json({ message: 'Success' });
});



authRoutes.get('/loggedin', (req, res, next) => {
  console.log("logged in user in the backend route: ", req.user)
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({ message: 'Unauthorized' });
});


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {

    // res.redirect('/login')
    res.status(403).json({ message: 'Unauthorized' });
  }
}

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      // res.redirect('/')
      res.status(403).json({ message: 'Unauthorized' });
    }
  }
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  }else {
    res.json(false);
  }
}

// function addToCart(req, res, next) {
//   return function(req, res, next) {
//     if (req.isAuthenticated() && req.user.role === role) {
//       return next();
//     } else {
//       res.redirect('/')
//     }
//   }
//   }


authRoutes.get('/private', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.json({ message: 'This is a private message' });
    return;
  }
  res.status(403).json({ message: 'Unauthorized' });
});



authRoutes.get('/cart', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.json({
       cart: req.body.cart
       });
    return;
  }
  res.status(403).json({ message: 'Unauthorized' });
});

authRoutes.get('/cart/:id', (req, res, next) => {
  if (req.isAuthenticated()) {
    User.findById(req.user, function(err, fulluser){
    res.json(fulluser);
  })
  }
  if (err) throw err;
})

authRoutes.post('/cart/:id/create', (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("req dot user >>>>>>>>>>>>>>>>>>>>>>>>>>>>", req.user);
    User.findById(req.user._id)
    .then((userFromDB) => {
      console.log("user from DB =================================", userFromDB);
      const userCart = {
        name: req.body.name,
        // content: req.body.content,
        // price: req.body.price
      }
    userFromDB.cart.push(userCart);
      console.log("user info after the push +++++++++++++++++++++++++++++++", userFromDB)
      userFromDB.save()
      console.log("user info after the save %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", userFromDB)
      res.json(userFromDB);
    })
    // .then((userFromDb) => {
    //   console.log("2nd user from DB ??????????????????????????????", userFromDB);
    // })   
    .catch((err) => {
      res.status(403).json({ message: 'Unauthorized' });
    return;
  })
  }
});

 

authRoutes.get("/auth/google", passport.authenticate("google", {
  scope: ["https://www.googleapis.com/auth/plus.login",
          "https://www.googleapis.com/auth/plus.profile.emails.read"]
}));

authRoutes.get("/auth/google/callback", passport.authenticate("google", {
  // failureRedirect: "/",
  // successRedirect: "/private-page"
}));  



module.exports = authRoutes;
