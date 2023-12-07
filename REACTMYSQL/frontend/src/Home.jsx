import React, { useEffect, useState } from 'react';
import { Link,useNavigate } from 'react-router-dom'
import axios from 'axios';


function Home() {
    const [posts, setPosts] = useState([]);// estos son los valores iniciales de los posts id.
    const [commentContent, setcommentContent] = useState(''); // estos son los valores iniciales del comentario  en este caso vacios "".
     
        
    
  useEffect(() => {
    // Fetch posts from the server
    axios.get('http://localhost:3000/posts')
      .then(res => setPosts(res.data))// estos son los valores iniciales del post  en este caso the response of "axios.get('http://localhost:3000/posts')"
      .catch(error => console.error('Error fetching posts:', error));
  }, []);

  const handleReply = (postId,loginId) => {
    // Add logic to send commentContent to the server and update the comments table
    const commentContentText=commentContent.commentContent; // para entender esto mira objects.js
    
    axios.post('http://localhost:3000/home',{postId:postId,commentContent:commentContentText})
          .then(res => {
        console.log(res.data.message);
        console.log(commentContentText);
        console.log(postId+"postID")
       
        // You may want to update the UI to reflect the comment addition
      })
      .catch(error => console.error('Error adding comment:', error));
  };

  

  return (
    <div>
      <Link to="/posts" className="btn btn-default border w-300 bg-light rounded-0 text-decoration-none">New Post</Link>

      {posts.map(post => (/*this post.id is the id from the posts table in my sql */
        <div key={post.id}> 
          <h3>{post.id}</h3>

          <h3>{post.title}</h3>
          <p>Login ID: {post.loginId}</p>
          <p>Content: {post.content}</p>
          <p>Creation Date: {post.creationDate}</p>
          <input type="text"  placeholder="Reply to this post..."  name = "commentContent" 
             onChange={e => setcommentContent({commentContent: e.target.value})} 
              />
          
          <button onClick={() => handleReply(post.id)}>Reply</button>
        </div>
      ))}
    </div>
  );
}
  
  export default Home;


