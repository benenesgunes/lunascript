import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import DreamJournal from "./pages/DreamJournal";
import DreamArchive from "./pages/DreamArchive";
import About from "./pages/About";
import Profile from "./pages/Profile";
import DreamInterpretation from "./pages/DreamInterpretation";
import UserSettings from "./pages/UserSettings";
import Layout from "./Layout";
import { BrowserRouter as Router, Routes, Route } from "react-router";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dreamjournal" element={<DreamJournal />} />
          <Route path="/dreamarchive" element={<DreamArchive />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/usersettings" element={<UserSettings />} />
          <Route path="/interpretation/:id" element={<DreamInterpretation />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
