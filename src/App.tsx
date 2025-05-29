import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import DocsPage from "@/pages/docs";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import CanvasPage from "@/pages/canvas";

function App() {
  return (
    <Routes>
      <Route element={<CanvasPage />} path="/" />
    </Routes>
  );
}

export default App;
