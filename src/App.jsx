import { BrowserRouter, Route, Routes } from 'react-router-dom';

import MainPage from './components/MainPage';
import DetailsPage from './components/DetailsPage';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/details/:factoryId/:month" element={<DetailsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
