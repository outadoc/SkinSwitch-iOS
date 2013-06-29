var win = Ti.UI.currentWindow;

Ti.include('/includes/lib/json.i18n.js');

var container = Ti.UI.createView({
	layout: 'vertical',
	height: Ti.UI.SIZE,
	top: 30
})

var lbl_question = Ti.UI.createLabel({
	text: win.question,
	color: 'white',
	top: 10,
	left: 10,
	right: 10
});

var txtfield_answer = Ti.UI.createTextField({
	borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
	autocorrect: false,
	top: 10,
	left: 10,
	right: 10
});

container.add(lbl_question);
container.add(txtfield_answer);

win.add(container);

var b_cancel = Ti.UI.createButton({
	title: I('addProcess.process.error.preview.cancel')
});

b_cancel.addEventListener('click', function() {
	win.close();
});

win.setLeftNavButton(b_cancel);

var b_continue = Ti.UI.createButton({
	title: I('addProcess.process.error.preview.ok')
});

b_continue.addEventListener('click', function() {
	var xhr_answer = Ti.Network.createHTTPClient({
		onload: function(e) {
			var responseObj = {};
			
			try {
				responseObj = JSON.parse(this.getResponseText());
			} catch(e) {
				responseObj.error = this.getResponseText();
			}
			
			if(responseObj.error != null) {
				//oh noes, an error!
				alert(responseObj.error);
			}
			
			win.close();
		},
		onerror: function(e) {
			win.triggerError('challenge')
		},
		autoRedirect: false
	});
	
	xhr_answer.open('POST', 'http://minecraft.net/challenge');
	xhr_answer.send({
		answer: txtfield_answer.getValue(),
		questionId: win.questionID
	});
});

win.setRightNavButton(b_continue);