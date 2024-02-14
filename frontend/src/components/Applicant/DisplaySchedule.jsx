import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import SelectNavbar from "../../components/SelectNavbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DisplaySchedule = () => {
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tournamentResponse = await axios.get(
          "https://api.fyp23s424.com/getTournaments"
        );
        const tournaments = tournamentResponse.data;

        const matchPromises = tournaments.map(async (tournament) => {
          const responseMatch = await axios.get(
            "https://api.fyp23s424.com/getMatches/" + tournament._id
          );
          const matches = responseMatch.data.map((match) => {
            // Parse MatchDate string
            const startDate = new Date(match.MatchDate);

            // Extract hours and minutes from MatchTime
            const [hours, minutes] = match.MatchTime.split(":").map(Number);

            // Set hours and minutes to the date object
            startDate.setHours(hours);
            startDate.setMinutes(minutes);

            // Return the event object with the start time included
            return {
              title: `${tournament.tournamentName} - ${match.MatchName} - ${tournament.tournamentVenue}`,
              start: startDate, // Combined date and time
              tournament: tournament.tournamentName,
              venue: tournament.tournamentVenue,
              matchname: match.MatchName,
              tournamentid: tournament._id,
              time: match.MatchTime,
            };
          });

          return matches;
        });

        const filteredMatchPromises = matchPromises.filter(Boolean);
        const matchResults = await Promise.all(filteredMatchPromises);

        const events = matchResults.flat();
        setEvents(events);
        console.log(matchResults);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Function to clean up pop-up elements when component unmounts
    return () => {
      const popovers = document.querySelectorAll(".custom-popover");
      popovers.forEach((popover) => {
        popover.remove();
      });
    };
  }, []);

  const eventDidMount = async (info) => {
    const { event } = info;
    setCurrentEvent(event);
    if (event && event.extendedProps) {
      const popover = document.createElement("div");
      popover.className = "custom-popover";

      popover.innerHTML = `
        <p> Tournament: ${event.extendedProps.tournament} </p>
        <p> Match: ${event.extendedProps.matchname} </p>
        <p> Time: ${event.extendedProps.time} </p>
        <p> Venue: ${event.extendedProps.venue} </p>
      `;

      popover.style.position = "absolute";
      popover.style.background = "white";
      popover.style.border = "1px solid #ccc";
      popover.style.padding = "10px";
      popover.style.zIndex = "1000"; // Ensure it appears above other elements

      const rect = info.el.getBoundingClientRect();
      const left = rect.right + window.pageXOffset + 5; // Adjust as needed
      const top = rect.top + window.pageYOffset;

      // Set initial position
      popover.style.left = `${left}px`;
      popover.style.top = `${top}px`;
      popover.style.display = "none"; // Initially hide pop-up

      let isMouseOver = false;

      popover.addEventListener("mouseenter", () => {
        isMouseOver = true;
      });

      popover.addEventListener("mouseleave", () => {
        isMouseOver = false;
      });

      info.el.addEventListener("click", () => {
        navigate(`/ViewTournamentDetails/${event.extendedProps.tournamentid}`);
      });

      info.el.addEventListener("mouseenter", () => {
        if (!isMouseOver) {
          popover.style.display = "block";
        }
      });

      info.el.addEventListener("mouseleave", () => {
        if (!isMouseOver) {
          popover.style.display = "none";
        }
      });

      // Append the popover to the body
      document.body.appendChild(popover);
    }
  };

  // Doesn't actually do anything
  const renderCustomHeaderCenter = () => {
    if (currentEvent && currentEvent.extendedProps) {
      const tournament = currentEvent.extendedProps.tournament;
      const venue = currentEvent.extendedProps.venue;
      const matchname = currentEvent.extendedProps.matchname;
      return { tournament } - { matchname } - { venue };
    } else {
      return null;
    }
  };
  // const handlePrint = () => {
  //   const originalContent = document.body.innerHTML;
  //   const printArea = document.getElementById("print-area").innerHTML;
  //   document.body.innerHTML = printArea;
  //   window.print();
  //   document.body.innerHTML = originalContent;
  // };
  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {SelectNavbar()}
      <div className="toolbar">
        <button
          className="btn btn-sm btn-danger mr-2"
          onClick={() => handlePrint()}
        >
          Print
        </button>
        {/* Other buttons and elements */}
      </div>
      <div id="print-area">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={"dayGridMonth"}
          headerToolbar={{
            start: "today prev,next",
            center: "title",
            end: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height={"auto"}
          width={"auto"}
          events={events}
          eventDidMount={eventDidMount}
        />
      </div>
        
    </div>
  );
};

export default DisplaySchedule;
