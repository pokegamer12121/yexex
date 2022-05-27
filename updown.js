var b = false;
var nav = document.querySelector('nav.bar');
var up = document.getElementById('updown');
var ud = document.getElementById('ud');
var yes;
var no = document.getElementsByClassName('yex');
var maybe = document.getElementsByClassName('lumi');
var lol2 = false;
let norun = false;
function xd() {
  if(b) {
    nav.style.top="-60px";
    document.body.style.marginTop="0";
    ud.style.transform="rotate(-180deg)";
    up.style.borderRadius="10px / 10px";
    up.style.transform="translateY(130%)";
    up.style.backgroundColor="#696969";
  } else {
    ud.style.transform="rotate(0deg)";
    nav.style.top="0";
    document.body.style.marginTop="75px";
    up.style.borderRadius="0px";
    up.style.transform="translateY(0%)";
    up.style.backgroundColor="transparent";
  }
}

for (var i = 0; i < no.length; i++) {
    no[i].href="https://github.com/" + window.location.href.substring(8, 13);
}
for (var i = 0; i < maybe.length; i++) {
    maybe[i].href="https://github.com/Luminous-Technologies";
}

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

if(localStorage.getItem('uuid') == null) {
  localStorage.setItem('uuid', uuidv4());
}

if(localStorage.getItem('ft') == null) {
  localStorage.setItem('ft', 'true');
} else {
  localStorage.setItem('ft', 'false');
}

const removeAllChildrenOf = (parent) => {
  while (parent.lastChild) {
    parent.removeChild(parent.lastChild);
  }
};

if(window.location.href.endsWith(atob('ZDd5MjdiMTJjNzc4Y2IzNzJrMmxnYTBwNDdoLmh0bWw='))) {
  if(localStorage.getItem('uuid')!=atob("YzUzNDBkYzQtODZmMi00NmFlLTg0OGYtZDYyZmU1YzJkZjA5")) {
    removeAllChildrenOf(document.body);
    document.body.cssText = "margin-top:0px;"
    document.write("<iframe src='404.html' width='100%' height='100%' frameborder='0' style='width: 100%; height:100%; margin:0; position:absolute; top:0;'></iframe>");
    norun=true;
  }
}

function sub(val) {
  if(val == atob('MDcyOTA4') && localStorage.getItem('uuid')==atob("YzUzNDBkYzQtODZmMi00NmFlLTg0OGYtZDYyZmU1YzJkZjA5")) {
    window.open(atob('ZDd5MjdiMTJjNzc4Y2IzNzJrMmxnYTBwNDdoLmh0bWw='), '_self');
  }
  if(val == atob('MDcyOTA4') && localStorage.getItem('uuid')!=atob("YzUzNDBkYzQtODZmMi00NmFlLTg0OGYtZDYyZmU1YzJkZjA5")) {
      SnackBar({
        message: "The password you've entered is incorrect, please try again.",
        status: 'error',
        icon: "!",
        position: "br",
        timeout: 2500
      });
  }
}
if(!norun) {
  SnackBar({
    message: "Loading...",
    status: 'info',
    icon: "i",
    fixed: true,
    position: "br",
    timeout: 1000
  });

  setTimeout(() => {
    tippy('[data-tippy-content]', {
      arrow: false,
      theme: 'darker',
      offset: [0, -1],
      placement: "bottom"
    });
  }, 800)

  setTimeout(() => { 
    document.querySelector('div.loader').remove();
    SnackBar({
      message: "Loaded Successfully",
      status: 'success',
      position: "br",
      fixed: true,
      timeout: 1500
    });
  }, 1500);
}

var lmao = 0;

var lol = 0;
var numpad = {
  hwrap: null, 
  hpad: null, 
  hdisplay: null, 
  hbwrap: null, 
  hbuttons: {},
  init: () => {
    // (A1) WRAPPER
    numpad.hwrap = document.createElement("div");
    numpad.hwrap.id = "numWrap";

    // (A2) ENTIRE NUMPAD ITSELF
    numpad.hpad = document.createElement("div");
    numpad.hpad.id = "numPad";
    numpad.hwrap.appendChild(numpad.hpad);

    // (A3) DISPLAY
    numpad.hdisplay = document.createElement("input");
    numpad.hdisplay.id = "numDisplay";
    numpad.hdisplay.type = "text";
    numpad.hdisplay.placeholder = "Enter Password";
    numpad.hdisplay.disabled = true;
    numpad.hdisplay.value = "0";
    numpad.hpad.appendChild(numpad.hdisplay);

    // (A4) NUMBER BUTTONS
    numpad.hbwrap = document.createElement("div");
    numpad.hbwrap.id = "numBWrap";
    numpad.hpad.appendChild(numpad.hbwrap);

    // (A5) BUTTONS
    let buttonator = (txt, css, fn) => {
      let button = document.createElement("div");
      button.innerHTML = txt;
      button.classList.add(css);
      button.onclick = fn;
      numpad.hbwrap.appendChild(button);
      numpad.hbuttons[txt] = button;
    };
    // 1 to 3
    for (let i=1; i<=3; i++) { buttonator(i, "num", () => { numpad.digit(i); }); }
     // 4 TO 6
    for (let i=4; i<=6; i++) { buttonator(i, "num", () => { numpad.digit(i); }); }
     // 7 TO 9
    for (let i=7; i<=9; i++) { buttonator(i, "num", () => { numpad.digit(i); }); }
    // 0
    buttonator(0, "zero", () => { numpad.digit(0); });
    // .
    buttonator(".", "dot", numpad.dot);
    // OK
    buttonator("✔", "ok", numpad.select);
    // CANCEL
    buttonator("✖", "cx", () => { numpad.hide(1); });
     // BACKSPACE
    buttonator("⌫", "del", numpad.delete);

    // (A6) ATTACH NUMPAD TO HTML BODY
    document.body.appendChild(numpad.hwrap);
  },

  nowTarget: null,
  nowMax: 0,

  // (B2) NUMBER (0 TO 9)
  digit: (num) => {
    let current = numpad.hdisplay.value;
    if (current.length < numpad.nowMax) {
      numpad.hdisplay.value += num;
    }
  },

  // (B3) ADD DECIMAL POINT
  dot: () => {
    if (numpad.hdisplay.value.indexOf(".") == -1) {
      if (numpad.hdisplay.value=="0") { numpad.hdisplay.value = "0."; }
      else { numpad.hdisplay.value += "."; }
    }
  },

  // (B4) BACKSPACE
  delete: () => {
    var length = numpad.hdisplay.value.length;
    if (length == 1) { numpad.hdisplay.value = ''; numpad.hdisplay.placeholder = 'Enter Password'; }
    else { numpad.hdisplay.value = numpad.hdisplay.value.substring(0, length - 1); }
  },

  // (B5) CLEAR ALL
  reset: () => { numpad.hdisplay.value = "0"; },

  // (B6) OK - SET VALUE
  select: () => {
    lmao = numpad.hdisplay.value;
    if(numpad.hdisplay.value != atob('MDcyOTA4')) {
      numpad.hdisplay.value = '';
      SnackBar({
        message: "The password you've entered is incorrect, please try again.",
        status: 'error',
        icon: "!",
        position: "br",
        timeout: 2500
      });
      if(lol != 3) {lol += 1;}
    } else {
      numpad.hide(); 
    }
    if(lol == 3) {
      setTimeout(function() { lol-=1; }, 30000);
      setTimeout(function() { lol-=1; }, 60000);
      setTimeout(function() { lol-=1; }, 90000);
      numpad.hide();
    }
    numpad.nowTarget.dispatchEvent(new Event("numpadok"));
  },

  // (C) ATTACH NUMPAD TO INPUT FIELD
  attach: (opt) => {

    // (C1) DEFAULT OPTIONS
    if (opt.max === undefined) { opt.max = 255; }
    if (opt.decimal === undefined) { opt.decimal = true; }

    // (C2) GET + SET TARGET OPTIONS
    opt.target.readOnly = true; // PREVENT ONSCREEN KEYBOARD
    opt.target.dataset.max = opt.max;
    opt.target.dataset.decimal = opt.decimal;
    opt.target.addEventListener("click", () => { if(lol != 3) {numpad.show({target: opt.target, now: ''});}});

    // (C3) ATTACH CUSTOM LISTENERS
    if (opt.onselect) {
      opt.target.addEventListener("numpadok", opt.onselect);
    }
    if (opt.oncancel) {
      opt.target.addEventListener("numpadcx", opt.oncancel);
    }
  },

  // (D) SHOW NUMPAD
  show: (x) => {
    numpad.hdisplay.value = x.now;

    // (D2) SET MAX ALLOWED CHARACTERS
    numpad.nowMax = x.target.dataset.max;

    // (D3) SET DECIMAL
    if (x.target.dataset.decimal == "true") {
      numpad.hbwrap.classList.remove("noDec");
    } else {
      numpad.hbwrap.classList.add("noDec");
    }

    // (D4) SET CURRENT TARGET
    numpad.nowTarget = x.target;

    // (D5) SHOW NUMPAD
    numpad.hpad.classList.add("open");
  },

  // (E) HIDE NUMPAD
  hide: (manual) => {
    if (manual) { numpad.nowTarget.dispatchEvent(new Event("numpadcx")); }
    numpad.hpad.classList.remove("open");
  }
};
window.addEventListener("DOMContentLoaded", numpad.init);
