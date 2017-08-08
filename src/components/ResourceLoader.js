import File from './File';

const ResourceLoader = function(AUDIO_CTX) {

  const STATE = {
    LOAD_END: false,
    TOTAL: 0,
    PROGRESS_LOADED: 0,
    LOAD_COUNT: 0,
    DECODE_COUNTER: 0
  }
  const DB_LOADED = {}

  function setTotal(value) {
    return STATE.TOTAL = value;
  }

  function getTotal() {
    return STATE.TOTAL;
  }

  function getProgressTotal() {
    return STATE.PROGRESS_LOADED;
  }

  function setProgress(name, value) {
    DB_LOADED[name] = value;
    STATE.PROGRESS_LOADED = Math.floor((getProgress() / getTotal()) * 100);
  }

  function getProgress() {
    let sum = 0;
    for (let prop in DB_LOADED) {
      sum += DB_LOADED[prop];
    }
    return sum;
  }

  class ResourceLoader {

    setState(value = false) {
      return STATE.LOAD_END = value;
    }
    setLoadCount(value) {
      return STATE.LOAD_COUNT = value;
    }
    incrementDecodeCounter() {
      return STATE.DECODE_COUNTER++;
    }
    getDecodeCounter() {
      return STATE.DECODE_COUNTER;
    }
    getLoadCount() {
      return STATE.LOAD_COUNT;
    }
    getState() {
      return STATE.LOAD_END;
    }
    getProgressPercent() {
      return STATE.PROGRESS_LOADED;
    }
    setProgressTotal(value) {
      return STATE.PROGRESS_LOADED = value;
    }

    loadFile(fileName) {
      const FILE = new File(fileName, AUDIO_CTX);

      const request = new XMLHttpRequest();
      request.name = FILE.name();
      request.open("GET", FILE.getDir() + fileName, true);
      request.responseType = FILE.getResponseType();
      request.addEventListener("progress", loadProgress);
      request.addEventListener("load", loadEnd);
      request.send();

      function loadProgress(event) {
        if (!FILE.getTotalSize()) {
          FILE.setTotalSize(event.total);
          setTotal(FILE.getTotalSize() + getTotal());
        }
        FILE.setProgress(event.loaded);
        setProgress(FILE.name(), FILE.getProgress());
      }

      function loadEnd(event) {
        FILE.setResponse(event.target);
      }
      return FILE
    }

  }

  return new ResourceLoader();
}

export default ResourceLoader;