import React, { useEffect, useState } from "react";
import SelectNavbar from "../../components/SelectNavbar";
import { useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./NewsDetails.css";
import { ShareSocial } from "react-share-social";
import DeleteIcon from "@mui/icons-material/Delete";

const NewsDetails = ({ match }) => {
  const [news, setNews] = useState(null);
  const { newsId } = useParams();
  const [user, setUser] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allComments, setAllComments] = useState([]);
  //url for sharing
  const url = window.location.href;
  //in-line css for react social share component (can't seperate it out without having bugs, fix this if we have time)
  const style = {
    root: {
      maxWidth: "750px", // Adjust the max-width as needed
      margin: "0 auto",
      fontSize: "2rem",
      padding: "1rem",
      background: "#f8f8f8", // Adjust background color
      borderRadius: "8px",
      boxShadow: "0 3px 5px 2px rgba(0, 0, 0, 0.1)", // Adjust box shadow
      color: "#333", // Set text color to black
    },
    copyContainer: {
      fontSize: "1rem",
      color: "aliceblue",
      background: "rgb(77, 77, 182)",
      borderRadius: "12px",
      padding: "10px",
      border: "1px solid rgb(41, 41, 97)",
      transitionDuration: "0.4s",
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          "https://api.fyp23s424.com/getCurrentUser",
          {
            withCredentials: true,
          }
        );
        console.log("current user ", data);
        setUser(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const getNewsDetailsAndComments = async () => {
      try {
        const [newsResponse, commentsResponse] = await Promise.all([
          axios.get(`https://api.fyp23s424.com/api/news/byid/${newsId}`),
          axios.get(`https://api.fyp23s424.com/api/news/${newsId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

        setNews(newsResponse.data.message);
        setComments(commentsResponse.data.comments);
        setAllComments(commentsResponse.data.comments);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
    getNewsDetailsAndComments();
  }, [newsId]);

  const writtenComment = (event) => {
    setUserInput(event.target.value);
  };
  const getNewsDetailsById = async () => {
    try {
      const { status, data } = await axios.get(
        `https://api.fyp23s424.com/api/news/byid/${newsId}`
      );
      console.log(data);
      setNews(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const getComments = async () => {
    try {
      const { data } = await axios.get(
        `https://api.fyp23s424.com/api/news/${newsId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setComments(data.comments);
    } catch (error) {
      console.log(error);
    }
  };

  const addToComments = async () => {
    const body = {
      comments: userInput,
      user: {
        _id: user._id,
        name: user.name,
      },
    };

    try {
      const { status, data } = await axios.post(
        `https://api.fyp23s424.com/api/news/create/${newsId}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(data);
      if (status === 200) {
        fetchAllComments();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentSubmit = async (commentText) => {
    if (!commentText.trim()) {
      window.alert("Please write a comment before submitting.");
      return;
    }
    if (!user) {
      alert("user is null");
      return;
    }
    const payload = {
      text: commentText,
      user: {
        _id: user?._id,
        name: user.name,
      },
    };
    console.log("paload", payload);
    try {
      const { data } = await axios.post(
        `https://api.fyp23s424.com/api/news/create/${newsId}`,
        payload
      );
      // Update the comments state with the new comment
      setAllComments([...allComments, data.comment]);
      setUserInput("");
      fetchAllComments();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllComments = async () => {
    try {
      const { data, status } = await axios.get(
        `https://api.fyp23s424.com/api/news/${newsId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAllComments(data.comments);
    } catch (error) {
      console.log(error);
    }
  };

  console.log("all comments", allComments);

  const handleCommentDelete = async (commentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (confirmed) {
      try {
        await axios.delete(
          `https://api.fyp23s424.com/api/news/comment/${commentId}`
        );
        setAllComments(
          allComments.filter((comment) => comment._id !== commentId)
        );
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div>
      {SelectNavbar()}
      {news ? (
        <div>
          <h2>{news.title}</h2>
          <h6>{news.category}</h6>

          <img
            width={"200px"}
            src={`https://api.fyp23s424.com/images/${news.photo}`}
            alt={news.title}
            onError={(e) => {
              // Handle image load error
              console.error("Error loading image:", e);
            }}
          />
          <p>{news.author}</p>
          <p>{news.postDate}</p>
          <pre class="pre-container">{news.content}</pre>
          <div align="center">
            <ShareSocial
              url={url}
              socialTypes={["facebook", "twitter", "whatsapp", "telegram"]}
              style={style}
            />
          </div>
          <div className="middle">
            <h3>Comments:</h3>
            {allComments.map((comment) => {
              console.log(comment);

              return (
                <p className="usernameSize" key={comment._id}>
                  <h4>{comment.user?.name}</h4>

                  <p>{comment.comments}</p>

                  {comment.user?._id === user?._id && (
                    <button
                      className="btn btn-danger btn-sm p-1"
                      onClick={() => handleCommentDelete(comment._id)}
                    >
                      <DeleteIcon />
                      Delete
                    </button>
                  )}
                </p>
              );
            })}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const commentText = e.target.elements.commentText.value;
                handleCommentSubmit(commentText);
                e.target.elements.commentText.value = "";
              }}
            >
              <input
                type="text"
                name="commentText"
                className="commentTextBox"
                placeholder="Add a comment"
                value={userInput}
                onChange={writtenComment}
              />
              <button className="mainBtns" type="submit">
                Submit
              </button>
            </form>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default NewsDetails;
