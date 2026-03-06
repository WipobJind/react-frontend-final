import './App.css'
import { Route, Routes, Link } from 'react-router-dom';
import RequireAuth from './middleware/RequireAuth';
import Login from './components/Login';
import Logout from './components/Logout';
import Books from './components/Books';
import { BookDetail } from './components/BookDetail';
import BookBorrow from './components/BookBorrow';
import { useUser } from './contexts/UserProvider';

function App() {
  const { user } = useUser();

  return (
    <div>
      {user.isLoggedIn && (
        <nav>
          <Link to="/books">Books</Link> | 
          <Link to="/borrow">Borrow</Link> | 
          <Link to="/logout">Logout</Link>
        </nav>
      )}
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/logout' element={<RequireAuth><Logout /></RequireAuth>} />
        <Route path='/books' element={<RequireAuth><Books /></RequireAuth>} />
        <Route path='/books/:id' element={<RequireAuth><BookDetail /></RequireAuth>} />
        <Route path='/borrow' element={<RequireAuth><BookBorrow /></RequireAuth>} />
        <Route path='*' element={<Login />} />
      </Routes>
    </div>
  );
}

export default App