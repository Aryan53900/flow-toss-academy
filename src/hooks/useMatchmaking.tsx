import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface MatchmakingData {
  user_id: string;
  location_lat?: number;
  location_lng?: number;
  wager_amount: number;
  created_at: string;
}

interface NearbyPlayer {
  user_id: string;
  username: string;
  location_city: string;
  distance?: number;
  wager_amount: number;
}

export const useMatchmaking = () => {
  const [inQueue, setInQueue] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nearbyPlayers, setNearbyPlayers] = useState<NearbyPlayer[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  };

  // Join matchmaking queue
  const joinQueue = async (wagerAmount: number = 0, location?: { lat: number; lng: number }) => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('matchmaking_queue')
        .upsert({
          user_id: user.id,
          location_lat: location?.lat,
          location_lng: location?.lng,
          wager_amount: wagerAmount
        });

      if (error) throw error;

      setInQueue(true);
      toast({
        title: "Joined Queue",
        description: "Looking for opponents near you...",
      });

      // Start looking for nearby players
      await findNearbyPlayers(location);
    } catch (error: any) {
      toast({
        title: "Queue Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Leave matchmaking queue
  const leaveQueue = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('matchmaking_queue')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setInQueue(false);
      setNearbyPlayers([]);
      toast({
        title: "Left Queue",
        description: "You've left the matchmaking queue.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Find nearby players
  const findNearbyPlayers = async (userLocation?: { lat: number; lng: number }) => {
    if (!user) return;

    try {
      // Get players in queue with their profiles
      const { data: queueData, error } = await supabase
        .from('matchmaking_queue')
        .select(`
          user_id,
          location_lat,
          location_lng,
          wager_amount,
          created_at
        `)
        .neq('user_id', user.id);

      if (error) throw error;

      if (!queueData || queueData.length === 0) {
        setNearbyPlayers([]);
        return;
      }

      // Get profile data for these users
      const userIds = queueData.map(q => q.user_id);
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, username, location_city')
        .in('user_id', userIds);

      if (profileError) throw profileError;

      // Combine queue and profile data
      const playersWithDistance = queueData.map(queue => {
        const profile = profiles?.find(p => p.user_id === queue.user_id);
        let distance;

        if (userLocation && queue.location_lat && queue.location_lng) {
          distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            queue.location_lat,
            queue.location_lng
          );
        }

        return {
          user_id: queue.user_id,
          username: profile?.username || 'Anonymous Player',
          location_city: profile?.location_city || 'Unknown Location',
          distance,
          wager_amount: queue.wager_amount
        };
      });

      // Sort by distance if available
      const sortedPlayers = playersWithDistance.sort((a, b) => {
        if (a.distance !== undefined && b.distance !== undefined) {
          return a.distance - b.distance;
        }
        return 0;
      });

      setNearbyPlayers(sortedPlayers);
    } catch (error: any) {
      console.error('Error finding nearby players:', error);
    }
  };

  // Challenge a specific player
  const challengePlayer = async (opponentId: string, wagerAmount: number = 0) => {
    if (!user) return null;

    try {
      // Create a new match
      const { data, error } = await supabase
        .from('matches')
        .insert({
          player1_id: user.id,
          player2_id: opponentId,
          wager_amount: wagerAmount,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Remove both players from queue
      await supabase
        .from('matchmaking_queue')
        .delete()
        .in('user_id', [user.id, opponentId]);

      toast({
        title: "Challenge Sent!",
        description: "Match created successfully!",
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Challenge Error",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
  };

  // Check queue status on component mount
  useEffect(() => {
    if (!user) return;

    const checkQueueStatus = async () => {
      const { data, error } = await supabase
        .from('matchmaking_queue')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        setInQueue(true);
        // Find nearby players if in queue
        const userLocation = data.location_lat && data.location_lng 
          ? { lat: data.location_lat, lng: data.location_lng }
          : undefined;
        await findNearbyPlayers(userLocation);
      }
    };

    checkQueueStatus();
  }, [user]);

  return {
    inQueue,
    loading,
    nearbyPlayers,
    joinQueue,
    leaveQueue,
    challengePlayer,
    findNearbyPlayers
  };
};