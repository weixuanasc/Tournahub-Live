import axios from "axios";
import React, { useEffect, useState } from "react";
import NavbarSA from "./NavbarSA";
import SearchBar from "./SearchBarSA";
import "./tableContainer.css";
import bgmImage2 from "./images/details.jpg";

function ManageNewsArticles() {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [scrollY, setScrollY] = useState(0);
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

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("https://api.fyp23s424.com/api/news/all");
        setNews(response.data.message);
      } catch (error) {
        console.log(error);
      }
    };

    fetchNews();
  }, []);

  const handleSearch = async (searchTerm) => {
    setSearchTerm(searchTerm);

    if (searchTerm.trim() === "") {
      // If the search term is empty, show all news
      setFilteredNews([]);
    } else {
      // Otherwise, filter news based on the search term
      try {
        const response = await axios.get(
          `https://api.fyp23s424.com/api/news/search/${searchTerm}`
        );
        setFilteredNews(response.data.message);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Confirm deletion?")) {
      try {
        await axios.delete(`https://api.fyp23s424.com/api/news/${id}`);
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <div>
        <NavbarSA />
        <img
          className="bg"
          src={bgmImage2}
          alt="Background"
          style={{ transform: `translateY(${scrollY * 0.001}px)` }}
        />
      </div>
      <div className="">
        <div className="">
          <h2>Manage News Articles</h2>
          <SearchBar onSearch={handleSearch} />
          <table className="table">
            <thead>
              <tr>
                <th style={{ background: "orange" }}>Title</th>
                <th style={{ background: "orange" }}>Author</th>
                <th style={{ background: "orange" }}>Category</th>
                <th style={{ background: "orange" }}>Date</th>
                <th style={{ background: "orange" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {searchTerm.trim() === ""
                ? news.map((article) => (
                    <tr key={article._id}>
                      <td>{article.title}</td>
                      <td>{article.author}</td>
                      <td>{article.category}</td>
                      <td>{article.postDate}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(article._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                : filteredNews.map((article) => (
                    <tr key={article._id}>
                      <td>{article.title}</td>
                      <td>{article.author}</td>
                      <td>{article.category}</td>
                      <td>{article.postDate}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(article._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default ManageNewsArticles;
