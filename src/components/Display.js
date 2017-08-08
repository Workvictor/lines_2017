//cSpell:ignoreRegExp /[а-я]/
import Canvas from "./Canvas";
import TextRaster from "./TextRaster";
const Display = function(width, height) {
  const STYLES = {
    position: 'absolute',
    left:50+"%",
    marginLeft:-Math.floor(width/2)+"px",
    top:0,
  };
  const WIDTH = width;
  const HEIGHT = height;
  const buffering = 3;
  const main_text = new TextRaster();
  const CV = new Canvas(WIDTH, HEIGHT);
  CV.CSS(STYLES);
  const OUTPUT = CV.get();
  const LAYERS = new Array();
  const BUFFER = new Array();
  //class interface
  class Display {
    constructor(){
      this.print("Plaese wait while loading...");
    }
    push(sprite) {
      LAYERS.push(sprite);          
    }
    setParent(parent) {
      parent.appendChild(CV.get());
    }
    setSize(width, height) {
      CV.size = {
        width: width,
        height: height
      };
    }
    print(text) {
      CV.clear();
      const text_sprite = main_text.rasterize(text, OUTPUT.width);                 
      CV.draw(text_sprite, Math.floor((OUTPUT.width / 2) - (text_sprite.width / 2)), Math.floor((OUTPUT.height / 2) - (text_sprite.height / 2)));
    }
    get offsetX(){
      return Math.floor(window.innerWidth/2 - OUTPUT.width/2);
    }
    get output() {
      return OUTPUT;
    }
    render() {
      CV.clear();
      LAYERS.forEach(function(element) {
        CV.draw(element.output);        
      }, this);
    }
  }
  return new Display();
}
export default Display;