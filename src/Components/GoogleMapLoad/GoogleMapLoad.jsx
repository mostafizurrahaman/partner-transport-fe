import { LoadScript } from "@react-google-maps/api";
import React, {  useState } from "react";

const GoogleMapLoad = ({ children }) => {
  const [googleApiLoaded, setGoogleApiLoaded] = useState(false);

//   const handleLoad = () => {
//     setGoogleApiLoaded(true);
//   };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyDfMF4ewLnSHTnvP5x7Tj4MXKdExbg98RY"
    //   onLoad={handleLoad}
    //   onError={() => console.error("Error loading Google Maps API")}
    >
      {children}
    </LoadScript>
  );
};

export default GoogleMapLoad;
