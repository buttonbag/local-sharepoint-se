var StandardMaster = (function () {
    function StandardMaster() {
        throw new Error("Cannot new this class");
    }
    StandardMaster.addEmbedly2Media = function () {
        var url = $(this).attr('href');
        var reduceWidthBy = $(".ms-cui-ribbonTopBars").height() ? 90 : 80;
        var reduceHeightBy = $(".ms-cui-ribbonTopBars").height() ? $(".ms-cui-ribbonTopBars").height() + 30 : 80;
        var viewPortWidth = $(window).width() - reduceWidthBy;
        var viewPortHeight = $(window).height() - reduceHeightBy;
        $().embedly.defaults = {
            key: '7da6a02216644386ad2d5fe5738d4737',
            query: {
                maxwidth: viewPortWidth,
                maxheight: viewPortHeight,
                autoplay: true,
            }
        };
        $().embedly.oembed(url)
            .progress(function (obj) {
            });
        return false;
    };
    StandardMaster.updateOfficeappURLs = function () {
        if (typeof _spPageContextInfo.userId == "undefined") {
            var currentsite = _spPageContextInfo.webAbsoluteUrl;
            for (var _i = 0, _a = $('a'); _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.hostname.indexOf('depaul.edu') != -1) {
                    if (item.href.indexOf('DownloadOfficeAppsHandler') == -1) {
                        var canonical = item.href.toLowerCase();
                        if (canonical.match(/(docx|doc|xls|xlsx|csv|ppt|pptx)$/)) {
                            item.href = currentsite + "/_layouts/15/DU.CCServices/DownloadOfficeAppsHandler.ashx?filename=" + item.href;
                        }
                    }
                }
            }
        }
    };
    StandardMaster.updateRollup = function (newAssetUrl, newAssetText, configObject, returnValue) {
        $("span[id$='EditBioRollupImage_ctl00_RichImageField_ImageFieldDisplay'] > img").attr('src', newAssetUrl);
        $("div#BioRollupImage > img").attr('src', newAssetUrl);
    };
    StandardMaster.attachDialogEventToWPButton = function (wpID, callback) {
        $("div[webpartid = " + wpID + "],div[webpartid2 = " + wpID + "]").each(function () {
            $(this).find('.action-attachdialog').each(function () {
                $(this).click(function () {
                    var spcontext = new SP.ClientContext();
                    var configPageUrl = $(this).attr("data-configurl");
                    var widthpercent = 80 / 100;
                    var heightpercent = 80 / 100;
                    if (!isNaN(parseInt($(this).attr("data-sizewidth"), 10))) {
                        widthpercent = parseInt($(this).attr("data-sizewidth"), 10) / 100;
                    }
                    if (!isNaN(parseInt($(this).attr("data-sizeheight"), 10))) {
                        heightpercent = parseInt($(this).attr("data-sizeheight"), 10) / 100;
                    }
                    if (spcontext.get_url().endsWith('/'))
                        configPageUrl = configPageUrl.substr(1);
                    var spWPId = wpID.replace(/\-/g, "_");
                    var fullUrl = location.protocol + "//" + location.hostname + spcontext.get_url() + configPageUrl + "?wpId=" + spWPId;
                    ;
                    var wWidth = $(window).width();
                    var dWidth = wWidth * widthpercent;
                    var wHeight = $(window).height();
                    var dHeight = wHeight * heightpercent;
                    var options = SP.UI.$create_DialogOptions();
                    options.dialogReturnValueCallback = function (result, retVal) {
                        if (result == SP.UI.DialogResult.OK) {
                            SP.UI.ModalDialog.RefreshPage(result);
                            callback(retVal);
                        }
                    };
                    options.height = dHeight;
                    options.width = dWidth;
                    options.url = fullUrl;
                    SP.UI.ModalDialog.showModalDialog(options);
                });
            });
        });
    };
    StandardMaster.addOverlayLinks = function (wpID, editPageUrl) {
        var wpSelector = "div[webpartid = " + wpID + "]";
        var divSelector = "li[class=edit-mode-item]";
        var spWPId = "g_" + wpID.replace(/\-/g, "_");
        var wWidth = $(window).width();
        var dWidth = wWidth * 80 / 100;
        var wHeight = $(window).height();
        var dHeight = wHeight * 80 / 100;
        var curthis = this;
        $("div[webpartid = " + wpID + "]").each(function () {
            $(this).find('.dpu-del-link').each(function () {
                $(this).click(function () {
                    var itemPos = $(this).attr('data-item');
                    var url = editPageUrl;
                    url += "&scId=" + itemPos;
                    url += "&wpId=" + spWPId;
                    var pageName = url.substring(0, url.indexOf("?"));
                    pageName = pageName.substring(pageName.lastIndexOf("/"));
                    url = url.replace(pageName, '/Remove.aspx');
                    curthis.openSPDialog({
                        "url": url,
                        "title": "Delete Item",
                        "width": dWidth,
                        "height": dHeight
                    });
                });
            });
            $(this).find('.dpu-edit-link').each(function () {
                $(this).click(function () {
                    var itemPos = $(this).attr('data-item');
                    var url = editPageUrl;
                    url += "&scId=" + itemPos;
                    url += "&wpId=" + spWPId;
                    curthis.openSPDialog({
                        "url": url,
                        "title": "Edit Item",
                        "width": dWidth,
                        "height": dHeight
                    });
                });
            });
        });
    };
    StandardMaster.openSPDialog = function (obj) {
        var wWidth = $(window).width();
        var dWidth = wWidth * 0.8;
        var wHeight = $(window).height();
        var dHeight = wHeight * 0.8;
        var dialogReturnValueCallback;
        dialogReturnValueCallback = Function.createDelegate(null, this.closeSPDialogCB);
        var options = {
            url: obj.url,
            title: obj.title ? obj.title : "DePaul",
            allowMaximize: false,
            showClose: true,
            width: dWidth,
            height: dHeight,
            dialogReturnValueCallback: dialogReturnValueCallback
        };
        SP.UI.ModalDialog.showModalDialog(options);
        return false;
    };
    StandardMaster.closeSPDialogCB = function (result, value) {
        if (value == 1) {
            window.statusId = SP.UI
                .Status
                .addStatus("Widget Saved", "The changes to the widget have been saved.", true);
            SP.UI.Status.setStatusPriColor(window.statusId, "Green");
        }
        else if (value == 2) {
            window.statusId = SP.UI.Status.addStatus("Widget Not Saved. A duplicate item already exist", value, true);
            SP.UI.Status.setStatusPriColor(window.statusId, "Red");
            return;
        }
        if (value == SP.UI.DialogResult.cancel) {
            window.statusId = SP.UI
                .Status
                .addStatus("Widget Not Saved", "No changes were made to the widget.", true);
            SP.UI.Status.setStatusPriColor(window.statusId, "Red");
            return;
        }
        setTimeout(function () { SP.UI.Status.removeStatus(window.statusId); }, 6000);
        SP.UI.ModalDialog.RefreshPage(result);
    };
    return StandardMaster;
}());
var userloggedin = false;
$(document).ready(function () {
    if (typeof _spPageContextInfo != "undefined") {
        if (_spPageContextInfo.hasOwnProperty('userId')) {
            userloggedin = true;
        }
    }
    $("#localmenu li a").each(function () {
        if ($(this).text() == "Recent") {
            $(this).hide();
        }
    });
    $("#localmenu li").each(function () {
        if ($(this).text() == "Recent") {
            $(this).hide();
        }
    });
    $("#ga-secondary li a").each(function () {
        if ($(this).text() == "Recent") {
            $(this).hide();
        }
    });
    $("#ga-secondary li").each(function () {
        if ($(this).text() == "Recent") {
            $(this).hide();
        }
    });
    if ($().accessibleMegaMenu) {
        $(".content-body").css("margin-top", "0px");
        $('nav#ga-global').accessibleMegaMenu({
            uuidPrefix: "accessible-megamenu",
            menuClass: "accessible-megamenu",
            topNavItemClass: "accessible-megamenu-top-nav-item",
            panelClass: "accessible-megamenu-panel",
            panelGroupClass: "accessible-megamenu-panel-group",
            hoverClass: "hover",
            focusClass: "focus",
            openClass: "open",
            openOnMouseover: true
        });
    }
    $(".slide-button").click(function () {
        $("#navbarCollapse").slideToggle();
        $(".hamburger-toggle i").toggleClass("fa-times");
        $(".hamburger-toggle i").toggleClass("fa-bars");
    });
    $('a.action-modal-embed.media-video').on('click', StandardMaster.addEmbedly2Media);
    $('a.action-modal-embed-noimages.media-video').on('click', StandardMaster.addEmbedly2Media);
    var UIFix = new DPULib.UIFix();
    UIFix.SetBodyIEClass();
    $('a.editor-login').each(function () { $(this).attr('href', UIFix.EditorLink()); });
    $(".dpu-shortcuts").attr('tabindex', '0');
    $(".dpu-shortcuts").bind("keypress", function (e) {
        if (e.keyCode == 13) {
            $('.dpu-shortcuts-drawer').slideToggle('slow');
            fixPipes();
            if ($('.dpu-shortcuts-drawer').is(':hidden')) {
                $("ga-shortcuts").focus();
            }
            else {
                $('.dpu-shortcuts-drawer a').first().focus();
            }
            return false;
        }
    });
    $("div[id$='RichHtmlField_displayContent']").attr("spellcheck", "true");
});
function fixPipes() {
    $("#sliding-drawer .unit ul").each(function () {
        var ulWidth = $(this).width();
        var countWidth = 0;
        $(this).children().each(function () {
            countWidth = Math.floor(countWidth) + Math.floor($(this).outerWidth(true)) + 1;
            if (countWidth < ulWidth) {
            }
            else {
                $(this).prev().css('border-right-width', 0);
                countWidth = 0 + Math.floor($(this).outerWidth(true)) + 1;
            }
        });
        $("#sliding-drawer .unit ul").each(function () {
            $(this).children().last().css('border-right-width', 0);
        });
    });
}
var InEditMode = $("#MSOLayout_InDesignMode").val() === "1" ? true : false;
$(document).ready(function () {
    if (!InEditMode) {
        var msgCurl = "https://wsrv.is.depaul.edu/ravalertrss/GetCurMesg.ashx";
        var msgBanner = "https://wdat.is.depaul.edu/SPMaintenanceBannerHandle/SpMaintenanceBannerHandleOne.ashx";
        var msgBanner2 = "https://wdat.is.depaul.edu/SPMaintenanceBannerHandle/SpMaintenanceBannerHandleSecond.ashx";
        if ((window.location.href.indexOf("sptest16") > -1) || (window.location.href.indexOf("localhost") > -1)) {
            msgCurl = "https://wsrvqua.is.depaul.edu/ravalertrss/GetCurMesg.ashx";
            msgBanner = "https://wdatdev01.dpu.depaul.edu/SpMaintenanceBannerHandle/SpMaintenanceBannerHandleOne.ashx";
            msgBanner2 = "https://wdatdev01.dpu.depaul.edu/SpMaintenanceBannerHandle/SpMaintenanceBannerHandleSecond.ashx";
        }
        var ts = new Date().getTime();
        var stdata = { _: ts };
        $.getJSON(msgCurl, stdata, function (data) {
            var msg = data.Message;
            if (msg !== 'REMOVE RSS') {
                $("#alert_banner1").html('<!-- googleoff: all--><!-- noindex--><div id="dpu-notice-banner" data-nosnippet="true" class="alert alert-danger text-center mb-0 mt-0 rounded-0 robots-noindex robots-nocontent" roll = "alert" >' + msg + '</div><!-- /noindex--><!-- googleon: all -->');
            }
        });
        var ts = new Date().getTime();
        var stdata = { _: ts };
        $.getJSON(msgBanner, stdata, function (data) {
            var msg = data.Message;
            var active = data.Active;
            if (active == true) {
                $("#alert_banner2").html('<!-- googleoff: all--><!-- noindex--><div id="dpu-notice-banner" data-nosnippet="true" class="alert alert-warning text-center mb-0 mt-0 rounded-0 robots-noindex robots-nocontent" roll = "alert" >' + msg + '</div><!-- /noindex--><!-- googleon: all -->');
            }
        });
        var ts = new Date().getTime();
        var stdata = { _: ts };
        $.getJSON(msgBanner2, stdata, function (data) {
            var msg = data.Message;
            var active = data.Active;
            if (active == true) {
                $("#alert_banner3").html('<!-- googleoff: all--><!-- noindex--><div id="dpu-notice-banner" data-nosnippet="true" class="alert alert-warning text-center mb-0 mt-0 rounded-0 robots-noindex robots-nocontent" style="background: #FDE7A2; border: 2px; border - color: #D2BA6F color: #674D04" roll = "alert" >' + msg + '</div><!-- /noindex--><!-- googleon: all -->');
            }
        });
    }
});
$(window).bind('load', function () {
    var breakpoint = 960;
    var viewport = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if (viewport < 1000)
        breakpoint = 815;
    if (viewport < 800)
        breakpoint = 480;
    document.cookie = 'resolution=' + breakpoint;
    if (jQuery().embedly && !InEditMode) {
        $('a.media-embed').each(function () {
            var parentwidth = $(this).parent().width();
            parentwidth = Math.floor(parentwidth);
            if ($(this).attr('href').indexOf('panopto') > 0) {
                var url = $(this).attr('href');
                url = url.toLowerCase().replace("viewer", "embed").replace("/panopto", "/Panopto");
                url = url + "&offerviewer=false&interactivity=none&showbrand=false";
                var iframe = document.createElement('iframe');
                iframe.setAttribute('src', url);
                iframe.setAttribute('width', $(this).parent().width().toString());
                iframe.setAttribute('height', $(this).parent().height().toString());
                iframe.setAttribute('class', 'embedly-embed');
                var div = document.createElement("div");
                div.setAttribute('class', 'embed');
                div.appendChild(iframe);
                $(this).replaceWith(div);
            }
            $(this).embedly({ query: { maxwidth: parentwidth }, key: '7da6a02216644386ad2d5fe5738d4737' });
        });
        if ($('a.media-modal-embed')) {
            $('a.media-modal-embed').attr('onclick', 'return false;');
        }
        $('a.media-modal-embed').each(function () {
            var url = $(this).attr('href');
            var protomatch = /^(https?|ftp):/;
            url = url.replace(protomatch, '');
        });
    }
    if (jQuery().audioPlayer && !InEditMode) {
        $('audio').audioPlayer();
    }
    StandardMaster.updateOfficeappURLs();
});

/* $(document).ready(function () { //appendDomainsToAnchors
	function createExclusionList(strings, classPrefix, suffix) {
		if (!Array.isArray(strings)) {
			console.error("Input must be an array of strings");
			return "";
		}

		return strings
			.map(function (word) {
				return classPrefix + word + suffix;
			})
			.join(", ");
	}

	var className = ["omit-context", "social", "cta-", "btn", "border"];
	var classPrefix = "[class*=";
	var suffix = "]";

	// viewbook specific
	var vbSelectors = ["#vbFooter a", "[class*=start-ctas] a"];
	var vbPrefix = "";
	var vbSuffix = "";

	var listWithSelector = createExclusionList(className, classPrefix, suffix);
	var exclusions = listWithSelector;

	//viewbook specific
	var vbListWithSelector = createExclusionList(vbSelectors, vbPrefix, vbSuffix);
	var vbExclusions = vbListWithSelector;

	// console.log(listWithSelector);
	// console.log(vbListWithSelector);

	$(
		"#ga-maincontent a[href]:not(" +
			vbExclusions +
			"):not(" +
			exclusions +
			"):not(" +
			exclusions +
			" a):not(a:has(img))"
	).each(function () {
		var href = $(this).attr("href");
		var fileType = getFileType(href);
		var currentText = $(this).text();

		if (!href) {
			return;
		} //not a link so skip.

		if (href.startsWith("http") && !href.includes("depaul.edu")) {
			//external link
			var domain = extractDomain(href);
			if (domain.startsWith("www.")) {
				domain = domain.slice(4);
			}

			if (fileType != "") {
				fileType = ", " + fileType;
			}

			var newTxt = $(this).text(currentText + " [" + domain + fileType + "]");

			newTxt.addClass("ext-link");

			if (fileType) {
				newTxt.addClass("ext-file");
			}
		} else if (fileType != "") {
			$(this)
				.text(currentText + " [" + fileType + "]")
				.addClass("ext-file");
		}
	});

	function extractDomain(url) {
		var anchor = document.createElement("a");
		anchor.href = url;
		return anchor.hostname;
	}

	function getFileType(link) {
		if (link.includes(".pdf")) {
			return "PDF";
		} else if (link.includes(".doc" || ".docx")) {
			return "DOC";
		} else if (link.includes(".xls" || ".xlsx")) {
			return "Excel";
		} else {
			return "";
		}
	}
}); */


$(document).ready(function () {
    if (!InEditMode) {
        function isInternetExplorer() {
            var ua = window.navigator.userAgent;
            var msie = ua.indexOf('MSIE ');
            if (msie > 0) {
                return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
            }
            var trident = ua.indexOf('Trident/');
            if (trident > 0) {
                var rv = ua.indexOf('rv:');
                return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
            }
            var edge = ua.indexOf('Edge/');
            if (edge > 0) {
                return false;
            }
            return false;
        }
        function diaplayBannerOnIE() {
            $("body").prepend('<p class="alert alert-warning text-center mb-0 mt-0 rounded-0" roll="alert">Your browser is out of date. Please use a different browser for a better experience.</p>');
        }
        if (isInternetExplorer()) {
            var timeoutVar = setTimeout(diaplayBannerOnIE, 1000);
        }
    }
});
