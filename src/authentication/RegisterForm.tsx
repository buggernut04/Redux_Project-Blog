import { JSX, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Button } from "../style/ui/button";
import { Input } from "../style/ui/input";
import { Label } from "../style/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../style/ui/card";
import { AppDispatch } from "../app/store";
import { RootState } from "../app/types";
import { clearError, setError, setLoading } from "./authSlice";
import { supabase } from "../supabase-client";

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export function SignUpForm({ onSuccess, onSwitchToLogin }: RegisterFormProps): JSX.Element {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.auth);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent): Promise< void > => {
        e.preventDefault();
        dispatch(clearError());

        if (password !== confirmPassword) {
            dispatch(setError("Passwords do not match"));
            return;
        }

        if (password.length < 8) {
            dispatch(setError("Password must be at least 8 characters"));
            return;
        }

        dispatch(setLoading(true));

        try {
            // Sign up the user with Supabase
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });
            if (error) throw error;

            if (data?.user?.identities?.length === 0) {
                throw new Error('User already exists');
            }
            
            if (data.user) {
              // Insert into the 'users' table
              const { error: insertError } = await supabase
                .from('user')
                .insert({
                  user_id: data.user.id, 
                  name,
                  email,
                });

              if (insertError) {
                console.error('Error inserting user data:', insertError);
                // Optionally, you could delete the auth user if insert fails, but for now, just log
              }
                
              onSuccess();
            }

            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
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
          <CardTitle className="text-3xl font-bold">Create an account</CardTitle>
          <CardDescription>
            Enter your information to get started
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
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
             {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                    dispatch(clearError());
                    onSwitchToLogin();
                }}
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}