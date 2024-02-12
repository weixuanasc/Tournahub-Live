import React, { useEffect, useState } from "react";
import "./ApplicantHome.css";
import axios from "axios";

const ApplicantHome = () => {
  const [newsData, setNewsData] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [LoadingNews, setLoadingNews] = useState(true);
  // axios.defaults.withCredentials = true;

  useEffect(() => {
    fetchData();
    fetchAllNews();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await axios.get("https://api.fyp23s424.com/getCurrentUser", {
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
        "https://api.fyp23s424.com/api/news/all"
      );
      setNewsData(data.message);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingNews(false);
    }
  };
  const handleTitleClick = (newsId) => {
    if (newsId) {
      window.location.href = `/home/news/${newsId}`;
    }
  };

  return <div></div>;
};

export default ApplicantHome;
