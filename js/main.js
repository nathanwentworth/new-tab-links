var browser = browser || chrome;
var _links;
var body;
var timeElem;
var editSection;
var listParent;
var textarea;
var themeSelect;
var fontSelect;
var options = {
  theme: 'light',
  font: 'monospace'
}
var version = '2018-05-30'

window.addEventListener('load', init, false);

function init() {
  textarea = document.getElementById('textarea');
  body = document.getElementById('body');
  listParent = document.querySelector('.list');
  themeSelect = document.getElementById('theme');
  themeSelect.addEventListener('change', changeTheme, false);
  fontSelect = document.getElementById('font');
  fontSelect.addEventListener('change', changeFont, false);
  document.getElementById('edit-button').addEventListener('click', editLinks);

  timeElem = document.getElementById('time');
  editSection = document.getElementById('edit')
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
  var lastRowWasHeader = false;

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
        lastRowWasHeader = false;
      } else {
        if (linksArr[i] === '\n' || linksArr[i] === '') {
          lastRowWasHeader = false;
          continue;
        } else if (linksArr[i] === '---' || linksArr[i] === '===') {
          lastRowWasHeader = false;
          listParent.appendChild(list);
          list = document.createElement('ul');
          continue;
        } else {
          li.textContent = linksArr[i];
          if (lastRowWasHeader) {
            li.classList.add('text');
          } else {
            li.classList.add('header');
          }
          lastRowWasHeader = true;
        }
      }
    }
    list.appendChild(li);
  }

  listParent.appendChild(list);
}

function editLinks() {
  if (!editSection.classList.toggle('hidden')) {
    return;
  }

  var links = textarea.value.trim();
  if (links != _links) {
    browser.storage.sync.set({ links: links });
    while (listParent.childNodes[0]) listParent.removeChild(listParent.childNodes[0]);
    load();
  }
}

function changeTheme(e) {
  if (!e) { return; }
  var newTheme = options.theme;
  newTheme = e.target.value;
  browser.storage.sync.set({ options: options });
  loadTheme(newTheme);
}

function loadTheme(theme) {
  options.theme = theme;
  themeSelect.value = theme;
  setBodyClass();
}

function changeFont(e) {
  if (!e) { return; }
  var newFont = options.font;
  newFont = e.target.value;
  browser.storage.sync.set({ options: options });
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

  if (hr > 12) { hr = hr - 12; }
  if (hr < 10) { hr = "0" + hr; }
  if (min < 10) { min = "0" + min; }

  timeElem.textContent = hr + ":" + min;
}

function clear() {
  browser.storage.sync.clear();
}
