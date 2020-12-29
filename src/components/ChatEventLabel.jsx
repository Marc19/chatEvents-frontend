import React from "react";
import PropTypes from "prop-types";

/**
 * @param {time: string, events: Array<string>} props
 */
const ChatEventLabel = (props) => {
  const { time, events } = props;

  return (
    <div className="d-flex" style={{ marginBottom: "20px", padding: "5px" }}>
      <span style={{ marginRight: "8px", width: "170px" }}>{time}:</span>

      <div className="d-flex flex-column">
        {events?.map((e, i) => (
          <div key={i} className="event-label">
            {e}
          </div>
        ))}
      </div>
    </div>
  );
};

ChatEventLabel.propTypes = {
  time: PropTypes.string,
  events: PropTypes.arrayOf(PropTypes.string),
};

export default ChatEventLabel;
