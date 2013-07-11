Ti.include('/includes/lib/json.i18n.js');

var win = Ti.UI.currentWindow,
	Utils = require('/includes/utils'),
	Ui = require('/includes/ui'),

searchBar = Ti.UI.createSearchBar({
	barColor: Utils.getNavColor(),
	hintText: I('addProcess.search.searchHint'),
	width: Ti.UI.FILL
}),

darkenView = Ti.UI.createView({
	backgroundColor: 'black',
	top: 0,
	bottom: 0,
	left: 0,
	right: 0
}),

containerView = null,

lbl_indicator = Ti.UI.createLabel({
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

win.setTitleControl(searchBar);

if(Utils.isiPhone()) {
	var b_close = Ti.UI.createButton({
		title: I('buttons.close'),
		style: Titanium.UI.iPhone.SystemButtonStyle.DONE
	});

	b_close.addEventListener('click', function(e) {
		if(win.container != null) {
			win.container.close();
		} else {
			win.close();
		}
	});

	win.setLeftNavButton(b_close);
}

darkenView.addEventListener('click', function() {
	searchBar.blur();
	
	if(searchBar.getValue() == '') {
		getRandomSkins();
	}
});

if(!Utils.isiPad()) {
	win.add(lbl_indicator);
}

if(Utils.isiPad()) {
	containerView = Ti.UI.createScrollView({
		layout: 'horizontal',
	  	left: 5,
	  	top: 0,
	  	bottom: 0,
	  	right: 5,
	  	contentWidth: 290,
  		showVerticalScrollIndicator: true
	});
} else {
	containerView = Ti.UI.createScrollableView({
		top: 10,
		bottom: 0,
		width: 270,
		clipViews: false,
		disableBounce: false
	});
	
	containerView.addEventListener('scrollend', loadSkinPreview);
}

win.add(containerView);

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
			var resultArray = [], i, currentSkinResult;
			
			try {
				resultArray = JSON.parse(this.responseText);
			} catch(e) {
				alert(I('addProcess.search.indicator.error.network'));
			}
			
			if(resultArray.error != null) {
				alert(I('addProcess.search.error.network'));
			} else {
				//resetting the list
				if(Utils.isiPad()) {
					if(containerView.children[0] != null) {
						var i, currentSkin,
							childrenArray = containerView.children;
						
						for(i = 0; i < childrenArray.length; i++) {
							containerView.remove(childrenArray[i]);
							childrenArray[i] = null;
						}
					}

					containerView.add(lbl_indicator);
				} else {
					containerView.setViews([]);
				}
				
				if(resultArray.length == 0 && params.match != null) {
					lbl_indicator.setText(I('addProcess.search.indicator.noResults', params.match));
				}
				
				for(i = 0; i < resultArray.length; i++) {
					currentSkinResult = Ui.getSingleSearchResult(resultArray[i], selectSkin);
					
					if(Utils.isiPad()) {
						containerView.add(currentSkinResult);
					} else {
						containerView.addView(currentSkinResult);
					}
					
					if(i == 0 || Utils.isiPad()) {
						loadSkinPreview({
							view: currentSkinResult
						});
					}
				}
			}
		},
		onerror: function(e) {
			alert(I('addProcess.search.error.network'));
		}
	});
	
	xhr.open('POST', 'http://skinmanager.fr.nf/json/');
	xhr.send(params);
}

function loadSkinPreview(e) {
	if(!e.view.frontImg.isLoaded) {
		var xhr_front = Ti.Network.createHTTPClient({
			onload: function() {
				if(this.getResponseData() != null && this.responseText.error == null) {
					e.view.frontImg.animate({
						opacity: 0,
						duration: 60
					}, function() {
						e.view.frontImg.setImage(xhr_front.getResponseData());
						e.view.frontImg.isLoaded = true;
						
						e.view.frontImg.animate({
							opacity: 1,
							duration: 60
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
	var win_info = Ti.UI.createWindow({
		title: I('addProcess.skinInfo.title'),
		url: 'info.js',
		backgroundImage: Utils.getBGImage(),
		barColor: Utils.getNavColor(),
		backgroundRepeat: true,

		skinUrl: 'http://skinmanager.fr.nf/json/?method=getSkin&id=' + parseInt(skinData.id) + '&base64=false',
		defaultSkinName: skinData.title,
		defaultSkinDesc: skinData.description
	});
	
	if(Utils.isiPad()) {
		win_info.masterGroup = win.masterGroup;
		win_info.prevWins = [win];
		win.masterGroup.open(win_info);
	} else {
		win_info.container = win.container;
		win_info.navGroup = win.navGroup;
		win.navGroup.open(win_info);
	}
}
