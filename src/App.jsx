import './App.css'
import { useRoutes } from 'react-router-dom';
import SignInPage from './pages/Signin';
import SignupPage from './pages/Signup';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import ViewBlogsPage from './pages/ViewBlogsPage';
import ViewBlogDetailsPage from './pages/ViewBlogDetailsPage';
import Navbar from './components/Navbar';
import useLocalStorage from './hooks/useLocalStorage';
import userContext from './context/userContext.js'
import userRecordContext from './context/userRecordContext.js';
import { useState } from 'react';
import LangPage from './pages/LangPage.jsx';

function App() {
  // React Router Setup

  const [_currentUser, setCurrentUser] = useLocalStorage('current_user', null);
  const [userRecordDoc, setUserRecordDoc] = useState(null);

  const routes = useRoutes([
    {
      path: '/',
      element: <LangPage />
    },
    {
      path: '/signin',
      element: <SignInPage />
    },
    {
      path: '/signup',
      element: <SignupPage />
    },
    {
      path: '/home',
      element: <HomePage />
    },
    {
      path: '/viewblogs',
      element: <ViewBlogsPage />
    },
    {
      path: '/viewblogs/:id',
      element: <ViewBlogDetailsPage />
    },
    {
      path: "*",
      element: <NotFoundPage />
    }

  ])

 return (
  <userContext.Provider value={
      {
        _currentUser,
        setCurrentUser
      }
    }>
    <userRecordContext.Provider value={{
        userRecordDoc,
        setUserRecordDoc
      }}>
      <Navbar />
      {routes}
    </userRecordContext.Provider>
  </userContext.Provider>
 )

}

export default App
