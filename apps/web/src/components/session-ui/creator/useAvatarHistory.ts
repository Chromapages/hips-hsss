"use client";

import { useReducer } from "react";
import type { Avatar2DConfig } from "@hips/types";
import { historyReducer } from "./creator-constants";

export function useAvatarHistory(initialConfig: Avatar2DConfig) {
  const [state, dispatch] = useReducer(historyReducer, {
    past: [],
    present: initialConfig,
    future: [],
  });

  const undo = () => dispatch({ type: "UNDO" });
  const redo = () => dispatch({ type: "REDO" });
  const set = (config: Avatar2DConfig) => dispatch({ type: "SET", config });
  const reset = (config: Avatar2DConfig) => dispatch({ type: "RESET", config });

  return {
    state,
    undo,
    redo,
    set,
    reset,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
}
export type UseAvatarHistoryReturn = ReturnType<typeof useAvatarHistory>;
