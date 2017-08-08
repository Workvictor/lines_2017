import Node from './Node';

const PathFinder = function(grid) {

  function isEmpty(grid, node) {
    return (
      grid[node.x][node.y] != 11 &&
      grid[node.x][node.y] != 21 &&
      grid[node.x][node.y] != 31 &&
      grid[node.x][node.y] != 41 &&
      grid[node.x][node.y] != 51
    );
  }

  function isInList(list, element) {
    let result = false;
    list.forEach(function(list_elem) {
      if (element.x === list_elem.x && element.y === list_elem.y)
        result = true;
    }, this);
    return result;
  }

  function getValidNeighbors(grid, closedList, currentNode, endNode) {
    const LIST = new Array();
    const X = currentNode.x;
    const Y = currentNode.y;
    const LEFT = X - 1 >= 0 ?
      push_IF_Valid(Node(X - 1, Y)) :
      null;
    const TOP = Y - 1 >= 0 ?
      push_IF_Valid(Node(X, Y - 1)) :
      null;
    const RIGHT = X + 1 <= grid.length - 1 ?
      push_IF_Valid(Node(X + 1, Y)) :
      null;
    const BOTTOM = Y + 1 <= grid[0].length - 1 ?
      push_IF_Valid(Node(X, Y + 1)) :
      null;

    function push_IF_Valid(element) {
      if (!isInList(closedList, element)) {
        if (isEmpty(grid, element)) {
          LIST.push(element);
        }
      }
      return null;
    }

    return LIST;
  }

  function distance_MH(node1, node2) {
    return Math.abs(node2.x - node1.x) + Math.abs(node2.y - node1.y)
  }

  function buildPath(currentNode) {
    let n = currentNode;
    const path = new Array();

    do {
      path.push(n.previousNode);
      n = n.previousNode;
    } while (n.previousNode);

    return path.reverse();

  }

  class PathFinder {
    findPath(grid, startNode, endNode) {

      const GRID = grid;
      const PATH = new Array();
      const OPEN_LIST = new Array();
      const CLOSED_LIST = new Array();
      const START = startNode;
      const END = endNode;
      START.previousNode = null;
      let previousNode = START;
      if (END.x < GRID.length && END.y < GRID[0].length && isEmpty(GRID, END))
        OPEN_LIST.push(START);

      while (OPEN_LIST.length > 0) {

        let bestNow = 0;

        for (let i = 0; i < OPEN_LIST.length; i++) {
          if (distance_MH(OPEN_LIST[i], END) < distance_MH(OPEN_LIST[bestNow], END)) {
            bestNow = i;
          }
        }
        let currentNode = OPEN_LIST.splice(bestNow, 1)[0];

        if (currentNode.x === END.x && currentNode.y === END.y) {
          END.previousNode = currentNode;
          let path = buildPath(END);
          return path;
        }

        CLOSED_LIST.push(currentNode);

        let neighbors = getValidNeighbors(GRID, CLOSED_LIST, currentNode, END);
        neighbors.forEach(function(element) {
          element.previousNode = currentNode;
          OPEN_LIST.push(element);
        });

        // const X = currentNode.x; const Y = currentNode.y; if (X - 1 >= 0)
        // neighbors.push(node(X - 1, Y)); if (Y - 1 >= 0)     neighbors.push(node(X, Y
        // - 1)); if (X + 1 <= GRID.length)     neighbors.push(node(X + 1, Y)); if (Y +
        // 1 <= GRID[0].length)     neighbors.push(node(X, Y + 1));

      }
      return null;
    }
  }

  return new PathFinder();
}

export default PathFinder;