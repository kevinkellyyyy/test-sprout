import './App.css';
import Home from './pages/Home';
import Details from './pages/Detail';
import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/details/:id" element={<Details/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
