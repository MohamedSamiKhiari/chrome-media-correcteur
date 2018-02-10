var medias = ["lemonde","liberation"];
function tellMistake(info,tab) {
  console.log("Faute trouvée dans : " + info.selectionText);
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var url = tabs[0].url;
    console.log(url);
    var site = findMedia(url);
    console.log(site);
    saveDatabase(info.selectionText, url, site);
  });
}
function findMedia(url) {
  var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
      var arrayLength = medias.length;
      for (var i = 0; i < arrayLength; i++) {
          if(match[2].match(medias[i]) == medias[i]){
            return medias[i];
          }
      }
    }
    else {
        return null;
    }
}
function saveDatabase(mistake, url, site) {
  var request = new XMLHttpRequest();
  request.open("POST", "http://www.oh-hi-denny.com/", true);
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send(JSON.stringify({mistake: mistake, url: url, media: site}));
};

chrome.contextMenus.create({
  title: "Signaler une faute de français dans : %s",
  contexts:["selection"],
  onclick: tellMistake,
});
