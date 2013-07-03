Ti.include('/includes/lib/json.i18n.js');

var win = Ti.UI.currentWindow;
var Utils = require('/includes/utils');
var Ui = require('/includes/ui');

var searchBar = Ti.UI.createSearchBar({
	barColor: Utils.getNavColor(),
	hintText: I('addProcess.search.searchHint'),
	width: Ti.UI.FILL
});

win.setTitleControl(searchBar);

var darkenView = Ti.UI.createView({
	backgroundColor: 'black',
	top: 0,
	bottom: 0,
	left: 0,
	right: 0
});

darkenView.addEventListener('click', function() {
	searchBar.blur();
	
	if(searchBar.getValue() == '') {
		getRandomSkins();
	}
});

var lbl_indicator = Ti.UI.createLabel({
	top: 20,
	left: 25,
	right: 20,
	font: {
		fontSize: 19,
		fontFamily: 'HelveticaNeue-Italic'
	},
	height: 20,
	color: 'white'
});

win.add(lbl_indicator);

var containerView = Ti.UI.createScrollableView({
	top: 10,
	bottom: 0,
	width: 270,
	clipViews: false,
	disableBounce: false
});

win.add(containerView);

searchBar.addEventListener('return', function(e) {
	e.source.blur();
	getSkinsFromSearch(e.source.getValue());
});

searchBar.addEventListener('focus', function(e) {
	darkenView.setOpacity(0);
	
	win.add(darkenView);
	
	darkenView.animate({
		opacity: 0.6,
		duration: 200
	});
});

searchBar.addEventListener('blur', function(e) {
	darkenView.animate({
		opacity: 0,
		duration: 200
	}, function(e) {
		win.remove(darkenView);
	});
});

searchBar.addEventListener('cancel', function(e) {
	e.source.blur();
	getRandomSkins();
});

getRandomSkins();

function getSkinsFromSearch(match) {
	lbl_indicator.setText(I('addProcess.search.indicator.searchResults', match));
	
	getRequestResults({
		method: 'searchSkinByName',
		match: searchBar.getValue()
	});
}

function getRandomSkins() {
	lbl_indicator.setText(I('addProcess.search.indicator.random'));
	
	getRequestResults({
		method: 'getRandomSkins'
	});
}

function getRequestResults(params) {
	var xhr = Ti.Network.createHTTPClient({
		onload: function(e) {
			var resultArray = [];
			
			try {
				resultArray = JSON.parse(this.responseText);
				
				if(resultArray.error != null) {
					alert(I('addProcess.search.indicator.error.network'));
				} else {
					containerView.setViews([]);
					
					if(resultArray.length == 0 && params.match != null) {
						lbl_indicator.setText(I('addProcess.search.indicator.noResults', params.match));
					}
					
					for(var i = 0; i < resultArray.length; i++) {
						var currentSkinResult = Ui.getSingleSearchResult(resultArray[i], selectSkin);
						containerView.addView(currentSkinResult);
						
						if(i == 0) {
							loadSkinPreview({
								view: currentSkinResult
							});
						}
					}
				}
			} catch(e) {
				alert(I('addProcess.search.indicator.error.network'));
			}
		},
		onerror: function(e) {
			alert(I('addProcess.search.indicator.error.network'));
		}
	});
	
	xhr.open('POST', 'http://skinmanager.fr.nf/json/');
	xhr.send(params);
}

containerView.addEventListener('scrollend', loadSkinPreview);

function loadSkinPreview(e) {
	if(!e.view.frontImg.isLoaded) {
		var xhr_front = Ti.Network.createHTTPClient({
			onload: function() {
				if(this.getResponseData() != null && this.responseText.error == null) {
					e.view.frontImg.animate({
						opacity: 0,
						duration: 100
					}, function() {
						e.view.frontImg.setImage(xhr_front.getResponseData());
						e.view.frontImg.isLoaded = true;
						
						e.view.frontImg.animate({
							opacity: 1,
							duration: 100
						});
					});
				}
				
				if(!e.view.backImg.isLoaded) {
					var xhr_back = Ti.Network.createHTTPClient({
						onload: function() {
							if(this.getResponseData() != null && this.responseText.error == null) {
								e.view.backImg.setImage(this.getResponseData());
								e.view.backImg.isLoaded = true;
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

function selectSkin(skinData) {
	var win_process = Ti.UI.createWindow({
		title: I('addProcess.process.title'),
		url: 'processing.js',
		backgroundImage: Utils.getBGImage(),
		barColor: Utils.getNavColor(),
		backgroundRepeat: true,

		skinUrl: 'http://skinmanager.fr.nf/json/?method=getSkin&id=' + parseInt(skinData.id) + '&base64=false',
		skinName: win.skinName,
		skinDesc: win.skinDesc
	});
	
	if(Utils.isiPad()) {
		win_process.masterGroup = win.masterGroup;
		win_process.prevWins = [win.prevWins[0], win];
		win.masterGroup.open(win_process);
	} else {
		win_process.container = win.container;
		win.navGroup.open(win_process);
	}
}
