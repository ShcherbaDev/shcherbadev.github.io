Vue.config.devtools = true;

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
		roomData: {
			name: undefined
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
		}
	}
});

// Save confirm window
/* document.addEventListener("keydown", e => {
	if(e.keyCode === 116) {
		e.preventDefault();

		const save = confirm("There may be unsaved changes in the project!\Save project?");
		if(save)
			location.reload();
		else
			return false;
	}
}); */

// Right mouse click blocker
/* document.addEventListener("contextmenu", e => {
	e.preventDefault();
	console.log(e);
}); */


// Editor's canvas
const canvas = document.getElementById("editor");
const context = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 400;
context.imageSmoothingEnabled = false;

const controls = {
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

// Canvas camera
function editorCam() {
	document.addEventListener("mousedown", e => {
		if(e.which === 2) {
			e.preventDefault();
			controls.canMoveCamera = true;
		}
	});

	document.addEventListener("mouseup", e => {
		if(e.which === 2) {
			controls.canMoveCamera = false;
		}
	});
	
	// Canvas camera moving
	document.addEventListener("mousemove", e => {
		if(controls.canMoveCamera) {
			for(let i in app.objects) {
				app.objects[i].editorSettings.inEditorX += e.movementX;
				app.objects[i].editorSettings.inEditorY += e.movementY;
			}
		}
	});
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