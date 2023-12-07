import React, {useState} from "react";
import { Link,useNavigate } from 'react-router-dom'
import axios from "axios"


function Posts(){
    const [values,setValues] = useState({ // aqui creamos un array, enel que los valores "post_title" y "content" les asignamos un valor vacio ""  
        post_title:'' , // esto corresponde al "setValues" inicial usando la funcion "useState", luego cuando llenamos el formulario en el sitio web
        content:''// la funcion "onChange" cambia los valores iniciales ""...values" por los valores "e.target.value"  y estos ultimo son enviados(post) al puerto "3000". 
    })
    const navigate = useNavigate()
    const handleSubmit=(event) => { // esta function toma los valores que estan guardados en  "Values", los cuales fueron generados en el formulario con la funcion"onchange"
        event.preventDefault();// l
        axios.post('http://localhost:3000/posts', values)
        .then(res => {
            if(res.data.Status === "Success"){
                navigate('/home')
            } else {
                alert(res.data.Error);
            }
        })
        .then(err => console.log(err));
    }
    return(// Onsubmit  nos indica que cuando clickeamos en el boton "Submit Post" activa la funcion "handle submit".
        <div className='d-flex justify-content-center align-items-center bg-primary vh-100 vw-100'>
            <div className="bg-white p-3 rounded w-50 h-50"> 
                <h2>CREATE A NEW POST </h2>
                
                <form onSubmit={handleSubmit}> 
                    <label htmlFor="post_title">POST TITLE</label>
                    <br></br>
                    <input type="textarea" name="post_title" placeholder="write the title of your post" id="post_title"//aqui vemos que funciona con el "name" 
                    onChange={e => setValues({...values, post_title: e.target.value})} className="form-control rounded-0"  />
                    <br></br>  
                
                    <br></br>
                    <div className="mb-3">
                        <label htmlFor="content"><strong>POST CONTENT</strong></label>
                        <br></br>
                        <input type="textarea"  placeholder='content of the post' name='content'
                        onChange={e => setValues({...values, content: e.target.value})} className="form-control rounded-0" />
                        <br></br>
                        <br></br>
                        <button type='submit' className='btn btn-success w-100 rounded-0'>SUBMIT POST</button>
                        <Link to="/home" className="btn btn-default border w-300 bg-light rounded-0 text-decoration-none">Home</Link>


                        
                    </div>
                    
                </form>
            
            </div>
        </div>

        
        
                
            
            
    )
}

export default Posts