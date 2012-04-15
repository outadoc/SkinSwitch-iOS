Ti.include('/includes/utils.js');
var win = Ti.UI.currentWindow;
var skinID = getRandomID();

var progBar = Ti.UI.createProgressBar({
	min:0,
	max:100,
	value:0,
	width:240,
	message:'Reticulating Splines...',
	style:Ti.UI.iPhone.ProgressBarStyle.BAR,
	color:'white'
});

progBar.show();
win.add(progBar);

var b_done = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.DONE
});

b_done.addEventListener('click', function(e) {
	win.container.close();
});

Ti.Filesystem.getFile(getSkinsDir() + skinID).createDirectory();
downloadSkin(win.skinUrl, skinID);

function downloadSkin(url) {
	var xhr = Ti.Network.createHTTPClient({
		onload: function() {
			progBar.setValue(30);
			downloadPreview('front');
		},
		onerror: function(e) {
			Ti.Filesystem.getFile(getSkinsDir() + skinID).deleteDirectory();
			alert('Error while downloading the skin. Aborting.');
			progBar.setValue(0);
			progBar.setMessage('Fail :(');
			win.setRightNavButton(b_done);
		}
	});
	
	xhr.open('GET', url);
	xhr.setFile(Ti.Filesystem.getFile(getSkinsDir() + skinID + '/skin.png'));
	
	progBar.setMessage('Downloading Skin...');
	progBar.setValue(10);
	xhr.send();
}

function downloadPreview(side) {
	var xhr = Ti.Network.createHTTPClient({
		onload: function() {
			if(side == 'front') {
				progBar.setValue(60);
				downloadPreview('back');
			} else {
				progBar.setValue(90);
				registerSkinToDatabase();
			}
		},
		onerror: function() {
			var dialog_continue = Ti.UI.createAlertDialog({
				title:'Network Error',
				message:'Error while downloading the preview. There will be no preview for this skin. Continue anyway?',
				buttonNames:['Cancel', 'Okay'],
				cancel:0
			});

			dialog_continue.addEventListener('click', function(e) {
				if(e.index == 1) {
					registerSkinToDatabase();
				} else {
					progBar.setValue(0);
					progBar.setMessage('Fail :(');
					Ti.Filesystem.getFile(getSkinsDir() + skinID).deleteDirectory();
					win.setRightNavButton(b_done);
				}
			});

			dialog_continue.show();
		},
		ondatastream: function(e) {
			progBar.setMessage('Downloading skin preview...');
		}
	});

	var output = Ti.Filesystem.getFile(getSkinsDir() + skinID + '/' + side + '.png');
	xhr.open('GET', 'http://dev.outadoc.fr/skinswitch/skinpreview.php?side=' + side + '&url=' + win.skinUrl);
	xhr.setFile(output);
	xhr.send();
	progBar.setMessage('Downloading skin previews...');
}

function registerSkinToDatabase() {
	progBar.setMessage('Registering skin to database...');
	progBar.setValue(90);

	var db = Ti.Database.open('skins');

	db.execute('INSERT INTO skins (id, name, description, timestamp) VALUES (?, ?, ?, ?)', skinID, win.skinName, win.skinDesc, String(new Date().getTime()));
	db.close();

	progBar.setMessage('Successfuly added the skin! :)');
	progBar.setValue(100);
	win.setRightNavButton(b_done);
}