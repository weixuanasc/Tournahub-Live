import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import NavbarTO from "../../components/NavbarTO";
import "./NewsForm.css";
import FeedOutlinedIcon from "@mui/icons-material/FeedOutlined";
import bgmImage2 from "../images/details.jpg";

const NewsForm = () => {
  // const [image, setImage] = useState("");
  const [sports, setSports] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allNews, setAllNews] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const editFormRef = useRef(null);
  const title = useRef(null);
  const author = useRef(null);
  const content = useRef(null);
  const photo = useRef(null);
  const category = useRef("");
  const [scrollY, setScrollY] = useState(0);

  const [newsData, setnewsData] = useState({
    category: "",
    title: "",
    content: "",
    author: "",
    photo: "",
    // user: "null",
    // user: user ? user._id : "",
    user: user ? { _id: user._id, name: user.name } : null,
  });
  //scrolling animation
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleInputChange = (e) => {
    setnewsData({
      ...newsData,
      [e.target.name]: e.target.value,
    });
  };
  // useEffect(() => {
  //   // Set the initial value of organizerId when the component mounts
  //   setorganizerId(user ? user._id : "");
  // }, [user]);

  const handleImage = (e) => {
    setnewsData({
      ...newsData,
      photo: e.target.files[0],
    });
    console.log(newsData.photo);
  };

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
  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await axios.get("https://api.fyp23s424.com/ManageSports");
        setSports(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSports();
    fetchData();
    fetchAllNews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for missing fields
    if (
      !newsData.category ||
      !newsData.title ||
      !newsData.author ||
      !newsData.content ||
      !newsData.photo
    ) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", newsData.title);
      formData.append("author", newsData.author);
      formData.append("content", newsData.content);
      formData.append("category", newsData.category);
      formData.append("photo", newsData.photo);

      if (user) {
        formData.append("user", user._id);
        formData.append("name", user.name);
      }

      const response = await axios.post(
        "https://api.fyp23s424.com/api/news/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);

      setnewsData({
        category: "",
        title: "",
        content: "",
        author: "",
        photo: "",
        user: user ? { _id: user._id, name: user.name } : null,
      });

      title.current.value = "";
      content.current.value = "";
      author.current.value = "";
      photo.current.value = "";
      category.current.value = "";

      // Fetch all news after successful submission
      fetchAllNews();

      // Show success message
      alert("Article has been posted successfully!");
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  const fetchAllNews = async () => {
    try {
      const { data, status } = await axios.get(
        "https://api.fyp23s424.com/api/news/all"
      );
      setAllNews(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteNews = async (newsId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this article?"
      );

      if (confirmDelete) {
        console.log("Deleting news with ID:", newsId);

        const { status } = await axios.delete(
          `https://api.fyp23s424.com/api/news/${newsId}`
        );

        console.log("Delete status:", status);

        if (status === 200) {
          fetchAllNews();
        }
      }
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  // Add a new state for tracking the edited article data
  const [editArticleData, setEditArticleData] = useState({
    id: null,
    title: "",
    author: "",
    content: "",
    category: "",
    photo: null,
  });
  useEffect(() => {
    if (isEditing && editFormRef.current) {
      // Scroll into view of the Edit form
      editFormRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [isEditing]);
  // Function to handle the edit button click
  const handleEdit = (article) => {
    setEditArticleData({
      id: article._id.toString(),
      title: article.title,
      author: article.author,
      content: article.content,
      category: article.category,
      photo: article.photo,
    });
    setIsEditing(true);
  };

  // Function to handle the update button click
  const handleUpdate = async (newsId) => {
    try {
      const formData = new FormData();
      formData.append("title", editArticleData.title);
      formData.append("author", editArticleData.author);
      formData.append("content", editArticleData.content);
      formData.append("category", editArticleData.category);
      formData.append("photo", editArticleData.photo);

      const response = await axios.put(
        `https://api.fyp23s424.com/api/news/edit/${newsId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);

      // Fetch all news after successful update
      await fetchAllNews();

      // Clear the editArticleData after successful update
      setEditArticleData({
        id: null,
        title: "",
        author: "",
        content: "",
        category: "",
        photo: null,
      });
    } catch (error) {
      console.error("Error updating the article:", error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };
  //-------------------------------------------------------------

  return (
    <div>
      <img
        className="bg"
        src={bgmImage2}
        alt="Background"
        style={{ transform: `translateY(${scrollY * 0.001}px)` }}
      />
      <NavbarTO />
      <br />
      <h1>
        <FeedOutlinedIcon style={{ marginRight: "10px", fontSize: 45 }} />
        Write a New Article:
      </h1>
      <br />
      <form action="">
        <h5>Select sport category:</h5>
        <div className="mb-2">
          <select
            type="select"
            name="category"
            onChange={handleInputChange}
            ref={category}
          >
            {/* Placeholder or instruction option */}
            <option ref={category} value="" disabled selected>
              Select category
            </option>

            {/* Actual options from the sports array */}
            {sports.map((sport) => (
              <option key={sport.id} value={sport.name}>
                {sport.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <input
            ref={title}
            type="text"
            name="title"
            id=""
            placeholder="Enter a title"
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-2">
          <input
            ref={author}
            type="text"
            name="author"
            id=""
            placeholder="Enter Author name"
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-2">
          <textarea
            ref={content}
            type="textarea"
            rows="10"
            column="70"
            name="content"
            id=""
            placeholder="Enter the article content"
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-2">
          <input
            ref={photo}
            type="file"
            accept=".png, .jpg, .jpeg"
            src=""
            alt=""
            name="photo"
            placeholder="paste photo"
            onChange={handleImage}
            required
          />
        </div>
        <button className="btn btn-success btn-sm" onClick={handleSubmit}>
          Submit
        </button>
      </form>
      <div>
        <h1>
          ---------------------------------------------------------------------------
        </h1>
        <h1>Edit news:</h1>
        <br />
        <h6>
          Disclaimer: After clicking the "Edit" button, the field to edit the
          news is below. Only change the field with updates.
        </h6>
        <br />
        {allNews
          .filter((news) => user?._id === news.user?._id)
          .map((news) => (
            <div className="articleForm" key={news._id}>
              <h5>{news.title}</h5>
              <p>Written by: {news.user?.name}</p>
              <p>Category: {news.category}</p>
              <p>Posted on: {formatDate(news.postDate)}</p>
              <h6>{news.content}</h6>
              <img
                width={"250px"}
                src={`https://api.fyp23s424.com/images/${news.photo}`}
                alt={news.title}
                onError={(e) => {
                  // Handle image load error
                  console.error("Error loading image:", e);
                }}
              />
              {user?._id === news.user?._id && (
                <div>
                  <button
                    className="btn btn-sm btn-danger mr-2"
                    onClick={() => handleDeleteNews(news._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-sm btn-info mr-2"
                    onClick={() => handleEdit(news)}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
      {/* Add a form for editing articles */}
      {editArticleData.id && (
        <div ref={editFormRef}>
          <h2>Edit Article</h2>
          {/* <form onSubmit={handleUpdate}> */}
          <form onSubmit={() => handleUpdate(editArticleData.id)}>
            <div>
              <input
                type="text"
                name="title"
                value={editArticleData.title}
                onChange={(e) =>
                  setEditArticleData({
                    ...editArticleData,
                    title: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <input
                type="text"
                name="author"
                value={editArticleData.author}
                onChange={(e) =>
                  setEditArticleData({
                    ...editArticleData,
                    author: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <textarea
                name="content"
                value={editArticleData.content}
                rows="10"
                columns="70"
                onChange={(e) =>
                  setEditArticleData({
                    ...editArticleData,
                    content: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <select
                type="select"
                name="category"
                value={editArticleData.category}
                onChange={(e) =>
                  setEditArticleData({
                    ...editArticleData,
                    category: e.target.value,
                  })
                }
                ref={category}
              >
                <option ref={category} disabled selected>
                  Select new category
                </option>
                {sports.map((sport) => (
                  <option key={sport.id} value={sport.name}>
                    {sport.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <input
                type="file"
                accept=".png, .jpg, .jpeg"
                onChange={(e) =>
                  setEditArticleData({
                    ...editArticleData,
                    photo: e.target.files[0],
                  })
                }
              />
            </div>
            <button
              className="btn btn-success "
              type="submit"
              onClick={() => handleUpdate(editArticleData.id)}
            >
              Update
            </button>
            <button
              className="btn btn-warning"
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditArticleData({
                  id: null,
                  title: "",
                  author: "",
                  content: "",
                  category: "",
                  photo: null,
                });
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default NewsForm;
