const express = require('express')
const exphbs = require('express-handlebars')
const expressValidator = require('express-validator')
const bodyParser = require('body-parser');
const xray = require('x-ray')
const routes = require('./routes/index')
const app = express()
const path = require('path')

// Views Engine

app.set('views', path.join(__dirname, 'views'))
app.engine('handlebars', exphbs({defaultLayout:'layout'}))
app.set('view engine', 'handlebars')

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Static Folder
app.use(express.static(path.join(__dirname,'public')))

// Express Validator
app.use(expressValidator({
    errorFormatter:(param,msg,value)=>{
        let namespace = param.split('.'),
            root = namespace.shift(),
            formParm = root

        while(namespace.length){
            formParm += '[' + namespace.shift + ']'
        }
    return {
        param: formParm,
        msg: msg,
        value:value
    }
    }
}))

// More setup
app.use('/', routes)

// Start server
app.set('port', (process.env.PORT || 80))
app.listen(app.get('port'), ()=>{
    console.log(`Insighter is running...`)
})
