import {
  useEffect,
  useState,
} from "react";

import axios from "axios";


// ========================================
// COUNTRY TYPE
// ========================================

/*
 * TypeScript:
 * This is the simplified country shape used
 * throughout our forms.
 *
 * Example:
 *
 * {
 *   code: "JP",
 *   name: "Japan"
 * }
 */
export interface CountryOption {
  code: string;

  name: string;
}


// ========================================
// REST COUNTRIES API TYPE
// ========================================

/*
 * The REST Countries API returns much more data,
 * but this hook only requests:
 *
 * cca2
 * name.common
 *
 * Therefore we only type the fields we actually use.
 */
interface RestCountry {
  cca2?: string;

  name?: {
    common?: string;
  };
}


// ========================================
// HOOK RETURN TYPE
// ========================================

interface UseCountryCodeResult {
  countries:
    CountryOption[];

  countryLoading:
    boolean;
}


// ========================================
// FALLBACK COUNTRY LIST
// ========================================

/*
 * If the external API request fails,
 * the form can still show these countries.
 */
const FALLBACK:
  CountryOption[] = [
  {
    code: "AU",
    name: "Australia",
  },

  {
    code: "CA",
    name: "Canada",
  },

  {
    code: "FR",
    name: "France",
  },

  {
    code: "DE",
    name: "Germany",
  },

  {
    code: "JP",
    name: "Japan",
  },

  {
    code: "GB",
    name: "United Kingdom",
  },

  {
    code: "US",
    name: "United States",
  },
];


// ========================================
// COUNTRY HOOK
// ========================================

/*
 * Custom React hook used by Student forms
 * and signup forms.
 *
 * It:
 *
 * 1. Fetches countries from REST Countries.
 * 2. Converts them into CountryOption objects.
 * 3. Sorts them alphabetically.
 * 4. Falls back to FALLBACK if the API fails.
 */
const useCountryCode =
  (): UseCountryCodeResult => {
    // ========================================
    // STATE
    // ========================================

    const [
      countries,
      setCountries,
    ] =
      useState<
        CountryOption[]
      >([]);


    const [
      countryLoading,
      setCountryLoading,
    ] =
      useState<boolean>(
        false
      );


    // ========================================
    // FETCH COUNTRIES
    // ========================================

    useEffect(() => {
      /*
       * Prevent state updates after the component
       * using this hook has been unmounted.
       */
      let alive =
        true;


      setCountryLoading(
        true
      );


      axios
        .get<RestCountry[]>(
          "https://restcountries.com/v3.1/all?fields=name,cca2"
        )

        .then(
          (response) => {
            if (!alive) {
              return;
            }


            /*
             * Convert the API response into the
             * simpler structure our forms need.
             */
            const list:
              CountryOption[] =
              (
                response.data ??
                []
              )
                .map(
                  (
                    country
                  ): CountryOption => ({
                    code:
                      (
                        country.cca2 ??
                        ""
                      ).toUpperCase(),

                    name:
                      country
                        .name
                        ?.common ??
                      "",
                  })
                )

                /*
                 * Remove incomplete API records.
                 */
                .filter(
                  (
                    country
                  ) =>
                    Boolean(
                      country.code &&
                      country.name
                    )
                )

                /*
                 * Display countries alphabetically.
                 */
                .sort(
                  (
                    first,
                    second
                  ) =>
                    first.name.localeCompare(
                      second.name
                    )
                );


            setCountries(
              list
            );
          }
        )

        .catch(
          (
            error:
              unknown
          ) => {
            /*
             * The original code silently used
             * the fallback list.
             *
             * We keep that behaviour, but logging
             * the error is useful during development.
             */
            console.error(
              "Failed to load countries:",
              error
            );


            if (alive) {
              setCountries(
                FALLBACK
              );
            }
          }
        )

        .finally(() => {
          if (alive) {
            setCountryLoading(
              false
            );
          }
        });


      // ========================================
      // CLEANUP
      // ========================================

      return () => {
        alive =
          false;
      };
    }, []);


    return {
      countries,
      countryLoading,
    };
  };

export default useCountryCode;