const LocalStrategy = require ('passport-local').Strategy

const bcrypt = require ('bcryptjs')
const User = require ('../models/User')
const passport = require('passport');


module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField:'email'},(email,password,done) =>{

        User.findOne({email:email}).then((user)=>{

            // match user
            if(!user){
                return done (null, false , {message: 'email is not registered'})
            }

            //match password

            bcrypt.compare(password , user.password , (err,isMatch)=>{

                if(err) throw err;

                if(isMatch){
                    return done( null , user)
                }else{
                    return done( null , false , {message:'password is incorrect'})
                }
            })
        })
    }))

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
    
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
    });
}