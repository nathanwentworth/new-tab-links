
var browser = browser || chrome;
var _links;
var body;
var textarea;
var themeSelect;
var fontSelect;
var options = {
  theme: 'light',
  font: 'monospace'
}

window.addEventListener('load', init, false);

function init() {
  textarea = document.getElementById('textarea');
  body = document.getElementById('body');
  themeSelect = document.getElementById('theme');
  themeSelect.addEventListener('change', changeTheme, false);
  fontSelect = document.getElementById('font');
  fontSelect.addEventListener('change', changeFont, false);
  document.getElementById('edit-button').addEventListener('click', editLinks);
  load();

  time();
  setInterval(time, 1000);
}

function load() {
  browser.storage.sync.get('links', function(item) {
    var textarea = document.getElementById('textarea');
    if (item.links != undefined) {
      textarea.value = item.links.trim();
    }
    console.log(item.links);
    parseLinks(item.links);
    _links = item.links;
    return item.links;
  });
  browser.storage.sync.get('options', function(item) {
    console.log(item.options);
    options = item.options || options;
    loadTheme(options.theme);
    loadFont(options.font);
  });
}

function parseLinks(links) {
  var linksArr;
  if (links != null) {
    linksArr = links.split('\n');
  } else {
    console.log("parseLinks: links is null");
  }
  console.log(linksArr);
  createLinks(linksArr);
}

function createLinks(linksArr) {

  var linkRegex = /\S+\.\S+ .+/;
  var httpRegex = /https?/;

  var listParent = document.querySelector('.list');
  var list = document.createElement('ul');

  if (linksArr != null && linksArr[0] != "") {
    for (var i = 0; i < linksArr.length; i++) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      if (linkRegex.test(linksArr[i])) {
        linksArr[i] = linksArr[i].trim();
        var link = linksArr[i].split(' ')[0];
        if (!httpRegex.test(link)) {
          link = 'http://' + link;
        }
        a.setAttribute('href', link);
        var linkText = linksArr[i].slice(linksArr[i].indexOf(' '));
        a.textContent = linkText;
        a.classList.add('button');
        li.appendChild(a);
      } else {
        if (linksArr[i] === '---' || linksArr[i] === '===') {
          listParent.appendChild(list);
          list = document.createElement('ul');
        } else {
          li.textContent = linksArr[i];
          li.classList.add('header');
        }
      }
      list.appendChild(li);
    }

    listParent.appendChild(list);
  } else {
    var li = document.createElement('li');
    li.innerHTML = 'Click "edit" to add links!<br>Use the format: example.com example<br>URL, a space, and then the title.';
    list.appendChild(li);
  }
}

function editLinks() {
  console.log("edit links clicked");
  var editSection = document.getElementById('edit');

  if (editSection.classList.toggle('hidden')) {
    var links = textarea.value.trim();
    if (links != _links) {
      browser.storage.sync.set({ links: links });
      var elements = document.getElementsByTagName('li');
      while (elements[0]) elements[0].parentNode.removeChild(elements[0]);
      load();
    }
  }
}

function changeTheme(e) {
  var newTheme = options.theme;
  if (e != null) {
    newTheme = e.target.value;
    browser.storage.sync.set({ options: options });
  }
  loadTheme(newTheme);
}

function loadTheme(theme) {
  options.theme = theme;
  themeSelect.value = theme;
  setBodyClass();
}

function changeFont(e) {
  var newFont = options.font;
  if (e != null) {
    newFont = e.target.value;
    browser.storage.sync.set({ options: options });
  }
  loadFont(newFont);
}

function loadFont(font) {
  options.font = font;
  fontSelect.value = font;
  setBodyClass();
}

function setBodyClass() {
  body.setAttribute('class', options.theme + " " + options.font);
  browser.storage.sync.set({ options: options });
}

function time() {
  var d = new Date();
  var hr = d.getHours();
  var min = d.getMinutes();

  if (hr > 12) {
    hr = hr - 12;
  }
  if (min < 10) {
    min = "0" + min;
  }

  document.getElementById('time').textContent = hr + ":" + min;
}

function clear() {
  browser.storage.sync.clear();
}
