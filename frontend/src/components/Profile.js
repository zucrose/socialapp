import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import EditProfile from "./EditProfile";
import "../css/Profile.css";
import ExpandPost from "./ExpandPost";
import ViewFollowers from "./ViewFollowers";
import ViewFollowing from "./ViewFollowing";

export default function Profile({ user, setAlert }) {
  const [profileData, setProfileData] = useState({});
  const [posts, setPosts] = useState({});
  const [following, setFollowing] = useState(false);
  const [owner, setOwner] = useState(false);
  const [editing, setEditing] = useState(false);
  const [Open, SetOpen] = useState(false);
  const [PostOpened, SetPostOpened] = useState(null);
  const [FollowersOpen, setFollowersOpen] = useState(false);
  const [FollowingOpen, setFollowingOpen] = useState(false);
  const params = useParams();
  useEffect(() => {
    updateProfile(params.username);
  }, [params.username, user, Open]);

  function updateFollowing(profile) {
    for (let follower of profile.followers) {
      if (follower.username === user) {
        setFollowing(true);
        return;
      }
    }
    setFollowing(false);
  }
  function updateProfile(username) {
    fetch("https://uzstragram.onrender.com/getProfile?user=" + username)
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 0) {
          setAlert({ varaint: "danger", message: "Profile does not exist." });
          return;
        }
        console.log(data[0]);
        fetch("https://uzstragram.onrender.com/getPosts?user=" + username)
          .then((res) => res.json())
          .then((posts) => {
            setProfileData(data[0]);
            setPosts(posts);
            updateFollowing(data[0]);
            setOwner(user === data[0].username);
          });
      })
      .catch((err) => console.error(err));
  }
  function followClick() {
    if (owner) return;
    if (!following) {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: user, id: profileData._id }),
      };
      fetch("https://uzstragram.onrender.com/addFollower", requestOptions)
        .then((res) => res.json())
        .then((data) => updateProfile(params.username));
    } else {
      const requestOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: user, id: profileData._id }),
      };
      fetch("https://uzstragram.onrender.com/removeFollower", requestOptions)
        .then((res) => res.json())
        .then((data) => updateProfile(params.username));
    }
  }

  function hideEditCallback(data) {
    updateProfile(params.username);
    setEditing(false);
  }

  if (profileData === {}) return null;
  return (
    <div className="profile">
      <EditProfile
        user={user}
        show={editing}
        hideCallBack={hideEditCallback}
        profileData={profileData}
        setAlert={setAlert}
      />
      <div className="profile-banner">
        <h4>@{profileData.username}</h4>
        <div className="profile-data">
          <img
            src={
              profileData.photo
                ? profileData.photo.asset.url
                : "https://via.placeholder.com/80"
            }
            id="profile-img"
            alt=""
          />
          <div className="vertical-data">
            <p>
              <strong>Posts</strong>
            </p>
            <h4>{posts ? posts.length : 0}</h4>
          </div>
          <div
            className="vertical-data followers"
            onClick={() => {
              setFollowersOpen(true);
            }}
          >
            <p>
              <strong>Followers</strong>
            </p>
            <h4>{profileData.followers ? profileData.followers.length : 0}</h4>
          </div>
          <div
            className="vertical-data followers"
            onClick={() => {
              setFollowingOpen(true);
            }}
          >
            <p>
              <strong>Following</strong>
            </p>
            <h4>{profileData.following ? profileData.following.length : 0}</h4>
          </div>
          <div className="follow-button">
            {user && !owner ? (
              <Button
                variant={following ? "danger" : "success"}
                onClick={followClick}
              >
                {following ? "Unfollow" : "Follow"}
              </Button>
            ) : null}
            {user && owner ? (
              <Button varaint="primary" onClick={() => setEditing(true)}>
                Edit
              </Button>
            ) : null}
          </div>
        </div>
        <div className="profile-bio">
          <div className="profile-name">
            <strong>
              {(profileData.first_name ? profileData.first_name : "") +
                " " +
                (profileData.last_name ? profileData.last_name : "")}
            </strong>
          </div>
          <div className="profile-text">{profileData.bio}</div>
        </div>
      </div>
      <div className="break"></div>
      <div className="profile-posts-wrapper">
        <div className="profile-posts">
          {posts && posts.length > 0
            ? posts.map((post, idx) => {
                return (
                  <div
                    onClick={() => {
                      SetOpen(true);
                      SetPostOpened(post);
                    }}
                  >
                    <img src={post.photo.asset.url} key={idx} alt="" />
                  </div>
                );
              })
            : null}
        </div>
      </div>
      {console.log(FollowersOpen)}
      {FollowingOpen ? (
        <ViewFollowing
          FollowingOpen={FollowingOpen}
          setFollowingOpen={setFollowingOpen}
          ProfileData={profileData}
        ></ViewFollowing>
      ) : null}
      {FollowersOpen ? (
        <ViewFollowers
          FollowersOpen={FollowersOpen}
          setFollowersOpen={setFollowersOpen}
          ProfileData={profileData}
        ></ViewFollowers>
      ) : null}
      {PostOpened ? (
        <ExpandPost
          postprop={PostOpened}
          Open={Open}
          setOpen={SetOpen}
          user={user}
        />
      ) : null}
    </div>
  );
}
