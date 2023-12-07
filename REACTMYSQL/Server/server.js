import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import jwt  from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';

const salt=10;

const app = express(); // create the express aplication
app.use(express.json()); // 


const corsOptions ={
    origin:'http://localhost:5173', // this is where the application is host
    credentials:true,            //access-control-allow-credentials:true
    methods:["POST","GET"],
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

   

app.use(cookieParser());

const db= mysql.createConnection({
    host:"localhost",
    port:3306, // este es el puerto donde se encuentra la base de datos.
    database:'signup',
    user:"root",
    password:"Mzsqlpassword.",
    
    
});

db.connect(function (err) {
    if(err){
        console.log("error occurred while connecting");
    }
    else{
        console.log("connection created with Mysql successfully");
    }
 });
 

//console.log(db)

app.get('/start', (req,res) => { 
       } )    


app.post('/register', (req,res) => { //here "app.post" is requesting the information to register url and sending the information to the datase.
    const sql = "INSERT INTO login (name,email,password) VALUES (?)";// aqui el nombre de las columnas en la base de datos va sin comillas. "values" son los valores que 
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => { // se envian desde el formulario del lado del cliente.
        if(err) return res.json({Error: "Error for hassing password"});
        const values = [
            req.body.name,// estos son las peticiones que le hace al servidor al cliente 
            req.body.email,
            hash
        ]
       db.query(sql,[values],(err, result) =>{
        if(err) return res.json({Error: "Inserting data Error in server"});
        return res.json({Status:"Success"});
       } )    
    })
              
})


app.post('/login', (req,res) => { // here "app.post" is requesting the information from login url, first the email if an email is returned, we compared the password with the information inthe database
    const sql = 'SELECT * from login WHERE email = ? '; //here we just select the email, not the password, because the password is hash or protected
    var email_value=req.body.email;
    db.query(sql,[req.body.email], (err,data) => { // here we asked the database if this email obtain from the clientside exist inthe database. "data" is the response from the database.
        if(err) return res.json({Error: "login error in server"});// if there is an error when we returned the email
        if(data.length > 0){ // if data received from the database is not empty or in other words if the email exists in the database, we compare then the password.
            bcrypt.compare(req.body.password.toString(), data[0].password, (err,response)=>{ // this is the password that we obtain from the frontend converted to string.
                if(err) return res.json({Error: "Password compare error"}); // compared with the information from the column password of the database.
                if(response){
                    const id = data[0].id; // this is tha name from the filtered row that we obtain from the "sql"
                    const token =jwt.sign({id}, "jwt-secret-key", {expiresIn:"1d"}); // this creates the information that will be stored in the token.
                    res.cookie("token",id) // esto envia el cookie a la pagina web, en este caso el nombre pero podriamos escribir token tambien.
                    return res.json({Status:"Success"});
                } else {
                    return res.json({Error:"Password not matched"});
                }
            })
        }else {
            return res.json ({Error:"No email existed"})
        }
    })
})

app.post('/posts', (req,res) => { // here the app can do request(req) or send reponses(res) to the "/posts" url in this case posts.
    const sql = "INSERT INTO posts (loginId,title, content) VALUES (?)";// aqui el nombre de las columnas en la base de datos va sin comillas. "values" son los valores que   
    const values = [ // son invocados en la query the sql, estos vienen de la peticion que hace a la url posts.
            req.cookies.token,
            req.body.post_title,
            req.body.content 
                       
        ];
       db.query(sql,[values],(err, result) =>{
        if(err) return res.json({Error: "Inserting data Error in server"});
        return res.json({Status:"Success"});
       } )    
    })


app.get('/posts', (req, res) => {
    const sql = 'SELECT * FROM posts ORDER BY creationDate';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
    });     

    // API endpoint to add a comment
app.post('/home', (req, res) => { // this is listening a post request from port 3000 and the url "/"
    const sql = 'INSERT INTO comments (loginId,postId,commentText) VALUES (?)';
    const values = [
        req.cookies.token,
        req.body.postId,
        req.body.commentContent
        

    ];
    
    db.query(sql, [values], (err, result) => {
      if (err) throw err;
      res.json({ message: 'Comment added successfully' });
    });
  });


app.listen(3000, () => {
    console.log("Running in port 3000. ..");
})