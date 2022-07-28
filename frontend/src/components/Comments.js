import React,{useState} from 'react';
import { Form,Button } from 'react-bootstrap';
import {Link} from "react-router-dom";
export default function Comments({post,user,setPost,reload,setreload})
{
    const [newComment,setNewComment]=useState(null);
    function addComment()
    {
        const requestOptions={
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({postid:post._id,username:user,description:newComment})
        }
        fetch("https://uzstragram.herokuapp.com/addComment",requestOptions).then((res)=>res.json()).then((data)=>{setreload(reload+1)
        });
    }

    function removeComment(key)
    {
        console.log("delete called");
        const requestOptions={
            method:"DELETE",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({postid:post._id,key:key})
        }
        fetch("https://uzstragram.herokuapp.com/removeComment",requestOptions).then((res)=>res.json()).then((data)=>{setreload(reload+1)
           });
    }
    console.log(post,user);
   
       return (
        
        <> {post.comments.map((x)=>
            <div key={x._key}>
            
              <div className='d-flex  justify-content-between'>
                    <p className="px-2 ">
                        <Link  className="lead" to={"/profile/"+x.username}>
                                <strong>{x.username}</strong>
                            </Link>
                    :{x.description}
                    </p>
                    {  (x.username===user)?
                    <span  className="fa fa-trash m-2 fa-2x fa-fade" aria-hidden="true"  onClick={()=>removeComment(x._key)}  > </span>
                    
                    :null}
              </div>
          
            </div>

       )

           }
           
       {  (post &&user )?
      
         <Form> 
           <Form.Group className='mb-3'>
              <Form.Control type="text" placeholder="Comment"  onInput={(e)=> setNewComment(e.target.value)}></Form.Control>
           </Form.Group>
           <div>
                    <Button variant="primary" onClick={addComment}>
                        Submit
                    </Button>
                </div>
         </Form>:null
         }
        </>
       )
      

    
}
