import { useState } from "react";
import { GameLobby } from "@/components/GameLobby";
import { GameArena, type Choice } from "@/components/GameArena";
import { CyberButton } from "@/components/ui/cyber-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type GameState = "lobby" | "game" | "leaderboard" | "tutorial";
type MatchState = "selecting" | "revealing" | "result";
type Result = "win" | "lose" | "draw";

const Index = () => {
  const [currentView, setCurrentView] = useState<GameState>("lobby");
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  const [opponentChoice, setOpponentChoice] = useState<Choice>(null);
  const [matchState, setMatchState] = useState<MatchState>("selecting");
  const [result, setResult] = useState<Result | undefined>();

  const handleChoice = (choice: Choice) => {
    setPlayerChoice(choice);
    setMatchState("revealing");

    // Simulate opponent choice and game resolution
    setTimeout(() => {
      const choices: Choice[] = ["rock", "paper", "scissors"];
      const opponentMove = choices[Math.floor(Math.random() * choices.length)];
      setOpponentChoice(opponentMove);

      // Determine result
      let gameResult: Result;
      if (choice === opponentMove) {
        gameResult = "draw";
      } else if (
        (choice === "rock" && opponentMove === "scissors") ||
        (choice === "paper" && opponentMove === "rock") ||
        (choice === "scissors" && opponentMove === "paper")
      ) {
        gameResult = "win";
      } else {
        gameResult = "lose";
      }

      setResult(gameResult);
      setMatchState("result");

      // Reset game after 4 seconds
      setTimeout(() => {
        setPlayerChoice(null);
        setOpponentChoice(null);
        setMatchState("selecting");
        setResult(undefined);
      }, 4000);
    }, 2000);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setOpponentChoice(null);
    setMatchState("selecting");
    setResult(undefined);
  };

  if (currentView === "game") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-4xl">
          {/* Game Header */}
          <div className="flex justify-between items-center mb-8">
            <CyberButton
              variant="neon"
              onClick={() => {
                setCurrentView("lobby");
                resetGame();
              }}
            >
              ← BACK TO LOBBY
            </CyberButton>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-primary">MATCH IN PROGRESS</h1>
              <p className="text-sm text-muted-foreground">Wager: 0.1 FLOW</p>
            </div>
            
            <CyberButton variant="neon" onClick={resetGame}>
              🔄 NEW ROUND
            </CyberButton>
          </div>

          <GameArena
            onChoice={handleChoice}
            playerChoice={playerChoice}
            opponentChoice={opponentChoice}
            gameState={matchState}
            result={result}
          />
        </div>
      </div>
    );
  }

  if (currentView === "leaderboard") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <CyberButton
              variant="neon"
              onClick={() => setCurrentView("lobby")}
            >
              ← BACK TO LOBBY
            </CyberButton>
            <h1 className="text-3xl font-bold text-primary">LEADERBOARD</h1>
            <div />
          </div>

          <div className="grid gap-6">
            <Card className="bg-card/50 border-primary/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-accent">🏆 Top Champions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { rank: 1, name: "CyberSamurai", wins: 847, tokens: "125.4 FLOW", winRate: "89%" },
                    { rank: 2, name: "NeonNinja", wins: 723, tokens: "98.7 FLOW", winRate: "85%" },
                    { rank: 3, name: "FlowMaster", wins: 692, tokens: "87.2 FLOW", winRate: "82%" },
                    { rank: 4, name: "PixelWarrior", wins: 634, tokens: "76.8 FLOW", winRate: "79%" },
                    { rank: 5, name: "CodeSlinger", wins: 587, tokens: "65.3 FLOW", winRate: "75%" },
                  ].map((player) => (
                    <div key={player.rank} className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-primary/10 hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className={`text-2xl font-bold ${
                          player.rank === 1 ? "text-accent" :
                          player.rank === 2 ? "text-secondary" :
                          player.rank === 3 ? "text-neon-purple" :
                          "text-muted-foreground"
                        }`}>
                          #{player.rank}
                        </span>
                        <div>
                          <h3 className="font-semibold text-foreground">{player.name}</h3>
                          <p className="text-sm text-muted-foreground">{player.wins} wins • {player.winRate} win rate</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-accent">{player.tokens}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === "tutorial") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <CyberButton
              variant="neon"
              onClick={() => setCurrentView("lobby")}
            >
              ← BACK TO LOBBY
            </CyberButton>
            <h1 className="text-3xl font-bold text-primary">TUTORIAL</h1>
            <div />
          </div>

          <div className="grid gap-6">
            <Card className="bg-card/50 border-primary/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-accent">🎮 How to Play</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Basic Rules</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Rock crushes Scissors</li>
                    <li>• Paper covers Rock</li>
                    <li>• Scissors cuts Paper</li>
                    <li>• Same choices result in a draw</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Blockchain Features</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Commit-reveal scheme ensures fair play</li>
                    <li>• Smart contracts handle wagers automatically</li>
                    <li>• Provably random number generation</li>
                    <li>• All matches recorded on FLOW blockchain</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Probability Lessons</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Each choice has a 33.33% win probability</li>
                    <li>• Random strategy yields 50% win rate (including draws)</li>
                    <li>• Pattern recognition can improve odds against predictable players</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-accent/10 to-primary/10 border-accent/30">
              <CardHeader>
                <CardTitle className="text-accent">🧠 Strategy Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-background/30">
                    <div className="text-2xl mb-2">🗿</div>
                    <h4 className="font-semibold text-neon-blue">Rock Strategy</h4>
                    <p className="text-sm text-muted-foreground mt-2">Most common first choice. Beats scissors but loses to paper.</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-background/30">
                    <div className="text-2xl mb-2">📄</div>
                    <h4 className="font-semibold text-neon-green">Paper Strategy</h4>
                    <p className="text-sm text-muted-foreground mt-2">Counter-intuitive choice. Often unexpected in crucial moments.</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-background/30">
                    <div className="text-2xl mb-2">✂️</div>
                    <h4 className="font-semibold text-neon-purple">Scissors Strategy</h4>
                    <p className="text-sm text-muted-foreground mt-2">Aggressive choice. Effective against paper strategies.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <GameLobby
      onStartGame={() => setCurrentView("game")}
      onViewLeaderboard={() => setCurrentView("leaderboard")}
      onViewTutorial={() => setCurrentView("tutorial")}
    />
  );
};

export default Index;