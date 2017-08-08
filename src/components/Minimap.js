import Canvas from "./Canvas";
import TextRaster from "./TextRaster";
import { text_db } from "./UserInterface";
const Minimap = function(width, height, display_width, display_height, colors) {
  const GW = width;
  const GH = height;
  const KX = Math.floor(display_width / width);
  const KY = Math.floor(display_height / height);
  const target = {
    x: 0,
    y: 0,
    name: text_db.target.toUpperCase()
  };

  const main_color = colors.main_color;
  const bg_color = colors.panel_color;
  const shadow_color = colors.shadow_color;

  const shadow_blur = 12;
  const line_width = 1;
  const padding = shadow_blur * 2 + line_width * 2;

  const cv = new Canvas(GW + padding, GH + padding);
  const center = cv.get().center;

  const position = {};
  setPosition(display_width, display_height);

  const absolute_coords = {
    x: 0,
    y: 0
  };
  const relative_coords = {
    x: 0,
    y: 0
  };

  const sprite = {};
  sprite.radar = drawRadar();
  sprite.target_pointer = drawTarget(target);
  sprite.output = render();

  function setPosition(width, height) {
    position.x = Math.floor(width - GW * 1.5);
    position.y = Math.floor(GH / 3);
  }

  function drawTarget(target) {
    const minimapText = new TextRaster();
    minimapText.setup({
      font_size: 8,
      font_color: main_color,
      shadow_color: shadow_color,
      padding_vertical: 0,
      padding_horizontal: 0
    });
    const target_text = minimapText.raster(target.name, 0);
    const scope_radius = 5;
    const offset = 10;
    const width = target_text.width + offset + scope_radius * 2;
    const height = target_text.height * 3;

    const cv = new Canvas(width, height);
    cv.draw(target_text, offset + scope_radius * 2, 0);
    cv.circle(
      cv.point(scope_radius, height - scope_radius),
      scope_radius,
      "transparent",
      main_color
    );
    cv
      .pathStart(cv.point(scope_radius * 2, height - scope_radius * 2))
      .lineTo(cv.point(offset + scope_radius * 2, Math.floor(height / 2)))
      .lineTo(
        cv.point(
          offset + scope_radius * 2 + target_text.width,
          Math.floor(height / 2)
        )
      );
    cv.stroke(main_color);
    return cv.get();
  }

  function drawRadar() {
    const cv = new Canvas(GW + padding, GH + padding);
    const center = cv.get().center;
    cv.setup({
      shadowColor: shadow_color,
      shadowBlur: shadow_blur,
      lineWidth: line_width
    });
    const path = cv.circle(
      cv.point(center.x, center.y),
      Math.floor(GW / 2),
      bg_color,
      main_color
    );
    return cv.get();
  }

  function render() {
    cv.clear();
    cv.set_composite("source-over");
    cv.draw(sprite.radar);
    cv.set_composite("source-atop");
    cv.draw(sprite.target_pointer, relative_coords.x, relative_coords.y);
    return cv.get();
  }

  class Minimap {
    onMouseMove(x, y) {
      absolute_coords.x = x;
      absolute_coords.y = y;
      relative_coords.x = Math.floor(GW / 3 / 2) + Math.floor(x / KX / 1.5);
      relative_coords.y = Math.floor(GH / 3 / 2) + Math.floor(y / KY / 1.5);
      sprite.output = render();
    }
    onDisplayResize(width, height) {
      setPosition(width, height);
    }
    getPosition() {
      return position;
    }
    draw() {
      return sprite.output;
    }
  }

  return new Minimap();
};

export default Minimap;
