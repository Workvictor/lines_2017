import Canvas from "./Canvas";
import HSLA from "./HSLA";
import Sprite from "./Sprite";

const TextRaster = function(options) {

  const color_mode = new HSLA();

  const DEFAULTS = {

    text_color: color_mode.set(36, 19, 44, 1),
    stroke_width: 0,
    stroke_color: null,
    shadow_blur: 12,
    shadow_color: color_mode.set(40, 100, 50, 0.5),

    font_size: 18,
    font_height: 1.3,
    font_family: 'Arial, Helvetica, sans-serif',

    text_align: 'center',
    text_baseline: 'top',
    text_padding: 0,
  }

  const OPTIONS = options ? options : DEFAULTS;

  OPTIONS.offset = OPTIONS.shadow_blur + OPTIONS.text_padding;

  function merge_styles() {
    return {
      fillStyle: OPTIONS.text_color,
      strokeStyle: OPTIONS.stroke_color,
      lineWidth: OPTIONS.stroke_width,
      font: OPTIONS.font_size + 'px ' + OPTIONS.font_family,
      shadowBlur: OPTIONS.shadow_blur,
      shadowColor: OPTIONS.shadow_color,
      textAlign: OPTIONS.text_align,
      textBaseline: OPTIONS.text_baseline,
    }
  }


  function rasterize_text(text, limit) {
    const canvas = new Canvas();
    canvas.setup(merge_styles());

    const width = limit ? limit : calculate_width(canvas.textWidth(text));
    const height = calculate_height();

    canvas.size = {
      width: width,
      height: height
    }

    if (limit) {
      const approval_width = limit - calculate_width(0);
      const rows = new Array();
      const separator = ' ';
      const elements = text.split(separator);
      let limit_row = '';
      elements.forEach(function(element, index) {
        const element_width = canvas.textWidth(' ' + element);
        const limit_width = canvas.textWidth(limit_row);

        if (limit_width + element_width < approval_width) {
          const sp = limit_width > 0 ? separator : '';
          limit_row += sp + element;
        } else {
          rows.push(limit_row);
          limit_row = '';
          limit_row += element;
        }
        if (index == elements.length - 1) rows.push(limit_row);

      }, this);

      let text_width = approval_width;
      let offset_top = OPTIONS.shadow_blur + OPTIONS.text_padding;
      let row_height = Math.floor(OPTIONS.font_height * OPTIONS.font_size);
      let text_height = Math.floor(rows.length * row_height + offset_top * 2);      
      let c_width = calculate_width(approval_width);
      let c_height = text_height;

      canvas.size = {
        width: c_width,
        height: c_height
      };

      // canvas.rect({
      //   width: c_width,
      //   height: c_height,
      //   border_color: '#fff'
      // });

      const center = {
        x: Math.floor(c_width / 2),
        y: Math.floor(row_height / 2),
      }
      rows.forEach(function(element, index) {
        canvas.text({
          text: element,
          x: calculate_text_snap(OPTIONS.text_align, c_width).x,
          y: index *row_height+ offset_top,
          text_color: OPTIONS.font_color,
          // shadow_blur: OPTIONS.shadow_blur,
          // shadow_color: OPTIONS.shadow_color
          // stroke_color:OPTIONS.stroke_color,
        });
      }, this);
    } else {
      let offset_top = OPTIONS.shadow_blur + OPTIONS.text_padding;
      canvas.text({
        text: text,
        x: Math.floor(width / 2),
        y: offset_top,
        text_color: OPTIONS.font_color,
        // shadow_blur: OPTIONS.shadow_blur,
        // shadow_color: OPTIONS.shadow_color,
        // stroke_color: OPTIONS.stroke_color,
      });
      // canvas.rect({
      //   width: width,
      //   height: height,
      //   border_color: '#fff'
      // });
    }
    return canvas.output;
  }

  function calculate_text_snap(options_align = 'left', line_width) {
    let snap = {
      x: 0
    };
    switch (options_align) {
      case 'center':
        //
        snap.x = Math.floor(line_width / 2);
        break;

      case 'left':
        //
        snap.x = OPTIONS.offset;
        break;

      case 'right':
        //

        break;
    }
    return snap;
  }

  function calculate_width(text_base_width) {
    return Math.floor(text_base_width + (
      OPTIONS.shadow_blur ?
      OPTIONS.text_padding ?
      OPTIONS.text_padding * 2 + OPTIONS.shadow_blur * 2 :
      OPTIONS.shadow_blur * 2 :
      0
    ))
  }

  function calculate_height() {
    return Math.floor(
      OPTIONS.font_size ?
      OPTIONS.shadow_blur ?
      OPTIONS.text_padding ?
      OPTIONS.text_padding * 2 + OPTIONS.shadow_blur * 2 + OPTIONS.font_size :
      OPTIONS.shadow_blur * 2 + OPTIONS.font_size :
      OPTIONS.font_size : 0
    )
  }

  class TextRaster {
    set options(props) {
      for (let key in props) {
        OPTIONS[key] = props[key];
      }
    }

    rasterize(text, limit) {
      return rasterize_text(text, limit);
    }
  }

  return new TextRaster()
}

export default TextRaster;