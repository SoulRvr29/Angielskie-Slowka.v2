export const speechHandler = (word) => {
  if (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window
  ) {
    const muteSaved = localStorage.getItem("mute");
    const muteState = muteSaved ? JSON.parse(muteSaved) : false;

    if (!muteState) {
      window.speechSynthesis.cancel();
      const utterance = new window.SpeechSynthesisUtterance(word);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  }
};
