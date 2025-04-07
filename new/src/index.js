import React from "react";
import { BrowserRouter } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import { base_path } from "./environment.jsx";
import "../src/style/css/feather.css";
import "../src/style/css/line-awesome.min.css";
import "../src/style/scss/main.scss";
import "../src/style/icons/fontawesome/css/fontawesome.min.css";
import "../src/style/icons/fontawesome/css/all.min.css";
import { createRoot } from "react-dom/client";
import axios from "axios";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import AllRoutes from "./Router/router.jsx";
import { Toaster } from "react-hot-toast";
axios.interceptors.request.use(
  (config) => {
    config.headers["Client-App-Key"] = process.env.REACT_APP_API_KEY;
    config.headers["Client-App-Type"] = process.env.REACT_APP_API_TYPE;
    config.headers["Content-Type"] = "application/json";

    return config;
  },
  (error) => Promise.reject(error)
);
const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      {/* <Provider store={store}>
        <BrowserRouter basename={base_path}>
          <AllRoutes />
        </BrowserRouter>
      </Provider> */}
      <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <BrowserRouter basename={base_path}>
          <Toaster />
          <AllRoutes />
        </BrowserRouter>
      </PersistGate>
    </Provider>
    </React.StrictMode>
  );
} else {
  console.error("Element with id 'root' not found.");
}
