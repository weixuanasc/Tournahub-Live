import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ForgetPassword from "./components/ForgetPassword";
import ResetPassword from "./components/ResetPassword";
import DashboardSA from "./components/DashboardSA";
import CreateSport from "./components/CreateSport";
import ManageSports from "./components/ManageSports";
import UpdateSports from "./components/UpdateSports";
import ManageNewsArticles from "./components/ManageNewsArticles";
import ManageUsers from "./components/ManageUsers";
import UpdateUsers from "./components/UpdateUsers";
import VerifyUsers from "./components/verifyUsers";
import DashboardA from "./components/DashboardA";
import DashboardTO from "./components/DashboardTO";
import DashboardS from "./components/DashboardS";
import DashboardTOPendingCollaboration from "./components/DashboardTOPendingCollaboration";
import UpdateProfile from "./components/Applicant/UpdateProfile";
import DisplaySchedule from "./components/Applicant/DisplaySchedule";
import NewsDetails from "./components/Applicant/NewsDetails";
import NewsForm from "./components/Applicant/NewsForm";
import RatingAndReview from "./components/Applicant/RatingAndReview";
import CreateTournament from "./components/CreateTournament";
import Tournament from "./components/Tournament";
import ViewTournamentDetails from "./components/ViewTournamentDetails";
import UpdateTournament from "./components/UpdateTournament";
import AddMatches from "./components/AddMatches";
import AddStatistics from "./components/AddStatistics";
import UpdateMatches from "./components/UpdateMatches";
import UpdateStatistics from "./components/UpdateStatistics";
import CreateRankingTable from "./components/CreateRankingTable";
import ViewApplicants from "./components/ViewApplicants";
import InvitationPage from "./components/InvitationPage";
import SponsorshipModels from "./components/SponsorshipModels";
import PaymentSuccess from "./components/PaymentSuccess";
import UploadSponsorIcon from "./components/UploadSponsorIcon";
import SponsorTournament from "./components/SponsorTournament";
import TournamentApplication from "./components/Applicant/TournamentApplication";
import AddScoresheet from "./components/AddScoresheet";
import ViewTournament from "./components/ViewTournament";
import UserApplicationStatus from "./components/Applicant/UserApplicationStatus";
import ScheduleGuide from "./components/ScheduleGuide";
import ContactUs from "./components/ContactUs";
import AboutUs from "./components/AboutUs";

export default function App() {
  const loginSA = window.localStorage.getItem("loggedInSA");
  const loginA = window.localStorage.getItem("loggedInA");
  const loginTO = window.localStorage.getItem("loggedInTO");
  const loginS = window.localStorage.getItem("loggedInS");
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              loginSA ? (
                <DashboardSA />
              ) : loginA ? (
                <DashboardA />
              ) : loginTO ? (
                <DashboardTO />
              ) : loginS ? (
                <DashboardS />
              ) : (
                <Home />
              )
            }
          />
          <Route path="/home/news/:newsId" element={<NewsDetails />} />
          <Route path="/ContactUs" element={<ContactUs />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/UploadNews" element={<NewsForm />} />
          <Route path="/RatingAndReview" element={<RatingAndReview />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/ForgetPassword" element={<ForgetPassword />} />
          <Route path="/ResetPassword/:id/:token" element={<ResetPassword />} />
          <Route path="/DashboardSA" element={<DashboardSA />} />
          <Route path="/CreateSport" element={<CreateSport />} />
          <Route path="/ManageSports" element={<ManageSports />} />
          <Route path="/UpdateSports/:id" element={<UpdateSports />} />
          <Route path="/ManageNewsArticles" element={<ManageNewsArticles />} />
          <Route path="/ManageUsers" element={<ManageUsers />} />
          <Route path="/verifyUsers" element={<VerifyUsers />} />
          <Route path="/UpdateUsers/:id" element={<UpdateUsers />} />
          <Route path="/home" element={<DashboardA />} />
          <Route path="/UpdateProfile" element={<UpdateProfile />} />
          <Route path="/TournamentSchedule" element={<DisplaySchedule />} />
          <Route path="/Apply" element={<TournamentApplication />} />
          <Route
            path="/userapplicationstatus"
            element={<UserApplicationStatus />}
          />
          <Route path="/DashboardTO" element={<DashboardTO />} />
          <Route path="/DashboardS" element={<DashboardS />} />

          <Route path="/CreateTournament" element={<CreateTournament />} />
          <Route path="/Tournament" element={<Tournament />} />

          <Route
            path="/ViewTournamentDetails/:id"
            element={<ViewTournamentDetails />}
          />
          <Route
            path="/ViewTournamentDetails"
            element={<ViewTournamentDetails />}
          />

          <Route path="/UpdateTournament/:id" element={<UpdateTournament />} />
          <Route path="/UpdateTournament" element={<UpdateTournament />} />

          <Route path="/AddMatches" element={<AddMatches />} />
          <Route path="/AddMatches/:tournamentId" element={<AddMatches />} />
          <Route path="/UpdateMatches" element={<UpdateMatches />} />
          <Route path="/UpdateMatches/:id" element={<UpdateMatches />} />

          <Route path="/AddStatistics" element={<AddStatistics />} />
          <Route
            path="/AddStatistics/:tournamentId"
            element={<AddStatistics />}
          />
          <Route path="/UpdateStatistics" element={<UpdateStatistics />} />
          <Route path="/UpdateStatistics/:id" element={<UpdateStatistics />} />

          <Route path="/CreateRankingTable" element={<CreateRankingTable />} />
          <Route
            path="/CreateRankingTable/:tournamentId"
            element={<CreateRankingTable />}
          />

          <Route path="/ViewApplicants" element={<ViewApplicants />} />
          <Route
            path="/ViewApplicants/:tournamentId"
            element={<ViewApplicants />}
          />

          <Route path="/InvitationPage" element={<InvitationPage />} />
          <Route
            path="/InvitationPage/:tournamentId"
            element={<InvitationPage />}
          />
          <Route path="/InvitationPage/:id" element={<InvitationPage />} />
          <Route path="/ScheduleGuide/:id" element={<ScheduleGuide />} />

          <Route path="/SponsorshipModels" element={<SponsorshipModels />} />
          <Route path="/PaymentSuccess" element={<PaymentSuccess />} />
          <Route path="/SponsorTournament" element={<SponsorTournament />} />
          <Route path="/UploadSponsorIcon" element={<UploadSponsorIcon />} />
          <Route path="/AddScoresheet" element={<AddScoresheet />} />
          <Route path="/ViewTournament" element={<ViewTournament />} />

          <Route
            path="/DashboardTOPendingCollaboration"
            element={<DashboardTOPendingCollaboration />}
          />
        </Routes>
      </Router>
    </div>
  );
}
