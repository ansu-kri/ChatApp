import { createSlice } from "@reduxjs/toolkit";
import { LogOut } from "lucide-react";

const initialState = {
    user: null, 
    token: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action)=>{
            state.user = action.payload.user;
            state.token= action.payload.token;
        },
        Logout: (state) => {
            state.user = null;
            state.token = null;
        }
    }
})

export const {setCredentials, logout} = authSlice.actions

export default authSlice.reducer;