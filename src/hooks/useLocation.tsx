import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Try to get city name from reverse geocoding
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          
          if (response.ok) {
            const data = await response.json();
            setLocation({
              latitude,
              longitude,
              city: data.city || data.locality || 'Unknown City'
            });
          } else {
            setLocation({ latitude, longitude });
          }
        } catch (err) {
          // If reverse geocoding fails, still save coordinates
          setLocation({ latitude, longitude });
        }
        
        setLoading(false);
        toast({
          title: "Location Found",
          description: "Your location has been detected for better matchmaking!",
        });
      },
      (error) => {
        setError(error.message);
        setLoading(false);
        toast({
          title: "Location Error",
          description: "Could not get your location. You can still play without location-based matching.",
          variant: "destructive"
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  return {
    location,
    loading,
    error,
    requestLocation
  };
};