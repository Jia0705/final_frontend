import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { CookiesProvider } from "react-cookie";

import Products from "./pages/Products";
import ProductAddNew from "./pages/ProductAddNew";
import ProductEdit from "./pages/ProductEdit";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Categories from "./pages/Categories";
import CategoryEdit from "./pages/CategoryEdit";
import Comments from "./pages/Comments";
import Bookmarks from "./pages/Bookmarks";
import Profile from "./pages/Profile";

function App() {
  return (
    <div className="App">
      {" "}
      <CookiesProvider defaultSetOptions={{ path: "/" }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/products/new" element={<ProductAddNew />} />
            <Route path="/products/:id/edit" element={<ProductEdit />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:id/edit" element={<CategoryEdit />} />
            <Route path="/products/:id/comment" element={<Comments />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </BrowserRouter>
        <Toaster richColors position="top-right" />
      </CookiesProvider>
    </div>
  );
}

export default App;
