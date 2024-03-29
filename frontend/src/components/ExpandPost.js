import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  Avatar,
} from "@mui/material";
import Comments from "./Comments";
import "../css/Post.css";

export default function ExpandPost({ postprop, Open, setOpen, user }) {
  const [liked, setLiked] = useState(false);
  const [post, setPost] = useState(postprop);
  const [reload, setreload] = useState(0);

  useEffect(() => {
    console.log("use Effect triggered", user, postprop);
    fetch("https://uzstragram.onrender.com/getPostWithId?id=" + postprop._id)
      .then((res) => res.json())
      .then((data) => {
        setPost(data[0]);
        for (let liker of data[0].likedby) {
          if (liker === user) {
            setLiked(true);
            return;
          }
        }
        setLiked(false);
        return;
      });
  }, [reload, postprop]);

  function closePost() {
    setOpen(false);
  }

  function addLike() {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postid: post._id, user: user }),
    };
    fetch("https://uzstragram.onrender.com/addLike", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setreload(reload + 1);
      });
  }

  function removeLike() {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postid: post._id, user: user }),
    };
    fetch("https://uzstragram.onrender.com/removeLike", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setreload(reload + 1);
      });
  }
  function deletePost() {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: post._id }),
    };
    console.log("delete called");
    fetch("https://uzstragram.onrender.com/deletePostWithId", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setOpen(false);
      });
  }

  if (Open === true && post) {
    const postdate = new Date(post.created_at).toString();

    return (
      <Modal size="lg" show={Open} onHide={closePost}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <Card
            sx={{
              backgroundColor: "#e5fcfb",
              boxShadow: "0 8px 24px 0 rgba(0,0,0,0.12)",
              overflow: "visible",
              borderRadius: "1.5rem",
              minWidth: "75 rem",
              minHeight: "60 rem",
            }}
            className="cardstyling"
          >
            <CardHeader
              title={
                <Link className="lead" to={"/profile/" + post.username}>
                  {post.username}
                </Link>
              }
              avatar={
                <Avatar
                  src={
                    post.profilepic
                      ? post.profilepic.asset.url
                      : "https://via.placeholder.com/80"
                  }
                />
              }
            />
            <div className="d-flex justify-content-between">
              <div className="d-flex flex-column w-100">
                <div>
                  <CardMedia
                    component="img"
                    variant="top"
                    src={post.photo.asset.url}
                    style={{ width: "30 rem", height: "50 rem" }}
                  ></CardMedia>
                </div>

                <CardContent>
                  <div className="d-flex justify-content-between">
                    <div className="">
                      {post.username !== user && user && liked ? (
                        <Typography gutterBottom className="text-muted">
                          Liked by You{" "}
                          {post.likes.length > 1 ? (
                            <>and {post.likes.length - 1} others</>
                          ) : null}{" "}
                        </Typography>
                      ) : (
                        <Typography gutterBottom className="text-muted">
                          {post.likes.length} Likes
                        </Typography>
                      )}
                    </div>
                    <div className="">
                      {post.username !== user && user && liked ? (
                        <span
                          className="fa fa-heart fa-2x "
                          aria-hidden="true"
                          onClick={removeLike}
                        ></span>
                      ) : null}
                      {post.username !== user && user && !liked ? (
                        <span
                          className="fa fa-heart-o fa-2x "
                          aria-hidden="true"
                          onClick={addLike}
                        ></span>
                      ) : null}
                    </div>
                  </div>

                  <Typography gutterBottom variant="h6">
                    {post.description}
                  </Typography>

                  <h4>Comments</h4>

                  {post.comments.length === 0 ? (
                    <Typography className="text-muted">
                      This post has no comments{" "}
                    </Typography>
                  ) : null}
                  <Comments
                    post={post}
                    user={user}
                    setPost={setPost}
                    reload={reload}
                    setreload={setreload}
                  ></Comments>
                  <br></br>
                  <div className="d-flex  justify-content-between">
                    <Typography className="text-muted" variant="overline">
                      {postdate}
                    </Typography>
                    {post.username === user ? (
                      <span
                        className="fa fa-trash m-2 fa-2x"
                        onClick={() => deletePost()}
                      >
                        {" "}
                      </span>
                    ) : (
                      console.log("author", post.username, "user", user)
                    )}
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        </Modal.Body>
      </Modal>
    );
  } else return <div></div>;
}
