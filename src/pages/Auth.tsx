import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { CyberButton } from '@/components/ui/cyber-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (!error) {
          navigate('/');
        }
      } else {
        const { error } = await signUp(email, password, username);
        // Don't navigate on signup, user needs to confirm email
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:100px_100px] animate-pulse" />
      </div>

      {/* Floating Neon Particles */}
      <div className="absolute top-1/4 left-10 w-2 h-2 bg-primary rounded-full animate-ping opacity-50" />
      <div className="absolute top-1/3 right-20 w-3 h-3 bg-accent rounded-full animate-pulse opacity-30" />
      <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-secondary rounded-full animate-ping opacity-40" />

      <div className="relative z-10 w-full max-w-md px-4">
        <Card className="bg-card/80 border-primary/30 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              {isLogin ? 'SIGN IN' : 'JOIN THE ARENA'}
            </CardTitle>
            <p className="text-muted-foreground">
              {isLogin ? 'Enter the cyberpunk arena' : 'Create your warrior profile'}
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-primary">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required={!isLogin}
                    className="bg-background/50 border-primary/20"
                    placeholder="Choose your warrior name"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-primary">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50 border-primary/20"
                  placeholder="your@email.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-primary">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background/50 border-primary/20"
                  placeholder="Enter your password"
                />
              </div>
              
              <CyberButton
                type="submit"
                variant="cyber"
                size="lg"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'PROCESSING...' : (isLogin ? '🎮 ENTER ARENA' : '⚡ CREATE WARRIOR')}
              </CyberButton>
            </form>
            
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-accent hover:text-accent/80 text-sm"
              >
                {isLogin 
                  ? "New warrior? Create your profile" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};