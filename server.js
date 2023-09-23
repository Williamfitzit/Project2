// IMPORTS
var http = require('http');
var bodyParser = require('body-parser')
const express = require('express')
const app = express()
const server = http.createServer(app);
var methodOverride = require('method-override')
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');
require('dotenv').config()
var ObjectId = require('mongoose').Types.ObjectId; 

const PORT = process.env.PORT || 3000

// setup database 
const mongoose = require('mongoose')
const mongoURI = process.env.MONGO_URI


// connect to mongo 
//mongoose.connect("mongodb://localhost/goals")

const db = mongoose.connection
// optional create status messages to check mongo connection 
db.on('error', (err) => { console.log('ERROR: ' , err)})
db.on('connected', () => { console.log('mongo connected')})
db.on('disconnected', () => { console.log('mongo disconnected')})


// get mongoose objects

const Goal = require('./db/goals');
//const Objective = require('./db/objective');



server.get('/', (req, res) => {
    var result = Goal.find().then((goal) => {
        app.locals.goal = goal;
        console.log(goal);
       res.render("index")})
})

server.get('/goal/new', (req, res)=>{
    res.render("new")
    
})

server.post('/goal', (req, res)=>{
    try{
        console.log(`Request Body is: ${JSON.stringify(req.body)}`)
        let currentDate = new Date()
        var objectiveMatrix = []
        let currentDateForamatted = currentDate.toISOString().split('T')[0]     
        for (i in req.body){
            if (i.includes("Objective")){
                objectiveMatrix.push({"description":req.body[i], "completed": false})
            }
        } 
        var db_message = {"name":req.body.name, "description": req.body.description, "createdDate": currentDateForamatted, "targetDate": req.body.targetDate, "objectives" : objectiveMatrix}
        console.log(db_message)
        const newGoal = Goal.create(db_message)
        res.redirect("/")
    }
    catch(err){
        console.log(err)
    }
})

server.get("/goal/:id", (req, res) =>{
    res.locals.index = req.params.id
    var result = Goal.find({_id:req.params.id}).then((goal) => {
        app.locals.goal = goal;
       res.render("show")})

})

server.get("/goal/:id/delete", (req, res) =>{
    var localID = req.params.id
    var result = Goal.findByIdAndDelete({_id:req.params.id}).then((goal)=>{
        res.redirect("/")
    })
    
})

server.get("/goal/:id/update", (req, res) =>{
    res.locals.index = req.params.id
    var result = Goal.find({_id:req.params.id}).then((goal) => {
        app.locals.goal = goal;
        console.log(goal);
        res.render("update")
    })})

    server.post("/goal/:id/update", (req, res) =>{
        var objectiveMatrix = []
        let currentDate = new Date()
        let currentDateForamatted = currentDate.toISOString().split('T')[0]  
        completed_check_array = []   
        console.log(JSON.stringify(req.body))
        Array.isArray(req.body.completedcheck) ? completed_check_array = req.body.completedcheck : completed_check_array.push(req.body.completedcheck)
        console.log("Check array")
        console.log(completed_check_array)
        counter = -1
        for (i in req.body){
    
            console.log(`Check position at point aribitrary: ${counter}`)
            console.log(completed_check_array[counter])
            if (i.includes("Objective")){
                counter++
                objectiveMatrix.push({"description":req.body[i], "completed": completed_check_array[counter] == "on"? true:false})
                console.log(objectiveMatrix)
            }
        } 
        var db_message = {"name":req.body.name, "description": req.body.description, "createdDate": currentDateForamatted, "targetDate": req.body.targetDate, "objectives" : objectiveMatrix}
        console.log(req.params.id)
        console.log(db_message)
        try{
        Goal.findOneAndReplace({_id: new ObjectId(req.params.id)}, db_message).then((newgoal)=>{
            console.log(newgoal)
        })
        //Goal.find({_id: new ObjectId(req.params.id)}).then((goal) => {
        //    console.log(goal)
        //})
        }

        catch(err){
            console.log(err)
        }
        res.redirect("/goal/"+req.params.id)
        })

        server.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}`)
})