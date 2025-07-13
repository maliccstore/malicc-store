'use client';
// This directive marks this as a Client Component in Next.js

import { useState, useEffect } from 'react';

/**
 * Custom hook to manage and check user authentication state
 * Provides:
 * - Current authentication status
 * - Loading state while checking auth status
 */
export function useAuth() {
  // State to track if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // State to track loading status during auth check
  const [isLoading, setLoading] = useState(true);

  /**
   * useEffect hook runs once on component mount to check authentication status
   * Empty dependency array ensures this only runs once
   */
  useEffect(() => {
    /**
     * Async function to check user authentication status
     * Called immediately when the component using this hook mounts
     */
    async function checkAuth() {
      try {
        // Make API call to check authentication status
        // Replace with your actual authentication endpoint
        const response = await fetch('/api/auth/check');
        const data = await response.json();

        // Update authentication state based on API response
        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        // Log and handle any errors during auth check
        console.error('Error checking authentication:', error);

        // Default to not authenticated if there's an error
        setIsAuthenticated(false);
      } finally {
        // Always set loading to false when the check is complete
        // (whether successful or failed)
        setLoading(false);
      }
    }

    // Execute the auth check when the hook is used
    checkAuth();

    // Empty dependency array means this effect runs only once on mount
  }, []);

  // Return the authentication state and loading status
  return { isAuthenticated, isLoading };
}
