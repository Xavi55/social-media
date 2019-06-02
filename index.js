//Kevin Gamez
//CONTROLLER

const morgan = require('morgan');
const express = require('express');
const sess = require('express-session');
const path = require('path');
const app = express();

//Settings
const PORT = process.env.PORT || 5000;

//DB
const db = require('./models/dbAccess');
const User = require('./models/User');
const Topic = require('./models/Topic'); 
const Message = require('./models/Message'); 

//Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(sess({
    secret:'secret01',
    resave:false,
    saveUninitialized:true
}))

//Serve these files for the view
app.use(express.static(path.join(__dirname,'view/build')));
/////////////   API ROUTES   //////////////////
app.post('/signup',async (req,res)=>
{
    //let username = req.body.username;
    //let password = req.body.password;

    let {
        username,
        password
    } = req.body;

    let x = await User.find({'username':username});
    if(x.length)
    {
        res.json({'pass':0,'mess':'User already exists'});
    }
    else
    {
        User.create({
            'username':username.substring(0,6),
            'password':password
        });
        res.json({'pass':1,'mess':'New user made'});
    }
})

app.post('/login',async (req,res) =>
{
    if(req.session.name)
    {
        res.json({'pass':1,'session':req.session})
    }
    else
    {
        let x = await User.find({'username':req.body.username,'password':req.body.password});
        if(Object.keys(x).length!=0)
        {
            req.session.username=x[0].username;//save new session
            req.session.uID=x[0].id;
            res.json({'pass':1,'session':req.session});
        }
        else
        {
            res.json({'pass':0,'mess':'login fail'});
        }
    }
});

app.get('/login',(req,res)=> //checks if logged in
{
    if(req.session.uID)
    {
        //console.log(req.session.name);
        res.json({'pass':1,'session':req.session});
    }
    else
    {
        res.json({'pass':0,'mess':'Not logged in!'});
    }
})

app.get('/logout',async (req,res)=>
{
    req.session.destroy();
    res.json({'pass':1,'mess':'Logout OKAY'});
});

app.post('/addTopic',async (req,res)=>
{
    //let topicName = req.body.topicName;
    //let subtext = req.body.subtext;
    //let author = req.body.author;
    let {
        topicName,
        subtext,
        author
    } = req.body;
    let timestamp = req.body.timestamp;
    let x = await Topic.find({'topicName':topicName});
    if(x.length)
    {
        res.json({'pass':0,'mess':'Topic already exists'});
    }
    else
    {
        Topic.create({
            'topicName':topicName,
            'subtext':subtext,
            'author':author,
            'timestamp':timestamp
        });
        res.json({'pass':1,'mess':'New topic made','topicName':topicName});
    }
})

app.get('/loadTopics',async (req,res)=>
{
    let x = await Topic.find();
    let rev=[]
    for(let i=x.length-1;i>-1;i--)
    {
        rev.push(x[i])
        //console.log(x[i]);
    }//most recent up top

    res.json({'topics':rev});
})

app.post('/newMessage',async(req,res)=>
{
    let {
        topicID,
        message,
        reply,
        author,
        timestamp,

    } = req.body;

    await Message.create({
        'topicID':topicID,
        'message':message,
        'reply':reply,
        'author':author,
        'timestamp':timestamp
    });
    res.json({'pass':1,'mess':'new message'})
})

app.get('/loadMessages/:topicID', async(req,res)=>
{
    let {//destructing
            topicID

        } = req.params;
    let x = await Message.find({"topicID":topicID});
    let rev=[]
    for(let i=x.length-1;i>-1;i--)
    {
        rev.push(x[i])
        //console.log(x[i]);
    }//most recent up top

    res.json({'messages':rev});
    //res.json({'Messages':x});
})
/////////////////////////////////////////////
app.listen(PORT,()=>
{
    console.log('Working on port',PORT);
});

