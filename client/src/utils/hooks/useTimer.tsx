import { useEffect, useRef, useState } from "react";

const TIME_IN_MS_TO_COUNTDOWN = 60 * 10 * 1000;
const INTERVAL_IN_MS = 100;

export default function useTimer(initialTime: number) {
    const [time, setTime] = useState(initialTime);

    useEffect(() => {

        const countDownUntilZero = () => {
            setTime(prevTime => {
                if (prevTime === 0) {
                    clearInterval(interval);
                    return 0;
                }
                else return prevTime - INTERVAL_IN_MS;
            });
        }

        let interval = setInterval(countDownUntilZero, INTERVAL_IN_MS);

        return () => clearInterval(interval);
    }, []);

    return (time / 1000).toFixed(1);
}
