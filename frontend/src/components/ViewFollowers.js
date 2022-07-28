import { useState } from "react";
import { Modal, Card, ListGroup } from "react-bootstrap";
import ProfileItem from "./ProfileItem";

export default function ViewFollowers({
  FollowersOpen,
  setFollowersOpen,
  ProfileData,
}) {
  return (
    <Modal
      size="lg"
      show={FollowersOpen}
      onHide={() => setFollowersOpen(false)}
    >
      <Modal.Header closeButton>
        <h4>Followers</h4>
      </Modal.Header>
      <Modal.Body>
        {ProfileData.followers.length ? (
          <Card style={{ width: "100%" }}>
            <ListGroup varaint="flush">
              {ProfileData.followers.map((item, idx) => (
                <ProfileItem
                  username={item.username}
                  first_name={item.first_name}
                  last_name={item.last_name}
                  photo={ProfileData.followersphoto[idx].photo}
                  followers={item.following.length}
                  key={idx}
                  setFollowersOpen={setFollowersOpen}
                ></ProfileItem>
              ))}
            </ListGroup>
          </Card>
        ) : (
          <h6>User has no followers</h6>
        )}
      </Modal.Body>
    </Modal>
  );
}
