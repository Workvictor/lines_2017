//cSpell:ignoreRegExp /[а-я]/
// import {int} from "./utils";
import Canvas from "./Canvas";
import Grid from "./Grid";
import PathFinder from './PathFinder';
import Node from './Node';
import ActiveNode from './ActiveNode';

const Board = function({
  cell_size,
  cols,
  rows,
  width,
  height
}) {


  const CELL_SIZE = cell_size;
  const COLS = cols;
  const ROWS = rows;
  const G_WIDTH = width;
  const G_HEIGHT = height;
  const WIDTH = COLS * CELL_SIZE;
  const HEIGHT = ROWS * CELL_SIZE;

  const offset_top = 150;
  const offset_left = Math.floor(G_WIDTH / 2 - WIDTH / 2);

  let grid = new Grid(COLS, ROWS);
  const A_STAR = new PathFinder();
  const ACTIVE_NODE = new ActiveNode();

  let activeCoords = null;
  let path = null;
  let ACTIVE_PATH = null;

  const SPRITE_SET = {
    output: null,
    floor_tiles: null,
    sphere_sprites: null,
    path_sprite: null,
    path_point: null,
    FLOOR_TILE_1: null,
    FLOOR_TILE_2: null,
    grid: null,
    spheres: null,
    board: null,

  }
  SPRITE_SET.nextSet = new Array();

  function init() {
    draw_path_point();
    SPRITE_SET.FLOOR_TILE_1 = draw_floor_tile(SPRITE_SET.floor_tiles[0]);
    SPRITE_SET.FLOOR_TILE_2 = draw_floor_tile(SPRITE_SET.floor_tiles[1]);
    draw_spheres();
    draw_grid();
    draw_board();
    draw_next_ui();
    draw_output();
  }

  function draw_spheres() {
    let arr = new Array();
    let arr_small = new Array();
    SPRITE_SET.sphere_sprites.forEach(function(element) {
      let canvas = new Canvas(CELL_SIZE);
      canvas.img({
        sprite: element,
      });
      arr.push(canvas.output);
      let canvas_sm = new Canvas(Math.floor(CELL_SIZE / 2));
      canvas_sm.img({
        sprite: element,
      });
      arr_small.push(canvas_sm.output);
    }, this);
    SPRITE_SET.spheres_appear = arr_small;
    SPRITE_SET.spheres = arr;
  }

  function draw_path_point() {
    let canvas = new Canvas(CELL_SIZE);
    canvas.img({
      sprite: SPRITE_SET.path_sprite
    });
    SPRITE_SET.path_point = canvas.output;
  }

  function draw_floor_tile(sprite) {
    let canvas = new Canvas(CELL_SIZE);
    canvas.img({
      sprite: sprite
    });
    return canvas.output;
  }

  function draw_grid() {
    let canvas = new Canvas(WIDTH, HEIGHT);
    for (let x = 0; x < COLS; x++) {
      for (let y = 0; y < ROWS; y++) {
        if ((x + y) % 2 !== 0) {
          canvas.draw(SPRITE_SET.FLOOR_TILE_1, x * CELL_SIZE, y * CELL_SIZE);
        } else {
          canvas.draw(SPRITE_SET.FLOOR_TILE_2, x * CELL_SIZE, y * CELL_SIZE);
        }
      }
    }
    SPRITE_SET.grid = canvas.output;
  }

  function get_shpere_sprite(value) {
    let index = 0;
    switch (value) {
      case 10:
        index = 0;
        break;
      case 20:
        index = 1;
        break;
      case 30:
        index = 2;
        break;
      case 40:
        index = 3;
        break;
      case 50:
        index = 4;
        break;
    }
    return (SPRITE_SET.spheres[index]);
  }

  function draw_sphere_sprite(canvas, value, x, y) {
    let index = 0;
    let size = -1;
    switch (value) {
      case 11:
        index = 0;
        size = 1;
        break;
      case 10:
        index = 0;
        size = 0;
        break;
      case 21:
        index = 1;
        size = 1;
        break;
      case 20:
        //
        index = 1;
        size = 0;
        break;
      case 31:
        index = 2;
        size = 1;
        break;
      case 30:
        //
        index = 2;
        size = 0;
        break;
      case 41:
        index = 3;
        size = 1;
        break;
      case 40:
        //
        index = 3;
        size = 0;
        break;
      case 51:
        index = 4;
        size = 1;
        break;
      case 50:
        //
        index = 4;
        size = 0;
        break;
    }
    if (size === 1) {
      canvas.draw(SPRITE_SET.spheres[index], x * CELL_SIZE, y * CELL_SIZE);
    }
    if (size === 0) {
      let elem = SPRITE_SET.spheres_appear[index];
      canvas.draw(elem, x * CELL_SIZE + Math.floor(CELL_SIZE / 2 - elem.width / 2), y * CELL_SIZE + Math.floor(CELL_SIZE / 2 - elem.height / 2));
    }
  }


  function draw_board() {
    let canvas = new Canvas(WIDTH, HEIGHT);
    canvas.draw(SPRITE_SET.grid);
    for (let x = 0; x < COLS; x++) {
      for (let y = 0; y < ROWS; y++) {
        let value = grid.getValue(x, y);
        draw_sphere_sprite(canvas, value, x, y);
      }
    }
    if (path) {
      draw_path(canvas, path);
    }
    SPRITE_SET.board = canvas.output;
  }

  function draw_output() {
    let canvas = new Canvas(G_WIDTH, G_HEIGHT);
    canvas.draw(SPRITE_SET.board, offset_left, offset_top);
    canvas.draw(SPRITE_SET.ui_next, Math.floor(G_WIDTH/2-SPRITE_SET.ui_next.width/2), G_HEIGHT-225);    
    SPRITE_SET.output = canvas.output;
  }

  function draw_path(canvas, path) {
    path.forEach(function(element) {
      canvas.draw(SPRITE_SET.path_point, element.x * CELL_SIZE, element.y * CELL_SIZE);
    }, this);
  }

  function grid_coords(x, y) {
    return {
      x: Math.floor(x / CELL_SIZE),
      y: Math.floor(y / CELL_SIZE)
    }
  }

  function draw_next_ui() {
    let canvas = new Canvas(430, 250);   
    SPRITE_SET.nextSet.forEach(function(element, index) {      
      canvas.draw(get_shpere_sprite(element),index * 180,0);
    }, this);
    SPRITE_SET.ui_next = canvas.output;
  }


  class Board {
    on_mouse_move(x, y) {
      const gc = grid_coords(x - offset_left, y - offset_top);
      const AN = ACTIVE_NODE.get();
      if (AN !== null && AN !== undefined && gc.x >= 0 && gc.x < COLS && gc.y >= 0 && gc.y < ROWS) {
        path = A_STAR.findPath(grid.getGrid(), AN, Node(gc.x, gc.y));
        draw_board();
        draw_output();
      } else {
        path = null;
      }

    }
    on_click(x, y) {
      const gc = grid_coords(x - offset_left, y - offset_top);
      if (path) {
        grid.moveNode(gc.x, gc.y);
        this.step();
        path = null;
        ACTIVE_NODE.reset();
      } else {
        if (ACTIVE_NODE.isValid()) {
          if (ACTIVE_NODE.isEqual(gc.x, gc.y)) {
            path = null;
            ACTIVE_NODE.reset();
          } else if (grid.isCanPickNode(gc.x, gc.y)) {
            ACTIVE_NODE.set(gc.x, gc.y);
          }
        } else if (grid.isCanPickNode(gc.x, gc.y)) {
          ACTIVE_NODE.set(gc.x, gc.y);
        }
      }
      draw_board();
      draw_output();
    }
    step() {
      grid.update();
      SPRITE_SET.nextSet = grid.nextSet;
      draw_next_ui();
      draw_board();
      draw_output();
    }
    get output() {
      return SPRITE_SET.output;
    }

    setup_sprites({
      floor_tiles,
      sphere_sprites,
      path_sprite
    }) {
      SPRITE_SET.floor_tiles = floor_tiles;
      SPRITE_SET.sphere_sprites = sphere_sprites;
      SPRITE_SET.path_sprite = path_sprite;
      init();
    }
  }

  return new Board();
}

export default Board;