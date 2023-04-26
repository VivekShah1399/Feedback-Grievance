import logo from './logo.svg';
import './App.css';


import Home from './Components/home'
import ShowFeedback from './Components/showFeedbacks'
import ShowGrievance from './Components/grievance';
function App() {
  return (
    <div className="App">
     <Home/>
     <ShowFeedback/>
     { /* <ShowGrievance/> */}
    </div>
  );
}

export default App;
