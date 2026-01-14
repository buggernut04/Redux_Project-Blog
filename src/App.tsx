import { JSX, useEffect, useState } from "react";
import { AppDispatch } from "./app/store";
import { RootState } from "./app/types";
import { useDispatch, useSelector } from "react-redux"
import { supabase } from "./supabase-client";
import { setUser } from "./authentication/authSlice";
import type { Session } from '@supabase/supabase-js';
import { Toaster } from "./style/ui/sonner";
import { LoginForm } from "./authentication/LoginForm";
import BlogPage from "./blogs/BlogPage";
import { SignUpForm } from "./authentication/RegisterForm";

export default function App(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);
  const [ isAuthenticated, setIsAuthenticated ] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<'login' | 'signup' | 'blogpage'>('login');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch(setUser(session?.user ?? null));
      setIsAuthenticated(!!session?.user);
      if (session?.user) {
        setCurrentPage('blogpage');
      }
    });

     const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session: Session | null) => {
        dispatch(setUser(session?.user ?? null));
        setIsAuthenticated(!!session?.user);
        if (session?.user) {
          setCurrentPage('blogpage');
        } else {
          setCurrentPage('login');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentPage === 'login' && (
        <>
          <LoginForm
            onSuccess={() => setCurrentPage('blogpage')} 
            onSwitchToSignup={() => setCurrentPage('signup')}
          />

          <Toaster />
        </>
      )}
      
      {currentPage === 'signup' && (
        <>
          <SignUpForm
            onSuccess={() => setCurrentPage('blogpage')} 
            onSwitchToLogin={() => setCurrentPage('login')}
          />
          <Toaster />
        </>
      )}
      
      {currentPage === 'blogpage' && isAuthenticated && <BlogPage />}
    </>
  );
}
