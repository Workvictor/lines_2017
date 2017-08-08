import HSLA from "./HSLA";
const Canvas = function(width = 0, height = 0) {
  const COLOR = {};
  COLOR.green = new HSLA(130);
  COLOR.main = COLOR.green.set(130, 100, 30);
  COLOR.highlight = COLOR.green.darken(+20);
  const WIDTH = width;
  const HEIGHT = height ? height : width;
  const CV = document.createElement("canvas");
  CV.ctx = CV.getContext("2d");
  CV.width = WIDTH;
  CV.height = HEIGHT;
  CV.x = 0;
  CV.y = 0;
  CV.workPath = new Array();
  CV.center = {
    x: Math.floor(CV.width / 2),
    y: Math.floor(CV.height / 2)
  };
  const STYLES_DEFAULT = {
    width: width,
    height: height,
    font: "bold 16px Arial, Helvetica, sans-serif",
    lineWidth: 1,
    borderRadius: 12,
    fillColor: COLOR.main,
    fontSize: 16,
    fontWeight: 400,
    fontFamily: "Arial, Helvetica, sans-serif",
    fontStyle: "normal",
    fontColor: "#fff",
    textAlign: "center",
    textBaseline: "middle"
  };
  const CURRENT_SETUP = new Array();
  const STYLE = STYLES_DEFAULT;

  initStyles();

  function controlPoint(point, clockwise) {
    const cp = {
      x: 0,
      y: 0
    };
    if (prev().x <= point.x && prev().y <= point.y) {
      cp.x = prev().x + (clockwise ? 0 : Math.abs(prev().x - point.x));
      cp.y = prev().y + (clockwise ? Math.abs(prev().y - point.y) : 0);
    }
    if (prev().x <= point.x && prev().y >= point.y) {
      cp.x = prev().x + (clockwise ? 0 : Math.abs(prev().x - point.x));
      cp.y = prev().y - (clockwise ? Math.abs(prev().y - point.y) : 0);
    }
    if (prev().x >= point.x && prev().y >= point.y) {
      cp.x = prev().x - (clockwise ? Math.abs(prev().x - point.x) : 0);
      cp.y = prev().y - (clockwise ? 0 : Math.abs(prev().y - point.y));
    }
    if (prev().x >= point.x && prev().y <= point.y) {
      cp.x = prev().x - (clockwise ? Math.abs(prev().x - point.x) : 0);
      cp.y = prev().y + (clockwise ? 0 : Math.abs(prev().y - point.y));
    }

    return cp;
  }

  function prev() {
    if (CV.workPath.length > 0) return CV.workPath[CV.workPath.length - 1];
  }

  function initStyles() {
    for (let prop in STYLE) {
      CV.ctx[prop] = STYLE[prop];
    }
    CV.ctx.font = parseFont();
  }

  function parseFont() {
    return STYLE.fontWeight + " " + STYLE.fontSize + "px " + STYLE.fontFamily;
  }
  class Canvas {
    setFont(
      fontSize,
      fontFamily = STYLE.fontFamily,
      fontWeight = STYLE.fontWeight
    ) {
      STYLE.fontSize = fontSize;
      STYLE.fontWeight = fontWeight;
      STYLE.fontFamily = fontFamily;
      initStyles();
      return parseFont();
    }

    setup2(props) {
      for (let prop in props) {
        STYLE[prop] = props[prop];
      }
      initStyles();
      return this;
    }
    setup_ctx(options) {
      for (let prop in options) {
        CV.ctx[prop] = options[prop];
      }
    }
    clear() {
      CV.ctx.clearRect(0, 0, CV.width, CV.height);
    }
    pathStart(point) {
      CV.path = new Path2D();
      CV.path.moveTo(point.x, point.y);
      CV.workPath.push(point);
      return this;
    }
    closePath() {
      CV.workPath.length = 0;
      CV.path.closePath();
      return CV.path;
    }
    moveTo(point) {
      CV.path.moveTo(point.x, point.y);
      CV.workPath.push(point);
      return this;
    }
    curveTo(point, clockwise = true) {
      const cp = controlPoint(point, clockwise);
      CV.path.quadraticCurveTo(cp.x, cp.y, point.x, point.y);
      CV.workPath.push(point);
      return this;
    }
    arcTo(point1, point2, r) {
      CV.path.arcTo(point1.x, point1.y, point2.x, point2.y, r);
      return this;
    }
    arc(point, r, start, end, clock = false) {
      CV.path.arc(point.x, point.y, r, start * Math.PI, end * Math.PI, clock);
      return this;
    }
    lineTo(point) {
      CV.path.lineTo(point.x, point.y);
      CV.workPath.push(point);
      return this;
    }
    circle(point, radius, color, stroke_color) {
      const path = new Path2D();
      CV.ctx.save();
      path.arc(point.x, point.y, radius, 0 * Math.PI, 2 * Math.PI);
      path.closePath();
      CV.ctx.fillStyle = color;
      CV.ctx.fill(path);
      if (stroke_color) {
        CV.ctx.strokeStyle = stroke_color;
        CV.ctx.stroke(path);
      }
      CV.ctx.restore();
      return path;
    }
    stroke(color = STYLE.fillColor) {
      CV.ctx.save();
      CV.ctx.strokeStyle = color;
      CV.ctx.stroke(CV.path);
      CV.ctx.restore();
      return CV.path;
    }
    fill(color = STYLE.fillColor) {
      CV.ctx.save();
      CV.ctx.fillStyle = color;
      CV.ctx.fill(CV.path);
      CV.ctx.restore();
      return CV.path;
    }
    clip(path) {
      if (path) CV.ctx.clip(path);
      else {
        CV.ctx.clip(CV.path);
      }
      return this;
    }
    pattern(img, repeat = "repeat") {
      return CV.ctx.createPattern(img, repeat);
    }
    set(propertyName, value) {
      for (let prop in STYLE) {
        if (propertyName === prop) {
          STYLE[prop] = value;
        }
      }
      initStyles();
    }
    draw(sprite, x = 0, y = 0) {
      CV.ctx.drawImage(sprite, x, y);
    }
    draw_rect({
      x = 0,
      y = 0,
      width = CV.width,
      height = CV.height,
      fill_color
    }) {
      CV.ctx.fillStyle = fill_color;
      CV.ctx.fillRect(x, y, width, height);
    }
    textWidth(text) {
      const measure = CV.ctx.measureText(text);
      return Math.ceil(measure.width);
    }
    getFontSize() {
      return STYLE.fontSize;
    }
    fill_bg(color) {
      CV.ctx.save();
      CV.ctx.fillStyle = color;
      CV.ctx.fillRect(0, 0, CV.width, CV.height);
      CV.ctx.restore();
    }
    set_composite(type) {
      CV.ctx.globalCompositeOperation = type;
    }
    point(x, y) {
      return {
        x,
        y
      };
    }
    setSize(width, height) {
      CV.width = width;
      CV.height = height;
    }
    CSS(styles) {
      for (let prop in styles) {
        CV.style[prop] = styles[prop];
      }
    }
    get() {
      return CV;
    }


    //new
    is_point_in_path(path, x, y) {
      return CV.ctx.isPointInPath(path, x, y);
    }
    img({
      sprite,
      x,
      y,
      alignment
    }) {
      x = x ? x : 0;
      y = y ? y : 0;
      alignment = alignment ? alignment : 'center';
      let dX = x;
      let dY = y;
      if (alignment === 'center') {
        dX = Math.floor(CV.width / 2 - sprite.width / 2);
        dY = Math.floor(CV.height / 2 - sprite.height / 2);
      }
      if (sprite.width > CV.width) {
        CV.ctx.drawImage(sprite, 0, 0, CV.width, CV.height);
      }else{
      CV.ctx.drawImage(sprite, dX, dY);
      }
    }
    rect({
      x = 0,
      y = 0,
      width,
      height,
      bg_color,
      border_color,
      border_width,
      shadow_blur,
      shadow_color
    }) {
      width = width === undefined ? CV.width : width;
      height = height === undefined ? width : height;
      CV.ctx.save();
      if (shadow_blur) {
        CV.ctx.shadowBlur = shadow_blur;
        if (shadow_color) CV.ctx.shadowColor = shadow_color;
      }
      if (bg_color) {
        CV.ctx.fillStyle = bg_color;
        CV.ctx.fillRect(x, y, width, height);
      }
      if (border_color) {
        if (border_width) CV.ctx.lineWidth = border_width;
        CV.ctx.strokeStyle = border_color;
        CV.ctx.strokeRect(x, y, width, height);
      }
      CV.ctx.restore();
    }
    text({
      text,
      x = 0,
      y = 0,
      text_color,
      stroke_color,
      stroke_width,
      shadow_blur,
      shadow_color
    }) {
      CV.ctx.save();
      if (shadow_blur) {
        CV.ctx.shadowBlur = shadow_blur;
        if (shadow_color) CV.ctx.shadowColor = shadow_color;
      }
      if (text_color) {
        CV.ctx.fillStyle = text_color;
      }
      CV.ctx.fillText(text, x, y);
      if (stroke_color) {
        if (stroke_width) CV.ctx.lineWidth = stroke_width;
        CV.ctx.strokeStyle = stroke_color;
        CV.ctx.strokeText(text, x, y);
      }
      CV.ctx.restore();
    }
    set size({
      width,
      height
    }) {
      if (width) CV.width = width;
      if (height) CV.height = height;
      for (let prop in CURRENT_SETUP[0]) {
        CV.ctx[prop] = CURRENT_SETUP[0][prop];
      }
    }
    setup(options) {
      for (let prop in options) {
        CV.ctx[prop] = options[prop];
      }
      CURRENT_SETUP.push(options);
      return this;
    }
    get output() {
      CV.center = {
        x: Math.floor(CV.width / 2),
        y: Math.floor(CV.height / 2)
      };
      return CV;
    }
  }

  return new Canvas();
};

export default Canvas;