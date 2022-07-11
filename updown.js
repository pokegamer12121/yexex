
function setRule(selector, rules) {
  if(document.styleSheets.length > 0) {
    for(const ss of document.styleSheets) {
      const r = ss.cssRules ? [...ss.cssRules] : [...ss.rules];
      if(r.some(v => v.selectorText === selector)) {
        for(const rule of r) {
          if(rule.selectorText === selector) {
            if(typeof rules !== "string") 
              rules.forEach((k, v) => { rule.style[k] = v; });
            else 
              cssToObj(rules).forEach((k, v) => { rule.style[k] = v; });
          }
        }
      } else if(ss === document.styleSheets[document.styleSheets.length - 1]) {
        const propText = typeof rules === "string" ? rules : Object.keys(rules).map(function (p) {
          return p + ":" + (p === "content" ? "'" + rules[p] + "'" : rules[p]);
        }).join(";");
        ss.insertRule(`${selector} { ${propText} }`, r.length);
      }
    }
  } else {
    const style = document.head.appendChild(document.createElement("style")).sheet;
    const propText = typeof rules === "string" ? rules : Object.keys(rules).map(function (p) {
      return p + ":" + (p === "content" ? "'" + rules[p] + "'" : rules[p]);
    }).join(";");
    style.insertRule(`${selector} { ${propText} }`);
  }
}

var b = false;
var nav = document.querySelector('nav.bar');
var up = document.getElementById('updown');
var ud = document.getElementById('ud');
var yes;
var no = document.getElementsByClassName('yex');
var maybe = document.getElementsByClassName('lumi');
var lol2 = false;
function xd() {
  if(b) {
    nav.style.top = "-60px";
    document.body.style.setProperty("--body-margin-top", "0");
    ud.style.transform = "rotate(-180deg)";
    up.style.borderRadius = "10px / 10px";
    up.style.transform = "translateY(130%)";
    up.style.backgroundColor = "#696969";
  } else {
    ud.style.transform = "rotate(0deg)";
    nav.style.top = "0";
    document.body.style.setProperty("--body-margin-top", "75px");
    up.style.borderRadius = "0px";
    up.style.transform = "translateY(0%)";
    up.style.backgroundColor = "transparent";
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

const themeButtons = [...document.querySelectorAll(".dropdown-item a")];

if(localStorage.getItem("theme-color") != null) { 
  document.documentElement.style.setProperty("--theme-clr", localStorage.getItem("theme-color"));
  themeButtons.forEach(value => {
    if(value.getAttribute("onclick").includes(localStorage.getItem("theme-color")))
      value.classList.add("active");     
    else if(value.classList.contains("active"))
      value.classList.remove("active");
    if(localStorage.getItem("theme-custom") == "true")
      themeButtons[3].classList.add("active");
  });
}                                                 
function theme(color, el, custom) {
  if(!custom) {
    localStorage.setItem("theme-custom", "false");
    document.documentElement.style.setProperty("--theme-clr", color);
    localStorage.setItem("theme-color", color);
  } else {
    localStorage.setItem("theme-custom", "true");
    document.querySelector(".dropdown-item > input[type=color]").oninput = function(e) {
      document.documentElement.style.setProperty("--theme-clr", e.target.value);
      localStorage.setItem("theme-color", e.target.value);
    };
  }
  if(el) {
    themeButtons.forEach(value => {
      if(value.classList.contains("active")) {
        value.classList.remove("active");
      }
    });
    el.classList.add("active");
  }
}

document.querySelector('a[data-custom]').addEventListener('click', () => {
  document.querySelector('input[type="color"]#thmclr').click();
});

SnackBar({
    message: "Loading...",
    status: 'info',
    theme: 'darker',
    icon: "i",
    fixed: true,
    position: "br",
    timeout: 1000
});

console.log("%cSite Status", "font-family: arial; color: white; text-shadow: 1px 1px limegreen; border: 1px solid limegreen; font-weight: 600; background: #333; padding: 5px 10px; border-radius: 10px;", "Loading...");

tippy('[data-tippy-content]', {
      arrow: false,
      theme: 'darker',
      offset: [0, -1],
      placement: "bottom"
});

setTimeout(() => { 
    document.querySelector('div.loader').remove();
    document.querySelector('div.loaded-overlay').style.display = 'block';
    console.log("%cSite Status", "font-family: arial; color: white; text-shadow: 1px 1px limegreen; border: 1px solid limegreen; font-weight: 600; background: #333; padding: 5px 10px; border-radius: 10px;", "Loaded Successfully!");
    SnackBar({
      message: "Loaded Successfully!",
      status: 'success',
      theme: 'darker',
      position: "br",
      fixed: true,
      timeout: 1500
    });
}, 1500);

setTimeout(() => document.querySelector('div.loaded-overlay').remove(), 2750);

