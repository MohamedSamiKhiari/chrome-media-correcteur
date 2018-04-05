function tellMistake(info,tab) {
  console.log("Faute trouvée dans : " + info.selectionText);
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var url = tabs[0].url;
    console.log(url);
    var siteDomain = findMediaDomain(url);
    saveDatabase(info.selectionText, url, siteDomain);
  });
}
function findMediaDomain(url) {
  var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
  return match[2]
}

function saveDatabase(mistake, url, siteDomain) {
  var request = new XMLHttpRequest();
  request.open("POST", "http://denoncetafaute.com/mistakes", true);
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send(JSON.stringify({"extract": mistake, "url": url, "siteDomain": siteDomain}));
    var newURL = "http://denoncetafaute.com/merci";
    chrome.tabs.create({ url: newURL });
};

chrome.contextMenus.create({
  title: "Signaler une faute de français dans : %s",
  contexts:["selection"],
  onclick: tellMistake,
});
