import Canvas from "./Canvas";
import HSLA from "./HSLA";
import TextRaster from "./TextRaster";

export const text_db = {
  loading: "loading",
  menu: "menu",
  menu_profile: "profile",
  menu_projects: "projects",
  yes: "yes",
  no: "no"
};
const UserInterface = function(width, height) {
  const hsla = new HSLA();

  const WIDTH = width;
  const HEIGHT = height;
  const SPRITES = {};
  const menu = {
    offset_top: 50,
    element_width: 150,
  };
  menu.new_game = {
    x: 0,
    y: menu.offset_top,
    default: update_menu_element({
      text: "New Game",
      font_size: 16,
      font_color: hsla.set(35, 20, 45, 1),
      shadow_blur: 6,
      shadow_color: hsla.set(40, 85, 65, 0.5)
    }),
    active: update_menu_element({
      text: "New Game",
      font_size: 22,
      font_color: hsla.set(40, 75, 70, 1),
      shadow_blur: 12,
      shadow_color: hsla.set(40, 85, 65, 1)
    }),
    is_mouse_over: false
  };

  menu.contacts = {
    x: menu.element_width + 10,
    y: menu.offset_top,
    default: update_menu_element({
      text: "Contacts",
      font_size: 16,
      font_color: hsla.set(35, 20, 45, 1),
      shadow_blur: 6,
      shadow_color: hsla.set(40, 85, 65, 0.5)
    }),
    active: update_menu_element({
      text: "Contacts",
      font_size: 22,
      font_color: hsla.set(40, 75, 70, 1),
      shadow_blur: 12,
      shadow_color: hsla.set(40, 85, 65, 1)
    }),
    is_mouse_over: false
  }

  menu.header = {
    x: Math.floor(WIDTH / 2 - menu.element_width / 2),
    y: menu.offset_top,
    default: update_menu_element({
      text: "Lines",
      font_size: 32,
      font_color: hsla.set(40, 75, 70, 1),
      shadow_blur: 12,
      shadow_color: hsla.set(40, 85, 65, 1)
    })
  }


  const CANVAS = new Canvas(width, height);

  function draw_bg(width, height) {
    let canvas = new Canvas(width, height);
    canvas.draw(SPRITES.top_panel, 0, 0);
    canvas.draw(SPRITES.botoom_panel, 0, height - SPRITES.botoom_panel.height);
    add_version(canvas);
    SPRITES.bg = canvas.output;
  }

  function update_menu_element({
    text,
    font_size,
    font_color,
    shadow_blur,
    shadow_color,
    text_padding
  }) {
    let raster = new TextRaster();
    raster.options = {
      font_size: font_size,
      font_color: font_color,
      shadow_blur: shadow_blur,
      shadow_color: shadow_color,
      text_align: "center"
    };
    let element = raster.rasterize(text, menu.element_width);
    let canvas = new Canvas(element.width, element.height);
    canvas.draw(element);

    let offset = shadow_blur ? shadow_blur : 0 + text_padding ? text_padding : 0;
    canvas.output.path =
      canvas.pathStart(canvas.point(offset, offset)).
    lineTo(canvas.point(canvas.output.width - offset, offset)).
    lineTo(canvas.point(canvas.output.width - offset, canvas.output.height - offset)).
    lineTo(canvas.point(offset, canvas.output.height - offset)).
    lineTo(canvas.point(offset, offset)).closePath();
    return canvas.output;
  }

  function update_menu(width, height) {
    let canvas = new Canvas(width, height);

    let new_game_text = menu.new_game.is_mouse_over ? menu.new_game.active : menu.new_game.default;
    menu.new_game.path = menu.new_game.default.path;

    let contacts_text = menu.contacts.is_mouse_over ? menu.contacts.active : menu.contacts.default;
    menu.contacts.path = menu.contacts.default.path;

    let lines_text = menu.header.default;

    menu.new_game.offsetY = menu.new_game.y - Math.floor(menu.new_game.default.height / 2);
    canvas.draw(new_game_text, menu.new_game.x, menu.new_game.y - Math.floor(new_game_text.height / 2));


    canvas.draw(contacts_text, new_game_text.width + 10, menu.offset_top - Math.floor(contacts_text.height / 2));
    canvas.draw(lines_text, Math.floor((width / 2) - (lines_text.width / 2)), menu.offset_top - Math.floor(lines_text.height / 2));
    SPRITES.menu = canvas.output;
  }


  function update_output(width, height) {
    let canvas = new Canvas(width, height);
    canvas.clear();
    canvas.draw(SPRITES.bg);
    canvas.draw(SPRITES.menu);
    SPRITES.output = canvas.output;
  }

  function add_version(canvas) {
    let raster = new TextRaster();
    raster.options = {
      font_size: 10,
      font_color: hsla.set(0,0,100),
      shadow_blur: 0,
      text_align: "center"
    };
    let element = raster.rasterize('v 0.0.2', menu.element_width);    
    canvas.draw(element, WIDTH - element.width,HEIGHT-element.height);
  }



  function init() {
    draw_bg(WIDTH, HEIGHT);
    update_menu(WIDTH, HEIGHT);
    update_output(WIDTH, HEIGHT);
  }

  class UserInterface {

    on_mouse_move(x, y) {
      if (CANVAS.is_point_in_path(menu.new_game.path, x, y - menu.new_game.offsetY)) {
        if (!menu.new_game.is_mouse_over) {
          menu.new_game.is_mouse_over = true;
          update_menu(width, height);
          update_output(width, height);
        }
      } else if (menu.new_game.is_mouse_over) {
        menu.new_game.is_mouse_over = false;
        update_menu(width, height);
        update_output(width, height);
      }
    }
    update() {}
    setup_sprites({
      top_panel,
      botoom_panel,
      sound_on,
      sound_off
    }) {
      if (top_panel != undefined) SPRITES.top_panel = top_panel;
      if (botoom_panel != undefined) SPRITES.botoom_panel = botoom_panel;
      if (sound_on != undefined) SPRITES.sound_on = sound_on;
      if (sound_off != undefined) SPRITES.sound_off = sound_off;
      init();
    }
    get output() {
      return SPRITES.output;
    }
  }
  return new UserInterface();
};
export default UserInterface;