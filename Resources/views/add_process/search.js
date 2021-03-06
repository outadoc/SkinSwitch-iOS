Ti.include('/includes/lib/json.i18n.js');

var BASE_URL = "http://skin.outadoc.fr/json/";

var win = Ti.UI.currentWindow,
	Utils = require('/includes/utils'),
	Ui = require('/includes/ui'),

loadingWin = Ui.createLoadingWindow(),

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

containerView = Ti.UI.createScrollableView({
	width: (Utils.isiPad()) ? '70%' : '90%',
	clipViews: false,
	disableBounce: false
}),

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
}),

lbl_page_indicator = Ti.UI.createLabel({
	bottom: 10,
	font: {
		fontSize: 16,
		fontFamily: 'Helvetica Neue'
	},
	textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	height: 16,
	color: 'white'
}),

b_close = Ti.UI.createButton({
	title: I('buttons.close')
});


loadingWin.open();

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

b_close.addEventListener('click', function(e) {
	win.navGroup.close();
});

darkenView.addEventListener('click', function() {
	searchBar.blur();
	
	if(searchBar.getValue() == '') {
		getRandomSkins();
	}
});


containerView.addEventListener('scrollend', function(e) {
	lbl_page_indicator.setText((e.currentPage + 1) + " / " + e.source.views.length);
	loadSkinPreview(e);
});

win.setLeftNavButton(b_close);
win.setTitleControl(searchBar);

win.add(lbl_indicator);
win.add(containerView);
win.add(lbl_page_indicator);

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
				alert(I('addProcess.search.error.network'));
			}
			
			if(resultArray.error != null) {
				alert(I('addProcess.search.error.network'));
			} else {
				//resetting the list
				containerView.setViews([]);
				lbl_page_indicator.setText(null);
				containerView.setOpacity(0);
				
				if(resultArray.length == 0 && params.match != null) {
					lbl_indicator.setText(I('addProcess.search.indicator.noResults', params.match));
				}
				
				for(i = 0; i < resultArray.length; i++) {
					currentSkinResult = Ui.createSingleSearchResult(resultArray[i], selectSkin);
					containerView.addView(currentSkinResult);	
									
					if(i == 0) {
						loadSkinPreview({
							view: currentSkinResult
						});
					}
				}
				
				if(resultArray != 0) {
					lbl_page_indicator.setText("1 / " + resultArray.length);
				}
			}
			
			loadingWin.close();
			containerView.animate({
				opacity: 1,
				duration: 300
			});
		},
		onerror: function(e) {
			loadingWin.close();
			alert(I('addProcess.search.error.network'));
		}
	});
	
	xhr.open('POST', BASE_URL);
	loadingWin.open();
	xhr.send(params);
}

function loadSkinPreview(e) {
	if(!e.view.frontImg.isLoaded) {
		var xhr_front = Ti.Network.createHTTPClient({
			onload: function() {
				if(this.responseText != null && this.responseText.error == null) {
					Utils.getSkinPreview('data:image/png;base64,' + xhr_front.responseText, 'front', function(success, preview) {
						if(success && preview != null) {
							e.view.frontImg.animate({
								opacity: 0,
								duration: 60
							}, function() {
								e.view.frontImg.setImage(preview);
								e.view.frontImg.isLoaded = true;
								
								Utils.getSkinPreview('data:image/png;base64,' + xhr_front.responseText, 'back', function(success, preview) {
									if(success && preview != null) {
										e.view.backImg.setImage(preview);
									}
								});
		
								e.view.frontImg.animate({
									opacity: 1,
									duration: 60
								});
							});
						}
					});
				}
			},
			cache: true
		});
		
		xhr_front.open('GET', BASE_URL + '?method=getSkin&id=' + parseInt(e.view.skinData.id) + '&base64=true');
		xhr_front.send();
	}
}

function selectSkin(skinData) {
	var win_info = Ti.UI.createWindow({
		title: I('addProcess.skinInfo.title'),
		url: 'info.js',
		backgroundImage: Utils.getModalBackgroundImage(),
		barColor: Utils.getNavColor(),
		translucent: false,
		navGroup: win.navGroup,

		skinUrl: BASE_URL + '?method=getSkin&id=' + parseInt(skinData.id) + '&base64=false',
		defaultSkinName: skinData.title,
		defaultSkinDesc: skinData.description
	});
	
	win.navGroup.openWindow(win_info);
}
