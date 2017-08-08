import Canvas from "./Canvas";
import Sprite from './Sprite'
const Cursor = function(colors) {
  const options = {
    cursor_size: 28,
    cursor_color: colors.main_color,
    shadow_color: colors.shadow_color,
    shadow_blur: 2,
  }

  function drawCursor({
    cursor_size,
    cursor_color,
    shadow_color,
    shadow_blur
  }) {
    const cv = new Canvas(cursor_size);
    const center = cv.get().center;
    cv.setup({
      stroke_width: 1,
      shadowColor: shadow_color,
      shadowBlur: shadow_blur,
    });
    cv
      .pathStart(cv.point(0, 0))
      .lineTo(cv.point(center.x + 3, center.y - 3))
      .lineTo(cv.point(center.x - 3, center.y + 3))
      .closePath();
    cv.stroke(cursor_color);
    return cv.get();
  }
  return new Sprite(drawCursor(options));
}

export default Cursor;