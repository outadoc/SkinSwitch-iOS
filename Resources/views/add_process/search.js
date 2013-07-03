var win = Ti.UI.currentWindow;

var Utils = require('/includes/utils');
var Ui = require('/includes/ui');

var searchBar = Ti.UI.createSearchBar({
	barColor: Utils.getNavColor(),
	hintText: 'Search on MC Network',
	width: Ti.UI.FILL
});

win.setTitleControl(searchBar);

var containerView = Ti.UI.createScrollableView({
	height: Ti.UI.FILL,
	width: '80%',
	showPagingControl: true,
	clipViews: false,
	pagingControlColor: 'transparent'
});

win.add(containerView);

searchBar.addEventListener('return', function(e) {
	e.source.blur();
	getSkinsFromSearch(e.source.getValue());
});

searchBar.addEventListener('focus', function(e) {
	e.source.setShowCancel(true);
});

searchBar.addEventListener('blur', function(e) {
	e.source.setShowCancel(false);
});

searchBar.addEventListener('cancel', function(e) {
	e.source.blur();
	getLatestSkins();
});

getLatestSkins();

function getSkinsFromSearch(match) {
	getRequestResults({
		method: 'searchSkinByName',
		match: searchBar.getValue(),
		max: 10,
		start: 0
	});
}

function getLatestSkins(match) {
	getRequestResults({
		method: 'getRandomSkins',
		max: 10,
		start: 0
	});
}

function getSkin(match) {
	getRequestResults({
		method: 'getSkin',
		base64: false,
		max: 10,
		start: 0
	});
}

function getRequestResults(params) {
	var xhr = Ti.Network.createHTTPClient({
		onload: function(e) {
			var resultArray = [];
			
			try {
				resultArray = JSON.parse(this.responseText);
				
				if(resultArray.error != null) {
					alert(resultArray.error);
				} else {
					containerView.setViews([]);
					
					for(var i = 0; i < resultArray.length; i++) {
						var currentSkinResult = Ui.getSingleSearchResult(resultArray[i]);
						containerView.addView(currentSkinResult);
						
						if(i == 0) {
							loadSkinPreview({
								view: currentSkinResult
							});
						}
					}
				}
			} catch(e) {
				alert('Couldn\'t parse result :s\n' + e);
			}
		}
	});
	
	xhr.open('POST', 'http://skinmanager.fr.nf/json/');
	xhr.send(params);
}

containerView.addEventListener('scrollend', loadSkinPreview);

function loadSkinPreview(e) {
	if(e.view.frontImg.image == null) {
		var xhr_front = Ti.Network.createHTTPClient({
			onload: function() {
				if(this.getResponseData() != null && this.responseText.error == null) {
					e.view.frontImg.setImage(this.getResponseData());
				}
				
				if(e.view.backImg.image == null) {
					var xhr_back = Ti.Network.createHTTPClient({
						onload: function() {
							if(this.getResponseData() != null && this.responseText.error == null) {
								e.view.backImg.setImage(this.getResponseData());
							}
						},
						cache: true
					});
					
					xhr_back.open('GET', 'http://apps.outadoc.fr/skinswitch/skinpreview.php?side=back&url=' + encodeURIComponent('http://skinmanager.fr.nf/json/?method=getSkin&id=' + parseInt(e.view.skinData.id) + '&base64=false'));
					xhr_back.send();
				}
			},
			cache: true
		});
		
		xhr_front.open('GET', 'http://apps.outadoc.fr/skinswitch/skinpreview.php?url=' + encodeURIComponent('http://skinmanager.fr.nf/json/?method=getSkin&id=' + parseInt(e.view.skinData.id) + '&base64=false'));
		xhr_front.send();
	}
}