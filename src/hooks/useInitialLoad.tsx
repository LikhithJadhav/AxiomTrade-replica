// src/hooks/useInitialLoad.tsx
"use client";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTokens } from "../lib/api";
import { useDispatch } from "react-redux";
import { setTokens, setLoading, setError } from "../store/slices/tokensSlice";

export function useInitialLoad() {
  const dispatch = useDispatch();
  const { data, error, isLoading } = useQuery(["tokens"], fetchTokens, { refetchOnWindowFocus: false });
  useEffect(() => {
    dispatch(setLoading());
  }, [dispatch]);
  useEffect(() => {
    if (data) dispatch(setTokens(data as any));
    if (error) dispatch(setError(String(error)));
  }, [data, error, dispatch]);
  return { isLoading, error };
}
