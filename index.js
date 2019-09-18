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
const Like = require('./models/Like'); 

//Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(sess({
    secret:'secret01',
    resave:false,
    saveUninitialized:true
}));
//NOTE :: tokens are better for more users

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
});

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
});

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
});

app.post('/newMessage',async(req,res)=>
{
    let {
        topicID,
        message,
        replyTo,
        author,
        timestamp,
        likes,
        dislikes,
        rank

    } = req.body;

    await Message.create({
        'topicID':topicID,
        'message':message,
        'replyTo':replyTo,
        'author':author,
        'timestamp':timestamp,
        'likes':likes,
        'dislikes':dislikes,
        'rank':rank
    });
    res.json({'pass':1,'mess':'message saved'})
});

app.get('/loadMessages/:topicID', async(req,res)=>
{
    let {//destructing
            topicID

        } = req.params;
    let x = await Message.find({"topicID":topicID,"replyTo":"0"});
    let rev=[]
    for(let i=x.length-1;i>-1;i--)
    {
        rev.push(x[i])
        //console.log(x[i]);
    }//most recent up top

    res.json({'messages':rev});
    //res.json({'Messages':x});
});
app.post('/message/like-dislike', async(req,res)=>
{
    let { code, messageID, userID } = req.body;
    //userID='5cf16101867082240dfafc50';
    //console.log(req.session.uID);
    if(!req.session.uID===undefined || req.session.uID!=userID)
    {
        console.log('dead');
        res.json({pass:0,'mess':'not logged in'});
    }
    else
    {
        let x = await Like.find({'userID':userID,'messageID':messageID});
        if(x.length===0)
        {
            Like.create({
                'userID':userID,
                'messageID':messageID,
                'liked':code
            });
            if(code)
            {
                Message.updateOne({'_id':messageID},{$inc:{'likes':1}})
                .then(d=>console.log('inc like'));
            }
            else //it's a disliked message
            {
                Message.updateOne({'_id':messageID},{$inc:{'dislikes':1}})
                .then(d=>console.log('dec like'));
            }
        }
        else
        {
            //console.log(code,messageID);
            //Like.find({'userID':userID,'messageID':messageID}).then(d=>console.log(d));
            Like.updateOne({'userID':userID,'messageID':messageID},{'liked':code})
            .then(d=>{if(d.nModified)console.log('like change')});

             //console.log(x);
            if(code && x[0]['liked']===0)
            {
                Message.updateOne({'_id':messageID},{$inc:{'likes':1,'dislikes':-1}})
                .then(d=>console.log('changed to like',d));
            }
            
            if(code===0 && x[0]['liked']===1)//it's a previously disliked message
            {
                Message.updateOne({'_id':messageID},{$inc:{'likes':-1,'dislikes':1}})
                .then(d=>console.log('changed to dislike',d));
            }
        }
        res.json({'mess':'like/dislike'});
    }
});
app.get('/loadMessages/replies/:messageID',async(req,res)=>
{
    let { messageID } = req.params;
    let x = await Message.find({"replyTo":messageID});
    if(x.length===0)
    {
        res.json({"pass":0,"mess":"no replies"});
    }
    else
    {
        //make obj first then use the messageID as its key
        //let temp={};
        //temp[messageID]=x;
        res.json({"pass":1,"mess":"replies found","replies":x});
    }
    //HERE>>>>>

    /* let replies =[];
    for(let i=x.length-1;i>-1;i--)
    {
        replies.push(x[i]);
        //console.log(x[i]);
    }//most recent up top
*/
    //res.json({messageID:x}); 
});

/////////////////////////////////////////////
app.listen(PORT,()=>
{
    console.log('Working on port',PORT);
});

