var win = Ti.UI.currentWindow;

var Utils = require('/includes/utils');

var searchBar = Ti.UI.createSearchBar({
	barColor: Utils.getNavColor(),
	hint: 'Search on MC Network',
	showCancel: true,
	top: 0
});

win.add(searchBar);

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
					for(var i = 0; i < resultArray.length; i++) {
						Ti.API.info(resultArray[i]);
						
						containerView.addView(getSingleSkinCell(resultArray[i]));
					}
				}
			} catch(e) {
				alert('Couldn\'t parse result :s');
			}
		}
	});
	
	xhr.open('POST', 'http://skinmanager.fr.nf/json/');
	xhr.send(params);
}

function getSingleSkinCell(skinData) {
	var view = Ti.UI.createView({
		left: 10,
		right: 10,
		top: 30,
		bottom: 30,
		borderRadius: 7,
		backgroundColor: 'white',
		skinData: skinData,
		layout: 'vertical'
	});
	
	var lbl_title = Ti.UI.createLabel({
		text: skinData.title,
		left: 10,
		right: 10,
		top: 5,
		height: 30,
		color: '#4f4f4f',
		textAlign: 'center',
		font: {
			fontSize: 19
		}
	});
	
	view.add(lbl_title);
	
	var img = Ti.UI.createImageView({
		top: 20
	});
	
	view.img = img;
	view.add(img);
	
	loadSkinPreview({
		view: view
	});
	
	return view;
}

containerView.addEventListener('scrollend', loadSkinPreview);

function loadSkinPreview(e) {
	if(e.view.img.image == null) {
		var xhr = Ti.Network.createHTTPClient({
			onload: function() {
				if(this.getResponseData() != null && this.responseText.error == null) {
					e.view.img.setImage(this.getResponseData());
				}
			},
			cache: true
		});
		
		xhr.open('GET', 'http://apps.outadoc.fr/skinswitch/skinpreview.php?url=' + encodeURIComponent('http://skinmanager.fr.nf/json/?method=getSkin&id=' + parseInt(e.view.skinData.id) + '&base64=false'));
		xhr.send();
	}
}