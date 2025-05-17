export const speechHandler = (text, play, onEndCallback) => {
  if (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window
  ) {
    const muteSaved = localStorage.getItem("mute");
    const muteState = muteSaved ? JSON.parse(muteSaved) : false;

    if (!muteState) {
      window.speechSynthesis.cancel();
      if (play) return;
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.onend = () => {
        if (onEndCallback) onEndCallback();
      };
      window.speechSynthesis.speak(utterance);
    }
  }
};
