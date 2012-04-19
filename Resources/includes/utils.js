function getRandomID() {
	return String(Math.floor(Math.random() * 98765862));
}

function getSkinsDir() {
	Titanium.Filesystem.getFile(Titanium.Filesystem.getApplicationDataDirectory() + 'skins/').createDirectory();
	return Titanium.Filesystem.getApplicationDataDirectory() + 'skins/';
}

function getBGImage() {
	return '/img/bg.png';
}

function getNavColor() {
	return '#888888';
}

function createLoadingWindow()
{
	var timeoutID;

	var win = Ti.UI.createWindow({
		height:320,
		width:480,
		orientationModes:[Ti.UI.PORTRAIT]
	});

	var view = Ti.UI.createView({
		height:60,
		width:60,
		borderRadius:10,
		backgroundColor:'#000',
		opacity:0.6
	});

	win.add(view);

	win.addEventListener('open', function(e)
	{
		timeoutID = setTimeout(function()
		{
			win.close();
		}, 10000);
	});


	win.addEventListener('close', function(e)
	{
		clearTimeout(timeoutID);
	});

	var spinWheel = Ti.UI.createActivityIndicator({
		style:Ti.UI.iPhone.ActivityIndicatorStyle.BIG
	});

	view.add(spinWheel);
	spinWheel.show();

	return win;
}