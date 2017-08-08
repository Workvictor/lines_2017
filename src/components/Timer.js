import Canvas from "./Canvas";
import TextRaster from "./TextRaster";
const Timer = function(width, height, display_width, display_height, colors) {
  const GW = width;
  const GH = height;
  let d_w = display_width;
  let d_h = display_height;

  let timer_start = Date.now();
  let seconds = 0;
  let minutes = 0;
  let hours = 0;

  const main_color = colors.main_color;
  const bg_color = colors.bg_color;
  const shadow_color = colors.shadow_color;
  const timer_fontsize = 12;
  const cv = new Canvas(GW, GH);
  const center = cv.get().center;
  const timer_text = new TextRaster();
  timer_text.setup({
    font_size: timer_fontsize,
    font_color: main_color,
    shadow_color: shadow_color,
    padding_vertical: 0,
    padding_horizontal: 0
  });
  const position = {};
  const sprite = {};
  sprite.timer = draw_timer_text();
  sprite.output = render();
  setPosition(display_width, display_height);

  function setPosition(width, height) {
    position.x = Math.floor(width - 55 - sprite.timer.width);
    position.y = Math.floor(height - 55 - sprite.timer.height);
  }

  function draw_timer_text() {
    const time = Date.now() - timer_start;
    let ms = time;
    let s_o = seconds;
    let m_o = minutes;
    if (time < 100 && time > 10) {
      ms = "0" + time;
    }
    if (time < 10) {
      ms = "00" + time;
    }
    if (time >= 999) {
      seconds++;
      timer_start = Date.now();
      ms = 999;
    }
    if (seconds >= 60) {
      seconds = 0;
      minutes++;
    }
    if (seconds < 10) {
      s_o = "0" + seconds;
    }
    if (minutes >= 60) {
      minutes = 0;
      hours++;
    }
    if (minutes < 10) {
      m_o = "0" + minutes;
    }

    const text = hours + ":" + m_o + ":" + s_o + ":" + ms;
    const output_text = timer_text.raster(text, 0);
    return output_text;
  }
  function render() {
    cv.clear();
    cv.draw(sprite.timer);
    return cv.get();
  }
  class Timer {
    draw() {
      sprite.timer = draw_timer_text();
      setPosition(d_w, d_h);
      return sprite.timer;
    }
    update_timer() {
      sprite.timer = draw_timer_text();
      setPosition(d_w, d_h);
      sprite.output = render();
    }
    onDisplayResize(width, height) {
      d_w = width;
      d_h = height;
      setPosition(width, height);
    }
    getPosition() {
      return position;
    }
  }

  return new Timer();
};

export default Timer;
