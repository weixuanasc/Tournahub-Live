import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavbarTO from './NavbarTO';

function EditStatistics() {
  const [statisticsDetails, setStatisticsDetails] = useState([]);
  const [loadingStatistics, setLoadingStatistics] = useState(true);
  const [updatedStatistics, setUpdatedStatistics] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch statistics when the component mounts
    axios
      .get(`http://localhost:3001/getStatistics/${id}`)
      .then((response) => {
        setStatisticsDetails(response.data);
        // Initialize updatedStatistics with the fetched data
        setUpdatedStatistics(response.data.map(statistics => ({...statistics})));
      })
      .catch((error) => {
        console.error('Error fetching statistics:', error);
      })
      .finally(() => {
        setLoadingStatistics(false);
      });
  }, [id]);

  const updateStatistics = (e, statisticsId) => {
    e.preventDefault();
    const updatedStatisticsData = updatedStatistics.find((statistics) => statistics._id === statisticsId);
    console.log('Updated Statistics:', updatedStatisticsData);
  
    axios
    .put(`http://localhost:3001/updateStatistics/${statisticsId}`, updatedStatisticsData)
    .then((result) => {
      console.log(result);
      alert('Statistics updated successfully');
      navigate('/Tournament');
    })
    .catch((err) => console.log(err));
};

  const handleInputChange = (e, statisticsId, field) => {
    setUpdatedStatistics((prevStatistics) =>
      prevStatistics.map((statistics) =>
      statistics._id === statisticsId ? { ...statistics, [field]: e.target.value } : statistics
      )
    );
  };
  

  return (
    <div>
      <NavbarTO />
      <div>
        {loadingStatistics ? (
          <p>Loading statistis...</p>
        ) : (
          <form>
            <h2>Update Statistics</h2>
            {statisticsDetails.map((statistics, index) => (
              <div key={index}>
                <p>
                  Participant:{' '}
                  <input
                    type="text"
                    value={updatedStatistics[index]?.Participant || statistics.Participant}
                    onChange={(e) => handleInputChange(e, statistics._id, 'Participant')}
                  />
                </p>
                <p>
                  Score(W/L):{' '}
                  <input
                    type="text"
                    value={updatedStatistics[index]?.Score || statistics.Score}
                    onChange={(e) => handleInputChange(e, statistics._id, 'Score')}
                  />
                </p>
                <p>
                  Average Score:{' '}
                  <input
                    type="text"
                    value={updatedStatistics[index]?.AverageScore || statistics.AverageScore}
                    onChange={(e) => handleInputChange(e, statistics._id, 'AverageScore')}
                  />
                </p>
                <p>
                  Total Score:{' '}
                  <input
                    type="text"
                    value={updatedStatistics[index]?.TotalScore || statistics.TotalScore}
                    onChange={(e) => handleInputChange(e, statistics._id, 'TotalScore')}
                  />
                </p>


                {/* ... other input fields ... */}
                <button onClick={(e) => updateStatistics(e, statistics._id)}>Update Statistics</button>
                <p></p>
              </div>
            ))}
          </form>
        )}
      </div>
    </div>
  );
}

export default EditStatistics;
