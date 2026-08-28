import { useMemo } from "react";

export const useAuthConfig = () => {
  const token = localStorage.getItem("token");

  return useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    [token]
  );
};
