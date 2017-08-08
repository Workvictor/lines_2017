import PathFinder from './PathFinder';
import ActiveNode from './ActiveNode';
import Node from './Node';

const Grid = function(width, height) {
  const WIDTH = width;
  const HEIGHT = height;
  const CHAIN_MAX_SIZE = 5;
  const NEW_MAX_ADD = 3;
  const MAX_COLORS = 9;
  const STATE = {
    EMPTY: 0,
    PATH_NODE: 1
  }
  const GRID = resetGrid(WIDTH, HEIGHT);
  const ACTIVE_NODE = new ActiveNode();
  const NEXT_SET = new Array();



  const randomRange = (min, max) => Math.floor(min + (Math.random() * (max - min)));

  function coords(x, y) {
    return {
      x: x,
      y: y
    }
  };

  function resetGrid(width, height) {
    let grid = new Array();
    for (let x = 0; x < width; x++) {
      grid.push(new Array());
      for (let y = 0; y < height; y++) {
        grid[x][y] = 0;
      }
    }
    return grid;
  }

  function setState(x, y, state) {
    GRID[x][y] = state;
    NEXT_SET.push(state);
  }

  function addRandom(count) {
    NEXT_SET.length = 0;
    for (let i = 0; i < count; i++) {
      let x = randomRange(0, WIDTH);
      let y = randomRange(0, HEIGHT);
      setState(x, y, randomRange(1, 6) * 10);
    }
  }

  function get_all_empty() {
    let empty = new Array();
    for (let x = 0; x < WIDTH; x++) {
      for (let y = 0; y < HEIGHT; y++) {
        if (GRID[x][y] === 0) {
          empty.push({
            x: x,
            y: y
          });
        }
      }
    }
    return empty;
  }

  function addNext() {
    NEXT_SET.length = 0;
    let empty = get_all_empty();
    if (empty.length >= 3) {
      let x = 0;
      let y = 0;
      for (let i = 0; i < NEW_MAX_ADD; i++) {
        do {
          x = randomRange(0, WIDTH);
          y = randomRange(0, HEIGHT);
        } while (GRID[x][y] !== 0);
        setState(x, y, randomRange(1, 6) * 10);
      }
    } else {
      console.log('Game Over');
    }
  }

  function growNext() {
    for (let x = 0; x < WIDTH; x++) {
      for (let y = 0; y < HEIGHT; y++) {
        if (GRID[x][y] === 10) {
          GRID[x][y] = 11;
        }
        if (GRID[x][y] === 20) {
          GRID[x][y] = 21;
        }
        if (GRID[x][y] === 30) {
          GRID[x][y] = 31;
        }
        if (GRID[x][y] === 40) {
          GRID[x][y] = 41;
        }
        if (GRID[x][y] === 50) {
          GRID[x][y] = 51;
        }
      }
    }
  }

  function isValid(x, y) {
    return isWithin(x, y) && isAllowValue(GRID[x][y]);
  }

  function isEmpty(x, y) {
    return (
      isWithin(x, y) &&
      GRID[x][y] != 11 &&
      GRID[x][y] != 21 &&
      GRID[x][y] != 31 &&
      GRID[x][y] != 41 &&
      GRID[x][y] != 51
    );
  }

  function is_element_valid(val) {
    return (
      val === 11 ||
      val === 21 ||
      val === 31 ||
      val === 41 ||
      val === 51
    );
  }

  function isAllowValue(value) {
    return (
      value === 11 ||
      value === 21 ||
      value === 31 ||
      value === 41 ||
      value === 51
    );
  }

  function isWithin(x, y) {
    return x >= 0 && y >= 0 && x < WIDTH && y < HEIGHT;
  }

  function getCol(x) {
    return GRID[x];
  }

  function getRow(y) {
    let result = new Array();
    for (let x = 0; x < WIDTH; x++) {
      result.push(GRID[x][y]);
    }
    return result;
  }

  function checkRowsChain() {
    let chain = new Array();
    for (let y = 0; y < HEIGHT; y++) {
      let row = getRow(y);
      row.forEach(function(element, index) {
        if (isAllowValue(element)) {
          if (chain.length === 0) {
            chain.push({
              x: index,
              y: y,
              value: element
            });
          } else {
            if (element === chain[0].value) {
              chain.push({
                x: index,
                y: y,
                value: element
              });
            } else {
              if (chain.length >= CHAIN_MAX_SIZE) {
                dropChain(chain);
              }
              chain.length = 0;
              chain.push({
                x: index,
                y: y,
                value: element
              });
            }
          }
        } else {
          if (chain.length >= CHAIN_MAX_SIZE) {
            dropChain(chain);
          }
          chain.length = 0;
        }
      }, this);
      if (chain.length >= CHAIN_MAX_SIZE) {
        dropChain(chain);
      }
      chain.length = 0;
    }
  }

  function checkColsChain() {
    let chain = new Array();
    for (let x = 0; x < WIDTH; x++) {
      let col = getCol(x);
      col.forEach(function(element, index) {
        if (isAllowValue(element)) {
          if (chain.length === 0) {
            chain.push({
              x: x,
              y: index,
              value: element
            });
          } else {
            if (element === chain[0].value) {
              chain.push({
                x: x,
                y: index,
                value: element
              });
            } else {
              if (chain.length >= CHAIN_MAX_SIZE) {
                dropChain(chain);
              }
              chain.length = 0;
              chain.push({
                x: x,
                y: index,
                value: element
              });
            }
          }
        } else {
          if (chain.length >= CHAIN_MAX_SIZE) {
            dropChain(chain);
          }
          chain.length = 0;
        }
      }, this);
      if (chain.length >= CHAIN_MAX_SIZE) {
        dropChain(chain);
      }
      chain.length = 0;
    }
  }

  function dropChain(chain) {
    chain.forEach(function(element) {
      GRID[element.x][element.y] = 0;
    }, this);
  }

  function debugChain(chain) {
    if (chain.length > 0) {
      console.log('chain now:');
      let str = '';

      chain.forEach(function(element) {
        str += '[' + element.x + ',' + element.y + ',' + element.value + ']';
      }, this);
      console.log(str);
      console.log('-------');
    }

  }

  function debug() {

    console.log('---debug begin---');
    for (let y = 0; y < HEIGHT; y++) {
      console.log('row', getRow(y));
    }
    console.log('---debug end---');
  }


  class Grid {
    constructor() {
      addNext();
    }
    update() {
      growNext();
      addNext();
      checkRowsChain();
      checkColsChain();
    }
    get nextSet() {
      return NEXT_SET;
    }
    isCanPickNode(x, y) {
      if (isValid(x, y)) {
        let active = ACTIVE_NODE.set(x, y);
        active.value = GRID[x][y];
        return active;
      } else
        return null;
    }
    moveNode(x, y) {
      if (isEmpty(x, y)) {
        let active = ACTIVE_NODE.get();
        if (active !== null) {
          setState(active.x, active.y, 0);
          setState(x, y, active.value);
          ACTIVE_NODE.reset();
        }
      }
      checkRowsChain();
      checkColsChain();
    }
    getValue(x, y) {
      return GRID[x][y];
    }
    getGrid() {
      return GRID;
    }
  }

  return new Grid();
}

export default Grid;