import ActionFrame from "./ActionFrame";
import AudioDecoder from "./AudioDecoder";

const File = function(fileName, AUDIO_CTX) {

  const DEFAULT_DIR = {
    STATIC: './static/',
    IMG_DIR: 'img/',
    AUDIO_DIR: 'audio/'
  }

  const DEFAULT_EXT = {
    PNG: 'png',
    JPG: 'jpg',
    GIF: 'gif',
    MP3: 'mp3'
  }
  const DEFAULT_KEYS = {
    FILE_TYPE: 'file_type',
    RESPONSE_TYPE: 'response_type',
    SOURCE_TYPE: 'source_type',
    RESPONSE: 'response',
    DIRECTORY: 'directory'
  }
  const EXT = setEXT(fileName);
  const NAME = setName(fileName);
  const FILE = setup(EXT, DEFAULT_KEYS.FILE_TYPE);

  const DECODER = new AudioDecoder(AUDIO_CTX);
  const RAF = new ActionFrame();

  const PROGRESS = {
    LOADED: 0,
    TOTAL: null,
    END: false
  }

  function setName(fileName) {
    return fileName
      .slice(0, -4)
      .toUpperCase();
  }

  function setEXT(fileName) {
    return fileName.slice(-3);
  }

  function setup(extension, key) {
    switch (extension) {
      case DEFAULT_EXT.JPG:
      case DEFAULT_EXT.PNG:
      case DEFAULT_EXT.GIF:
        //if image


        switch (key) {
          case DEFAULT_KEYS.FILE_TYPE:
            //if need type of file
            return new Image();
          case DEFAULT_KEYS.RESPONSE_TYPE:
            //if need response type
            return 'blob';
          case DEFAULT_KEYS.SOURCE_TYPE:
            //if need source type
            return 'src';
          case DEFAULT_KEYS.RESPONSE:
            //if need source type
            return 'responseURL';
          case DEFAULT_KEYS.DIRECTORY:
            //if need source type
            return DEFAULT_DIR.STATIC + DEFAULT_DIR.IMG_DIR;
        }
        break;
        //
      case DEFAULT_EXT.MP3:
        //if audio
        switch (key) {
          case DEFAULT_KEYS.FILE_TYPE:
            //if need type of file
            return {};
          case DEFAULT_KEYS.RESPONSE_TYPE:
            //if need response type
            return 'arraybuffer';
          case DEFAULT_KEYS.SOURCE_TYPE:
            //if need source type
            return 'buffer';
          case DEFAULT_KEYS.RESPONSE:
            //if need source type
            return 'response';
          case DEFAULT_KEYS.DIRECTORY:
            //if need source type
            return DEFAULT_DIR.STATIC + DEFAULT_DIR.AUDIO_DIR;
        }
        break;
    }
  }

  class File {
    setProgress(value) {
      PROGRESS.LOADED = value;
    }
    setResponse(target) {

      if (EXT === DEFAULT_EXT.MP3) {
        DECODER.decodeBuffer(target[setup(EXT, DEFAULT_KEYS.RESPONSE)]);
        DECODER.onDecode(function(buffer) {
          FILE.decodeBuffer = buffer;
          FILE.name = NAME;
          PROGRESS.END = true;
        });
      } else {
        FILE.src = URL.createObjectURL(target.response);
        // FILE[this.getSourceType()] = target[setup(EXT, DEFAULT_KEYS.RESPONSE)];
        FILE.onload = function() {
          PROGRESS.END = true;
        };
      }

    }
    setTotalSize(value) {
      PROGRESS.TOTAL = value ?
        value :
        null;
    }
    setBuffer(buffer) {
      FILE.buffer = buffer;
    }
    isSound() {
      return EXT === DEFAULT_EXT.MP3;
    }
    getTotalSize() {
      return PROGRESS.TOTAL;
    }
    getProgress() {
      return PROGRESS.LOADED;
    }
    isLoaded() {
      return PROGRESS.END;
    }
    get() {
      return FILE;
    }
    name() {
      return NAME;
    }
    onLoaded(callback) {
      if (this.isLoaded())
        callback()
      else {
        setTimeout(function() {
          this.onLoaded(callback);
        }.bind(this), 16);
      }
    }
    getResponseType() {
      return setup(EXT, DEFAULT_KEYS.RESPONSE_TYPE);
    }
    getResponse(target) {
      return setup(EXT, DEFAULT_KEYS.RESPONSE);
    }

    getSourceType() {
      return setup(EXT, DEFAULT_KEYS.SOURCE_TYPE);
    }
    getDir() {
      return setup(EXT, DEFAULT_KEYS.DIRECTORY);
    }
  }
  return new File();
}

export default File;