"use client"

import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"

interface JwtPayload {
  exp: number
  [key: string]: any
}

/**
 * Check if the user is authenticated by verifying the JWT token in cookies
 * @returns {Promise<boolean>} True if authenticated, false otherwise
 */
export const checkAuth = async (): Promise<boolean> => {
  try {
    // Get the JWT token from cookies
    const token = Cookies.get("jwt") // Adjust the cookie name based on your backend implementation

    if (!token) {
      return false
    }

    // Decode the token to check expiration
    const decoded = jwtDecode<JwtPayload>(token)

    // Check if token is expired
    const currentTime = Date.now() / 1000
    if (decoded.exp < currentTime) {
      // Token is expired
      Cookies.remove("jwt")
      return false
    }

    return true
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
