$('#modal_settings_button_clear').click(function() {
	whiteboard.modalClose('.modal_settings');
	whiteboard.modalOpen('.modal_clear');
	whiteboard.setToolHead(new ClearHead());
});

$('#modal_settings_button_cancel').click(function() {
	whiteboard.modalClose('.modal_settings');
});

var b = document.getElementById('modal_settings_button_download');
b.addEventListener('click', function() {
	console.log('Trying to download...');
	var c = document.getElementById('canvas1');
	this.href = c.toDataURL();
	var n = whiteboard.whiteboard_id;
    this.download = 'whiteboard-' + n + '.png';
});

function SettingsTool() {
	this.name = 'settings';
}

SettingsTool.prototype.onButtonClick = function() {
	whiteboard.modalOpen('.modal_settings');
};

whiteboard.makeTool(new SettingsTool());
