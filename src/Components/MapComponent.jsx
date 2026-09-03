import { GoogleMap, Marker, DirectionsRenderer, InfoWindow } from "@react-google-maps/api";
import locationA from "../assets/images/user.png";
import locationB from "../assets/images/loading.png";
import { useGoogleMapRoute } from "./useGoogleMapRoute";
import React, { useState, useEffect } from "react";

const containerStyle = {
  width: "100%",
  height: "600px",
};

const MapComponent = ({ getAuctionDetails }) => {
  const result = getAuctionDetails?.data?.result;
  const loadingCoords = result?.loadingLocation?.coordinates;
  const unloadingCoords = result?.unloadingLocation?.coordinates;
  const partnerCoords = result?.confirmedPartner?.location?.coordinates;
  const mainService = result?.mainService;
  const isSell = mainService === 'sell';

  // For sell, prioritize partner to pickup route
  // For move, original loading to unloading route
  const origin = isSell ? partnerCoords : loadingCoords;
  const destination = isSell ? loadingCoords : unloadingCoords;

  const { directions } = useGoogleMapRoute(origin, destination);

  const [isMarkersVisible, setIsMarkersVisible] = useState(false);
  const [isRouteVisible, setIsRouteVisible] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);

  useEffect(() => {
    if (directions) {
      setIsMarkersVisible(true);
      setIsRouteVisible(true);
    } else if (loadingCoords) {
      // If no directions yet (e.g. no partner for sell), just show markers
      setIsMarkersVisible(true);
    }
  }, [directions, loadingCoords]);

  if (!loadingCoords) {
    return <div>Loading map...</div>;
  }

  const loadingLatLng = { lat: loadingCoords[1], lng: loadingCoords[0] };
  const unloadingLatLng = unloadingCoords ? { lat: unloadingCoords[1], lng: unloadingCoords[0] } : null;
  const partnerLatLng = partnerCoords ? { lat: partnerCoords[1], lng: partnerCoords[0] } : null;

  return (
    <GoogleMap 
      mapContainerStyle={containerStyle} 
      center={loadingLatLng} 
      zoom={12}
    >
      {isMarkersVisible && (
        <>
          {/* Pickup/Loading Marker */}
          <Marker
            position={loadingLatLng}
            onClick={() => setActiveMarker("loading")}
            icon={{
              url: locationA,
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
          {activeMarker === "loading" && (
            <InfoWindow position={loadingLatLng} onCloseClick={() => setActiveMarker(null)}>
              <div className="px-3 pb-2 pt-1">
                <strong>{isSell ? "Pickup Location" : "Loading Location"}</strong>
                <p className="text-gray-600 text-xs mt-1">Status: {result?.user_status || "Pending"}</p>
              </div>
            </InfoWindow>
          )}

          {/* Partner Marker */}
          {partnerLatLng && (
            <>
              <Marker
                position={partnerLatLng}
                onClick={() => setActiveMarker("partner")}
                icon={{
                  url: locationB,
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
              />
              {activeMarker === "partner" && (
                <InfoWindow position={partnerLatLng} onCloseClick={() => setActiveMarker(null)}>
                  <div className="px-3 pb-2 pt-1">
                    <strong>Winning Partner Current Location</strong>
                    <p className="text-gray-600 text-xs mt-1">Status: {result?.partner_status || "Active"}</p>
                  </div>
                </InfoWindow>
              )}
            </>
          )}

          {/* Unloading Marker - Only for "move" services if coordinates are valid */}
          {!isSell && unloadingLatLng && unloadingLatLng.lat !== 0 && (
            <>
              <Marker
                position={unloadingLatLng}
                onClick={() => setActiveMarker("unloading")}
                icon={{
                  url: locationA,
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
              />
              {activeMarker === "unloading" && (
                <InfoWindow position={unloadingLatLng} onCloseClick={() => setActiveMarker(null)}>
                  <div className="px-3 pb-2 pt-1">
                    <strong>Unloading Location</strong>
                    <p className="text-gray-600 text-xs mt-1">Status: {result?.user_status || "Pending"}</p>
                  </div>
                </InfoWindow>
              )}
            </>
          )}
        </>
      )}

      {isRouteVisible && directions && (
        <DirectionsRenderer
          directions={directions}
          options={{ suppressMarkers: true }}
        />
      )}
    </GoogleMap>
  );
};

export default MapComponent;
