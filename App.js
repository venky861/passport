
const express = require ('express')
const app = express()
const router = require ('./routes/index')
const users = require ('./routes/users')
const expressLayouts = require ('express-ejs-layouts')
const mongoose= require ('mongoose')
const mon = require ('./config/key')
const flash = require ('connect-flash')
const session = require ('express-session')
const passport = require('passport');
const db = mon.MongoURI

const mango=mongoose.connect(db , {useNewUrlParser:true , useUnifiedTopology:true}).then(console.log("Mongo db connected")).catch(err => console.log(err))
// passport config

require('./config/passport')(passport)
//express session
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}))

//passport middleware

app.use(passport.initialize());
app.use(passport.session());



//connect flash
app.use(flash())

//middleware for global vars
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg')
    res.locals.error_msg=req.flash('error_msg')
    res.locals.error=req.flash('error')
    next()
})
//inite middleware expresslayout EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

//middleware body parser

app.use(express.urlencoded({extended:false}))


//Routes
app.use('/', router)
app.use('/users', users)

//Port
const PORT = process.env.PORT || 5000
app.listen(PORT , console.log(`Server is running on port ${PORT}`))

