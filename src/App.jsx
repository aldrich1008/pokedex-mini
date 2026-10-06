import { HashRouter, Routes, Route } from "react-router-dom";
import ListPage from "./pages/ListPage.jsx";
import DetailPage from "./pages/DetailPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<ListPage />} />
        <Route path="/pokemon/:name" element={<ListPage />} />
        <Route path="/standalone/:name" element={<DetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
