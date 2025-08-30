import { useState, useEffect } from "react";
import { CyberButton } from "@/components/ui/cyber-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "@/hooks/useLocation";
import { useMatchmaking } from "@/hooks/useMatchmaking";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface GameLobbyProps {
  onStartGame: () => void;
  onViewLeaderboard: () => void;
  onViewTutorial: () => void;
}

export const GameLobby = ({ onStartGame, onViewLeaderboard, onViewTutorial }: GameLobbyProps) => {
  const [userStats, setUserStats] = useState({ wins: 0, losses: 0, totalMatches: 0 });
  const { user, signOut } = useAuth();
  const { location, loading: locationLoading, requestLocation } = useLocation();
  const { inQueue, loading: matchmakingLoading, nearbyPlayers, joinQueue, leaveQueue, challengePlayer } = useMatchmaking();
  const navigate = useNavigate();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  // Fetch user stats
  useEffect(() => {
    if (user) {
      // TODO: Fetch real user stats from profiles table
      setUserStats({ wins: 23, losses: 7, totalMatches: 30 });
    }
  }, [user]);

  const handleQuickMatch = async () => {
    if (!location) {
      await requestLocation();
    }
    await joinQueue(0, location ? { lat: location.latitude, lng: location.longitude } : undefined);
  };

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:100px_100px] animate-pulse" />
      </div>

      {/* Header */}
      <div className="relative z-10 container mx-auto px-4 pt-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              RPS ARENA
            </h1>
            <p className="text-muted-foreground text-lg mt-2">On-Chain Rock Paper Scissors</p>
          </div>
          
          <div className="flex items-center gap-4">
            {location && (
              <Badge variant="outline" className="border-accent text-accent">
                📍 {location.city || 'Location Found'}
              </Badge>
            )}
            <CyberButton
              variant="neon"
              size="lg"
              onClick={signOut}
            >
              ⚡ SIGN OUT
            </CyberButton>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Game Stats */}
          <Card className="bg-card/50 border-primary/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-primary">Game Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Matches</span>
                <span className="text-accent font-bold">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Players</span>
                <span className="text-accent font-bold">89</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Prize Pool</span>
                <span className="text-accent font-bold">15.8 FLOW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Your Wins</span>
                <span className="text-accent font-bold">{userStats.wins}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Your Losses</span>
                <span className="text-destructive font-bold">{userStats.losses}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Play */}
          <Card className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 border-primary/30 backdrop-blur-sm animate-neon-pulse lg:col-span-2">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-primary">Ready for Battle?</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-muted-foreground">
                Challenge opponents in provably fair Rock Paper Scissors battles
              </p>
              
              {!inQueue ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CyberButton
                    variant="cyber"
                    size="xl"
                    onClick={handleQuickMatch}
                    disabled={matchmakingLoading}
                    className="w-full"
                  >
                    {matchmakingLoading ? "⏳ SEARCHING..." : "🎮 QUICK MATCH"}
                  </CyberButton>
                  <CyberButton
                    variant="neon"
                    size="xl"
                    onClick={() => !location ? requestLocation() : null}
                    disabled={locationLoading}
                    className="w-full"
                  >
                    {locationLoading ? "📍 LOCATING..." : "📍 ENABLE LOCATION"}
                  </CyberButton>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-accent">🔍 Searching for opponents...</div>
                  <CyberButton
                    variant="defeat"
                    size="lg"
                    onClick={leaveQueue}
                    disabled={matchmakingLoading}
                    className="w-full"
                  >
                    ❌ LEAVE QUEUE
                  </CyberButton>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <CyberButton
            variant="neon"
            size="lg"
            onClick={onViewLeaderboard}
            className="w-full"
          >
            🏆 LEADERBOARD
          </CyberButton>
          
          <CyberButton
            variant="neon"
            size="lg"
            onClick={onViewTutorial}
            className="w-full"
          >
            📚 TUTORIAL
          </CyberButton>
          
          <CyberButton
            variant="neon"
            size="lg"
            onClick={() => {}}
            className="w-full"
          >
            📊 STATISTICS
          </CyberButton>
        </div>

        {/* Nearby Players / Recent Matches */}
        <Card className="mt-12 bg-card/30 border-primary/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-primary">
              {nearbyPlayers.length > 0 ? "Nearby Players" : "Recent Matches"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {nearbyPlayers.length > 0 ? (
                nearbyPlayers.map((player, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-primary/10">
                    <div className="flex items-center gap-3">
                      <span className="text-foreground font-medium">{player.username}</span>
                      <span className="text-sm text-muted-foreground">{player.location_city}</span>
                      {player.distance && (
                        <Badge variant="outline" className="text-xs">
                          {player.distance.toFixed(1)}km away
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-accent">
                        {player.wager_amount > 0 ? `${player.wager_amount} FLOW` : 'Free'}
                      </span>
                      <CyberButton
                        variant="neon"
                        size="sm"
                        onClick={() => challengePlayer(player.user_id, player.wager_amount)}
                      >
                        CHALLENGE
                      </CyberButton>
                    </div>
                  </div>
                ))
              ) : (
                [
                  { player: "CyberSamurai", result: "WIN", move: "Rock vs Scissors", time: "2m ago" },
                  { player: "NeonNinja", result: "DRAW", move: "Paper vs Paper", time: "5m ago" },
                  { player: "FlowMaster", result: "LOSS", move: "Scissors vs Rock", time: "8m ago" },
                ].map((match, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-primary/10">
                    <div className="flex items-center gap-3">
                      <span className="text-foreground font-medium">{match.player}</span>
                      <span className="text-sm text-muted-foreground">{match.move}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold ${
                        match.result === "WIN" ? "text-accent" : 
                        match.result === "LOSS" ? "text-destructive" : 
                        "text-secondary"
                      }`}>
                        {match.result}
                      </span>
                      <span className="text-xs text-muted-foreground">{match.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Neon Particles */}
      <div className="absolute top-1/4 left-10 w-2 h-2 bg-primary rounded-full animate-ping opacity-50" />
      <div className="absolute top-1/3 right-20 w-3 h-3 bg-accent rounded-full animate-pulse opacity-30" />
      <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-secondary rounded-full animate-ping opacity-40" />
    </div>
  );
};