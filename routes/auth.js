module.exports = (app, passport) => {
  app.get('/signin', (req, res, next) => {
    res.render('signin');
  });

  app.post('/signin', passport.authenticate('local-signin', {
    successRedirect : '/questions', // redirect to the secure profile section
    failureRedirect : '/signin', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  app.get('/auth/facebook',
    passport.authenticate('facebook', { scope : 'email' })
  );

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect : '/signin',
      failureFlash : true // allow flash messages
    }), (req, res, next) => {
      req.flash('success', 'Welcome!');
      res.redirect('/questions');
    }
  );
  app.get('/auth/naver',
    passport.authenticate('naver', { scope : 'email' })
  );

  app.get('/auth/naver/callback',
    passport.authenticate('naver', {
      failureRedirect : '/signin',
      failureFlash : true // allow flash messages
    }), (req, res, next) => {
      req.flash('success', 'Welcome!');
      res.redirect('/questions');
    }
  )
  app.get('/signout', (req, res) => {
    req.logout();
    req.flash('success', 'Successfully signed out');
    res.redirect('/');
  });
};
//authentication
// var jwt = require('jsonwebtoken');
// var compose = require('composable-middleware');
// var SECRET = 'token secret';
// var expires = 60;

// fucnction signToken(id){
//   return jwt.sign({id:id}, SECRET, {expiresInMinutes:EXPIRES});
// }

// function isAuthenticated(){
//   return compose()
//     .use(function req,res,next){
//       var decoded = jwt.verify(req.headers.authorization, SECRET);
//       console.log(decoded)
//       req.user = decode;
//     })
// }

// getToken: function(){
//   var token = jwt.sign({
//     id: this.id
//   }, secret);
//   return token;
// }

// router.post('/signin',function(req,res){
//   db.users.findOne({
//     where: {email: req.body.email}
//   }).then(function(user){
//     if(user &&cipher(req.body.password)===user.password){
//       res.json({
//         token: user.getToken()
//       });
//     }else{
//       throw err
//     }
//   }).catch(function(err){

//   });
// });

'use strict';

var jwt = require('jsonwebtoken');
var compose = require('composable-middleware');
var SECRET = 'token_secret';
var EXPIRES = 60; // 1 hour

// JWT 토큰 생성 함수
function signToken(id) {
  return jwt.sign({id: id}, SECRET, { expiresInMinutes: EXPIRES });
}

// 토큰을 해석하여 유저 정보를 얻는 함수
function isAuthenticated() {
  return compose()
      // Validate jwt
      .use(function(req, res, next) {
        var decoded = jwt.verify(req.headers.authorization, SECRET);
        console.log(decoded) // '{id: 'user_id'}'
        req.user = decode;
      })
      // Attach user to request
      .use(function(req, res, next) {
        req.user = {
          id: req.user.id,
          name: 'name of ' + req.user.id
        };
        next();
      });
}


exports.signToken = signToken;
exports.isAuthenticated = isAuthenticated;