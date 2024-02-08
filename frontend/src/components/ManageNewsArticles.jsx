import axios from 'axios';
import React, { useEffect, useState } from 'react';
import NavbarSA from './NavbarSA';
import SearchBar from './SearchBarSA';
import './tableContainer.css'

function ManageNewsArticles() {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/news/all');
        setNews(response.data.message);
      } catch (error) {
        console.log(error);
      }
    };

    fetchNews();
  }, []);

  const handleSearch = async (searchTerm) => {
    setSearchTerm(searchTerm);
  
    if (searchTerm.trim() === '') {
      // If the search term is empty, show all news
      setFilteredNews([]);
    } else {
      // Otherwise, filter news based on the search term
      try {
        const response = await axios.get(`http://localhost:3001/api/news/search/${searchTerm}`);
        setFilteredNews(response.data.message);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Confirm deletion?')) {
      try {
        await axios.delete(`http://localhost:3001/api/news/${id}`);
        window.location.reload()
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <div>
      <NavbarSA />
      </div>
      <div className="">
        <div className="">
        <h2>Manage News Articles</h2>
        <SearchBar onSearch={handleSearch} />
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {searchTerm.trim() === ''
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