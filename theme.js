if(localStorage.getItem("theme-color") != null) { 
  document.documentElement.style.setProperty("--theme-clr", localStorage.getItem("theme-color"));
}