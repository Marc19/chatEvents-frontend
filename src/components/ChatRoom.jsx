import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import ChatRoomFilterPanel from "./ChatRoomFilterPanel";
import ChatEventLabel from "./ChatEventLabel";

/**
 * @param {{queryParams: {granularity: string|number, from: Date, to: Date}, queryEvents: Function, events: Array}} props
 */
const ChatRoom = (props) => {
  const { queryParams, setQueryParams, events } = props;

  const eventsEndRef = useRef(null);

  const scrollToBottom = () => {
    eventsEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [events]);

  /**
   * @param {string} dateString
   * @returns {string}
   */
  const formatDate = (dateString) => {
    let formattedDate = dateString
      .replace("T", " ")
      .replace("-", "/")
      .replace("-", "/");

    if (queryParams.granularity === 24) {
      formattedDate = formattedDate.split(" ")[0];
    }

    return formattedDate;
  };

  const singularizeOrPluralizePeople = (count) => {
    if (count === 1) return "person";
    else return "people";
  };

  const singularizeOrPluralizeComments = (count) => {
    if (count === 1) return "comment";
    else return "comments";
  };

  const extractEvents = (event) => {
    // Event Stats
    if (event.hour) {
      return [
        `${event.peopleEnteredCount} ${singularizeOrPluralizePeople(
          event.peopleEnteredCount
        )} entered`,
        `${event.peopleLeftCount} left`,
        `${event.peopleHighFivingCount} ${singularizeOrPluralizePeople(
          event.peopleHighFivingCount
        )} high-fived ${
          event.peopleHighFivedCount
        } other ${singularizeOrPluralizePeople(event.peopleHighFivedCount)}`,
        `${event.commentCount} ${singularizeOrPluralizeComments(
          event.commentCount
        )}`,
      ];
    }

    // Events
    else {
      switch (event.EventName) {
        case "EnterTheRoom":
          return [`${event.User.userName} enters the Room`];
        case "LeaveTheRoom":
          return [`${event.User.userName} leaves`];
        case "Comment":
          return [`${event.User.userName} comments: "${event.Text}"`];
        case "HighFive":
          return [
            `${event.User.userName} high-fives ${event.OtherUser.userName}`,
          ];
        default:
      }
    }
    return ["Unknown Event"];
  };

  return (
    <>
      <ChatRoomFilterPanel setQueryParams={setQueryParams} />

      <div className="chat-events-list">
        {events?.map((e) => (
          <ChatEventLabel
            key={e.EventId ? e.EventId : e.hour}
            time={formatDate(e.TimeStamp ? e.TimeStamp : e.hour)}
            events={extractEvents(e)}
          />
        ))}
        <div ref={eventsEndRef} />
      </div>
    </>
  );
};

ChatRoom.propTypes = {
  queryParams: PropTypes.shape({
    granularity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    from: PropTypes.object,
    to: PropTypes.object,
  }),
  setQueryParams: PropTypes.func,
  events: PropTypes.array,
};

export default ChatRoom;
