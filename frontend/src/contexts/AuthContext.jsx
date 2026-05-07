// import axios from "axios";
// import httpStatus from "http-status";
// import { createContext, useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export const AuthContext = createContext({});

// const client = axios.create({
//     baseURL: "http://localhost:8000/api/v1/users",
// });

// export const AuthProvider = ({ children }) => {
//     const authContext = useContext(AuthContext);
//     const [userData, setUserData] = useState(authContext);
//     const router = useNavigate();

//     const handleRegister = async (name, username, password) => {
//         try {
//             const request = await client.post("/register", {
//                 name: name,
//                 username: username,
//                 password: password
//             });

//             if (request.status === httpStatus.CREATED) {
//                 return request.data.message;
//             }
//         } catch (err) {
//             console.error("Register error:", err);
//             throw err;
//         }
//     };

//     const handleLogin = async (username, password) => {
//         try {
//             const request = await client.post("/login", {
//                 username: username,
//                 password: password
//             });

//             console.log("✅ Login successful:", request.data);

//             if (request.status === httpStatus.OK) {
//                 localStorage.setItem("token", request.data.token);
//                 router("/home");
//             }
//         } catch (err) {
//             console.error("❌ Login error:", err);
//             throw err;
//         }
//     };

//     const getHistoryOfUser = async () => {
//         try {
//             const token = localStorage.getItem("token");
            
//             if (!token) {
//                 throw new Error("No token found. Please login again.");
//             }

//             console.log("📜 Fetching history with token:", token);

//             // POST request to match backend route
//             const request = await client.post("/get_all_activity", {
//                 token: token
//             });

//             console.log("✅ History response:", request.data);

//             // Backend returns array directly
//             return request.data;
//         } catch (err) {
//             console.error("❌ Error in getHistoryOfUser:", err);
//             throw err;
//         }
//     };

//     const addToUserHistory = async (meetingCode) => {
//         try {
//             const token = localStorage.getItem("token");
            
//             if (!token) {
//                 throw new Error("No token found. Please login again.");
//             }

//             console.log("➕ Adding meeting to history:", meetingCode);

//             const request = await client.post("/add_to_activity", {
//                 token: token,
//                 meeting_code: meetingCode
//             });

//             console.log("✅ Added to history:", request.data);
//             return request;
//         } catch (e) {
//             console.error("❌ Error adding to history:", e);
//             throw e;
//         }
//     };

//     const data = {
//         userData,
//         setUserData,
//         addToUserHistory,
//         getHistoryOfUser,
//         handleRegister,
//         handleLogin
//     };

//     return (
//         <AuthContext.Provider value={data}>
//             {children}
//         </AuthContext.Provider>
//     );
// };



// src/contexts/AuthContext.jsx (Modified)

import axios from "axios";
import httpStatus from "http-status";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
export const AuthContext = createContext({});

const client = axios.create({
    baseURL: "http://localhost:8001/api/v1/users",
});

export const AuthProvider = ({ children }) => {
    // 1. Initial user state
    const router = useNavigate();

    // Initialize user synchronously from localStorage to avoid route protection race
    const tokenFromStorage = localStorage.getItem("token");
    const [user, setUser] = useState(() => {
        if (tokenFromStorage) return { token: tokenFromStorage, username: 'user' };
        return null;
    });

    // Function to log out
    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        router("/auth"); // Redirect to login page on logout
    };

    const handleRegister = async (name, username, password) => {
        // ... (rest of the handleRegister logic remains the same)
        try {
            const request = await client.post("/register", {
                name: name,
                username: username,
                password: password
            });

            if (request.status === httpStatus.CREATED) {
                return request.data.message;
            }
        } catch (err) {
            console.error("Register error:", err);
            throw err;
        }
    };

    const handleLogin = async (username, password) => {
        try {
            const request = await client.post("/login", {
                username: username,
                password: password
            });

            console.log("✅ Login successful:", request.data);

            if (request.status === httpStatus.OK) {
                const token = request.data.token;
                localStorage.setItem("token", token);
                
                // Set the user state upon successful login
                setUser({ token: token, username: username }); 
                
                router("/home");
            }
        } catch (err) {
            console.error("❌ Login error:", err);
            throw err;
        }
    };
    
    // ... (keep getHistoryOfUser and addToUserHistory functions)
    const getHistoryOfUser = async () => {
        // ... (rest of the function remains the same)
        try {
            const token = localStorage.getItem("token");
            
            if (!token) {
                throw new Error("No token found. Please login again.");
            }

            console.log("📜 Fetching history with token:", token);

            // POST request to match backend route
            const request = await client.post("/get_all_activity", {
                token: token
            });

            console.log("✅ History response:", request.data);

            // Backend returns array directly
            return request.data;
        } catch (err) {
            console.error("❌ Error in getHistoryOfUser:", err);
            throw err;
        }
    };

    const addToUserHistory = async (meetingCode) => {
        // ... (rest of the function remains the same)
        try {
            const token = localStorage.getItem("token");
            
            if (!token) {
                throw new Error("No token found. Please login again.");
            }

            console.log("➕ Adding meeting to history:", meetingCode);

            const request = await client.post("/add_to_activity", {
                token: token,
                meeting_code: meetingCode
            });

            console.log("✅ Added to history:", request.data);
            return request;
        } catch (e) {
            console.error("❌ Error adding to history:", e);
            throw e;
        }
    };

    // 2. The most important addition: a simple check for logged-in status
    const isLoggedIn = !!user;

    const data = {
        user, // Changed from userData
        setUser, // Changed from setUserData
        isLoggedIn, // Expose the login status
        handleLogout, // Expose the logout function
        addToUserHistory,
        getHistoryOfUser,
        handleRegister,
        handleLogin
    };

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    );
};