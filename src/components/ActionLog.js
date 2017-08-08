import Canvas from "./Canvas";
import TextRaster from "./TextRaster";
const ActionLog = function({
  width,
  height,
  display_width,
  display_height,
  colors
}) {
  const bounds = {};
  set_bounds(display_width, display_height);
  const main_color = colors.main_color;
  const shadow_color = colors.shadow_color;
  const position = {
    x: 0,
    y: 0
  };
  const cv = new Canvas(width, height);
  const store = {};
  store.rows = new Array();
//   store.output = render();

  function set_bounds(width, height) {
    bounds.width = width;
    bounds.height = height;
  }
function render_msg(text){    
  const r_text = new TextRaster();
  r_text.setup({
    font_size: 12,
    font_color: main_color,
    shadow_color: shadow_color,
    padding_vertical: 16,
    padding_horizontal: 16
  });
  
}
function render(){

}
  class ActionLog {
    add_msg(text) {

        store.rows.push(text);
    }
  }

  return new ActionLog();
};

export default ActionLog;
