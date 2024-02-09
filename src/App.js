import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Landing } from './components/landing';
import { SignUp } from './components/signUp';
import { ExpenseTracker } from './components/expense-tracker';
import { Profile } from './components/profile';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/logIn' element={<SignUp />} />
          <Route path='/expense-tracker' element={<ExpenseTracker />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
