var config = {
	pixels : 10000
};
var siteURLs; 
var sitePxs; 

window.onload = function()
{
	loadOptions();
	document.getElementById("save").addEventListener("click", saveOptions);
	document.getElementById("reset").addEventListener("click", eraseOptions);
	document.getElementById("add").addEventListener("click", addSite);
	document.getElementById("remove0").addEventListener("click", function(){removeSite(0)});
};

function addSite()
{
	siteURLs.push("");
	sitePxs.push(0);

	var index = siteURLs.length - 1;
	addSiteField(index);
}

function addSiteField(index)
{
	document.getElementById("sites").insertAdjacentHTML('beforeend', 
	'<div class="option-row" id="row' + index
	+ '"><span>On&nbsp;</span><input class="siteURL" placeholder="example.com" id="siteURL' + index
	+ '" type="text"></input><span>&nbsp;stop after&nbsp;</span><input class="pxNum" value='+config.pixels+'" id="pxNum' + index
	+ '" type="number" min="0"></input>'
	+ '<span>&nbsp;pixels&nbsp;</span>'
	+ '<i class="material-icons" id="remove' + index + '">close</i>'
	+ '</button><br></div>');
	document.getElementById("remove" + index).addEventListener("click", function(){removeSite(index)});
}

function removeSite(index)
{
	remove("row" + index);
	siteURLs.splice(index, 1);
	sitePxs.splice(index, 1);
}

function remove(id)
{
    var elem=document.getElementById(id)
	if(elem != null)
		elem.parentNode.removeChild(elem);
	else
		alert("NULL WITH ID " + id + "!");
}

function loadOptions()
{
	siteURLs = localStorage["siteURLs"];
	sitePxs = localStorage["sitePxs"];
	var closeBehav = localStorage["closeBehav"];
	var redirectURL = localStorage["redirectURL"];

	console.log(siteURLs);
	if(siteURLs == null)
	{
		siteURLs = [""];
	}
	else
	{
		siteURLs = siteURLs.split(",");
	}
	if(sitePxs == null)
	{
		sitePxs = [1];
		sitePxs[0] = config.pixels;
	}
	else
	{
		sitePxs = sitePxs.split(",");
	}

	if(redirectURL != null)
	{
		document.getElementById("redirectURL").value = redirectURL;
	}

	document.getElementById("siteURL0").value = siteURLs[0];
	for(var i = 1; i < siteURLs.length; i++)
	{
		addSiteField(i);
		document.getElementById('siteURL' + i).value = siteURLs[i];
	}

	document.getElementById("pxNum0").value = sitePxs[0];
	for(var i = 1; i < sitePxs.length; i++)
	{
		document.getElementById('pxNum' + i).value = sitePxs[i];
	}

	var radios = document.getElementsByName('closeBehav');

	for (var i = 0, length = radios.length; i < length; i++)
	{
		if (radios[i].value == closeBehav)
		{
			radios[i].checked = true;
			break;
		}
	}
}

function saveOptions()
{
	var closeBehav = "";

	var redirectURL = document.getElementById("redirectURL").value;

	var siteURLInputs = document.getElementsByClassName("siteURL");
	var sitePxInputs = document.getElementsByClassName("pxNum");

	for(var i = 0; i < siteURLInputs.length; i++)
	{
		siteURLs[i] = siteURLInputs[i].value;
	}

	for(var i = 0; i < sitePxInputs.length; i++)
	{
		sitePxs[i] = sitePxInputs[i].value;
	}

	var radios = document.getElementsByName('closeBehav');

	for (var i = 0; i < radios.length; i++)
	{
		if (radios[i].checked)
		{
			closeBehav = radios[i].value;
			break;
		}
	}

	localStorage["siteURLs"] = siteURLs;
	localStorage["sitePxs"] = sitePxs;

	localStorage["closeBehav"] = closeBehav;
	localStorage["redirectURL"] = redirectURL;
	$("#checkmark").animate({width:'show'},350).delay( 2000);
	$("#checkmark").animate({width:'hide'},350);
}

function eraseOptions()
{
	localStorage.removeItem("siteURLs");
	localStorage.removeItem("sitePxs");
	localStorage.removeItem("closeBehav");
	localStorage.removeItem("redirectURL");
	location.reload();
}
