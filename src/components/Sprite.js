//cSpell:ignoreRegExp /[а-я]/

const Sprite = function(img, key = "default") {
  const animation = {};
  // animation.frame = 0;
  // animation.frame_max = 0;
  animation.keys = new Array();
  addAnimation(key, img);
  setAnimation(key);
  this.x = getCenter(img).x;
  this.y = getCenter(img).y;
  const position = {
    x:0,y:0
  }

  // animation.name = animation.keys[0];

  // sprite.center = {
  //   x: Math.floor(sprite.width / 2),
  //   y: Math.floor(sprite.height / 2)
  // };
  // sprite.x = -sprite.center.x;
  // sprite.y = -sprite.center.y;

  function addAnimation(name, sprites) {
    animation.keys.push(name);
    if (sprites.length) {
      animation[name] = sprites;
    } else {
      animation[name] = [sprites];
    }
  }

  function setAnimation(key) {
    if (animation.keys.includes(key)) {
      animation.name = key;
      animation.frame = 0;
      animation.frame_max = animation[animation.name].length - 1;
    }
  }

  function getCenter(img) {
    return {
      x: Math.floor(img.width / 2),
      y: Math.floor(img.height / 2)
    };
  }

  function step() {
    if (animation.frame < animation.frame_max) animation.frame++;
    else animation.frame = 0;
  }
  class Sprite {
    addAnimation(name, sprites) {
      animation.keys.push(name);
      animation[name] = sprites;
    }
    setAnimation(name) {
      if (animation.keys.includes(name)) {
        animation.name = name;
        animation.frame = 0;
        animation.frame_max = animation[animation.name].length - 1;
      }
    }
    set_position(x,y){
      position.x=x;
      position.y=y;
    }
    get_position(){
      return position
    }
    draw() {
      step();      
      return animation[animation.name][animation.frame];
    }
  }

  return new Sprite();
};

export default Sprite;