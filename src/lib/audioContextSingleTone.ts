

export function getAudioContext() {
  let audioContext:AudioContext;

  return function () {
    if (!audioContext) {
      audioContext = new AudioContext();
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    return audioContext;
  }
}