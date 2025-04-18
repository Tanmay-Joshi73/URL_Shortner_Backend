"use client"

import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"
import axios from "axios"
interface JwtPayload {
  exp: number
  [key: string]: any
}

/**
 * Check if the user is authenticated by verifying the JWT token in cookies
 * @returns {Promise<boolean>} True if authenticated, false otherwise
 */
export const checkAuth = async (): Promise<any> => {
  try {
    const res = await axios.get("http://localhost:8000/api/CookieCheck", {
      withCredentials: true, // 👈 important to send cookies
    })
    return res;
    
  } catch (error) {
    console.error("Auth check error:", error)
    return false
  }

}

/**
 * Logout the user by removing the JWT cookie
 */
export const logout = (): void => {
  Cookies.remove("jwt")
  window.location.href = "/login"
}
