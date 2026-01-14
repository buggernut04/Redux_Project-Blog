import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "../app/types"
const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: false,
        error: null,
    } as AuthState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
            state.loading = false;
            state.error = null;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
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