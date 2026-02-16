import { useCallback } from "react";
import { captureSound, castleSound, gameEndSound, gameStartSound, moveCheckSound, moveSelfSound, promoteSound } from "../../assets/audio/audioVariables";

export function useGameAudio() {
    const playMove = useCallback(() => {
        moveSelfSound.play();
    }, []);
    const playCapture = useCallback(() => {
        captureSound.play();
    }, []);
    const playCheck = useCallback(() => {
        moveCheckSound.play();
    }, []);
    const playCastle = useCallback(() => {
        castleSound.play();
    }, []);
    const playPromote = useCallback(() => {
        promoteSound.play();
    }, []);
    const playGameStart = useCallback(() => {
        gameStartSound.play();
    }, []);
    const playGameEnd = useCallback(() => {
        gameEndSound.play();
    }, []);

    return {
        playMove,
        playCapture,
        playCheck,
        playCastle,
        playPromote,
        playGameEnd
    }
}
