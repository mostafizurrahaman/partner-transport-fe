import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Routes/Routes";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { Toaster } from "sonner";
import GoogleMapLoad from "./Components/GoogleMapLoad/GoogleMapLoad"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleMapLoad>
        <RouterProvider router={router} />
      </GoogleMapLoad>
    </Provider>
    <Toaster
      position="top-right"
      richColors
      toastOptions={{
        duration: 1500,
      }}
    />
  </React.StrictMode>
);
