import { useEffect,useState } from "react";
import { Link } from "react-router-dom";
import {Card,CardHeader,CardMedia,CardContent,Typography,Avatar} from '@mui/material';
import "../css/Post.css";
import ExpandPost from "./ExpandPost";


export default function AllPosts({user}){
    const [AllPostsData,setAllPosts]=useState(null);
    const [Open,setOpen]=useState(false);
    const [PostOpened,SetPostOpened]=useState(null);

    useEffect(()=>{
        if(!user){
            fetch("/getAllPosts").then((res)=>res.json())
            .then((data)=> setAllPosts(data)).catch((err)=> console.error(err));
        }
        else{
            fetch("/getPostsOfFollowing?user="+user).then((res)=>res.json())
            .then((data)=> {setAllPosts(data);console.log(AllPostsData)}).catch((err)=>console.error(err));
        }
    },[user]);
    console.log(AllPostsData);
   
    return <><div className="center mt-3">
        {AllPostsData? AllPostsData.map((post,index)=>(
               
               <div className="center m-2" style={{min_width:"30%" , maxWidth:"400px"}} key={index} onClick={()=>{setOpen(true);
               SetPostOpened(post)}}>
                
                <Card sx={{
                            backgroundColor: '#e5fcfb',
                            minWidth: 320,
                            position: 'relative',
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
                                    
                                       <Typography className="text-muted">{post.likes.length} Likes</Typography>

                                 </div>                       
                         </div>
                      
                        <Typography>{post.description}</Typography>
                        <Typography className="text-muted">{post.created_at}</Typography>
                    </CardContent>
                   
                </Card>
                
               </div>
      ))
      :<p>No posts to Display</p>}
      
    </div>;
     {(PostOpened)?
    <ExpandPost postid={PostOpened._id} Open={Open} setOpen={setOpen} user={user}/>:null}
    </>
}