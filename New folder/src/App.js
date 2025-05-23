import { createContext, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import Footer from './components/footer/footer';
import Header from './components/header/header';
import Home from './pages/Home/index';
import Signin from './pages/Signin/index';
import Signup from './pages/Signup/index';
import About from "./pages/About";
import Dashboard from "./pages/Dashboard/index";
import DoctorDashboard from "./pages/Dashboard/doctorindex";
import Prescriptions from "./pages/Prescriptions/index.js";
import DocPrescriptions from "./pages/Prescriptions/docindex.js";
import PrescriptionDetails from "./pages/PrescriptionDetails";
import ContactUs from "./pages/ContactUs";
import Appointment from "./pages/Appointment/Appointment.js";
import DocAppointment from "./pages/Appointment/docappointment.js";
import PatientProfile from "./pages/Profile/PatientProfile.js";
import DocProfile from "./pages/Profile/docProfile.js";
import SearchResult from "./pages/SearchResult/index.js";
import PatientSearch from './pages/SearchedProfile/PatientSearch.js';
import DoctorSearch from './pages/SearchedProfile/DoctorSearch.js';
import DocEdit from "./pages/Edit/docEdit.js";
import PatientEdit from "./pages/Edit/patientEdit.js";
import UserList from './components/userlists/UserList.js';

export const MyContext = createContext();

function App() {
  const [showheaderfooter, setshowheaderfooter] = useState(true);

  const values = {
    showheaderfooter,
    setshowheaderfooter,
  };

  return (
    <BrowserRouter>
      <MyContext.Provider value={values}>
        {showheaderfooter && <Header />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/SignIn" element={<Signin />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/About" element={<About />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/DoctorDashboard" element={<DoctorDashboard />} />
          <Route path="/Prescriptions" element={<Prescriptions />} />
          <Route path="/DocPrescriptions" element={<DocPrescriptions />} />
          <Route path="/PrescriptionDetails/:id" element={<PrescriptionDetails />} />
          <Route path="/ContactUs" element={<ContactUs />} />
          <Route path="/Appointment" element={<Appointment />} />
          <Route path="/DocAppointment" element={<DocAppointment />} />
          <Route path="/PatientProfile" element={<PatientProfile />} />
          <Route path="/DocProfile" element={<DocProfile />} />
          <Route path="/search-results" element={<SearchResult />} />
          <Route path="/patient/doctor/:doctorId" element={<DoctorSearch />} />
          <Route path="/doctor/patient/:patientId" element={<PatientSearch />} />
          <Route path="/DocEdit" element={<DocEdit />} />
          <Route path="/PatientEdit" element={<PatientEdit />} />
          <Route path="/userlist" element={<UserList />} />

        </Routes>
        {showheaderfooter && <Footer />}
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;
