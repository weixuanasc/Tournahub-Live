import React, { useEffect, useState } from "react";
import "./DisplayAllNews.css";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import RecommendIcon from "@mui/icons-material/Recommend";
import NewspaperIcon from "@mui/icons-material/Newspaper";

const DisplayAllNews = () => {
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
  const shuffleNews = (array) => {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };
  const CustomPrevArrow = (props) => (
    <div
      className="custom-arrow custom-prev"
      onClick={props.onClick}
      style={{ zIndex: 1 }}
    >
      <ArrowCircleLeftIcon style={{ fontSize: 30 }} />
    </div>
  );

  const CustomNextArrow = (props) => (
    <div className="custom-arrow custom-next" onClick={props.onClick}>
      <ArrowCircleRightIcon style={{ fontSize: 30 }} />
    </div>
  );
  const slickSettings = {
    lazyLoad: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  return (
    <div className="sporty">
      <div>
        {/* <h2>All News</h2> */}
        <Slider {...slickSettings}>
          {newsData.map((news) => (
            <div key={news._id} className="slide-item">
              <a
                href={`/home/news/${news._id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleTitleClick(news._id);
                }}
              >
                <div className="titletext">
                  <img
                    width={"600px"}
                    height={"420px"}
                    src={`https://api.fyp23s424.com/images/${news.photo}`}
                    alt={news.title}
                    onClick={() => handleTitleClick(news._id)}
                  />
                  <div className="title-overlay">
                    <h3>{news.title}</h3>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </Slider>
      </div>
      <h2>
        <RecommendIcon style={{ marginRight: "10px", fontSize: 45 }} />
        Recommended
      </h2>
      <div>
        {loading || LoadingNews ? (
          <p>Loading...</p>
        ) : (
          <div className="skalent">
            {newsData.map(
              (news) =>
                news.category === user.interestedSport && (
                  <div className="newsBorder" key={news._id}>
                    <a
                      className="newstitle"
                      href={`/home/news/${news._id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleTitleClick(news._id);
                      }}
                    >
                      <div className="newsColumns">
                        <img
                          className="fixed-size-image"
                          src={`https://api.fyp23s424.com/images/${news.photo}`}
                          alt={news.title}
                          onClick={() => handleTitleClick(news._id)}
                        />
                        {/* 
                      <h3 className="category-box">{news.category}</h3> */}
                        <div>
                          <h3>{news.title}</h3>
                          <p>Written by: {news.user?.name}</p>
                          <p>
                            {new Date(news.postDate).toLocaleDateString(
                              "en-GB",
                              { year: "numeric", month: "long", day: "numeric" }
                            )}
                          </p>
                        </div>
                        {/* <p>{news.content}</p> */}
                      </div>
                    </a>
                  </div>
                )
            )}
            <div className="sporty">
              <div className="newline">
                <h2>
                  <NewspaperIcon
                    style={{ marginRight: "10px", fontSize: 45 }}
                  />
                  Other News
                </h2>
                {newsData.map(
                  (news) =>
                    news.category !== user.interestedSport &&
                    news.category && (
                      <div className="newsBorder" key={news._id}>
                        <a
                          className="newstitle"
                          href={`/home/news/${news._id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleTitleClick(news._id);
                          }}
                        >
                          {/* <p>{news.user?.name}</p> */}
                          <div className="newsColumns">
                            <img
                              className="fixed-size-image"
                              src={`https://api.fyp23s424.com/images/${news.photo}`}
                              alt={news.title}
                              onClick={() => handleTitleClick(news._id)}
                            />
                            <div>
                              <h3>{news.title}</h3>
                              <p>Written by: {news.user?.name}</p>
                              <p>
                                {new Date(news.postDate).toLocaleDateString(
                                  "en-GB",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                          {/* <p>{news.content}</p> */}
                        </a>
                      </div>
                    )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayAllNews;
