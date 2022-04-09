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
  return config.blockedTextHTML;
}

function notBlockedText(urlFound) {
  return config.notBlockedTextHTML;
}

function noSitesText(urlFound) {
  return config.noSitesTextHTML;
}

function reloadPage() {
  return config.reloadPageHTML;
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

const config = {
  pixels : 10000,
  blockedTextHTML : `<div id='popupHeader' class="primary">
  <i class="material-icons">
      track_changes
  </i>
  <span class="popupHeaderText">
      Active
  </span>
  </div>
  <div id='popupRemainder'>
      <p class="popupRemainderText">You've limited scrolling on this site.
      </p>
  </div>
  <div id='button-container'>
      <button id="button-add-site" class="button-limit">
          <i class="material-icons">
          public
          </i>
          <span class="button-limit-text">
          Unlimit this site
          </span>
      </button>
  </div>`,
  notBlockedTextHTML : `<div id='popupHeader' class="secondary">
  <i class="material-icons">
    notifications_off
  </i>
  <span class="popupHeaderText">
    Inactive
  </span>
</div>
<div id='popupRemainder'>
  <p class="popupRemainderText">You can <span class="textEmphasize">scroll freely</span> on this site
</div>
<div id='button-container'>
  <button id="button-add-site" class="button-limit">
    <i class="material-icons">
      public
    </i>
    <span class="button-limit-text">
      Limit this site
    </span>
    </button>
</div>`,
  noSitesTextHTML : `<div id='popupHeader' class="secondary">
  <i class="material-icons">
    announcement
  </i>
  <span class="popupHeaderText">
    No Sites Added
  </span>
</div>
<div id='popupRemainder'>
  <p class="popupRemainderText">There are <span class="textEmphasize">no</span>
  sites set up for Dop-a-mine to watch right now.</p>
</div>
<div id='button-container'>
  <button id="button-add-site" class="button-limit">
  <i class="material-icons">
  public
  </i>
  <span class="button-limit-text">
  Limit this site
  </span>
  </button>
</div>`,
  reloadPageHTML : `<center id="refresh-container">
  <span class="refresh-icon"><i class="material-icons">
    refresh
  </i></span>
</center>
<div id='popupRemainder'>
  <p class="popupRemainderText">
      Got it! Please <span class="textEmphasize">reload</span>
  your current tab to see your changes.</p>
</div>`
};