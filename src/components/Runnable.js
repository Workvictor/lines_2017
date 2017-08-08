const Runnable = function() {
  const STATE = {
    running:true,
  };
  class Runnable {
    set run(state) {
      STATE.running = (state === 1||state === true)?true:false;
    }
    get is_running() {
      return STATE.running;
    }
  }
  return new Runnable();
}
export default Runnable;