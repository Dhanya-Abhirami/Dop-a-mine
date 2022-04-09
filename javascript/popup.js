var config = {
  pixels : 10000
}; 
function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}

function refreshCurrentTab() {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var id = tab.id;
    chrome.tabs.reload(id);
  });


}

function renderStatus(statusText)
{
  document.getElementById('status').innerHTML = statusText;
}

function addSiteFromPopup(url)
{
  var siteURLs = localStorage["siteURLs"];
  var sitePXs = localStorage["sitePxs"];

  currentDomain = url.split('/')[2]; 

  var siteURLList;
  var sitePXList;

  if(siteURLs == null)
  {
		siteURLList = [];
    sitePXList = [];
	}
  else {
    siteURLList = siteURLs.split(",");
    sitePXList = sitePXs.split(",");
  }
  siteURLList.push(currentDomain);
  sitePXList.push(config.pixels); 

  localStorage["siteURLs"] = siteURLList;
  localStorage["sitePxs"] = sitePXList;

  renderStatus(reloadPage());
  document.getElementById("refresh-container").addEventListener("click", function() {
    refreshCurrentTab();
    }, false);

}

function removeSiteFromPopup(url) {
  var siteURLs = localStorage["siteURLs"];
  var sitePXs = localStorage["sitePxs"];
  currentDomain = url.split('/')[2];
  var siteArray = siteURLs.split(",");
  var pxArray = sitePXs.split(",");
	for(var i = 0; i < siteArray.length; i++)
	{
		if(currentDomain.indexOf(siteArray[i]) > -1)
		{
			siteArray.splice(i, 1);
      pxArray.splice(i, 1);
      localStorage["siteURLs"] = siteArray;
    	localStorage["sitePxs"] = pxArray;
      renderStatus(reloadPage());
      document.getElementById("refresh-container").addEventListener("click", function() {
        refreshCurrentTab();
        }, false);
      return;
		}
	}
}

function siteBlocked(url)
{
	var siteURLs = localStorage["siteURLs"];
	if(typeof siteURLs == 'undefined')
		return false
	var siteArray = siteURLs.split(",");
	for(var i = 0; i < siteArray.length; i++)
	{
		if((url.indexOf(siteArray[i]) > -1) && siteArray[i] != '')
		{
			websiteIndex = i;
			return true;
		}
	}
	return false;
}

function blockedText(urlFound) {
  return "../html/blockedText.html";
}

function notBlockedText(urlFound) {
  const reader = new FileReader();
  reader.readAsText("../html/notBlockedText.html");
  return reader;
}

function noSitesText(urlFound) {
  const reader = new FileReader();
  reader.readAsText("../html/noSitesText.html");
  return reader;
}

function reloadPage() {
  const reader = new FileReader();
  reader.readAsText("../html/reloadPage.html");
  return reader;
}


document.addEventListener('DOMContentLoaded', function()
{
	getCurrentTabUrl(function(url)
	{
    var siteURLs = localStorage["siteURLs"];
		if(siteURLs != null && siteBlocked(url))
		{
			renderStatus(blockedText(url));
      document.getElementById("button-add-site").addEventListener("click", function() {
        removeSiteFromPopup(url);
        }, false);
		}
		else if(siteURLs != null)
		{
			renderStatus(notBlockedText(url));
      document.getElementById("button-add-site").addEventListener("click", function() {
        addSiteFromPopup(url);
        }, false);
		}
		else
		{
			renderStatus(noSitesText(url));
      document.getElementById("button-add-site").addEventListener("click", function() {
        addSiteFromPopup(url);
        }, false);
		}

  });
});

$(document).ready(function(){
   $('body').on('click', 'a', function(){
     chrome.tabs.create({url: $(this).attr('href')});
     return false;
   });
});
