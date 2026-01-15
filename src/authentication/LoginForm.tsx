import { JSX, useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "../style/ui/button";
import { Input } from "../style/ui/input";
import { Label } from "../style/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../style/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../app/store";
import { RootState } from "../app/types";
import { clearError, setError, setLoading } from "./authSlice";
import { supabase } from "../supabase-client";

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToSignup: () => void;
}

export function LoginForm({ onSuccess, onSwitchToSignup }: LoginFormProps): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [ isLogin, setIsLogin ] = useState<boolean>(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      if (data.user) {
        onSuccess();
      }

      setEmail("");
      setPassword("");
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        dispatch(setError(errorMessage));
    } finally {
        dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold">Welcome</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button onClick={handleSubmit} 
            disabled={loading} type="submit" className="w-full">
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  dispatch(clearError());
                  onSwitchToSignup();
                }}
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}