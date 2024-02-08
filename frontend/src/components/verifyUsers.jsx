import axios from 'axios';
import React, { useEffect, useState } from 'react';
import NavbarSA from './NavbarSA';
import './tableContainer.css'

function VerifyUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/PendingUsers');
        setUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, []);

  const handleApprove = async (id) => {
    if (window.confirm('Confirm approval?')) {
      try {
        await axios.put(`http://localhost:3001/approveUser/${id}`);
        window.location.reload()
      } catch (error) {
        console.log(error);
      }
    }
  }

  const showPDF=(verification)=>{
    window.open(`http://localhost:3001/verify/${verification}`, "_blank", "noreferrer")
  }

  return (
    <>
      <div>
      <NavbarSA />
      </div>
      <div className="">
        <div className="">
          <h2>Verify Users</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>User Type</th>
                <th>Verification</th>
                <th>isActive</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.usertype}</td>
                  <td>{user.verification}</td>
                  <td>{user.isActive}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleApprove(user._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => showPDF(user.verification)}
                    >
                      Show PDF
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
};

export default VerifyUsers;