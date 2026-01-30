import { useEffect, useRef, useState } from "react";


export default function useTimer(initialTime: number) {
    const [time, setTime] = useState(initialTime);

    useEffect(() => {
        const interval = setInterval(() => setTime(t => t - 1), 1000);
        return () => clearInterval(interval);
    })

    return { time };
}
