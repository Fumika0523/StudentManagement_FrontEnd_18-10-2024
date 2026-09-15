import { useMemo } from "react";

/*
  AxiosRequestConfig is the official Axios type for
  configuration objects passed to:

    axios.get(url, config)
    axios.post(url, data, config)
    axios.delete(url, config)

  We use `import type` because this is only needed
  by TypeScript and does not need to exist at runtime.
*/
import type { AxiosRequestConfig } from "axios";


/*
  This custom hook returns an AxiosRequestConfig object.

  By explicitly writing:

    (): AxiosRequestConfig

  TypeScript now knows exactly what this function returns.
*/
export const useAuthConfig = (): AxiosRequestConfig => {
  /*
    localStorage.getItem() returns:

      string | null

    because the token might not exist in localStorage.
  */
  const token = localStorage.getItem("token");


  /*
    useMemo prevents the config object from being recreated
    unnecessarily on every render.

    We also tell useMemo what kind of object it should return:

      useMemo<AxiosRequestConfig>
  */
  return useMemo<AxiosRequestConfig>(
    () => ({
      headers: {
        /*
          Authorization header sent to protected backend routes.

          Example:

            Authorization: Bearer eyJhbGci...

          If token is null, this currently becomes:

            Bearer null

          That matches your EXISTING behaviour.

          Later we can improve authentication handling separately,
          but we should not change application behaviour during
          the TypeScript migration unless necessary.
        */
        Authorization: `Bearer ${token}`,
      },
    }),

    /*
      Recreate the config only when the token changes.
    */
    [token]
  );
};