import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import userImg from "../assets/user.png";
import { BASE_URL } from "../configuration";

/**
 * @param {{user: {userId: number, userName: string, isInRoom: boolean},
 *  chatRoomId: number, queryEvents: Function, updateUserIsInRoom: Function,
 * usersInRoom: Array<{userId: number, userName: string, isInRoom: boolean}>}} props
 */
const UserCard = (props) => {
  const {
    user,
    chatRoomId,
    queryEvents,
    updateUserIsInRoom,
    usersInRoom,
  } = props;

  const [commenting, setCommenting] = useState(false);
  const [highFiving, setHighFiving] = useState(false);

  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (!usersInRoom.find((u) => u.userId === user.userId)) {
      setCommenting(false);
      setHighFiving(false);
    }
  }, [user.userId, usersInRoom]);

  const onEnterOrLeaveClicked = () => {
    if (!user.isInRoom) {
      enterAction();
    } else {
      leaveAction();
    }
  };

  const onCommentClicked = () => {
    setHighFiving(false);
    setCommenting(!commenting);
  };

  const onHighFiveClicked = () => {
    setCommenting(false);
    setHighFiving(!highFiving);
  };

  const enterAction = () => {
    const enterRoom = async () => {
      try {
        const payload = {
          UserId: user.userId,
          ChatRoomId: chatRoomId,
        };
        const result = await axios.post(
          `${BASE_URL}/api/chatevent/entertheroom`,
          payload
        );

        if (result.status === 200) {
          updateUserIsInRoom(user, true);
          await queryEvents();
        }
      } catch (error) {}
    };

    enterRoom();
  };

  const leaveAction = () => {
    const leaveRoom = async () => {
      try {
        const payload = {
          UserId: user.userId,
          ChatRoomId: chatRoomId,
        };
        const result = await axios.post(
          `${BASE_URL}/api/chatevent/leavetheroom`,
          payload
        );

        if (result.status === 200) {
          updateUserIsInRoom(user, false);
          await queryEvents();
        }
      } catch (error) {}
    };

    leaveRoom();
  };

  const commentAction = () => {
    const comment = async () => {
      try {
        const payload = {
          UserId: user.userId,
          ChatRoomId: chatRoomId,
          Text: commentText,
        };
        const result = await axios.post(
          `${BASE_URL}/api/chatevent/comment`,
          payload
        );

        if (result.status === 200) {
          setCommentText("");
          setCommenting(false);
          await queryEvents();
        }
      } catch (error) {}
    };

    comment();
  };

  /**
   * @param {number} otherUserId
   */
  const highFiveAction = (otherUserId) => {
    const highFive = async () => {
      try {
        const payload = {
          UserId: user.userId,
          ChatRoomId: chatRoomId,
          OtherUserId: otherUserId,
        };
        const result = await axios.post(
          `${BASE_URL}/api/chatevent/highfive`,
          payload
        );

        if (result.status === 200) {
          setHighFiving(false);
          await queryEvents();
        }
      } catch (error) {}
    };

    highFive();
  };

  return (
    <Card className="user-card" style={{ width: "18rem" }}>
      <Card.Img
        variant="top"
        src={userImg}
        style={{
          width: "50px",
          height: "60px",
          alignSelf: "center",
          paddingTop: "10px",
        }}
      />
      <Card.Body className="user-card-body">
        <Card.Title style={{ textAlign: "center" }}>
          {" "}
          {user.userName}{" "}
        </Card.Title>

        <div className="d-flex justify-content-between">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={onEnterOrLeaveClicked}
          >
            {user.isInRoom ? "Leave" : "Enter"}
          </Button>

          <Button
            disabled={!usersInRoom.find((u) => u.userId === user.userId)}
            variant="outline-secondary"
            size="sm"
            onClick={onCommentClicked}
          >
            Comment
          </Button>

          <Button
            disabled={!usersInRoom.find((u) => u.userId === user.userId)}
            variant="outline-secondary"
            size="sm"
            onClick={onHighFiveClicked}
          >
            High Five
          </Button>
        </div>

        <div className="d-flex justify-content-around mt-2">
          {commenting ? (
            <>
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={commentAction}
              >
                Add
              </Button>
            </>
          ) : highFiving ? (
            <>
              {usersInRoom
                ?.filter((u) => u.userId !== user.userId)
                .map((u) => (
                  <Button
                    key={u.userId}
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => highFiveAction(u.userId)}
                  >
                    {u.userName}
                  </Button>
                ))}
            </>
          ) : (
            ""
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

UserCard.propTypes = {
  user: PropTypes.shape({
    userId: PropTypes.number,
    userName: PropTypes.string,
    isInRoom: PropTypes.bool,
  }),
  chatRoomId: PropTypes.number,
  queryEvents: PropTypes.func,
  updateUserIsInRoom: PropTypes.func,
  usersInRoom: PropTypes.arrayOf(
    PropTypes.shape({
      userId: PropTypes.number,
      userName: PropTypes.string,
      isInRoom: PropTypes.bool,
    })
  ),
};

export default UserCard;
