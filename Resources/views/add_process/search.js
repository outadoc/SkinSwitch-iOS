var win = Ti.UI.currentWindow;

var Utils = require('/includes/utils');
var Ui = require('/includes/ui');

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
					containerView.setViews([]);
					
					for(var i = 0; i < resultArray.length; i++) {
						containerView.addView(getSingleSkinCell(resultArray[i]));
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

function getSingleSkinCell(skinData) {
	var height = 170,
		width = 85;
	
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
		top: 10,
		height: 20,
		color: '#4f4f4f',
		textAlign: 'center',
		font: {
			fontSize: 19
		}
	});
	
	view.add(lbl_title);
	
	var lbl_author = Ti.UI.createLabel({
		text: 'by #' + skinData.owner,
		color: '9f9f9f',
		height: 20,
		top: 5,
		font: {
			fontSize: 17
		},
		textAlign: 'center',
	});
	
	view.add(lbl_author);
		
	var view_skin = Ti.UI.createImageView({
		top: 20,
		height: height,
		width: width
	});

	var img_skin_front = Ti.UI.createImageView({
		defaultImage: '/img/char_front.png',
		height: height,
		width: width,
		top: 0,
		left: 0
	});
	
	view.frontImg = img_skin_front;
	view_skin.add(img_skin_front);

	var img_skin_back = Ti.UI.createImageView({
		defaultImage: '/img/char_back.png',
		height: height,
		width: width,
		top: 0,
		left: 0
	});
	
	view.backImg = img_skin_back;
	
	//fix bug where you wouldn't be able to click?
	view_skin.addEventListener('click', function(e) {});
	
	img_skin_front.addEventListener('click', function() {
		view_skin.animate({
			view: img_skin_back,
			transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
		});
	});

	img_skin_back.addEventListener('click', function() {
		view_skin.animate({
			view: img_skin_front,
			transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
		});
	});
	
	view.add(view_skin);
	
	var scrollView_desc = Ti.UI.createLabel({
		top: 10,
		bottom: 10,
		left: 20,
		right: 20
	});
	
	var lbl_description = Ti.UI.createLabel({
		text: skinData.description,
		color: '5f5f5f',
		font: {
			fontSize: 16
		}
	});
	
	scrollView_desc.add(lbl_description);
	view.add(scrollView_desc);
	
	loadSkinPreview({
		view: view
	});
	
	return view;
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