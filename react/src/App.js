import logo from './logo.svg';
import { useNavigate } from 'react-router-dom';
import './App.css';
import Index from './pages/index/Index';
import Navbar from './components/Navbar';

function App() {
  const navigate = useNavigate();
  return (
    <div className="">
      {/* <Navbar /> */}
      <Index/>
    </div>
  );
}


export default App;
