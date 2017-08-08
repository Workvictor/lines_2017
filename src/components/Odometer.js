import Canvas from "./Canvas";
import TextRaster from "./TextRaster";
const Odometer = function(width, height, colors) {
  const bounds = {};
  set_bounds(width, height);
  const main_color = colors.main_color;
  const shadow_color = colors.shadow_color;
  const position = {
    x: 0,
    y: 0
  };
  const store = {};
  store.text = "";
  store.distance = 0;
  store.pos = {
    x: 0,
    y: 0
  };
  const text = new TextRaster();
  text.setup({
    font_size: 12,
    font_color: main_color,
    shadow_color: shadow_color,
    padding_vertical: 22,
    padding_horizontal: 22
  });

  store.output = text.raster(store.distance, 0);

  function set_bounds(width, height) {
    bounds.width = width;
    bounds.height = height;
  }

  function set_position() {
    position.x = bounds.width - store.output.width-40;
    position.y = store.output.height+180;
  }

  function calculate_distance(x, y) {
    if (store.pos.x === 0 && store.pos.y === 0) {
      store.pos.x = x;
      store.pos.y = y;
    } else {
      if (store.pos.x != x) {
        store.distance++;
        store.pos.x = x;
      }
      if (store.pos.y != y) {
        store.distance++;
        store.pos.y = y;
      }
    }
  }

  function update() {
    store.output = text.raster(store.text + ": " + store.distance, 0);
    set_position();
  }

  class Odometer {
    on_resize(width, height) {
      set_bounds(width, height);
      update();
    }
    set_distance(x, y) {
      calculate_distance(x, y);
      update();
    }
    set_text(text) {
      store.text = text;
      update();
    }
    distance_is_greater(value) {
      return store.distance > value;
    }
    getPosition() {
      return position;
    }
    draw() {
      return store.output;
    }
  }

  return new Odometer();
};

export default Odometer;