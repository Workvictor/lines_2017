const AudioController = function () {

    const AUDIO_CTX = new(window.AudioContext || window.webkitAudioContext)();
    const GAIN_NODE = AUDIO_CTX.createGain();
    GAIN_NODE.gain.value = 0.1;
    const TRACKS = new Array();

    function findTrack(name) {
        let track = null;
        TRACKS.forEach(checkName);
        const sourceOutput = AUDIO_CTX.createBufferSource();
        sourceOutput.buffer = track.decodeBuffer;
        function checkName(element) {
            track = element.name == name
                ? element
                : track;
        }
        return sourceOutput;
    }

    class AudioController {

        getCTX(){
            return AUDIO_CTX;
        }

        addTrack(file) {
            TRACKS.push(file);
        }
        play(name) {
            const TRACK = findTrack(name);
            TRACK.loop = true;
            TRACK.start(0);
            TRACK.connect(GAIN_NODE);
            GAIN_NODE.connect(AUDIO_CTX.destination);
        }
        stop(name) {}
    }

    return new AudioController();
}

export default AudioController;