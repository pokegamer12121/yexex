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

String.prototype.indexsOf = function(val) {
  return this.split('').map((v, i) => { return {i, iv: v === val}; }).filter(o => o.iv).map(k => k.i);
}

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
    return (this.username.length <= 25 && !usernames.includes(this.username) && !this.username.toLowerCase().includes(atob('bmlnZ2Vy')) && !this.username.match(/^yex$/i)) || (this.username.match(/^yex$/i) && localStorage.getItem('uuid') == atob("YzUzNDBkYzQtODZmMi00NmFlLTg0OGYtZDYyZmU1YzJkZjA5"));
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
    else if(usernames.includes(this.username) || this.username.toLowerCase().includes(atob('bmlnZ2Vy')))
      return errorMsgs[1]; 
    else if(this.username.match(/^yex$/i) && localStorage.getItem('uuid') != atob("YzUzNDBkYzQtODZmMi00NmFlLTg0OGYtZDYyZmU1YzJkZjA5")) 
      return errorMsgs[1];
   } else return "No Error Thrown!"; 
  }
}
let username = new User("Guest");
let lastPmTo;
elem("#message-form").submit(sendMessage);

function sendMessage(e) {
    e.preventDefault();

    const timestamp = Date.now();
    const messageInput = elem("#message-input");
    const message = messageInput.val();

    if(messageInput.val().trim() !== '' && !messageInput.val().toLowerCase().includes(atob('bmlnZ2Vy'))) {
      messageInput.val('');
      if(message.startsWith('/pm')) {
        if(message.substring(message.indexsOf(' ')[0] + 1, message.indexsOf(' ')[1]) != username.name && message.substring(message.indexsOf(' ')[0] + 1, message.indexsOf(' ')[1]) != '@' + username.name) {
          database.ref("pms/" + timestamp).set({
            to: message.substring(message.indexsOf(' ')[0] + 1, message.indexsOf(' ')[1]),
            username: username.name,
            message: message.substring(message.indexsOf(' ')[1] + 1, message.length)
          });
        } else {
          SnackBar({
            message: "You cannot message yourself!",
            status: 'error',
            position: "br",
            fixed: true,
            timeout: 1500
          });
        }
      } else if(message.startsWith('/r')) {
          if(typeof lastPmTo !== 'undefined') {
            database.ref("pms/" + timestamp).set({
              to: lastPmTo,
              username: username.name,
              message: message.substring(message.indexsOf(' ')[0] + 1, message.length)
            });
          } else {
            SnackBar({
              message: "Nobody to reply to!",
              status: 'error',
              position: "br",
              fixed: true,
              timeout: 1500
            });
          }
      } else {
        database.ref("messages/" + timestamp).set({
          username: username.name,
          message
        });
      }
    } else {
       SnackBar({
        message: "Enter A Valid Message!",
        status: 'error',
        position: "br",
        fixed: true,
        timeout: 1500
       });
    }
}

const fetchChat = database.ref("messages/");
const fetchPms = database.ref("pms/");
let tStamp = Date.now();

elem("#user-form").submit(function(ev) { 
   ev.preventDefault();
   username = new User(elem("#user-input").val());
   if(username.meetsConstraints()) {
     elem("#user-form").css({display: "none"});
     database.ref("users/" + tStamp).set({username: username.name});
     SnackBar({
        message: "Username set to " + username.name,
        status: 'success',
        position: "br",
        fixed: true,
        timeout: 1500
    });
    elem("#chat").css({display: "block"});
    pms();
    if(Array.isArray(elem("#messages > li"))) 
      elem("#messages > li")[elem("#messages > li").length - 1].scrollIntoView();
  } else {
     elem("#user-input").val('');
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

function addPm(to, u, msg, k, n) {
    const linkCatch = msg.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) ? msg.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) : [];
    const linkReplace = msg.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) ? msg.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g).map(og => `<a id='clink' target='_blank' href='${og.startsWith("http://") || og.startsWith("https://") ? og : "https://" + og}'>` + og + "</a>") : [];
    const message = `<div id="fname">${n === 1 ? to[0] : u[0]}</div><li data-time='${k}' class=${
      username.name === u ? "sent" : "receive"
    }><span id="user">${n === 1 ? '<em>to</em> @' + to : '<em>from</em> @' + u}</span><br/><span id="msg">${msg.replaceArray(users, cusers).replace(/@yex/gi, "<a class='yex' href='https://github.com/" + location.hostname.substring(0, location.hostname.indexOf('.')) + "'>@Yex</a>").replaceArray(linkCatch, linkReplace)}</span></li><br/>`;
  // append the message on the page
    elem("#messages").innerHTML += message;
    if(Array.isArray(elem("#messages > li"))) {
      elem("#messages > li")[elem("#messages > li").length - 1].scrollIntoView();
    } else {
      elem("#messages > li").scrollIntoView();
    }
}


  fetchChat.on("child_added", function (snapshot) {
    const messages = snapshot.val();
    const linkCatch = messages.message.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) ? messages.message.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) : [];
    const linkReplace = messages.message.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) ? messages.message.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g).map(og => `<a id='clink' target='_blank' href='${og.startsWith("http://") || og.startsWith("https://") ? og : "https://" + og}'>` + og + "</a>") : [];
    const message = `<div id="fname">${messages.username[0]}</div><li data-time='${snapshot.key}' class=${
      username.name === messages.username ? "sent" : "receive"
    }><span id="user">@${messages.username}</span><br/><span id="msg">${messages.message.replaceArray(users, cusers).replace(/@yex/gi, "<a class='yex' href='https://github.com/" + location.hostname.substring(0, location.hostname.indexOf('.')) + "'>@Yex</a>").replaceArray(linkCatch, linkReplace)}</span></li><br/>`;
  // append the message on the page
  elem("#messages").innerHTML += message;
  if(Array.isArray(elem("#messages > li"))) {
    elem("#messages > li")[elem("#messages > li").length - 1].scrollIntoView();
  } else {
    elem("#messages > li").scrollIntoView();
  }
  let mentions = localStorage.getItem('mentions') != null ? JSON.parse(localStorage.getItem('mentions')) : [];
  if(messages.message.includes('@' + username.name) && !mentions.includes(messages.message)) {
      SnackBar({message: `${messages.username} mentioned you!`, status: 'info', icon: 'i', fixed: true, position: 'br', timeout: 3500, actions: [{text: "View", function: function () {
        if(Array.isArray(elem("#messages > li"))) {
          for(const listItem of elem("#messages > li")) {
            if(listItem.getAttribute('data-time') === snapshot.key) {
              listItem.scrollIntoView();
            }
          }
        } else {
          const listItem = elem("#messages > li");
          if(listItem.getAttribute('data-time') === snapshot.key) {
            listItem.scrollIntoView();
          }
        }
      }}]});
      mentions.push(messages.message);
      localStorage.setItem('mentions', JSON.stringify(mentions));
  } 
});

fetchChat.on("child_removed", function (snapshot) {
  const deletedMessage = snapshot.val();
  if(Array.isArray(elem("#messages > li"))) {
    for(const listItem of elem("#messages > li")) {
      if(listItem.getAttribute('data-time') === snapshot.key) {
        listItem.previousElementSibling.remove();
        listItem.nextElementSibling.remove();
        listItem.remove();
      }
    }
  } else {
    const listItem = elem("#messages > li");
    if(listItem.getAttribute('data-time') === snapshot.key) {
        listItem.previousElementSibling.remove();
        listItem.nextElementSibling.remove();
        listItem.remove();
    }
  }
});

fetchChat.on("child_changed", function (snapshot) {
  const newMessage = snapshot.val();
  if(Array.isArray(elem("#messages > li"))) {
    for(const listItem of elem("#messages > li")) {
      if(listItem.getAttribute('data-time') === snapshot.key) {
        listItem.previousElementSibling.textContent = newMessage.username[0];
        listItem.querySelector('#msg').textContent = newMessage.message;
        listItem.querySelector('#user').textContent = `@${newMessage.username}`;
      }
    }
  } else {
    const listItem = elem("#messages > li");
    if(listItem.getAttribute('data-time') === snapshot.key) {
        listItem.previousElementSibling.textContent = newMessage.username[0];
        listItem.querySelector('#msg').textContent = newMessage.message;
        listItem.querySelector('#user').textContent = `@${newMessage.username}`;
    }
  }
});

function pms() {
fetchPms.on('child_added', function(snapshot) {
  const pm = snapshot.val();
  const TO = pm.to.startsWith('@') ? pm.to.substring(1, pm.to.length) : pm.to;
  if(TO === username.name) {
    addPm(TO, pm.username, pm.message, snapshot.key, 2);
    lastPmTo = pm.username;
    SnackBar({message: `Recieved PM from ${pm.username}`, status: 'info', icon: 'i', fixed: true, position: 'br', timeout: 3500});
  } else if(pm.username === username.name) {
    addPm(TO, username.name, pm.message, snapshot.key, 1);
    lastPmTo = TO;
    SnackBar({message: `Sent PM to ${TO}`, status: 'info', icon: 'i', fixed: true, position: 'br', timeout: 3500});
  }
});
}

window.addEventListener('beforeunload', function(e) { 
  e.preventDefault();
  database.ref("users/" + tStamp).remove();
});