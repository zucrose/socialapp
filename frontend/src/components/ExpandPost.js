import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import {Card,CardHeader,CardMedia,CardContent,Typography,Avatar} from '@mui/material';
import "../css/Post.css"


export default function ExpandPost({postid,Open,setOpen,user})
{
    
    const [liked,setLiked]=useState(false);
    const [post,setPost]=useState(null);
    useEffect(()=>{updateLiked(user,postid)},[user,postid]);


    function closePost(){
        setOpen(false);
    }
    function updateLiked(user,postid){

        if(user==null)
        return ;
        fetch("/getProfile?user="+user).then((res)=>res.json()).then((data)=>{
              fetch("/getPostWithId?id="+postid).then((res)=>res.json()).then((d)=>{setPost(d[0]);
              for(let likedpost of data[0].liked_by)
              {
                   if(likedpost._id === postid)
                   {
                    setLiked(true);
                    return;
                   }
              }
              setLiked(false);
              return;})
        })
    }
    function addLike(){
           
        const requestOptions={
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({postid:postid,user:user})
        }
        fetch("/addLike",requestOptions).then((res)=>res.json()).then((data)=>{updateLiked(user,postid);
        });
    }

    function removeLike(){
        const requestOptions={
            method:"DELETE",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({postid:postid,user:user})
        }
        fetch("/removeLike",requestOptions).then((res)=>res.json()).then((data)=>{updateLiked(user,postid)
           });


    }
    
 
    if(Open === true && post )
    {  
    return <Modal show={Open} onHide={closePost}>
     <Modal.Header closeButton></Modal.Header>
     <Modal.Body>
          <Card sx={{
                            backgroundColor: '#e5fcfb',                          
                            boxShadow: '0 8px 24px 0 rgba(0,0,0,0.12)',
                            overflow: 'visible',
                            borderRadius: '1.5rem',
                            
                        }} className="cardstyling">
                  <CardHeader title={ 
                    <Link  className="lead" to={"/profile/"+post.username}>
                          {post.username}
                         </Link>
                    }
                    
                    avatar={
                            <Avatar  src={post.profilepic.asset.url}/>
                                
                            }
                    />
                    
                    <div className="d-flex align-items-center flex-column">
                        <CardMedia component="img" variant="top" src={post.photo.asset.url} style={{width:"100%"}} ></CardMedia>
                    </div>
                    <CardContent>
                       
                         <div className="d-flex justify-content-between">
                                 <div className="">
                                     { (post.username!==user&&user&&liked)?
                                    <Typography className="text-muted">Liked by You  {(post.likes.length>1)? <>and {post.likes.length-1} others</>:null} </Typography>:
                                    <Typography className="text-muted">{post.likes.length} Likes</Typography>
                                      }
                                 </div>
                                 <div className="">
                                   {     
                                    post.username!==user&&user&&liked?
                                    <span  className="fa fa-heart fa-2x" aria-hidden="true" style={{color:'red'}}   onClick={removeLike}></span>:null
                                   }
                                   {
                                    (post.username!==user&&user&&!liked)?
                                    <span  className="fa fa-heart-o fa-2x"  aria-hidden="true"  onClick={addLike} ></span>
                                    :null
                                    
                                    }
                                 </div>
                                
                               
                         </div>
                      
                       
                        <Typography>{post.description}</Typography>
                       
                        <Typography className="text-muted">{post.created_at}</Typography>
                        
                    </CardContent>
                   
                </Card>
                
     </Modal.Body>
      
    </Modal>
    }
    else 
   return  <div></div>;
}