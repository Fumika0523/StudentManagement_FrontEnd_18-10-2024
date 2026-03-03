// CountryCode.js
// A custom React hook that fetches the country list and returns it
// along with a loading flag. Named with "use" prefix convention.

import { useEffect, useState } from "react";
import axios from "axios";

const FALLBACK = [
  { code: "AU", name: "Australia" },
  { code: "CA", name: "Canada" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "JP", name: "Japan" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
];

function useCountryCode() {
  const [countries, setCountries] = useState([]);
  const [countryLoading, setCountryLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    setCountryLoading(true);

    axios
      .get("https://restcountries.com/v3.1/all?fields=name,cca2")
      .then((res) => {
        if (!alive) return;
        const list = (res.data || [])
          .map((c) => ({
            code: (c.cca2 || "").toUpperCase(),
            name: c?.name?.common || "",
          }))
          .filter((c) => c.code && c.name)
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(list);
      })
      .catch(() => {
        if (alive) setCountries(FALLBACK);
      })
      .finally(() => {
        if (alive) setCountryLoading(false);
      });

    return () => { alive = false; };
  }, []);

  return { countries, countryLoading };
}

export default useCountryCode;