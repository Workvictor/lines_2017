
const Root = function(id = "root") {
  const ROOT_STYLES = {
    position: "fixed",
    width: 100 + "%",
    height: 100 + "%",
    backgroundColor: "#d9cfbc",
    overflow: "hidden",
    opacity: 1
  };
  const ROOT = document.getElementById(id);
addStyles();
  function addStyles(){
    for (let prop in ROOT_STYLES){
      ROOT.style[prop] = ROOT_STYLES[prop];
    }
  }
  class Root {
    
    add_child(child){
      ROOT.appendChild(child);
    }
    remove_child(){

    }
  }
  return new Root();
};
export default Root;
