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
const auth = firebase.auth();
const storage = firebase.storage();

const elem = (query) => document.querySelector(query);
const elems = (query) => Array.from(document.querySelectorAll(query));

elem("#message-form").addEventListener("submit", sendMessage);
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

function createCategory(name) {
  elem(`div#categories`).insertAdjacentHTML("beforeend", `
    <div class="category" data-name="${name}">
      <label class="name">${name}<input type="checkbox" /></label>
      <div class="channels-container">
        <div class="channels"></div>
      </div>
    </div>
  `)
}

function strToNode(str) {
  const el = document.createElement("div");
  el.insertAdjacentHTML("beforeend", str);
  return el.children[0];
}

function createChannel(name, type, categoryName) {
  elem(`div.category[data-name=${categoryName}] div.channels`).insertAdjacentHTML("beforeend", `
    <a href="#${name}" id="${name}" class="channel" data-type="${type}">${name}</a>
  `);
}

function createChatMessage(sender, content, timestamp) {
  if(content.trim() !== '') {
    document.querySelector("ul#channel-content").insertAdjacentHTML("beforeend", `
      <li class="chat-message" data-status="${(sender.uid || "") === auth.currentUser.uid ? 'sent' : 'received'}" data-timestamp="${(timestamp || Date.now())}"> 
        <img class='profile-pic' src="${sender.photoURL}" alt="Profile Pic" loading="lazy">
        <div class="user-message">
          <p class="username">${(sender.displayName || "User")} <time class="timestamp" datetime="${new Date(parseInt((timestamp || Date.now()))).toISOString()}">${new Date(parseInt((timestamp || Date.now()))).toLocaleString('en-US', { dateStyle: "short", timeStyle: "short" })}</time></p>
          <div class="message-content">${replaceArray(content.trim(), ["\&", "\<", "\>", /*/`{3,4} *(\w*)\s+([^`]*)`{3,4}/g,*/ /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/g, /@\S+/g], ["&amp;", "&lt;", "&gt;", /*(_, lang, code) => "<pre><code>" + hljs.highlight(code, { language: lang || "plaintext" }).value + "</code></pre>",*/ full => `<a href="${full}">${full}</a>`, full => `<span class='mcolor'>${full}</span>`])}</div>
        </div>
      </li>
    `);
    scrollChatMessages();
  }
}

function extractKeys(keys, from) {
  return Object.fromEntries(Object.entries(from).filter(([key]) => keys.includes(key)));
}

function sendMessage(e) {
    e.preventDefault();

    const messageInput = elem("#message-input");
    const message = messageInput.value; 
    const user = extractKeys(["displayName", "photoURL", "uid"], auth.currentUser);

    if(messageInput.value.trim() !== '' && !messageInput.value.toLowerCase().includes(atob('bmlnZ2Vy'))) {
      database.ref(`${location.hash.slice(1)}/${Date.now()}`).set({
        user,
        message
      }).then(() => messageInput.value = '').catch(err => SnackBar({
        message: err.message,
        status: 'error',
        position: "br",
        fixed: true,
        timeout: 1500
      }));
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

elem('i[class^="fa"]#eye').onclick = function() {
  this.previousElementSibling.type = this.previousElementSibling.type === "password" ? "text" : "password";
  this.classList.toggle("fa-eye");
  this.classList.toggle("fa-eye-slash");
  this.previousElementSibling.focus();
};

if("user-email" in localStorage && "user-password" in localStorage) {
  auth.signInWithEmailAndPassword(localStorage.getItem("user-email"), localStorage.getItem("user-password")).then(async userCredential => {
    const user = userCredential.user;
    const photoRef = storage.ref(`userPhotos/${user.uid}`) || storage.ref("userPhotos/default.png");
    const photoURL = await photoRef.getDownloadURL();
    elem("#user > img.profile-pic").setAttribute("src", photoURL);
    elem("#user > #user-info > p.username").textContent = user.displayName;
    elem("#user-form").toggleAttribute("hidden");
    elem("#chat").toggleAttribute("hidden");
    scrollChatMessages();
  }).catch(thrownError => { 
    SnackBar({
      message: thrownError.message,
      status: 'error',
      icon: "!",
      position: "br",
      fixed: true,
      timeout: 2000
    });
    console.error(thrownError);
  });
}

elem("#user-form #form-change").onclick = function() {
  if(elem("#user-form").getAttribute("data-mode") === "login") {
    this.textContent = "Login";
    elem("#user-form h1").textContent = "Sign Up";
    elem("#user-form").setAttribute("data-mode", "register");
  } else if(elem("#user-form").getAttribute("data-mode") === "register") {
    this.textContent = "Sign Up";
    elem("#user-form h1").textContent = "Login";
    elem("#user-form").setAttribute("data-mode", "login");
  }
  elems("#photo-input, #username-input").forEach(v => v.toggleAttribute("required"));
};

elem("#user-form").onsubmit = function(ev) { 
   ev.preventDefault();

   if(this.getAttribute("data-mode").toLowerCase() === "login")
      auth.signInWithEmailAndPassword(elem("#email-input").value, elem("#password-input").value).then(async userCredential => {
        const user = userCredential.user;
        const photoRef = storage.ref(`userPhotos/${user.uid}`);
        const photoURL = await photoRef.getDownloadURL();
        elem("#user > img.profile-pic").setAttribute("src", photoURL);
        elem("#user > #user-info > p.username").textContent = user.displayName;
        this.toggleAttribute("hidden");
        elem("#chat").toggleAttribute("hidden");
        scrollChatMessages();
      }).catch(thrownError => { 
        SnackBar({
          message: thrownError.message,
          status: 'error',
          icon: "!",
          position: "br",
          fixed: true,
          timeout: 2000
        });
        console.error(thrownError);
      });
   else if(this.getAttribute("data-mode").toLowerCase() === "register")
      auth.createUserWithEmailAndPassword(elem("#email-input").value, elem("#password-input").value).then(async userCredential => {
        const user = userCredential.user;
        const displayName = elem("#username-input").value;
        const photoFile = elem("#photo-input").files[0];
        if(displayName.length > 25 || displayName.toLowerCase().includes(atob('bmlnZ2Vy')))
          throw new TypeError((displayName.length > 25 ? "Username is too long! " : '') + (displayName.toLowerCase().includes(atob('bmlnZ2Vy')) ? "That username is already in use!" : ''));
        const photoRef = (await Promise.resolve(storage.ref("userPhotos").child(user.uid).put(photoFile))).ref;
        const photoURL = await photoRef.getDownloadURL();
        user.updateProfile({ displayName, photoURL });
        elem("#user > img.profile-pic").setAttribute("src", photoURL);
        elem("#user > #user-info > p.username").textContent = displayName;
        this.toggleAttribute("hidden");
        elem("#chat").toggleAttribute("hidden");
        scrollChatMessages();
      }).catch(thrownError => { 
        SnackBar({
          message: thrownError.message,
          status: 'error',
          icon: "!",
          position: "br",
          fixed: true,
          timeout: 2500
        });
        console.error(thrownError);
      });
      if(this.querySelector("button.toggle-btn").classList.contains("active")) {
        localStorage.setItem("user-email", elem("#email-input").value);
        localStorage.setItem("user-password", elem("#password-input").value);
      }
};

function openFilePicker({ accept="*", multiple=false }) {
	const fileInput = document.createElement("input");
	fileInput.type = "file";
  fileInput.accept = accept;
  fileInput.multiple = multiple;
	if(fileInput.showPicker)
    fileInput.showPicker();
  else fileInput.click();
	return new Promise(res => {
		fileInput.addEventListener("change", () => res( options.multiple ? Array.from(fileInput.files) : fileInput.files[0] ));
	});
}

elem("div#user img.profile-pic").onclick = async function() {
  const file = await openFilePicker( { accept: "image/png, image/jpeg" } );
  const photoRef = storage.ref("userPhotos/" + auth.currentUser.uid);
  photoRef.put(file);
  const photoURL = await photoRef.getDownloadURL();
  auth.currentUser.updateProfile( { photoURL } );
  this.src = photoURL;
};

function chatChannelChildAdded(snapshot) {
  const val = snapshot.val();
  if(typeof val === "object")
    createChatMessage(val.user, val.message, snapshot.key);
}
  
function chatChannelChildRemoved(snapshot) {
  for(const listItem of document.querySelectorAll("ul#channel-content > li")) {
    if(listItem.getAttribute('data-timestamp') === snapshot.key)
      listItem.remove();
  }
}
  
async function chatChannelChildChanged(snapshot) {
  for(const listItem of document.querySelectorAll("ul#channel-content > li")) {
    if(listItem.getAttribute('data-timestamp') === snapshot.key) {
      const newMessage = snapshot.val();
      listItem.querySelector(".profile-pic").src = newMessage.user.photoURL;
      listItem.querySelector(".username").innerHTML = `${newMessage.user.displayName} <time class="timestamp" datetime=${(new Date(parseInt(snapshot.key))).toISOString()}> ${(new Date(parseInt(snapshot.key))).toLocaleString('en-US', { dateStyle: "short", timeStyle: "short" })} </span>`;
      listItem.querySelector(".message-content").textContent = newMessage.message;
    }
  }
}

let hashRef;
  
window.onhashchange = async () => {
  if(hashRef) {
    hashRef.off("child_added", chatChannelChildAdded);
    hashRef.off("child_removed", chatChannelChildRemoved);
    hashRef.off("child_changed", chatChannelChildChanged);
  }
  elem("ul#channel-content").replaceChildren();
  (elem("a.channel[data-type]:target") || elem(`a.channel[data-type]${location.hash}`)).closest("div.category[data-name]").querySelector("input[type='checkbox']").checked = true;
  elem("ul#channel-content").setAttribute("data-channel", location.hash.slice(1));
  hashRef = database.ref(`${location.hash.slice(1)}/`);
  hashRef.on("child_added", chatChannelChildAdded);
  hashRef.on("child_removed", chatChannelChildRemoved);
  hashRef.on("child_changed", chatChannelChildChanged);
  elem("textarea#message-input").value = '';
  const readonly = (await hashRef.child("readonly").get()).val();
  elem("textarea#message-input").disabled = readonly;
  elem("textarea#message-input").placeholder = readonly ? "You do not have permissions to send messages in this channel." : "Enter Message...";
};

if(location.hash === '' || location.hash === '#')
  location.hash = "#general";
else window.onhashchange();