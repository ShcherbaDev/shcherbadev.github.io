Vue.component('modal', {
	props: ['title'],
	template: `
	<transition name="modal">
		<div class="modal-mask">
			<div class="modal-wrapper">
				<div class="modal-container">
					<div class="modal-header">
						<h1 class="title">{{title}}</h1>
					</div>

					<div class="modal-body">
						<slot name="content">
							Modal content
						</slot>
					</div>

					<div class="modal-footer">
						<slot name="footer">
							<button class="modal-default-button" @click="$emit('close')">
								OK
							</button>
						</slot>
					</div>
				</div>
			</div>
		</div>
	</transition>
	`
});

Vue.component('object-item', {
	props: ["object"],
	template: `
		<li @click="console.log(object)">
			{{object}}
		</li>
	`
});

let app = new Vue({
	el: "#app",
	data: {
		showModal: false,
		addObjectForm: {
			typeSelect: "",
			fill: "#000000",
			layer: "0",
			x: "",
			y: "",
			width: "",
			height: ""
		},
		objects: [],
		objectId: 1
	},
	methods: {
		addObj: function(e) {
			let properties = {
				type: this.addObjectForm.typeSelect,
				fill: this.addObjectForm.fill,
				x: parseInt(this.addObjectForm.x),
				y: parseInt(this.addObjectForm.y),
				width: parseInt(this.addObjectForm.width),
				height: parseInt(this.addObjectForm.height),
			}

			this.objects.push({
				id: this.objectId++,
				type: properties.typeSelect,
				fill: properties.fill,
				x: properties.x,
				y: properties.y,
				width: properties.width,
				height: properties.height,
				editorSettings: {
					inEditorX: properties.x,
					inEditorY: properties.y,
					inEditorWidth: properties.width,
					inEditorHeight: properties.height,
					isSelected: false
				}
			});
			app.showModal = false;
		}
	}
});



const canvas = document.getElementById("editor");
const context = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 400;
context.imageSmoothingEnabled = false;

const controls = {
	isAltPressed: false,
	canMoveCamera: false,
	isCameraMoving: false,
	cameraSize: 100,
	selectedObjectCoords: {
		x: undefined,
		y: undefined,
		width: undefined,
		height: undefined,
		id: undefined
	}
}

app.objects.push(
	{
		id: app.objectId++,
		type: "rectangle",
		fill: "cyan",
		x: 43,
		y: 52,
		width: 64,
		height: 64,
		editorSettings: {
			inEditorX: 43,
			inEditorY: 52,
			inEditorWidth: 64,
			inEditorHeight: 64,
			isSelected: false
		}
	},

	{
		id: app.objectId++,
		type: "rectangle",
		fill: "cyan",
		x: canvas.width/2,
		y: canvas.height/2,
		width: 64,
		height: 64,
		editorSettings: {
			inEditorX: canvas.width/2,
			inEditorY: canvas.height/2,
			inEditorWidth: 64,
			inEditorHeight: 64,
			isSelected: false
		}
	}
);

// Editor camera
function editorCam() {
	document.onkeydown = e => { 
		controls.isAltPressed = (e.altKey) ? true : false;

		// Editor camera resizing
		function camResize() {
			if(controls.isAltPressed) {
				if(e.keyCode === 107 && controls.cameraSize < 150) {
					for(let i in app.objects) {
						app.objects[i].editorSettings.inEditorWidth += 10;
						app.objects[i].editorSettings.inEditorHeight += 10;
					}
					controls.cameraSize += 10;
				}
				if(e.keyCode === 109 && controls.cameraSize > 50) {
					for(let i in app.objects) {
						app.objects[i].editorSettings.inEditorWidth -= 10;
						app.objects[i].editorSettings.inEditorHeight -= 10;
					}
					controls.cameraSize -= 10;
				}
			}
		}
		camResize();
	};
	document.onkeyup = e => { controls.isAltPressed = (!e.altKey) ? false : true };
	
	// Editor camera moving
	document.onmousedown = e => { controls.canMoveCamera = (e.which === 1 && controls.isAltPressed && e.target === canvas) ? true : false };
	document.onmouseup = e => { controls.canMoveCamera = false };
	document.onmousemove = e => {
		if(controls.canMoveCamera) {
			for(let i in app.objects) {
				app.objects[i].editorSettings.inEditorX += e.movementX;
				app.objects[i].editorSettings.inEditorY += e.movementY;
			}
		}
	}

	// Object select
	document.onclick = e => {
		if(e.target === canvas) {
			for(let i in app.objects) {
				if(e.layerX >= app.objects[i].editorSettings.inEditorX && e.layerX <= app.objects[i].editorSettings.inEditorX+app.objects[i].editorSettings.inEditorWidth &&
					e.layerY >= app.objects[i].editorSettings.inEditorY && e.layerY <= app.objects[i].editorSettings.inEditorY+app.objects[i].editorSettings.inEditorHeight) {
					
				}
			}
		}
	}
}
editorCam();

function loop() {
	context.clearRect(0, 0, canvas.width, canvas.height);

	for(let i in app.objects) {
		context.fillStyle = app.objects[i].fill;
		context.fillRect(app.objects[i].editorSettings.inEditorX, app.objects[i].editorSettings.inEditorY, app.objects[i].editorSettings.inEditorWidth, app.objects[i].editorSettings.inEditorHeight);
	}

	requestAnimationFrame(loop);
}
loop();