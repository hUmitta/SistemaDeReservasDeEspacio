import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Intermediario from './pages/intermediario';
import LoginPage from './pages/LoginPage';
import Home from './pages/home';
import RegisterPage from './pages/RegisterPage';
import Unauthorized from './pages/unauthorized';
import { UserProvider } from './userContext';
import PrivateRoute from './components/privateRoute';
import Navbar from './components/Navbar';
import ApplicationPage from './pages/ApplicationPage';

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar/>
        <Routes>

          <Route path="/" element={<Intermediario />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path='/application' element={ <ApplicationPage /> } />


          {/*HOME COMPARTIDO ENTRE ESTUDIANTE Y DOCENTE*/}


          <Route path="/home" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />
          



          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
