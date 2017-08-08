import Canvas from "./Canvas";
import TextRaster from "./TextRaster";
const PopUp = function(options) {
  const OPTIONS = {
    text:options.text,

    width: options.width,
    height: options.height,

    text_color: options.text_color,
    text_shadow_color: options.text_shadow_color,
    text_shadow_blur: options.text_shadow_blur,

    bg_color: options.bg_color,
    border_color: options.border_color,
    shadow_color: options.shadow_color,
    shadow_blur: options.shadow_blur,
  }

  
  
  class PopUp{
    show(){

    }
    hide(){

    }
    on_allow(){

    }
    on_denied(){

    }
  }
  return new PopUp();
}

export default PopUp;