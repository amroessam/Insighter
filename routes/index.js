const express = require('express') 
const router = express.Router()
const uid = require('uniqid')
const sqlite3 = require('sqlite3') 
const path = require('path')
const db = new sqlite3.Database(__dirname+'/../INFACK.db')
const server = require('http').createServer(express())
const io = require('socket.io')(server)
const request = require('request');
const cheerio = require('cheerio');
server.listen(process.env.PORT || 8080)

router.get('/',(req,res)=>{
    res.sendFile(__dirname+'/test.html')//change to index for main app
})
router.get('/app',(req,res)=>{
    res.render('app',{get:true})
})

router.post('/app', (req,res) =>{
    console.log(req.body)
    req.checkBody('seed','Seed is required.').notEmpty()
    req.checkBody('age1','Age is required').notEmpty()
    req.checkBody('age2','Age is required').notEmpty()
    req.checkBody('age1','Age can not be less than 18 or greater than 64.').isInt({min:18,max:64})
    req.checkBody('age2','Age can not be less than 18 or greater than 64.').isInt({min:18,max:64})
    let errors = req.validationErrors()
    if (errors){
        res.render('app',{
            errors:errors,
            get:true
        })
    }else{
        // fackFB()
        let result = {}
        result.id = uid()
        result.searchType = req.body.searchType
        result.seed = req.body.seed
        result.iterations = req.body.iterations
        result.ip = req.connection.remoteAddress
        db.run(`INSERT INTO requests (id,req_param,ip) VALUES (?,?,?)`,[result.id,`{searchType:${result.searchType},seed:${result.seed},iterations:${result.iterations}}`,result.ip]
    ,err=>{
        if (err) throw err
        else{
            res.render('app',{success:true,id:result.id,get:false})
            // console.log(req.body)
        }
        
    })
        console.log(result)
    }
    
    let url = `https://www.facebook.com/ads/audience-insights/people?&age=${req.body.age1}-${req.body.age2}`

})

io.on('connection', (socket)=>{
    socket.on('pressed',d=>{
        console.log(d)
    })
    
})

let fackFB = (id,searchType,seed,age,gender) =>{

}

module.exports = router