import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import moment from "moment";
import UserCard from "./components/UserCard";
import ChatRoom from "./components/ChatRoom";
import AppSpinner from "./components/AppSpinner";
import { BASE_URL } from "./configuration";
import "./App.css";

const App = () => {
  const [initialFetchFailed, setInitialFetchFailed] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [chatRoom, setChatRoom] = useState(null);

  const [queryParams, setQueryParams] = useState({
    from: null,
    to: null,
    granularity: null,
  });

  const [resultEvents, setResultEvents] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const chatRoomsResult = await axios(
          `${BASE_URL}/api/chatevent/getchatrooms`
        );
        const chatRoom =
          chatRoomsResult.data.length >= 1 ? chatRoomsResult.data[0] : null;
        setChatRoom(chatRoom);

        const usersResult = await axios(`${BASE_URL}/api/chatevent/getusers`);
        setUsers(
          (usersResult.data?.length === 4
            ? usersResult.data.map((u) => {
                const isInRoomValue = chatRoom?.users
                  ?.map((cru) => cru.userId)
                  .includes(u.userId);

                return { ...u, isInRoom: isInRoomValue };
              })
            : []) ?? []
        );
        setInitialFetchFailed(false);
        setLoading(false);
      } catch (error) {
        setInitialFetchFailed(true);
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const queryEvents = useCallback(async () => {
    const getChatEvents = async () => {
      const result = await axios.get(
        `${BASE_URL}/api/chatevent/getchatevents`,
        {
          params: {
            chatroomid: chatRoom.chatRoomId,
            from: formatDateToMatchQueryString(queryParams.from),
            to: formatDateToMatchQueryString(queryParams.to),
          },
        }
      );

      setResultEvents(result.data);
    };

    const getChatEventStats = async () => {
      const result = await axios.get(
        `${BASE_URL}/api/chatevent/getchateventstats`,
        {
          params: {
            chatroomid: chatRoom.chatRoomId,
            from: formatDateToMatchQueryString(queryParams.from),
            to: formatDateToMatchQueryString(queryParams.to),
            granularity: queryParams.granularity,
          },
        }
      );

      setResultEvents(result.data);
    };

    if (!queryParams.granularity) {
      getChatEvents();
    } else {
      getChatEventStats();
    }
  }, [chatRoom?.chatRoomId, queryParams]);

  useEffect(() => {
    if (!chatRoom?.chatRoomId || !queryParams) return;
    queryEvents();
  }, [chatRoom?.chatRoomId, queryEvents, queryParams]);

  /**
   * @param {Date} date
   */
  const formatDateToMatchQueryString = (date) => {
    if (date === null) return null;

    const format = "DD-MM-YYYYTHH:mm:ss";

    return moment(date).format(format);
  };

  /**
   * @param {{userId: number, userName: string, isInRoom: boolean}} user
   * @param {boolean} value
   */
  const updateUserIsInRoom = (user, value) => {
    if (value === true) {
      setChatRoom({ ...chatRoom, users: [...chatRoom?.users, user] });
    } else {
      setChatRoom({
        ...chatRoom,
        users: chatRoom?.users?.filter((cru) => cru.userId !== user.userId),
      });
    }

    const newUsers = users.map((u) =>
      u.userId === user.userId ? { ...u, isInRoom: value } : { ...u }
    );

    setUsers(newUsers);
  };

  if (initialFetchFailed)
    return (
      <div className="d-flex mt-2 justify-content-center">
        Please make sure Backend App is running
      </div>
    );

  if (isLoading) return <AppSpinner />;

  return (
    <div className="App row">
      <div className="two-users-col col-xs-12 col-lg-3">
        <UserCard
          user={users[0]}
          chatRoomId={chatRoom?.chatRoomId}
          queryEvents={queryEvents}
          updateUserIsInRoom={updateUserIsInRoom}
          usersInRoom={chatRoom?.users}
        />
        <UserCard
          user={users[1]}
          chatRoomId={chatRoom?.chatRoomId}
          queryEvents={queryEvents}
          updateUserIsInRoom={updateUserIsInRoom}
          usersInRoom={chatRoom?.users}
        />
      </div>

      <div className="chatroom-col col-xs-12 col-lg-6">
        <ChatRoom
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          events={resultEvents}
        />
      </div>

      <div className="two-users-col col-xs-12 col-lg-3 mb-xs-4">
        <UserCard
          user={users[2]}
          chatRoomId={chatRoom?.chatRoomId}
          queryEvents={queryEvents}
          updateUserIsInRoom={updateUserIsInRoom}
          usersInRoom={chatRoom?.users}
        />
        <UserCard
          user={users[3]}
          chatRoomId={chatRoom?.chatRoomId}
          queryEvents={queryEvents}
          updateUserIsInRoom={updateUserIsInRoom}
          usersInRoom={chatRoom?.users}
        />
      </div>
    </div>
  );
};

export default App;
