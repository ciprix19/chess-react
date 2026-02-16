import { useEffect, useState } from "react";

const MS_CONVERSION = 60 * 1000

export default function Timer({ timerValueInMinutes } : { timerValueInMinutes : number }) {
    // const [time, setTime] = useState(timerValueInMinutes * MS_CONVERSION);
    const [time, setTime] = useState(timerValueInMinutes * MS_CONVERSION);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(prev => {
                if(prev <= 1000) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1000;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const minutes = Math.floor((time / 1000 / 60) % 60);
    const seconds = Math.floor((time / 1000) % 60);

    return (
        <div className='timer'>
            {minutes < 10 ? `0${minutes}` : minutes} : {seconds < 10 ? `0${seconds}` : seconds}
        </div>
    );
}
