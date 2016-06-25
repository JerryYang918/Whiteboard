var image_scale = 1;
var scale_per_click = 1.2;
var current_upload_id = null;

$('#button_shrink').click(function (event){
	image_scale /= scale_per_click;
	$("#modal_image").css('transform', 'scale(' + image_scale + ')');
});

$('#button_enlarge').click(function (event){
	image_scale *= scale_per_click;
	$("#modal_image").css('transform', 'scale(' + image_scale + ')');
});

$("#modal_image_button_upload").click(function() {
	$("#image_upload_input").click();
});

$("#modal_image_button_url").click(function() {
	var url = window.prompt('Enter image url', '');
	if (url) {
		whiteboard.setToolHead(new ImageHead(url));
	}
});

$("#modal_image_button_cancel").click(function() {
	whiteboard.modalInputCancel();
});

// Handle the image uploading process

if (typeof Ospry !== 'undefined') {
	var ospry = new Ospry('pk-test-53z2t7ah9j8jhe2l6zjh9v2h');
}


if (typeof Ospry === 'undefined') {
	$('#image_upload_form').change(function(e) {
		alert('Image uploading is not available');
	});
} else {
	$('#image_upload_form').change(function(e) {

		var the_id = Math.random();
		current_upload_id = the_id;

		var onUpload = function(err, metadata) {
			console.log('Upload result:');
			console.log(err);
			console.log(metadata);
			if (the_id == current_upload_id) {
				if (err === null) {
					whiteboard.modalClose('.modal_image_upload_progress');
					var url = metadata.url + '?format=jpeg';
					whiteboard.setToolHead(new ImageHead(url));
				} else {
					whiteboard.modalClose('.modal_image_upload_progress');
					alert('Error in image uploading :(');
				}
			} else {
				console.log('Image upload was cancelled');
			}
		};

		console.log('Uploading...');
		console.log(this, e);
		var up_result = ospry.up({
			form: this,
			imageReady: onUpload,
		});
		console.log(up_result);
		whiteboard.modalClose('.modal_image_select');
		whiteboard.modalOpen('.modal_image_upload_progress', '.modal_centered');
		whiteboard.toolbarActivate('#toolbar_cancel');
	});
}

// Objects to interface with the whiteboard

function ImageHead(url) {
	whiteboard.modalClose('.modal_image_upload_progress');
	whiteboard.modalClose('.modal_image_select');
	whiteboard.modalOpen('.modal_image');
	whiteboard.toolbarActivate('#toolbar_confirm', '#toolbar_cancel', '#toolbar_image');
	this.url = url;
	$('#modal_image').attr('src', url);
}

ImageHead.prototype.onMove = function(p) {
	this.position = new Point(p.x, p.y);
	$('#modal_image').css('left', p.x + whiteboard.pan_x);
	$('#modal_image').css('top', p.y + whiteboard.pan_y);
}

ImageHead.prototype.onModalConfirm = function() {
	console.log('Painting image.');
	whiteboard.sendPaintEvent('image', {
		position: this.position,
		url: this.url,
		scale: image_scale
	});
	whiteboard.modalClose('.modal_image');
	$('#modal_image').attr('src', '/static/images/loading.svg');
}

ImageHead.prototype.onModalCancel = function() {
	whiteboard.modalClose('.modal_image');
}

function SelectHead() {
	whiteboard.modalOpen('.modal_image_select', '.modal_centered');
}

SelectHead.prototype.onModalConfirm = function() {
	whiteboard.modalClose('.modal_image_select');
	whiteboard.modalClose('.modal_image_upload_progress');
};

SelectHead.prototype.onModalCancel = function() {
	whiteboard.modalClose('.modal_image_select');
	whiteboard.modalClose('.modal_image_upload_progress');
	current_upload_id = null;
}

function ImageTool() {
	this.name = 'image';
	this.desktopOnly = true;
	this.shortcut_key = 'i';
}

ImageTool.prototype.onButtonClick = function() {
	return new SelectHead();
};

ImageTool.prototype.drawFull = function(data) {
	function callback(url, position, context) {
		whiteboard.drawEverything();
	}
	drawImageScaled(data.url, data.position, data.scale, context_picture, callback);
};

whiteboard.makeTool(new ImageTool());