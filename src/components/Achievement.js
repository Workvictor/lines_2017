import Canvas from "./Canvas";
import TextRaster from "./TextRaster";
const Achievement = function(colors) {
  const main_color = colors.main_color;
  const bg_color = colors.panel_color;
  const shadow_color = colors.shadow_color;
  const store = new Array();
  const achieve_text = new TextRaster();
  achieve_text.setup({
    font_size: 24,
    font_color: main_color,
    shadow_color: shadow_color,
    padding_vertical: 22,
    padding_horizontal: 22
  });
  function show_achieve(text) {
    const achieve = {};
  }

  class Achievement {}

  return new Achievement();
};

export default Achievement;
