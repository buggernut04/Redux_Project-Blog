import { combineSlices, configureStore } from "@reduxjs/toolkit"
import { authReducer } from "../authentication/authSlice";
import { blogReducer } from "../blogs/blogSlice"; 

const rootReducer = combineSlices({ auth: authReducer, blog: blogReducer });

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ 
        serializableCheck: false 
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;