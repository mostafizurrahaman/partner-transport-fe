import { useEffect, useState } from "react";

export const useGoogleMapRoute = (originCoords, destinationCoords) => {
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    if (originCoords && destinationCoords && window.google) {
      const origin = { lat: originCoords[1], lng: originCoords[0] };
      const destination = { lat: destinationCoords[1], lng: destinationCoords[0] };

      const service = new window.google.maps.DirectionsService();

      service.route(
        {
          origin,
          destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") {
            setDirections(result);
          } else {
            console.error("Failed to load directions:", status);
          }
        }
      );
    }
  }, [originCoords, destinationCoords]);

  return { directions };
};
