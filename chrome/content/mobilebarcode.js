var mobilebarcode = new Object();

mobilebarcode.prefs = null;
mobilebarcode.codetype = "";
mobilebarcode.codesize = "";
mobilebarcode.provider = "";

//mobilebarcode.prefixURL = "http://mobilecodes.nokia.com/qr?MODULE_SIZE=6&name=&MARGIN=10&ENCODING=BYTE&MODE=TEXT&a=view&DATA=";
//mobilebarcode.prefixURL = function(size="6", name="", margin="10", type="LINK")

/**
 * Installs the toolbar button with the given ID into the given
 * toolbar, if it is not already present in the document.
 *
 * @param {string} toolbarId The ID of the toolbar to install to.
 * @param {string} id The ID of the button to install.
 * @param {string} afterId The ID of the element to insert after. @optional
 */

/*
function installButton(toolbarId, id, afterId) {
    if (!document.getElementById(id)) {
        var toolbar = document.getElementById(toolbarId);

        var before = toolbar.firstChild;
        if (afterId) {
            let elem = document.getElementById(afterId);
            if (elem && elem.parentNode == toolbar)
                before = elem.nextElementSibling;
        }

        toolbar.insertItem(id, before);
        toolbar.setAttribute("currentset", toolbar.currentSet);
        document.persist(toolbar.id, "currentset");

        if (toolbarId == "addon-bar")
            toolbar.collapsed = false;
    }
}

if (firstRun) {
    installButton("nav-bar", "mobilebarcode-status-panel", "urlbar");
}
*/

mobilebarcode.prefixURL = function(name,type)
{
	switch (mobilebarcode.provider)
	{
		case "KAYWA":
			return mobilebarcode.prefixURL_kaywa(name,type);
		break;
		case "GOOGLE":
			return mobilebarcode.prefixURL_google(name,type);
		break;
		case "NOKIA":
			return mobilebarcode.prefixURL_nokia(name,type);
		break;
		default:
			return mobilebarcode.prefixURL_google(name,type);
		break;
	}
};

mobilebarcode.prefixURL_google = function(name, type)
{
	switch(mobilebarcode.codesize)
	{
		case "S":
			sizenumber="200x200";
		break;
		case "M":
			sizenumber="300x300";
		break;
		case "L":
			sizenumber="400x400";
		break;
		case "XL":
			sizenumber="500x500";
		break;
		case "XXL":
			sizenumber="547x547";
		break;
		default:
			sizenumber="300x300";
		break;
	}
	/*
	 *	Type: cht = qr
	 *	Size: chs = <width>x<height>
	 *	Encoding: choe = [UTF-8|Shift_JIS|ISO-8859-1]
	 *	Error Correction: chld = <L|M|Q|H>|<margin>
	 *	Data: chl = <data>
	 */
	
	prefix = "http://chart.apis.google.com/chart?cht=qr&chld=M|4&choe=UTF-8&" +
		"chs=" + sizenumber + "&chl=";

	return prefix;
};

mobilebarcode.prefixURL_kaywa = function(name, type)
{
	// For text, maximum 250 characters
	// Would be good to show a 'too big' image if they select too much text
	
	switch(mobilebarcode.codesize)
	{
		case "S":
			sizenumber="5";
		break;
		case "M":
			sizenumber="6";
		break;
		case "L":
			sizenumber="7";
		break;
		case "XL":
			sizenumber="8";
		break;
		case "XXL":
			sizenumber="12";
		break;
		default:
			sizenumber="6";
		break;
	}

	switch(mobilebarcode.codetype)
	{
		case "DM":
			prefix = "http://datamatrix.kaywa.com/img.php?" +
				"s=" + sizenumber + "&d=";
		break;
		case "QR":
		default:
			prefix = "http://qrcode.kaywa.com/img.php?" +
				"s=" + sizenumber + "&d=";
		break;
	}

	return prefix;
};

mobilebarcode.prefixURL_nokia = function(name, type)
{
	switch(mobilebarcode.codetype)
	{
		case "DM":
			switch(mobilebarcode.codesize)
			{
				case "S":
					sizenumber="0.12";
				break;
				case "M":
					sizenumber="0.18";
				break;
				case "L":
					sizenumber="0.25";
				break;
				case "XL":
					sizenumber="0.50";
				break;
				case "XXL":
					sizenumber="0.75";
				break;
				default:
					sizenumber="0.18";
				break;
			}
			prefix = "http://mobilecodes.nokia.com/dm?" +
				"X=" + sizenumber;
<!--
            if (name.length>0)
			{
				prefix = prefix + "&name=" + name;
			}
			if (type.length>0)
			{
				prefix = prefix + "&TYPE=" + type;
			}
-->
			prefix = prefix + "&NDEF_DATA=&MODE=TEXT&a=view&BARCODE=";
		break;
		case "QR":
		default:
			switch(mobilebarcode.codesize)
			{
				case "S":
					sizenumber="2";
				break;
				case "M":
					sizenumber="4";
				break;
				case "L":
					sizenumber="6";
				break;
				case "XL":
					sizenumber="8";
				break;
				case "XXL":
					sizenumber="10";
				break;
				default:
					sizenumber="6";
				break;
			}
			prefix = "http://mobilecodes.nokia.com/qr?" +
				"MODULE_SIZE=" + sizenumber;
<!--
            if (name.length>0)
			{
				prefix = prefix + "&name=" + name;
			}
			if (type.length>0)
			{
				prefix = prefix + "&TYPE=" + type;
			}
-->
			prefix = prefix + "&MARGIN=0&ENCODING=BYTE&MODE=TEXT&a=view&DATA=";
		break;
	}

	return prefix;
};

mobilebarcode.getBarcodeURL = function()
{
	var theurl = getBrowser().contentWindow.location.href;
	return mobilebarcode.prefixURL("","LINK") + mobilebarcode.URLEncode(theurl);
}

mobilebarcode.getBarcode = function()
{
	var theurl = getBrowser().contentWindow.location.href;
	var barcode = document.getElementById ( 'mobilebarcode-status-image' );
//	barcode.src = "http://www.sample.org.uk/mobilebarcoder/gen.php?data=" + 
//					mobilebarcode.URLEncode(theurl);
	barcode.src = mobilebarcode.prefixURL("","LINK") + mobilebarcode.URLEncode(theurl);
	return;
};

mobilebarcode.getBarcodeFromSelection = function()
{
	var sel_text = mobilebarcode.get_selected_text();
	openNewTabWith(mobilebarcode.prefixURL("","") + mobilebarcode.URLEncode(sel_text), null, null, false);
};
mobilebarcode.showBarcodeFromSelection = function()
{
	var sel_text = mobilebarcode.get_selected_text();
	image = document.getElementById("mobilebarcode-context-selection-image");
	image.src = mobilebarcode.prefixURL("","") + mobilebarcode.URLEncode(sel_text);
};

mobilebarcode.getBarcodeFromLink = function()
{
	if (gContextMenu)
	{
		if (typeof(gContextMenu.linkURL)=='string') {
			sel_text = gContextMenu.linkURL
		} else {
			sel_text = gContextMenu.linkURL()
		}
		//var sel_text = gContextMenu.linkURL;
		openNewTabWith(mobilebarcode.prefixURL("","") + mobilebarcode.URLEncode(sel_text), null, null, false);
	}
};
mobilebarcode.showBarcodeFromLink = function()
{
	if (gContextMenu)
	{
		if (typeof(gContextMenu.linkURL)=='string') {
			sel_text = gContextMenu.linkURL
		} else {
			sel_text = gContextMenu.linkURL()
		}
		image = document.getElementById("mobilebarcode-context-link-image");
		image.src = mobilebarcode.prefixURL("","") + mobilebarcode.URLEncode(sel_text);
	}
};

mobilebarcode.init = function()
{
	// Register to receive notifications of preference changes
	mobilebarcode.prefs = Components.classes["@mozilla.org/preferences-service;1"]
		.getService(Components.interfaces.nsIPrefService)
		.getBranch("mobilebarcode.");
	mobilebarcode.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
	mobilebarcode.prefs.addObserver("", this, false);
	
	mobilebarcode.codetype = mobilebarcode.prefs.getCharPref("type").toUpperCase();
	mobilebarcode.provider = mobilebarcode.prefs.getCharPref("provider").toUpperCase();
	mobilebarcode.codesize = mobilebarcode.prefs.getCharPref("size").toUpperCase();
	
	menu = document.getElementById("contentAreaContextMenu");
//	if (menu)
//	{
		menu.addEventListener("popupshowing", mobilebarcode.draw, false);
//	}
	
	selection = document.getElementById("mobilebarcode-context-selection-popup");
	link = document.getElementById("mobilebarcode-context-link-popup");
	
	selection.addEventListener("popupshowing", mobilebarcode.showBarcodeFromSelection, false);
	link.addEventListener("popupshowing", mobilebarcode.showBarcodeFromLink, false);

    //hidden menuitems
    document.getElementById("mobilebarcode-context-selection").hidden = true;
    document.getElementById("mobilebarcode-context-link").hidden = true;
};

mobilebarcode.observe = function(subject, topic, data)
{
	if (topic != "nsPref:changed")
	{
		return;
	}
	
//	switch(data)
//	{
//		case "size":
			mobilebarcode.codesize = mobilebarcode.prefs.getCharPref("size").toUpperCase();
//		break;
//		case "type":
			mobilebarcode.codetype = mobilebarcode.prefs.getCharPref("type").toUpperCase();
			mobilebarcode.provider = mobilebarcode.prefs.getCharPref("provider").toUpperCase();
//		break;
//	}
};

mobilebarcode.uninit = function()
{
	menu = document.getElementById("contentAreaContextMenu");
	if (menu)
	{
		menu.removeEventListener("popupshowing", mobilebarcode.draw, false);
	}

    //hidden menuitems
    document.getElementById("mobilebarcode-context-selection").hidden = true;
    document.getElementById("mobilebarcode-context-link").hidden = true;

	mobilebarcode.prefs.removeObserver("", this)
};

mobilebarcode.draw = function()
{	
	if (gContextMenu)
	{
		gContextMenu.showItem("mobilebarcode-context-selection", gContextMenu.isTextSelected);
		gContextMenu.showItem("mobilebarcode-context-link", gContextMenu.onLink);
	}
};

// ====================================================================
//       URLEncode and URLDecode functions
// http://www.albionresearch.com/misc/urlencode.php
//
// Copyright Albion Research Ltd. 2002
// http://www.albionresearch.com/
//
// You may copy these functions providing that 
// (a) you leave this copyright notice intact, and 
// (b) if you use these functions on a publicly accessible
//     web site you include a credit somewhere on the web site 
//     with a link back to http://www.albionresearch.com/
//
// If you find or fix any bugs, please let us know at albionresearch.com
// ====================================================================
mobilebarcode.URLEncode = function(plaintext)
{
	return encodeURIComponent(plaintext);
	/*
	// The Javascript escape and unescape functions do not correspond
	// with what browsers actually do...
	var SAFECHARS = "0123456789" +					// Numeric
					"ABCDEFGHIJKLMNOPQRSTUVWXYZ" +	// Alphabetic
					"abcdefghijklmnopqrstuvwxyz" +
					"-_.!~*'()";					// RFC2396 Mark characters
	var HEX = "0123456789ABCDEF";

	var encoded = "";
	for (var i = 0; i < plaintext.length; i++ ) {
		var ch = plaintext.charAt(i);
	    if (ch == " ") {
		    encoded += "+";				// x-www-urlencoded, rather than %20
		} else if (SAFECHARS.indexOf(ch) != -1) {
		    encoded += ch;
		} else {
		    var charCode = ch.charCodeAt(0);
			if (charCode > 255) {
//			    alert( "Unicode Character '" 
//                        + ch 
//                        + "' cannot be encoded using standard URL encoding.\n" +
//				          "(URL encoding only supports 8-bit characters.)\n" +
//						  "A space (+) will be substituted." );
				encoded += "+";
			} else {
				encoded += "%";
				encoded += HEX.charAt((charCode >> 4) & 0xF);
				encoded += HEX.charAt(charCode & 0xF);
			}
		}
	} // for

	return encoded;
	*/
};

// This function is from Right-Click-Link
mobilebarcode.get_selected_text = function()
{
	var focused_window = document.commandDispatcher.focusedWindow;
	var sel_text = focused_window.getSelection();
	return sel_text.toString();
};

mobilebarcode.displayAbout = function()
{
    Components.utils.import("resource://gre/modules/AddonManager.jsm");    
      
    AddonManager.getAddonByID("{A5C87640-F7CF-11DA-974D-0800200C9A66}", function(addon) {  
		var addonAboutURL = addon.aboutURL;
		// if custom aboutURL specified use it, otherwise use default
		if (addonAboutURL)
			window.openDialog(addonAboutURL, '', 'chrome,centerscreen,modal', addon);
		else
			window.openDialog('chrome://mozapps/content/extensions/about.xul', '', 'chrome,centerscreen,modal', addon);
    });  
}

mobilebarcode.displayOptions = function()
{
	window.openDialog('chrome://mobilebarcode/content/options.xul','optionsdialog','chrome,centerscreen,modal')
}

mobilebarcode.showPopup = function()
{
	//Note: openPopupAtScreen and openPopup require Firefox 3.0 or later (Gecko 1.9 == Firefox 3.0)
	var thetoolbarbutton = document.getElementById('mobilebarcode-status-panel');
	document.getElementById('mobilebarcode-tooltip').openPopup(thetoolbarbutton, 'after_start', 0, 0, false, false);
}

window.addEventListener("load", function(e) { mobilebarcode.init(); }, false);
// The unload event causes the extension to stop functioning on all already loaded pages when one page is closed.
//window.addEventListener("unload", mobilebarcode.uninit, false);