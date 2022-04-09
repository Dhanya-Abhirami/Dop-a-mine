var pageDeleted = false;
var pageMatch = false;
var siteURLs;
var sitePxs; 
var currSitePx = 300;
var websiteIndex = 0; 
var closeBehav = "close";
var redirectURL = "http://www.google.com"; 
var lastAlert = 0; 
var tolerance = 1000; 

var paused = false;

function siteBlocked()
{
	if(typeof siteURLs == 'undefined')
		return false
	var siteArray = siteURLs.split(",");
	for(var i = 0; i < siteArray.length; i++)
	{
		if(window.location.href.indexOf(siteArray[i]) != "" && window.location.href.indexOf(siteArray[i]) > -1)
		{
			websiteIndex = i;
			return true;
		}
	}
	return false;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	if (request.method == "setURLs")
	{
			siteURLs = request.data;
			if(siteBlocked())
			{
				pageMatch = true;
			}
			else
			{
				pageMatch = false;
			}
	}
	else if(request.method == "setPxs")
	{
		sitePxs = request.data;
		if(typeof sitePxs !== 'undefined')
			sitePxs = sitePxs.split(",");
	}
	else if(request.method == "setClose")
	{
		closeBehav = request.data;
	}
	else if(request.method == "setRedirect")
	{
		redirectURL = request.data;
	}
	else if(request.method == "togglePaused")
	{
		paused = !paused;
	}
});

window.onscroll = function(ev)
{
	if(sitePxs != null)
	{
		if(window.scrollY > sitePxs[websiteIndex] && pageMatch)
		{
			pageDeleted = true;

			if(closeBehav == "close")
			{
				chrome.runtime.sendMessage({method: "closeTab"}, function(response)
				{
				});
			}
			else if(closeBehav == "remove")
			{
				document.body.remove();
			}
			else if(closeBehav == "redirect")
			{
				window.location.replace(redirectURL);
			}
			else if(closeBehav == "alert")
			{
				if(lastAlert == 0 || window.scrollY > lastAlert + tolerance)
				{
					alert("Hey, you've been scrolling for a while.");
					lastAlert = window.scrollY;
					document.body.style.filter = 'grayscale(100%)';
				}
			}
			else
			{
				chrome.runtime.sendMessage({method: "closeTab"}, function(response)
				{
				});
			}
		}
	}
};
