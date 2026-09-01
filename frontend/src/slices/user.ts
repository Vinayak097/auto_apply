import { createSlice } from "@reduxjs/toolkit";

interface User {
  id: string;
  name?: string;
  email: string;
}
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};
export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      console.log("inside the login ", action.payload);
      let obj = {
        id: action.payload._id,
        email: action.payload.email,
      };
      state.user = obj;
      return state;
    },
    register: (state, action) => {
      let obj = {
        id: action.payload._id,
        email: action.payload.email,
        name: action.payload?.name || "",
      };
      state.user = obj;
      return state;
    },
    logout: (state, action) => {
      state.user = null;
      return state;
    },
  },
});

export const { login, logout, register } = userSlice.actions;
export default userSlice.reducer;
