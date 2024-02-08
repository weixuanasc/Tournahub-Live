import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import NavbarTO from "../../components/NavbarTO";
import "./NewsForm.css"

const NewsForm = () => {
  // const [image, setImage] = useState("");
  const [sports, setSports] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allNews, setAllNews] = useState([]);
  const title = useRef(null);
  const author = useRef(null);
  const content = useRef(null);
  const photo = useRef(null);
  const category = useRef("");
  // const [organizerId, setorganizerId] = useState("");

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
      const { data } = await axios.get("https://tournahub-hlr8.onrender.com/getCurrentUser", {
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
        const response = await axios.get("https://tournahub-hlr8.onrender.com/ManageSports");
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

    try {
      const formData = new FormData();
      formData.append("title", newsData.title);
      formData.append("author", newsData.author);
      formData.append("content", newsData.content);
      formData.append("category", newsData.category);
      formData.append("photo", newsData.photo);
      // formData.append("user", user._id);
      // formData.append("user", user ? user._id : "");
      // formData.append("user", user ? user._id : "");
      if (user) {
        formData.append("user", user._id);
        formData.append("name", user.name);
      }

      const response = await axios.post(
        "https://tournahub-hlr8.onrender.com/api/news/create",
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
        // user: "null",
        // user: user ? user._id : "",
        user: user ? { _id: user._id, name: user.name } : null,
      });
      title.current.value = "";
      content.current.value = "";
      author.current.value = "";
      photo.current.value = "";
      category.current.value = "";

      // Fetch all news after successful submission
      fetchAllNews();
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  const fetchAllNews = async () => {
    try {
      const { data, status } = await axios.get(
        "https://tournahub-hlr8.onrender.com/api/news/all"
      );
      setAllNews(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  // const handleDeleteNews = async (newsId) => {
  //   try {
  //     const { status } = await axios.delete(
  //       `http://localhost:3001/api/news/${newsId}`
  //     );
  //     if (status === 200) {
  //       fetchAllNews();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleDeleteNews = async (newsId) => {
    try {
      console.log("Deleting news with ID:", newsId);

      const { status } = await axios.delete(
        `https://tournahub-hlr8.onrender.com/api/news/${newsId}`
      );

      console.log("Delete status:", status);

      if (status === 200) {
        fetchAllNews();
      }
    } catch (error) {
      console.log("Delete error:", error);
    }
  };
  //Handles edit of article------------------------------------
  // const [editArticleData, setEditArticleData] = useState({
  //   id: null,
  //   title: "",
  //   author: "",
  //   content: "",
  //   category: "",
  //   photo: null,
  // });

  // const handleEdit = (article) => {
  //   setEditArticleData({
  //     id: article._id,
  //     title: article.title,
  //     author: article.author,
  //     content: article.content,
  //     category: article.category,
  //     photo: article.photo,
  //   });
  // };

  // const handleUpdate = async (newsId) => {
  //   try {
  //     const formData = new FormData();
  //     formData.append("title", editArticleData.title);
  //     formData.append("author", editArticleData.author);
  //     formData.append("content", editArticleData.content);
  //     formData.append("category", editArticleData.category);
  //     formData.append("photo", editArticleData.photo);

  //     const response = await axios.put(
  //       `http://localhost:3001/api/news/edit/${newsId}`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     console.log(response.data);

  //     // Fetch all news after successful update
  //     await fetchAllNews();

  //     // Clear the editArticleData after successful update
  //     setEditArticleData({
  //       id: null,
  //       title: "",
  //       author: "",
  //       content: "",
  //       category: "",
  //       photo: null,
  //     });
  //   } catch (error) {
  //     console.error("Error updating the article:", error);
  //   }
  // };

  // Add a new state for tracking the edited article data
  const [editArticleData, setEditArticleData] = useState({
    id: null,
    title: "",
    author: "",
    content: "",
    category: "",
    photo: null,
  });

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
        `https://tournahub-hlr8.onrender.com/api/news/edit/${newsId}`,
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
  //-------------------------------------------------------------

  return (
    <div>
      <NavbarTO />
      <h1>Write a new article:</h1>
      <form action="">
        <h6>Select sport category:</h6>
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
      <button onClick={handleSubmit}>Submit</button>
      </form>
      <div>
      <h1>---------------------------------------------------------------------------</h1>
      <h1>Edit news:</h1>
      <h6>Disclaimer: You can view all articles, but only edit and delete your own.</h6>
        {/* {allNews.map((newss) => {
          return (
            <>
              <div>
                <h5>{newss.title}</h5>
                console.log(newss.user);
                <p>{newss.user?.name}</p>
                <p>Category: {newss.category}</p>
                <h6>{newss.content}</h6>
                {user?._id === newss.user?._id && (
                  <button onClick={() => handleDeleteNews(newss._id)}>
                    Delete
                  </button>
                )}
              </div>
            </>
          );
        })} */}
        {/* {allNews.map((news) => {
          return (
            <div key={news._id}>
              <h5>{news.title}</h5>
              <p>{news.user?.name}</p>
              <p>Category: {news.category}</p>
              <h6>{news.content}</h6>
              {user?._id === news.user?._id && (
                <button onClick={() => handleDeleteNews(news._id)}>
                  Delete
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}; */}
        {allNews.map((news) => (
          <div key={news._id}>
            <h5>{news.title}</h5>
            <p>{news.user?.name}</p>
            <p>Category: {news.category}</p>
            <h6>{news.content}</h6>
            {user?._id === news.user?._id && (
              <div>
                <button onClick={() => handleDeleteNews(news._id)}>
                  Delete
                </button>
                {/* Add a button to trigger the handleEdit function */}
                <button onClick={() => handleEdit(news)}>Edit</button>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Add a form for editing articles */}
      {editArticleData.id && (
        <div>
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
              type="submit"
              onClick={() => handleUpdate(editArticleData.id)}
            >
              Update
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default NewsForm;
