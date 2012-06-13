var win = Ti.UI.currentWindow;
Ti.include('/includes/lib/json.i18n.js');

var paypalUrl = 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=K963NDAY8S3FU'
var webView = Ti.UI.createWebView({
	url: paypalUrl
});
win.add(webView);

webView.addEventListener('load', stoppedLoading);
webView.addEventListener('error', function(e) {
	stoppedLoading();
	var errorDialog = Ti.UI.createAlertDialog({
		title: I('webview.error.title'),
		message: I('webview.error.message', webView.getUrl(), e.message.split('"')[1])
	});
	errorDialog.show();
});

var b_prev = Ti.UI.createButton({
	image: '/img/arrow_left.png'
});

b_prev.addEventListener('click', function() {
	webView.goBack();
});

var b_fwd = Ti.UI.createButton({
	image: '/img/arrow_right.png'
});

b_fwd.addEventListener('click', function() {
	webView.goForward();
});

var b_cancel = Ti.UI.createButton({
	systemButton: Ti.UI.iPhone.SystemButton.STOP
});

b_cancel.addEventListener('click', function() {
	webView.stopLoading();
});

var b_refresh = Ti.UI.createButton({
	systemButton: Ti.UI.iPhone.SystemButton.REFRESH
});

b_refresh.addEventListener('click', function() {
	webView.reload();
});

var loading_wheel = Ti.UI.createButton({
	systemButton: Ti.UI.iPhone.SystemButton.ACTIVITY
});

var fixedSpace = Ti.UI.createButton({
	systemButton: Ti.UI.iPhone.SystemButton.FIXED_SPACE,
	width: 25
});

var flexibleSpace = Ti.UI.createButton({
	systemButton: Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});

var b_safari = Ti.UI.createButton({
	systemButton: Ti.UI.iPhone.SystemButton.ACTION
});

b_safari.addEventListener('click', function() {
	var option_confirm = Ti.UI.createOptionDialog({
		options: [I('webview.action.safari'), I('webview.action.email'), I('webview.action.cancel')],
		cancel: 2
	});

	option_confirm.addEventListener('click', function(e) {
		if(e.index == 0) {
			Ti.Platform.openURL(paypalUrl);
		} else if(e.index == 1) {
			var emailDialog = Ti.UI.createEmailDialog({
				html: true,
				subject: I('webview.email.subject'),
				messageBody: I('webview.email.message') + '<br /><a href=' + paypalUrl + '>' + I('webview.email.link') + '</a>'	
			});
			emailDialog.open();
		}
	});

	option_confirm.show();
});

//add the elements to the window toolbar
win.setToolbar([flexibleSpace, b_prev, flexibleSpace, b_fwd, flexibleSpace, b_refresh, flexibleSpace, b_safari, flexibleSpace]);

webView.addEventListener('beforeload', function() {
	//set the back/forward buttons correct behavior
	if(webView.canGoBack()) {
		b_prev.enabled = true;
	} else {
		b_prev.enabled = false;
	}
	if(webView.canGoForward()) {
		b_fwd.enabled = true;
	} else {
		b_fwd.enabled = false;
	}

	win.setRightNavButton(loading_wheel);
	win.setToolbar([flexibleSpace, b_prev, flexibleSpace, b_fwd, flexibleSpace, b_cancel, flexibleSpace, b_safari, flexibleSpace], {
		animated: false
	});
});

function stoppedLoading() {
	win.setRightNavButton();
	win.setToolbar([flexibleSpace, b_prev, flexibleSpace, b_fwd, flexibleSpace, b_refresh, flexibleSpace, b_safari, flexibleSpace], {
		animated: false
	});
}