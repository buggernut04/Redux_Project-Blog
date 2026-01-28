import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "../app/types"
import { User } from "@supabase/supabase-js";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: false,
        error: null,
    } as AuthState,
    reducers: {
        setUser(state, action: PayloadAction<User | null>) {
            state.user = action.payload;
            state.loading = false;
            state.error = null;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
            state.loading = false;
        },
        clearError: (state) => {
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.error = null;
        }
    }
});

export const { setUser, setLoading, setError, clearError, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;