function getRandomID() {
	return String(Math.floor(Math.random() * 98765862));
}

function getSkinsDir() {
	Titanium.Filesystem.getFile(Titanium.Filesystem.getApplicationDataDirectory() + 'skins/').createDirectory();
	return Titanium.Filesystem.getApplicationDataDirectory() + 'skins/';
}

function getBGImage() {
	if(Ti.Platform.getOsname() === 'iphone') {
		return '/img/bg.png';
	} else if(Ti.Platform.getOsname() === 'ipad') {
		return '/img/block_stonebrick.png';
	}
}

function getNavColor() {
	return '#888888';
}

function createLoadingWindow() {
	var win = Ti.UI.createWindow({
		width: 320,
		height: 480
	});

	var view = Ti.UI.createView({
		height: 60,
		width: 60,
		borderRadius: 10,
		backgroundColor: 'black',
		opacity: 0.6
	});

	win.add(view);

	var spinWheel = Ti.UI.createActivityIndicator({
		style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG
	});

	view.add(spinWheel);
	spinWheel.show();

	return win;
}