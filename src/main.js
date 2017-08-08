//cSpell:ignoreRegExp /[а-я]/
import Display from "./components/Display";
import ActionFrame from "./components/ActionFrame";
import Board from "./components/Board";
import Runnable from "./components/Runnable";
import ResourceLoader from "./components/ResourceLoader";
import AudioController from "./components/AudioController";
import Root from "./components/Root";
import UserInterface from "./components/UserInterface"
const Main = function() {
  const ROOT = new Root();
  const LOOP = new ActionFrame();
  const PROCESS = new Runnable();

  const DISPLAY = new Display(982, window.innerHeight);
  ROOT.add_child(DISPLAY.output);

  const UI = new UserInterface(DISPLAY.output.width, DISPLAY.output.height);
  const BOARD = new Board({
    cell_size:74,
    cols:9,
    rows:6,
    width:DISPLAY.output.width, height:DISPLAY.output.height
  });

  const AUDIO_CONTROLLER = new AudioController();
  const FILE_LOADER = new ResourceLoader(AUDIO_CONTROLLER.getCTX());

  const IMAGES = [
    "1.png",
    "2.png",
    "3.png",
    'ball_1.png',
    'ball_2.png',
    'ball_3.png',
    'ball_4.png',
    'ball_5.png',
    "layout_bottom.png",
    "layout_top.png",
    "path_point.png",
    "sound_off.png",
    "sound_on.png",
  ];
  // const SOUNDS = [];


  const RESOURCES = IMAGES; 
  const IMAGES_READY = new Array(IMAGES.length); 
  

  function init() {
    PROCESS.run = true;
    for (let i = 0; i < RESOURCES.length; i++) {
      const FILE = FILE_LOADER.loadFile(RESOURCES[i]);
      FILE.onLoaded(function() {
        // if (FILE.isSound()) {
        //   AUDIO_CONTROLLER.addTrack(FILE.get());
        //   SOUNDS[i - IMAGES.length] = FILE.name();
        //   FILE_LOADER.incrementDecodeCounter();
        // } 
        // else {          
          IMAGES[i] = FILE.get();          
        // }
        FILE_LOADER.setLoadCount(FILE_LOADER.getLoadCount() + 1);
      });
    }
    LOOP.init(onLoading);
  }

  function on_load_end() {    
    BOARD.setup_sprites({
      floor_tiles: [IMAGES[0], IMAGES[1], IMAGES[2]],
      sphere_sprites: [IMAGES[3], IMAGES[4], IMAGES[5], IMAGES[6], IMAGES[7]],
      path_sprite: IMAGES[10],
    });
    UI.setup_sprites({
      top_panel: IMAGES[9],
      botoom_panel: IMAGES[8],
      sound_on: IMAGES[12],
      sound_off: IMAGES[11],
    })
    BOARD.step();
    DISPLAY.push(UI);
    DISPLAY.push(BOARD);
    
    DISPLAY.print("Loading: " + 100 + "%");
    window.addEventListener("mousemove", on_mouse_move);
    window.addEventListener("click", on_click);
    LOOP.init(update);
  }

  function update() {
    DISPLAY.render();
    LOOP.check(PROCESS.is_running);
  }

  function onLoading() {
    const LOADED_NOW = FILE_LOADER.getProgressPercent();
    const LOADED_COUNT = FILE_LOADER.getLoadCount();
    // const DECODING_PROGRESS = Math.floor(
    //   FILE_LOADER.getDecodeCounter() / SOUNDS.length * 100
    // );
    if (LOADED_NOW >= 0 && LOADED_NOW < 100) {
      DISPLAY.print("Loading: " + LOADED_NOW + "%");
    } 
    // else if (LOADED_COUNT >= IMAGES.length) {
    //   DISPLAY.print("Decoding audio: " + DECODING_PROGRESS + "%");
    // }
    if (LOADED_NOW == 100 && LOADED_COUNT == RESOURCES.length) {
      LOOP.init(on_load_end);
    }
    LOOP.check(LOADED_NOW <= 100 && LOADED_COUNT < RESOURCES.length);
  }

  function on_mouse_move(event) {
    let cor_x = event.clientX - DISPLAY.offsetX;
    UI.on_mouse_move(cor_x, event.clientY);
    BOARD.on_mouse_move(cor_x, event.clientY);
  }
  function on_click(event){
    let cor_x = event.clientX - DISPLAY.offsetX;
    BOARD.on_click(cor_x, event.clientY);
  }

  function onMouseClick(event) {}

  function onResize() {}
  class Main {
    constructor() {
      init();
    }

  }
  return new Main();
};

const MAIN = new Main();