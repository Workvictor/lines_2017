//cSpell:ignoreRegExp /[а-я]/
import Canvas from "./Canvas";
import Sprite from './Sprite';
import HSLA from "./HSLA";
import ActionFrame from "./ActionFrame";
const VFX_Noise = function(options) {

  const hsla = new HSLA();
  //настройки по умолчанию
  const DEFAULTS = {
    //размер-радиус шума
    cell_size: 1,
    //ширина и высота экрана
    width: window.screen.width,
    height: window.screen.height,
    //количество фреймов анимации
    frames_max: 24,
    //максимальное время такта генерации, милисекунд
    performance_rate: 30,
    //цветовая палитра
    //количество оттенков шума от черного к белому, чем больше, тем разнообразнее картинки с шумом
    colors: 8,
    //прозрачность шума
    opacity: 0.2,
    period_color: hsla.set(0, 0, 0, 0.3)
  }
  DEFAULTS.opacity = 0.1*(DEFAULTS.cell_size/1);
  DEFAULTS.period_color = hsla.set(0, 0, 0, 0.3*(DEFAULTS.cell_size/1));


  function set_options(options) {
    if (options) {
      const result = {};
      for (let prop in DEFAULTS) {
        if (options[prop]) {
          result[prop] = options[prop];
        }
      }
      return result;
    } else {
      return DEFAULTS;
    }
  }

  function draw_period_line() {
    const buffer = new Canvas(OPTIONS.width, OPTIONS.cell_size);
    buffer.draw_rect({
      fill_color: OPTIONS.period_color
    });
    return buffer.get();
  }

  function fill_frames() {
    if (COLORS.length < OPTIONS.colors) {
      generate_colors();
      PROGRESS.now++;
      if (COLORS.length === OPTIONS.colors) PROGRESS.now = COLORS.length;
    } else if (LINES.length < LINES_MAX) {
      generate_lines();
      PROGRESS.now++;
      if (LINES.length === LINES_MAX) PROGRESS.now = LINES.length * OPTIONS.width;
    } else if (FRAMES.length < OPTIONS.frames_max) {
      push_frames();
      PROGRESS.now++;
      if (FRAMES.length === OPTIONS.frames_max) PROGRESS.now = PROGRESS.total;
    }
  }

  function generate_colors() {
    const buffer = new Canvas(OPTIONS.cell_size);
    buffer.draw_rect({
      fill_color: hsla.set(0, 0, COLORS.length * COLOR_STEP + COLOR_STEP, OPTIONS.opacity)
    });
    COLORS.push(buffer.get());
  }

  function generate_lines() {
    if (cols_repeat === 0) {
      LINES.push(new Canvas(COLS * OPTIONS.cell_size, OPTIONS.cell_size).get());
    }
    if (cols_repeat < COLS) {
      LINES[LINES.length - 1].ctx.drawImage(COLORS[Math.floor(Math.random() * (COLORS.length - 1))], cols_repeat * OPTIONS.cell_size, 0);
      cols_repeat++;
      if (cols_repeat === COLS) cols_repeat = 0;
    }
  }

  function push_frames() {
    FRAMES.push(generate_frame());
  }

  function generate_frame() {
    let buffer = new Canvas(COLS * OPTIONS.cell_size, ROWS * OPTIONS.cell_size);
    // buffer.setup_ctx({
    //     globalAlpha:OPTIONS.opacity
    // })
    for (let row = 0; row < ROWS; row++) {
      if (row % 2 == 0) {
        buffer.draw(PERIOD_LINE, 0, row * OPTIONS.cell_size);
      } else {
        buffer.draw(LINES[Math.floor(Math.random() * (LINES.length - 1))], 0, row * OPTIONS.cell_size);
      }
    }
    return buffer.get();
  }

  function update() {
    while (Date.now() - PROGRESS.time < OPTIONS.performance_rate && FRAMES.length < OPTIONS.frames_max) {
      fill_frames();      
    }
    if (FRAMES.length === OPTIONS.frames_max) {
      is_ready = true;
      sprite = new Sprite(FRAMES);
    }
    PROGRESS.time = Date.now();
    RAF.check(FRAMES.length < OPTIONS.frames_max);
  }

  function progress_percent() {    
    return Math.floor((PROGRESS.now / PROGRESS.total) * 100);
  }

  const RAF = new ActionFrame();
  const OPTIONS = set_options(options);
  const COLS = Math.floor(OPTIONS.width / OPTIONS.cell_size);
  const ROWS = Math.floor(OPTIONS.height / OPTIONS.cell_size);
  const LINES_MAX = Math.floor(ROWS / (OPTIONS.cell_size * 2));
  const COLOR_STEP = 100 / OPTIONS.colors;
  const PROGRESS = {
    total: OPTIONS.width * LINES_MAX + OPTIONS.frames_max + OPTIONS.colors,
    now: 0,
    time: 0
  }
  const COLORS = new Array();
  const FRAMES = new Array();
  const LINES = new Array();
  const PERIOD_LINE = draw_period_line();
  let cols_repeat = 0;
  let is_ready = false;
  let sprite = null;


  class VFX_Noise {
    generate() {
      RAF.init(update);
    }
    on_progress(callback) {
      if (!is_ready)
        setTimeout(function() {
          callback(progress_percent());
          this.on_progress(callback);
        }.bind(this), OPTIONS.performance_rate);
    }
    on_progress_end(callback) {
      if (is_ready)
        callback(sprite);
      else
        setTimeout(function() {
          this.on_progress_end(callback);
        }.bind(this), OPTIONS.performance_rate);
    }
  }
  return new VFX_Noise();
}

export default VFX_Noise;