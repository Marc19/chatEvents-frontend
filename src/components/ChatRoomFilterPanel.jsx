import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { Dropdown } from "react-bootstrap";
import PropTypes from "prop-types";
import "react-datepicker/dist/react-datepicker.css";

/**
 * @param {{setQueryParams: Function}} props
 */
const ChatRoomFilterPanel = (props) => {
  const { setQueryParams } = props;

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [granularity, setGranularity] = useState("");

  useEffect(() => {
    setQueryParams({
      from: fromDate,
      to: toDate,
      granularity: granularity,
    });
  }, [fromDate, toDate, granularity, setQueryParams]);

  return (
    <>
      <div className="d-flex justify-content-around">
        <DatePicker
          selected={fromDate}
          onChange={(date) => setFromDate(date)}
        />

        <span>to</span>

        <DatePicker selected={toDate} onChange={(date) => setToDate(date)} />

        <span>Granularity</span>
        <Dropdown size="sm">
          <Dropdown.Toggle
            size="sm"
            variant="outline-secondary"
            id="dropdown-basic"
          >
            {granularity}
          </Dropdown.Toggle>

          <Dropdown.Menu size="sm">
            <Dropdown.Item onSelect={(e) => setGranularity("")}>
              <i>minute by minute</i>
            </Dropdown.Item>
            <Dropdown.Item onSelect={(e) => setGranularity(1)}>1</Dropdown.Item>
            <Dropdown.Item onSelect={(e) => setGranularity(2)}>2</Dropdown.Item>
            <Dropdown.Item onSelect={(e) => setGranularity(3)}>3</Dropdown.Item>
            <Dropdown.Item onSelect={(e) => setGranularity(4)}>4</Dropdown.Item>
            <Dropdown.Item onSelect={(e) => setGranularity(6)}>6</Dropdown.Item>
            <Dropdown.Item onSelect={(e) => setGranularity(8)}>8</Dropdown.Item>
            <Dropdown.Item onSelect={(e) => setGranularity(12)}>
              12
            </Dropdown.Item>
            <Dropdown.Item onSelect={(e) => setGranularity(24)}>
              24
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <span>{granularity === 1 ? "hour" : "hours"}</span>
      </div>

      <hr />
    </>
  );
};

ChatRoomFilterPanel.propTypes = {
  setQueryParams: PropTypes.func,
};

export default ChatRoomFilterPanel;
