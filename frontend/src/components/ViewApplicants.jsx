// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import NavbarTO from "./NavbarTO";

// function ViewApplicants() {
//   const { tournamentId } = useParams();
//   const [tournament, setTournament] = useState(null);
//   const [applicants, setApplicants] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchApplicationsOfTournaments = async () => {
//     if (!tournamentId) return;
//     try {
//       const { data } = await axios.get(
//         `http://localhost:3001/api/applicationstatus/getApplicationOfTournament/${tournamentId}`
//       );
//       setApplicants(data.message);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   const fetchTournamenData = async () => {
//     try {
//       const { data } = await axios.get(
//         `http://localhost:3001/getTournamentDetails/${tournamentId}`
//       );
//       setTournament(data);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   useEffect(() => {
//     if (!tournamentId) return;
//     fetchApplicationsOfTournaments();
//     fetchTournamenData();
//   }, [tournamentId]);

//   return (
//     <>
//       <NavbarTO />
//       <div className="d-flex justify-content-center align-items-center">
//         <h2>Applicants for {tournament?.tournamentName}</h2>

//         {applicants?.length > 0 ? (
//           <ul>
//             {applicants.map((applicantions) => (
//               <div key={applicantions._id}>
//                 <p>username :{applicantions?.user?.name}</p>
//                 <p>email :{applicantions?.user?.email}</p>
//               </div>
//             ))}
//           </ul>
//         ) : (
//           <p>No applicants for this tournament.</p>
//         )}
//       </div>
//     </>
//   );
// }
// export default ViewApplicants;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavbarTO from "./NavbarTO";

function ViewApplicants() {
  const { tournamentId } = useParams();
  const [tournament, setTournament] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplicationsOfTournaments = async () => {
    if (!tournamentId) return;
    try {
      const { data } = await axios.get(
        `http://localhost:3001/api/applicationstatus/getApplicationOfTournament/${tournamentId}`
      );
      setApplicants(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTournamentData = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3001/getTournamentDetails/${tournamentId}`
      );
      setTournament(data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateApplicationStatus = async (applicationId, action) => {
    try {
      await axios.put(
        `http://localhost:3001/api/applicationstatus/updateApplicationStatus/${applicationId}`,
        { action }
      );
      fetchApplicationsOfTournaments();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!tournamentId) return;
    fetchApplicationsOfTournaments();
    fetchTournamentData();
  }, [tournamentId]);

  return (
    <>
      <NavbarTO />
      <div>
        <h2>Applicants for {tournament?.tournamentName}</h2>

        {applicants?.length > 0 ? (
          <ol>
            {applicants.map((application) => (
              <li key={application._id}>
                <p>username: {application?.user?.name}</p>
                <p>email: {application?.user?.email}</p>
                <p>status: {application.action}</p>
                <button
                  onClick={() =>
                    updateApplicationStatus(application._id, "APPROVED")
                  }
                  disabled={application.action !== "REQUESTED"}
                >
                  Accept
                </button>
                <button
                  onClick={() =>
                    updateApplicationStatus(application._id, "REJECTED")
                  }
                  disabled={application.action !== "REQUESTED"}
                >
                  Reject
                </button>
              </li>
            ))}
          </ol>
        ) : (
          <p>No applicants for this tournament.</p>
        )}
      </div>
    </>
  );
}

export default ViewApplicants;
