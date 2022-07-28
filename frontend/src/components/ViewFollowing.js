
import { Modal, Card, ListGroup } from "react-bootstrap";
import ProfileItem from "./ProfileItem";

export default function ViewFollowing({
  FollowingOpen,
  setFollowingOpen,
  ProfileData,
}) {
  return (
    <Modal
      size="lg"
      show={FollowingOpen}
      onHide={() => setFollowingOpen(false)}
    >
      <Modal.Header closeButton>
        <h4>Following</h4>
      </Modal.Header>
      <Modal.Body>
        {ProfileData.followers.length ? (
          <Card style={{ width: "100%" }}>
            <ListGroup varaint="flush">
              {ProfileData.followingData.map((item, idx) => (
                <ProfileItem
                  {...item}
                  key={idx}
                  setFollowersOpen={setFollowingOpen}
                ></ProfileItem>
              ))}
            </ListGroup>
          </Card>
        ) : (
          <h6>User follows no one</h6>
        )}
      </Modal.Body>
    </Modal>
  );
}
