const AudioDecoder = function (AUDIO_CTX) {

    const SOURCE_OUTPUT = AUDIO_CTX.createBufferSource();

    function getBuffer(buffer) {
        SOURCE_OUTPUT.buffer = buffer; 
    }

    class AudioDecoder {
        decodeBuffer(fileBuffer) {
            AUDIO_CTX.decodeAudioData(fileBuffer, getBuffer);
        }
        onDecode(callback) {
            if (SOURCE_OUTPUT.buffer !== null) {
                callback(SOURCE_OUTPUT.buffer);
            } else {
                setTimeout(function () {
                    this.onDecode(callback);
                }.bind(this), 16);
            }
        }
    }

    return new AudioDecoder();
}

export default AudioDecoder;