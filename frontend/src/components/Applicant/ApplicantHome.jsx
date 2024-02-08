import React, { useEffect, useState } from "react";
import "./ApplicantHome.css";
import axios from "axios";

const ApplicantHome = () => {
  const [newsData, setNewsData] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // axios.defaults.withCredentials = true;

  useEffect(() => {
    fetchData();
    fetchAllNews();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/getCurrentUser", {
        withCredentials: true,
      });
      setUser(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllNews = async () => {
    try {
      const { status, data } = await axios.get(
        "http://localhost:3001/api/news/all"
      );
      setNewsData(data.message);
    } catch (error) {
      console.log(error);
    }
  };
  const handleTitleClick = (newsId) => {
    if (newsId) {
      window.location.href = `/home/news/${newsId}`;
    }
  };

  return (
    <div>
      <h2>Latest News</h2>
      <div>
        <>
          {newsData.map(
            (news) =>
              news.category === user.interestedSport && (
                <div key={news._id}>
                  <a
                    href={`/home/news/${news._id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleTitleClick(news._id);
                    }}
                  >
                    <h3>{news.title}</h3>
                    <p>{news.user?.name}</p>
                    <img
                      className="fixed-size-image"
                      src={`http://localhost:3001/images/${news.photo}`}
                      alt={news.title}
                      onClick={() => handleTitleClick(news._id)}
                    />
                    {/* <p>{news.content}</p> */}
                  </a>
                </div>
              )
          )}

          {newsData.map(
            (news) =>
              news.category !== user.interestedSport &&
              news.category && (
                <div key={news._id}>
                  <a
                    href={`/home/news/${news._id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleTitleClick(news._id);
                    }}
                  >
                    <h3>{news.title}</h3>
                    <p>{news.user?.name}</p>
                    <img
                      className="fixed-size-image"
                      src={`http://localhost:3001/images/${news.photo}`}
                      alt={news.title}
                      onClick={() => handleTitleClick(news._id)}
                    />
                    {/* <p>{news.content}</p> */}
                  </a>
                </div>
              )
          )}

          {/* {newsData.map((news) => (
        <div key={news._id}>
          <h3 onClick={() => handleTitleClick(news._id)}>
            <img
              className="fixed-size-image"
              src={`http://localhost:3001/images/${news.photo}`}
              alt={news.title}
            />
            {news.title}
          </h3>
          <p>{news.content}</p>
        </div>
      ))} */}
        </>
      </div>
    </div>
  );
};

export default ApplicantHome;
