import Canvas from "./Canvas";
import Sprite from './Sprite';
const SceneWrapper = function(OPTIONS) {

  function set_size() {

  }
  const sprite = new Sprite();
  sprite.on_resize = function({
    width,
    height
  }) {
    console.log('on_resize', width, height);

  }
  return sprite;
}

export default SceneWrapper;