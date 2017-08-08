const addStyles = (elem, styles) => {
  for (let prop in styles) {
    elem.style[prop] = styles[prop];
  }
  return elem;  
}
export const INT = value => Math.floor(value);
export const randomRange = (min, max) => INT(min + (Math.random() * (max - min)));

export default {addStyles, INT};