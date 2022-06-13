/* 

 \|          /|\           |/   
  \|      {| [|] |}       |/

*/

/* </> \---> 𝙔𝙚𝙭'𝙨 𝙅𝙖𝙫𝙖𝙎𝙘𝙧𝙞𝙥𝙩 𝘼𝙙𝙙𝙤𝙣𝙨 <---/ </> */

String.prototype.toNumber = function() {
  return parseInt(this);
};

Number.prototype.isInteger = function() {
  return (parseFloat(this) | 0) === parseFloat(this);
};

Array.prototype.deleteItem = function(item) {
  this.splice(this.indexOf(item), 1);
};

Array.prototype.deleteIndex = function(index) {
  this.splice(index, 1);
};

Array.prototype.removeItem = function(item) {
  this.splice(this.indexOf(item), 1);
};

Array.prototype.removeIndex = function(index) {
  this.splice(index, 1);
};

Array.prototype.clear = function() {
  while(this[0]) this.deleteIndex(0);
};

Array.prototype.push = function(...items) {
  this.splice(this.length, 0, ...items);
};

Array.prototype.unshift = function(...items) {
  this.splice(0, 0, ...items);
};

Array.prototype.prepend = function(...items) {
  this.unshift(...items);
}

Array.prototype.append = function(item) {
  this.push(item);
};

Array.prototype.reorder = function() {
  let nums = 0;
  let letters = 0;
  this.forEach(value => {
    if(!isNaN(value)) {
        nums++;
    } else {
        letters++;
    }
  });
  if(nums > letters && letters == 0) {
    this.sort(function(a, b) { return a - b; });
    return this;
  } else if(letters > nums && nums == 0) {
    this.sort();
    return this;
  } else if(nums != 0 && letters != 0) {
    const numArray = [], letArray = [];
    this.forEach(value => {
      if(!isNaN(value)) {
        numArray.push(value);
      } else {
        letArray.push(value);
      }
    });
    numArray.sort(function(a, b) { return a - b; });
    letArray.sort();
    this.clear();
    this.push(...numArray, ...letArray);
    return this;
  }
};

Array.prototype.toObject = function() {
  let arrayObj = {};
  this.forEach((v, i) => arrayObj[i] = v);
  return arrayObj;
};

Array.prototype.toMap = function() {
  let arrayMap = new Map();
  this.forEach((v, i) => arrayMap.set(i, v));
  return arrayMap;
};

Array.prototype.toSet = function() {
  let arraySet = new Set();
  this.forEach(v => arraySet.add(v));
  return arraySet;
};

Array.prototype.subarray = function(start, end) {
  return this.slice(start, end);
};

Array.prototype.subarr = function(start, length) {
  return this.slice(start, start + length);
};

Array.prototype.replace = function(rval, rwith) {
  let replaceItems = [];
  if(rval instanceof RegExp) {
    this.forEach(value => {
      const matches = value.match(rval) ? value.match(rval) : null;
      replaceItems.push(matches != null ? value.replace(...matches, rwith) : value);
    });
  } else {
    this.forEach(value => {
      const matches = value.match(new RegExp(rval, "i")) ? value.match(new RegExp(rval, "i")) : null;
      replaceItems.push(matches != null ? value.replace(...matches, rwith) : value);
    });
  }
  return replaceItems;
};

Element.prototype.setCss = function(name, value) {
  this.style[name] = value;
};

Element.prototype.getCss = function(name) {
  return this.style[name];
};

Element.prototype.setHtml = function(value) {
  this.innerHTML = value;
};

Element.prototype.getHtml = function() {
  return this.innerHTML;
};

HTMLElement.prototype.click = function(callback) {
  this.onclick = function(e) { callback(e); };
};

Element.prototype.hover = function(onin, onout) {
  if(onin) this.onmouseenter = function(e) { onin(e); };
  if(onout) this.onmouseleave = function(e) { onout(e); };
};

Element.prototype.keydown = function(key, callback) {
  this.onkeydown = function(e) { if(e.key == key) callback(e); };
};

Element.prototype.keypress = function(key, callback) {
  this.onkeypress = function(e) { if(e.key == key) callback(e); };
};

Element.prototype.keyup = function(key, callback) {
  this.onkeyup = function(e) { if(e.key == key) callback(e); };
};

HTMLElement.prototype.focus = function(callback) {
  this.onfocus = function(e) { callback(e); };
};

Element.prototype.unfocus = function(callback) {
  this.onblur = function(e) { callback(e); };
};

Element.prototype.load = function(callback) {
  this.onload = function(e) { callback(e); };
};

Element.prototype.unload = function(callback) {
  this.onunload = function(e) { callback(e); };
};

Element.prototype.input = function(callback) {
  this.oninput = function(e) { callback(e); };
};

Element.prototype.scroll = function(callback) {
  this.onscroll = function(e) { callback(e); };
};

HTMLFormElement.prototype.submit = function(callback) {
  this.onsubmit = function(e) { callback(e); };
};

NodeList.prototype.toArray = function() {
  return [...this];
};

function elem(...query) {
  const elemArray = document.querySelectorAll([...query].join(", ")).toArray();
  return elemArray.length != 1 ? elemArray : document.querySelector(query);
}

Object.prototype.includes = function(query) {
  return this.hasOwnProperty(query);
};

Object.prototype.createInstance = function() {
  return Object.create(this);
};

Object.prototype.setKey = function(key, value) {
  this[key] = value;
};

Object.prototype.deleteKey = function(key) {
  delete this[key];
};

Object.prototype.forEach = function(callback) {
  for (const [key, value] of Object.entries(this)) {
    callback(key, value);
  }
};

Object.prototype.toArray = function() {
  let objArray = [];
  this.forEach((k, v) => {
    const kvObj = {};
    kvObj.setKey(k, v);
    objArray.push(kvObj);
  });
  return objArray;
};

Object.prototype.keys = function() {
  return Object.keys(this);
};

Object.prototype.values = function() {
  return Object.values(this);
};

/*

  /|      {| [|] |}       |\
 /|          \|/           |\

*/

const firebaseConfig = {
  apiKey: "AIzaSyAa9nIvVqumqkClFO8il19Va0KoQ_wmN8M",
  authDomain: "yexs-chat.firebaseapp.com",
  databaseURL: "https://yexs-chat-default-rtdb.firebaseio.com",
  projectId: "yexs-chat",
  storageBucket: "yexs-chat.appspot.com",
  messagingSenderId: "784190773413",
  appId: "1:784190773413:web:5de305c6e34bc779a6154c"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let usernames = [];
let users = [];
let cusers = [];
const fetchUsers = database.ref("users/");
fetchUsers.on("child_added", function (snapshot) {
  usernames.push(snapshot.val().username.toLowerCase());
  users.push("@" + snapshot.val().username);
  cusers.push("<span id='mcolor'>@" + snapshot.val().username + "</span>");
});

fetchUsers.on("child_removed", function (snapshot) {
  usernames.deleteItem(snapshot.val().username.toLowerCase());
  users.deleteItem("@" + snapshot.val().username);
  cusers.deleteItem("<span id='mcolor'>@" + snapshot.val().username + "</span>");
});

class User {
  constructor(name) {
    this.username = name;
  }
  meetsConstraints() {
    return (this.username.length <= 25 && !usernames.includes(this.username) && !this.username.match(/^yex$/i)) || (this.username.match(/^yex$/i) && localStorage.getItem('uuid') == atob("YzUzNDBkYzQtODZmMi00NmFlLTg0OGYtZDYyZmU1YzJkZjA5"));
  }
  changeUsername(newName) {
    usernames.deleteItem(this.username);
    this.username = newName;
    usernames.push(newName);
    users = usernames.map((og) => "@" + og);
    cusers = users.map((og) => "<span id='mcolor'>" + og + "</span>");
  }
  get name() {
    return this.username;
  }
  get errorMsg() {
   const errorMsgs = ["That username is too long! max is 25 chars", "That username is in use!"]; 
   if(!this.meetsConstraints()) {
    if(this.username.length > 25)
      return errorMsgs[0];
    else if(usernames.includes(this.username))
      return errorMsgs[1]; 
    else if(this.username.match(/^yex$/i) && localStorage.getItem('uuid') != atob("YzUzNDBkYzQtODZmMi00NmFlLTg0OGYtZDYyZmU1YzJkZjA5")) 
      return errorMsgs[1];
   } else return "No Error Thrown!"; 
  }
}
let username = new User("Guest");
elem("#message-form").submit(sendMessage);

function sendMessage(e) {
    e.preventDefault();

    // get values to be submitted
    const timestamp = Date.now();
    const messageInput = elem("#message-input");
    const message = messageInput.value;

  // clear the input box
    messageInput.value = "";
    
  // create db collection and send in the data
    database.ref("messages/" + timestamp).set({
      username: username.name,
      message
    });
}

String.prototype.replaceArray = function(find, replace) {
  var replaceString = this;
  var regex; 
  for (var i = 0; i < find.length; i++) {
    regex = new RegExp(find[i], "g");
    replaceString = replaceString.replace(regex, replace[i]);
  }
  return replaceString;
};

const fetchChat = database.ref("messages/");
let tStamp = Date.now() + 250;

elem("#user-form").submit(function(ev) { 
   ev.preventDefault();
   username = new User(elem("#user-input").value);
   if(username.meetsConstraints()) {
     elem("#user-form").setCss("display", "none");
     database.ref("users/" + tStamp).set({username: username.name});
     SnackBar({
        message: "Username set to " + username.name,
        status: 'success',
        position: "br",
        fixed: true,
        timeout: 1500
    });
    elem("#chat").setCss("display", "block");
    elem("#messages > li")[elem("#messages > li").length - 1].scrollIntoView();
  } else {
     elem("#user-input").value = "";
     SnackBar({
        message: username.errorMsg,
        status: 'error',
        icon: "!",
        position: "br",
        fixed: true,
        timeout: 2000
      });
   } 
  });
  fetchChat.on("child_added", function (snapshot) {
  const messages = snapshot.val();
  const linkCatch = messages.message.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) ? messages.message.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) : [];
  const linkReplace = messages.message.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) ? messages.message.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g).map(og => `<a id='clink' target='_blank' href='${og.startsWith("http://") || og.startsWith("https://") ? og : "https://" + og}'>` + og + "</a>") : [];
  const message = `<div id="fname">${messages.username.substring(0, 1)}</div><li class=${
    username === messages.username ? "sent" : "receive"
  }><span id="user">@${messages.username}</span><br/><span id="msg">${messages.message.replaceArray(users, cusers).replace(/@yex/gi, "<a class='yex' href='https://github.com/" + window.location.href.substring(8, 13) + "'>@Yex</a>").replaceArray(linkCatch, linkReplace)}</span></li><br/>`;
  // append the message on the page
  elem("#messages").innerHTML += message;
  if(elem("#messages > li") instanceof Array) {
    elem("#messages > li")[elem("#messages > li").length - 1].scrollIntoView();
  } else {
    elem("#messages > li").scrollIntoView();
  }
  let mentions = localStorage.getItem('mentions') != null ? JSON.parse(localStorage.getItem('mentions')) : [];
  if(messages.message.includes('@' + (username ? username : localStorage.uuid)) && !mentions.includes(messages.message)) {
      SnackBar({message: `${messages.username} mentioned you!`, status: 'info', icon: 'i', fixed: true, position: 'br', timeout: 3500, actions: [{text: "View", function: function () {
        for (let lm of elem("#messages > li")) {
          if(lm.children[2].textContent == messages.message && lm.children[0].textContent == messages.username) {
            lm.scrollIntoView();
          }
        }
      }}]});
      mentions.push(messages.message);
      localStorage.setItem('mentions', JSON.stringify(mentions));
  } 
});

fetchChat.on("child_removed", function (snapshot) {
  const deletedMessage = snapshot.val();
  for(const listItem of elem("#messages > li")) {
    if(listItem.textContent.includes(deletedMessage.username) && listItem.textContent.includes(deletedMessage.message)) {
      listItem.previousElementSibling.remove();
      listItem.children[1].remove();
      listItem.nextElementSibling.remove();
      listItem.remove();
    }
  }
  if(elem("#messages > li").length > 0) elem("#messages > li")[elem("#messages > li").length - 1].scrollIntoView();
});
  window.onunload = () => database.ref("users/" + tStamp).remove();