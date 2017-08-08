const ActiveNode = function() {
  let activeNode = null;
  let value = 0;
  class ActiveNode {
    reset() {
      activeNode = null;
    }
    isValid() {
      return activeNode !== null;
    }
    x() {
      return activeNode.x
    }
    y() {
      return activeNode.y
    }
    isEqual(x, y) {
      if (this.isValid()) {
        if (typeof x === typeof null) {
          const {
            X,
            Y
          } = x;
          return X === activeNode.x && Y === activeNode.y
        } else
          return x === activeNode.x && y === activeNode.y;
      } else return false
    }
    set(x, y) {
      if (x !== null && y !== null && x !== undefined && y !== undefined)
        return activeNode = {
          x,
          y
        }
      return activeNode;
    }
    set value(val) {
      value = val;
    }
    get value() {
      return value;
    }
    get() {
      return activeNode
    }
  }
  return new ActiveNode();
}

export default ActiveNode;