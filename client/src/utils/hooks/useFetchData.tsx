import { useEffect, useState } from "react";

export default function useFetchData<T = any>(url: string, headers: object) : T | null {
    const [data, setData] = useState<T | null>(null);
    useEffect(() => {
        if (url) {
            let ignore = false;
            fetch(url, headers)
                .then(response => response.json())
                .then(json => {
                    if (!ignore) {
                        setData(json);
                    }
                });
            return () => {
                ignore = true;
            }
        }
    }, [url]);
    return data;
}