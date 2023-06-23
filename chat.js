firebase.initializeApp({
  apiKey: "AIzaSyAa9nIvVqumqkClFO8il19Va0KoQ_wmN8M",
  authDomain: "yexs-chat.firebaseapp.com",
  databaseURL: "https://yexs-chat-default-rtdb.firebaseio.com",
  projectId: "yexs-chat",
  storageBucket: "yexs-chat.appspot.com",
  messagingSenderId: "784190773413",
  appId: "1:784190773413:web:5de305c6e34bc779a6154c"
});
const database = firebase.database();
const auth = firebase.auth();
const storage = firebase.storage();

const elem = (query) => document.querySelector(query);
const elems = (query) => Array.from(document.querySelectorAll(query));
const channelContent = elem("ul#channel-content");

elem("#message-form").addEventListener("submit", messageSub);
elem("#message-input").addEventListener("keydown", function(ev) {
  if(ev.key === "Tab") {
    ev.preventDefault();
    this.setRangeText('\t', this.selectionStart, this.selectionEnd, "end");
  }
})

function scrollChatMessages() {
  const liElems = elems("ul#channel-content > li");
  if(liElems.length > 0)
    liElems.at(-1).scrollIntoView();
}

function replaceArray(str, find, replace) {
  var replaceString = str;
  var regex; 
  for (var i = 0; i < find.length; i++) {
    regex = new RegExp(find[i], "g");
    replaceString = replaceString.replace(regex, replace[i]);
  }
  return replaceString;
}

function strToNode(str) {
  const el = document.createElement("div");
  el.insertAdjacentHTML("beforeend", str);
  return el.children[0];
}

function createCategory(name) {
  return elem("div#categories").appendChild(strToNode(`
    <div class="category" data-name="${name}">
      <label class="name">${name}<input type="checkbox" /></label>
      <div class="channels-container">
        <div class="channels"></div>
      </div>
    </div>
  `));
}

function createChannel(name, type, categoryName) {
  return elem(`div.category[data-name=${categoryName}] div.channels`).appendChild(strToNode(`
    <a href="#${name}" id="${name}" class="channel" data-type="${type}">${name}</a>
  `));
}

function createChatMessage(content, sender={}, timestamp=Date.now()) {
  if(content.trim() !== '') {
    const prevMax = channelContent.scrollHeight - channelContent.clientHeight;
    channelContent.insertAdjacentHTML("beforeend", `
      <li class="chat-message" data-status="${(sender.uid || '') === auth.currentUser.uid ? 'sent' : 'received'}" data-timestamp="${(timestamp || Date.now())}"> 
        <img class='profile-pic' src="${(sender.photoURL || "./favicon.png")}" alt="Profile Pic" loading="lazy">
        <div class="user-message">
          <p class="username">${(sender.displayName || "Chat Bot <span class='bot'>BOT</span>")} <time class="timestamp" datetime="${new Date(timestamp).toISOString()}">${new Date(timestamp).toLocaleString('en-US', { dateStyle: "short", timeStyle: "short" })}</time></p>
          <div class="message-content">${replaceArray(content.trim(), ["\&", "\<", "\>", /*/`{3,4} *(\w*)\s+((?:.|\s)*)`{3,4}/g,*/ /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/g, /@\S+/g], ["&amp;", "&lt;", "&gt;", /*(_, lang, code) => "<pre><code>" + hljs.highlight(code, { language: lang || "plaintext" }).value + "</code></pre>",*/ full => `<a href="${full}">${full}</a>`, full => `<span class='mcolor'>${full}</span>`])}</div>
        </div>
      </li>
    `);
    if(channelContent.scrollTop === prevMax || (sender.uid || '') === auth.currentUser.uid)
      scrollChatMessages();
  }
}

function extractKeys(keys, from) {
  return Object.fromEntries(Object.entries(from || {}).filter(([key]) => keys.includes(key)));
}

function errorNotif(msg) {
  return SnackBar({
    message: msg,
    status: "error",
    position: "br",
    icon: '!',
    fixed: true,
    timeout: 2000
  });
}

function sendMessage(message, clearMessageInput=true) {
  if(message.trim() !== '' && !message.toLowerCase().includes(atob("bmlnZ2Vy"))) {
    database.ref(`channels/${location.hash.slice(1)}/messages/${Date.now()}`).set({
      user: extractKeys(["displayName", "photoURL", "uid"], auth.currentUser),
      message
    }).then(() => clearMessageInput ? elem("#message-input").value = '' : null).catch(err => errorNotif(err.message));
  } else errorNotif("Enter A Valid Message!");
}

const commands = {
  "shrug": function() {
    sendMessage([...arguments].join(' ') + " ¯\\_(ツ)_/¯");
  },
  "tableflip": function() {
    sendMessage([...arguments].join(' ') + " (╯°□°）╯︵ ┻━┻");
  },
  "help": function() {
    createChatMessage("Commands:\n" + Object.keys(this).map(v => `\t>\t/${v}`).join('\n'));
  }
};

function messageSub(e) {
    e.preventDefault();

    const messageInput = elem("#message-input");
    const message = messageInput.value; 

    if(message.startsWith('/')) {
      const cmdName = message.slice(1).split(' ').shift().toLowerCase();
      const cmdArgs = message.split(' ').slice(1);

      if(Object.keys(commands).includes(cmdName)) 
        commands[cmdName](...cmdArgs);
      else errorNotif("Unknown Command.");
    } else sendMessage(message);
}

elem('i[class^="fa"]#eye').onclick = function() {
  this.previousElementSibling.type = this.previousElementSibling.type === "password" ? "text" : "password";
  this.classList.toggle("fa-eye");
  this.classList.toggle("fa-eye-slash");
  this.previousElementSibling.focus();
}

if("user-email" in localStorage && "user-password" in localStorage) {
  auth.signInWithEmailAndPassword(localStorage.getItem("user-email"), localStorage.getItem("user-password")).then(async userCredential => {
    loadMessages();
    const user = userCredential.user;
    const photoRef = storage.ref(`userPhotos/${user.uid}`);
    const photoURL = await photoRef.getDownloadURL();
    elem("#user > img.profile-pic").setAttribute("src", photoURL);
    elem("#user > #user-info > p.username").textContent = user.displayName;
    elem("#user-form").toggleAttribute("hidden");
    elem("#chat").toggleAttribute("hidden");
    scrollChatMessages();
  }).catch(thrownError => errorNotif(thrownError.message));
}

elem("#form-change").onclick = function() {
  if(elem("#user-form").getAttribute("data-mode") === "login") {
    this.textContent = "Login";
    elem("#user-form h1").textContent = "Register";
    elem("#user-form").setAttribute("data-mode", "register");
  } else if(elem("#user-form").getAttribute("data-mode") === "register") {
    this.textContent = "Register";
    elem("#user-form h1").textContent = "Login";
    elem("#user-form").setAttribute("data-mode", "login");
  }
  elems("#photo-input, #username-input").forEach(v => v.toggleAttribute("required"));
}

elem("#user-form").onsubmit = function(ev) { 
   ev.preventDefault();

   if(this.getAttribute("data-mode") === "login")
      auth.signInWithEmailAndPassword(elem("#email-input").value, elem("#password-input").value).then(async userCredential => {
        loadMessages();
        const user = userCredential.user;
        const photoRef = storage.ref(`userPhotos/${user.uid}`);
        const photoURL = await photoRef.getDownloadURL();
        elem("#user img.profile-pic").setAttribute("src", photoURL);
        elem("#user p.username").textContent = user.displayName;
        this.toggleAttribute("hidden");
        elem("#chat").toggleAttribute("hidden");
        scrollChatMessages();
      }).catch(thrownError => errorNotif(thrownError.message));
   else if(this.getAttribute("data-mode") === "register")
      auth.createUserWithEmailAndPassword(elem("#email-input").value, elem("#password-input").value).then(async userCredential => {
        loadMessages();
        const user = userCredential.user;
        const displayName = elem("#username-input").value;
        const photoFile = elem("#photo-input").files[0];
        if(displayName.length > 25 || displayName.toLowerCase().includes(atob('bmlnZ2Vy')))
          throw new TypeError((displayName.length > 25 ? "Username is too long! " : '') + (displayName.toLowerCase().includes(atob("bmlnZ2Vy")) ? "That username is already in use!" : ''));
        const photoRef = (await storage.ref("userPhotos").child(user.uid).put(photoFile)).ref;
        const photoURL = await photoRef.getDownloadURL();
        user.updateProfile({ displayName, photoURL });
        elem("#user img.profile-pic").setAttribute("src", photoURL);
        elem("#user p.username").textContent = displayName;
        this.toggleAttribute("hidden");
        elem("#chat").toggleAttribute("hidden");
        scrollChatMessages();
      }).catch(thrownError => errorNotif(thrownError.message));
      if(this.querySelector("button.toggle-btn").classList.contains("active")) {
        localStorage.setItem("user-email", elem("#email-input").value);
        localStorage.setItem("user-password", elem("#password-input").value);
      }
}

function openFilePicker({ accept="*", multiple=false }) {
	const fileInput = document.createElement("input");
	fileInput.type = "file";
  fileInput.accept = accept;
  fileInput.multiple = multiple;
	if(fileInput.showPicker)
    fileInput.showPicker();
  else fileInput.click();
	return new Promise((res) => {
		fileInput.addEventListener("change", () => res( multiple ? Array.from(fileInput.files) : fileInput.files[0] ));
	});
}

elem("div#user img.profile-pic").onclick = async function() {
  const file = await openFilePicker({ accept: "image/png, image/jpeg" });
  const photoRef = storage.ref("userPhotos/" + auth.currentUser.uid);
  await photoRef.put(file);
  this.src = this.src + '?' + Date.now();
}

function chatChannelChildAdded(snapshot) {
  createChatMessage(snapshot.val().message, snapshot.val().user, Number(snapshot.key));
}
  
function chatChannelChildRemoved(snapshot) {
  for(const listItem of elems("ul#channel-content > li")) {
    if(listItem.getAttribute('data-timestamp') === snapshot.key)
      listItem.remove();
  }
}
  
function chatChannelChildChanged(snapshot) {
  if(messageElem = elems("ul#channel-content > li").find(v => v.getAttribute('data-timestamp') === snapshot.key)) {
    const { message, user: { photoURL, displayName } } = snapshot.val();
    messageElem.querySelector(".profile-pic").src = photoURL;
    messageElem.querySelector(".username").firstChild.replaceWith(new Text(displayName + ' '));
    messageElem.querySelector(".message-content").textContent = message;
  }
}

let hashRef;

async function loadMessages() {
  if(location.hash === '' || location.hash.trim() === "#") location.hash = "general";
  if(hashRef) {
    hashRef.child("messages").off("child_added", chatChannelChildAdded);
    hashRef.child("messages").off("child_removed", chatChannelChildRemoved);
    hashRef.child("messages").off("child_changed", chatChannelChildChanged);
  }
  channelContent.replaceChildren();
  (elem(`a.channel[data-type]${location.hash}`) || createChannel(location.hash.slice(1), "chat", "chats")).closest("div.category[data-name]").querySelector("input[type='checkbox']").checked = true;
  channelContent.setAttribute("data-channel", location.hash.slice(1));
  hashRef = database.ref(`channels/${location.hash.slice(1)}`);
  hashRef.child("messages").on("child_added", chatChannelChildAdded);
  hashRef.child("messages").on("child_removed", chatChannelChildRemoved);
  hashRef.child("messages").on("child_changed", chatChannelChildChanged);
  elem("#message-input").value = '';
  const readonly = (await hashRef.child("readonly").get()).val();
  elem("#message-input").disabled = readonly;
  elem("#message-input").placeholder = readonly ? "You do not have permissions to send messages in this channel." : "Enter Message...";
}
  
window.onhashchange = loadMessages;