import sanityClient from "./client.js";
import { createReadStream } from "fs";
import { basename } from "path";
import { nanoid } from "nanoid";
const functions= {}

functions.createUser=(firstName,lastName,username,password)=>{
    return sanityClient.create({
        _type:"user",
        first_name:firstName,
        last_name:lastName,
        username:username,
        password:password,
        created_at: new Date(),
    });
};
functions.getProfile = (user) => {
    return sanityClient.fetch(
      `*[_type == "user" && username == $username]{
        ...,
        "followingData":following[]->{
          ...,
            photo{
          asset->{
            _id,
            url
          }
         }
       },

        "followers": *[_type == "user" && references(^._id)],
        "followersphoto": *[_type == "user" && references(^._id)]{
          photo{
            asset->{_id,
            url}
          }
        },
        "liked_by": *[_type == "post" && references(^._id) && author->username != $username],
        photo{
          asset->{
            _id,
            url
          }
        }
      }`,
      { username: user }
    );
  };
  
functions.getUserId =(user)=>{
    return sanityClient.fetch(`*[_type=="user" && username== $username]{
        _id
    }`,{username:user})
}
functions.createPost =(user,caption,image)=>{
    return sanityClient.assets.upload("image",createReadStream(image.path),{
        filename: basename(image.path)
    }).then((data)=> functions.getUserId(user).then((ids)=>{
        const id=ids[0]._id;
        return sanityClient.create({
            _type:"post",
            author:{_ref:id},
            photo:{ asset:{_ref:data._id}},
            description: caption,
            created_at: new Date(),
            likes:[],
            comments:[],
        });
    }));
}
functions.getAllPosts=()=>{
    return sanityClient.fetch(`*[_type == "post"]{
        ...,
        "username":author->username,
        "likedby":likes[]->username,
        "profilepic":author->photo{
            asset->{
                _id,
                url
            }
        },
        photo{
            asset->{
                _id,
                url
            }
        }
    }`);
};
functions.getPostsOfFollowing = (username) => {
    return sanityClient.fetch(
      `*[_type == "user" && username == $username]{
      following[]->{
        "posts": *[_type == "post" && references(^._id) && author->_id == (^._id)]{
          ...,
          "username": author->username,
          "profilepic":author->photo{
              asset->{
                _id,
                url
              }
          },
          
          photo{
            asset->{
              _id,
              url
            }
          }
        }
      }
    }`,
      { username }
    );
  };

functions.searchForUsername=(text)=>{
    return sanityClient.fetch(`*[_type=="user" && username match " ${text}*"]{
        ...,
        "followers": count(*[_type=="user" && references(^._id)]),
         photo{
            asset->{
                _id,
                url
            }
         }

    }`)
}
functions.getPosts=(username)=>{
    return sanityClient.fetch(`*[_type == "post" && author->username == $username]{
        ...,
        "username":author->username,
        "profilepic":author->photo{
            asset->{
              _id,
              url
            }
        },
        photo{
            asset->{
                _id,
                url
            }
        }
        
    }`,{username})
}
functions.getPostWithId=(id)=>{
  return sanityClient.fetch(`*[_type == "post" && _id == $id ]{
    ...,
    "username":author->username,
    "likedby":likes[]->username,
    "profilepic":author->photo{
        asset->{
            _id,
            url
        }
    },
    photo{
        asset->{
            _id,
            url
        }
    }
}`,{id});
}
functions.updateProfile=(user,first_name,last_name,bio,image)=>{
    if(image){
         return sanityClient.assets.upload("image",createReadStream(image.path),{filename:basename(image.path)}).
         then((data)=>functions.getUserId(user).then((ids)=>
            sanityClient.patch(ids[0]._id).set({first_name,last_name,bio,photo:{asset:{_ref:data._id}},
            }).commit()
         ));
    }
    else
    {
       return functions.getUserId(user).then((ids)=>
            sanityClient.patch(ids[0]._id).set({first_name,last_name,bio,
            }).commit()
         )
    }
};

functions.addFollower=(user,followingId)=>{
    return functions.getUserId(user).then((ids)=>sanityClient.patch(ids[0]._id)
    .setIfMissing({following:[]})
    .insert("after","following[-1]",[{_ref:followingId,_key:nanoid(),_type:"reference"}])
    .commit());
}

functions.removeFollower=(user,followingId)=>{
    return functions.getUserId(user).then((ids)=>sanityClient.patch(ids[0]._id)
    .unset([`following[_ref=="${followingId}"]`])
    .commit());
}

functions.addLike=(postid,user)=>{
    return functions.getUserId(user).then( (ids)=>
    sanityClient.patch(postid)
    .setIfMissing({likes:[]})
    .insert("after","likes[-1]",[{_ref:ids[0]._id,_key:nanoid(),_type:"reference"}])
    .commit());

}

functions.removeLike=(postid,user)=>{
  return functions.getUserId(user).then((ids)=>sanityClient.patch(postid)
  .unset([`likes[_ref=="${ids[0]._id}"]`])
  .commit());
}

functions.addComment=(postid,user,description)=>{
  return sanityClient.patch(postid)
  .setIfMissing({comments:[]})
  .insert("after","comments[-1]",[{username:user,description:description,_key:nanoid()}])
  .commit();
}

functions.removeComment=(postid,key)=>{
  return  sanityClient.patch(postid)
  .unset([`comments[_key=="${key}"]`])
  .commit();
}

functions.deletePost=(postid)=>{
 return sanityClient.delete({query: '*[_type ==  "post" && _id == $postid ]', params: {postid}})
}
export default functions;