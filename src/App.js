import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./Components/LoginComponent/LoginPage";
import RegisterUser from "./Components/LoginComponent/RegisterUser";
import AdminMenu from "./Components/LoginComponent/AdminMenu";
import StudentMenu from "./Components/LoginComponent/StudentMenu";
import FoundItemSubmission from './Components/ItemComponent/FoundItemSubmission';
import LostItemReport from './Components/ItemComponent/LostItemReport';
import FoundItemReport from './Components/ItemComponent/FoundItemReport';
import LostItemSubmission from './Components/ItemComponent/LostItemSubmission';
import Profile from './Components/ItemComponent/Profile';
import UserLostItem from './Components/ItemComponent/UserLostItem';
import UserFoundItem from './Components/ItemComponent/UserFoundItem';
import StudentList from './Components/LoginComponent/StudentList';
import PublicChat from './Components/ItemComponent/PublicChat';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage/>}/>
        <Route path="/Register" element={<RegisterUser/>}/>
        <Route path="/AdminMenu" element={<AdminMenu/>}/>
        <Route path="/StudentMenu" element={<StudentMenu/>}/>
        <Route path="/lost-item-submission" element={<LostItemSubmission />} />
        <Route path="/lost-item-report" element={<LostItemReport />} />
        <Route path="/found-item-submission" element={<FoundItemSubmission />} />
        <Route path="/found-item-report" element={<FoundItemReport />} />
        <Route path="/user-profile" element={<Profile />} />
        <Route path="/user-lost-item" element={<LostItemReport />} />
        <Route path="/user-found-item" element={<UserFoundItem />} />
        <Route path="/StudentList" element={<StudentList />} />
        <Route path="/public-chat" element={<PublicChat />} />
        </Routes>
     </BrowserRouter>
    </div>
  );
}

export default App;
