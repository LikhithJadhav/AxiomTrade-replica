"use client";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTokens } from "../lib/api";
import { useDispatch } from "react-redux";
import { setTokens, setLoading, setError } from "../store/slices/tokensSlice";

/**
 * useInitialLoad
 * - Uses react-query (v5) object form of useQuery
 * - Dispatches into Redux once the fetch completes
 */
export function useInitialLoad() {
  const dispatch = useDispatch();

  // v5 object syntax: pass queryKey + queryFn inside a single object
  const { data, error, isLoading } = useQuery({
    queryKey: ["tokens"],
    queryFn: fetchTokens,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    // mark loading while query is in-flight
    if (isLoading) dispatch(setLoading());
  }, [isLoading, dispatch]);

  useEffect(() => {
    if (data) {
      dispatch(setTokens(data as any));
    }
    if (error) {
      dispatch(setError(String(error)));
    }
  }, [data, error, dispatch]);

  return { isLoading, error };
}