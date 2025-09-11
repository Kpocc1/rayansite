import React from "react";
import {
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";

import useCustomer from "hooks/useCustomer";
import pages from "./constants/routes";

import Home from "./pages/home";

import PageDefault from "./pages/page";
import PageReviews from "./pages/page/page-reviews";
import PageNewsList from "pages/page/page-news-list";
import PageNewsDetail from "pages/page/page-news-detail";
import PageContact from "pages/page/page-contact";

import Catalog from "./pages/catalog";
import Category from "./pages/catalog/category";
import Product from "./pages/catalog/product";

import Cart from "./pages/cart";
import CartSuccess from "pages/cart/success";

import Profile from "./pages/account/profile";
import Password from "./pages/account/password";
import History from "./pages/account/history";
import HistoryDetail from "./pages/account/history/Detail";
import Wishlist from "./pages/account/wishlist";

import Error404 from "./pages/common/404";

const PublicRoutes = () => <Outlet />;

const PrivateRoutes = () => {
  const { customer } = useCustomer();

  return (
    customer.token ? (
      <Outlet />
    ) : (
      <Navigate to={pages.LOGIN} />
    )
  );
};

const Router = () => {
  return (
    <Routes>
      <Route exact path="/" element={<PublicRoutes />}>
        <Route exact path="/" element={<Home />} />
        <Route exact path={pages.CATALOG} element={<Catalog />} />
        <Route exact path="/catalog/*" element={<Category />} />
        <Route exact path="/product/*" element={<Product />} />

        <Route exact path="/cart" element={<Cart />} />
        <Route exact path="/cart/success/*" element={<CartSuccess />} />
        <Route exact path="/reviews" element={<PageReviews />} />
        <Route exact path="/news" element={<PageNewsList />} />
        <Route exact path="/news/*" element={<PageNewsDetail />} />
        <Route exact path="/contact" element={<PageContact />} />
      </Route>

      <Route exact path="/page" element={<PublicRoutes />}>
        <Route exact path="/page/*" element={<PageDefault />} />
      </Route>

      <Route exact path="/account" element={<PrivateRoutes />}>
        <Route exact path="/account" element={<Profile />} />
        <Route exact path="/account/password" element={<Password />} />
        <Route exact path="/account/history" element={<History />} />
        <Route exact path="/account/history/*" element={<HistoryDetail />} />

        <Route exact path="/account/wishlist" element={<Wishlist />} />
      </Route>

      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};

export default Router;
