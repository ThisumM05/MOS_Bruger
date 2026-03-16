import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API Base URL - Adjust port if needed
const API_URL = 'http://localhost:8000/api/users/users/';

// Helper to get initial state from localStorage
const storedToken = localStorage.getItem('token');
const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

// Thunks
export const login = createAsyncThunk(
    'user/login',
    async ({ email, password, role }, { rejectWithValue }) => {
        try {
            // Basic POST request
            // Ensure your backend expects 'email', 'password' and 'role'
            const response = await axios.post(`${API_URL}login/`, { email, password, role });
            return response.data;
        } catch (error) {
            // Error handling
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.detail || error.response.data.message || 'Login failed');
            }
            return rejectWithValue(error.message);
        }
    }
);

export const register = createAsyncThunk(
    'user/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}register/`, userData);
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.detail || error.response.data.message || 'Registration failed');
            }
            return rejectWithValue(error.message);
        }
    }
);

export const logout = createAsyncThunk(
    'user/logout',
    async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return null;
    }
);


const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: storedUser,
        token: storedToken,
        isAuthenticated: !!storedToken,
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login Cases
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user || { username: action.meta.arg.username };
                state.token = action.payload.access || action.payload.token;

                if (state.token) {
                    localStorage.setItem('token', state.token);
                }
                if (state.user) {
                    localStorage.setItem('user', JSON.stringify(state.user));
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Register Cases
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                // If register automatically logs in:
                if (action.payload.access || action.payload.token) {
                    state.isAuthenticated = true;
                    state.token = action.payload.access || action.payload.token;
                    state.user = action.payload.user;
                    localStorage.setItem('token', state.token);
                    localStorage.setItem('user', JSON.stringify(state.user));
                }
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Logout Cases
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            });
    },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
