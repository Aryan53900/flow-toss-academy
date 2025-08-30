import { useState } from "react";
import { CyberButton } from "@/components/ui/cyber-button";
import rockHand from "@/assets/rock-hand.jpg";
import paperHand from "@/assets/paper-hand.jpg";
import scissorsHand from "@/assets/scissors-hand.jpg";

export type Choice = "rock" | "paper" | "scissors" | null;

interface GameArenaProps {
  onChoice: (choice: Choice) => void;
  playerChoice: Choice;
  opponentChoice: Choice;
  gameState: "selecting" | "revealing" | "result";
  result?: "win" | "lose" | "draw";
}

export const GameArena = ({ 
  onChoice, 
  playerChoice, 
  opponentChoice, 
  gameState, 
  result 
}: GameArenaProps) => {
  const [hoveredChoice, setHoveredChoice] = useState<Choice>(null);

  const getChoiceImage = (choice: Choice) => {
    switch (choice) {
      case "rock": return rockHand;
      case "paper": return paperHand;
      case "scissors": return scissorsHand;
      default: return null;
    }
  };

  const getResultText = () => {
    if (result === "win") return "VICTORY!";
    if (result === "lose") return "DEFEAT!";
    if (result === "draw") return "DRAW!";
    return "";
  };

  const getResultColor = () => {
    if (result === "win") return "text-accent";
    if (result === "lose") return "text-destructive";
    if (result === "draw") return "text-secondary";
    return "";
  };

  return (
    <div className="relative min-h-[600px] bg-gradient-to-br from-card via-background to-muted rounded-2xl border border-primary/20 overflow-hidden">
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Arena Header */}
      <div className="relative z-10 text-center pt-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          BATTLE ARENA
        </h2>
        <p className="text-muted-foreground mt-2">Choose your weapon</p>
      </div>

      {/* Game State Display */}
      {gameState === "result" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center">
            <h3 className={`text-6xl font-bold mb-4 ${getResultColor()} animate-neon-pulse`}>
              {getResultText()}
            </h3>
            {playerChoice && opponentChoice && (
              <div className="flex items-center gap-8 mb-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">YOU</p>
                  <img
                    src={getChoiceImage(playerChoice)}
                    alt={playerChoice}
                    className="w-24 h-24 object-contain animate-hand-clash"
                  />
                </div>
                <div className="text-4xl text-primary">VS</div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">OPPONENT</p>
                  <img
                    src={getChoiceImage(opponentChoice)}
                    alt={opponentChoice}
                    className="w-24 h-24 object-contain animate-hand-clash"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Choice Selection */}
      {gameState === "selecting" && (
        <div className="relative z-10 flex items-center justify-center min-h-[400px]">
          <div className="grid grid-cols-3 gap-8">
            {(["rock", "paper", "scissors"] as const).map((choice) => (
              <div key={choice} className="text-center">
                <CyberButton
                  variant={choice}
                  size="game"
                  onClick={() => onChoice(choice)}
                  onMouseEnter={() => setHoveredChoice(choice)}
                  onMouseLeave={() => setHoveredChoice(null)}
                  className="mb-4 relative group"
                >
                  <img
                    src={getChoiceImage(choice)}
                    alt={choice}
                    className={`w-16 h-16 object-contain transition-all duration-300 ${
                      hoveredChoice === choice ? "animate-cyber-glow scale-110" : ""
                    }`}
                  />
                  {hoveredChoice === choice && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                  )}
                </CyberButton>
                <p className="text-lg font-semibold uppercase tracking-wider text-foreground">
                  {choice}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revealing State */}
      {gameState === "revealing" && (
        <div className="relative z-10 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-neon-pulse">
              <div className="w-32 h-32 border-4 border-primary rounded-full border-t-transparent animate-spin mx-auto mb-6" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-2">REVEALING...</h3>
            <p className="text-muted-foreground">Calculating results on-chain</p>
          </div>
        </div>
      )}

      {/* Neon Corner Accents */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-primary/50 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-primary/50 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-primary/50 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-primary/50 rounded-br-lg" />
    </div>
  );
};