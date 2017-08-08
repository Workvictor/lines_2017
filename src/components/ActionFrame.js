const ActionFrame = function(cb) {
  let callback = cb ? cb : null;
  class ActionFrame {
    run() {
      return window.requestAnimationFrame(callback);
    }
    stop() {
      return window.cancelAnimationFrame(callback);
    }
    check(expression = true) {
      expression ? this.run() : this.stop();
    }
    init(cb) {
      callback = cb;
      this.run();
    }
    setFrame(cb){
      callback = cb;
    }
  }

  return new ActionFrame();
}

export default ActionFrame;