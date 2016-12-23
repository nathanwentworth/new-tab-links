
function Load() {
  // var links = localStorage.getItem('links');
  // var links;
  chrome.storage.sync.get('links', function(item) {
    var textarea = document.getElementById('textarea');
    textarea.value = item.links.trim();
    console.log(item.links);
    ParseLinks(item.links);
    return item.links;
  });
  
}
Load();

function ParseLinks(links) {
  var linksArr;
  if (links != null) {
    linksArr = links.split('\n');
  } else {
    console.log("ParseLinks: links is null");
  }
  console.log(linksArr);
  CreateLinks(linksArr);
}

function CreateLinks(linksArr) {

  var linkRegex = /\S+\.\S+ .+/;
  
  var list = document.getElementById('list');

  if (linksArr != null && linksArr[0] != "") {
    for (var i = 0; i < linksArr.length; i++) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      if (linkRegex.test(linksArr[i])) {
        linksArr[i] = linksArr[i].trim();
        a.setAttribute('href', 'http://' + linksArr[i].split(' ')[0])
        var linkText = linksArr[i].slice(linksArr[i].indexOf(' '));
        a.textContent = linkText;
      } else {
        a.setAttribute('href', '#');
        a.textContent = "Invalid URL!";
        a.style.color = "#ff0000";
      }
      li.appendChild(a);
      list.appendChild(li);
    }
  } else {
    var li = document.createElement('li');
    li.innerHTML = "Click \"edit\" to add links!<br>Use the format: example.com example<br>URL, a space, and then the title.";
    list.appendChild(li);
  }
}
  
function EditLinks() {
  console.log("edit links clicked");
  var editSection = document.getElementById('edit');
  if (editSection.style.display != "none") {
    editSection.style.display = "none";
  } else {
    editSection.style.display = "block";
  }

  var textarea = document.getElementById('textarea');
  var links = textarea.value.trim();

  // localStorage.setItem('links', links);
  chrome.storage.sync.set({
    links: links
  });
  var elements = document.getElementsByTagName('li');
  while (elements[0]) elements[0].parentNode.removeChild(elements[0]);
  Load();
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
  
  document.getElementById("hour").textContent = "" + hr;
  document.getElementById("minute").textContent = "" + min;
}
time();
setInterval(time, 1000);

document.getElementById('edit-button').addEventListener('click', EditLinks);

