Vue.config.devtools = true;

Vue.component("object-item", {
	props: ["object"],
	template: `
		<td @click="console.log(object)" style="border: 1px solid #000; padding: 5px 10px">
			{{object.id}}
		</td>
	`
});

Vue.component("start-window", {
	template: `
		<div class="card-container">
			<div class="card card-start">
				<div class="card-header">
					<h1 class="title">RPGinia</h1>
					<h2 class="subtitle">Room editor</h2>
				</div>
				<div class="card-body">
					<div class="list-group">
						<button class="list-group-item list-group-item-action" @click="app.startWindow.currentHTML = 1">
							<i class="fas fa-plus"></i>
							New room
						</button>
						<button class="list-group-item list-group-item-action open-file-btn">
							<label for="open-project">
								<i class="far fa-folder-open"></i>
								Open room
							</label>
						</button>
						<input type="file" id="open-project" accept="application/json" @change="app.openProject(this.files)">

						<button class="list-group-item list-group-item-action" @click="app.loadProject()" v-if="localStorage.getItem('room')">
							<i class="fas fa-pencil-alt"></i>
							Open last project
						</button>
					</div>
				</div>
				<div class="card-footer">
					<div class="container-fluid">
						<div class="row">
							<div class="col-6">
								<p class="text-left">&copy; <a href="https://www.facebook.com/profile.php?id=100010853207140" target="_blank">Andrey Shcherbakov</a></p>
							</div>
							<div class="col-6">
								<p class="text-right">
									<a href="https://shcherbadev.github.io/RPGinia" target="_blank">Help</a>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	`
});

Vue.component("project-settings", {
	template: `
		<div class="card-container">
			<div class="card card-settings">
				<div class="card-header">
					<h1 class="title">Room settings</h1>
				</div>
				<div class="card-body">
					<div class="form-group">
						<label for="projectName">Room name <b class="required">*</b></label>
						<input type="text" class="form-control" id="projectName" placeholder="Enter room name" v-model="app.projectData.roomData.settings.name">
					</div>
					<div class="form-group selectFile">
						<label for="spriteSheet">Sprite sheets JSON <b class="required">*</b></label>
	
						<div class="form-control">
							<div class="selectedFile">File is not selected</div>
							<button class="selectFileBtn">Select</button>
							<input type="file" id="spriteSheet" accept="application/json" @change="app.setProjectName(this.files)">
						</div>
					</div>
					<div class="form-group">
						<label for="background">Background:</label>
						<input type="color" class="form-control" id="background" v-model="app.projectData.roomData.settings.background">
					</div>
					<p>The inputs with <b class="required">*</b> are required</p>
				</div>
				<div class="card-footer">
					<button class="btn btn-secondary" @click="app.startWindow.currentHTML = 0">Back</button>
					<button class="btn btn-primary" @click="app.setEditorCanvas(); app.saveProject()" v-if="app.projectData.roomData.settings.name && 
																						app.projectData.roomData.settings.spriteSheetName && 
																						app.projectData.roomData.settings.spriteSheetsData.spriteSheets">Create</button>
					<button class="btn btn-primary" disabled v-else>Create</button>
				</div>
			</div>
		</div>
	`
});

let app = new Vue({
	el: "#app",
	data: {
		canUseEditor: false,
		startWindow: {	
			currentHTML: 0
		},
		controls: {
			canMoveCamera: false,
			isCameraMoving: false,
			cameraZoom: 100,
			selectedObjectCoords: {
				x: undefined,
				y: undefined,
				width: undefined,
				height: undefined,
				id: undefined
			}
		},
		projectData: {
			roomData: {
				settings: {
					name: undefined,
					spriteSheetName: undefined,
					spriteSheetsData: undefined,
					background: "#000000"
				},
				sprites: []
			}
		},
		objects: [],
		objectId: 1
	},
	methods: {
		openProject: (files) => {
			const file = document.querySelector("input#open-project[type='file']").files;
			const reader = new FileReader();

			reader.onload = e => {
				if(JSON.parse(e.target.result).roomData) {
					app.projectData.roomData.settings = JSON.parse(e.target.result).roomData.settings;
					app.projectData.roomData.sprites = JSON.parse(e.target.result).roomData.sprites;
					app.setEditorCanvas();
				} else console.error(`${file[0].name} is not a room file!`);
			}
			reader.readAsText(file[0]);
		},
		setProjectName: (files) => {
			const file = document.querySelector(".card.card-settings .card-body .form-control > input[type='file']").files;
			const projectNameField = document.querySelector(".card.card-settings .card-body .form-control .selectedFile");
			const reader = new FileReader();

			reader.onload = e => {
				if(JSON.parse(e.target.result).spriteSheets) {
					app.projectData.roomData.settings.spriteSheetName = file[0].name;
					app.projectData.roomData.settings.spriteSheetsData = JSON.parse(e.target.result);
					projectNameField.innerHTML = file[0].name;
				} else console.error(`${file[0].name} is not a sprite sheet's file!`);
			}
			reader.readAsText(file[0]);
		},
		saveProject: () => {
			localStorage.setItem("room", JSON.stringify(app.projectData));
			localStorage.setItem("controls", JSON.stringify(app.controls));
		},
		loadProject: () => {
			app.projectData = JSON.parse(localStorage.getItem("room"));
			app.controls = JSON.parse(localStorage.getItem("controls"));
			app.setEditorCanvas();
		},
		setEditorCanvas: () => {
			app.canUseEditor = true;

			setTimeout(() => {
				const canvas = document.getElementById("editor");
				const context = canvas.getContext("2d");
			
				canvas.width = 600;
				canvas.height = 400;
				context.imageSmoothingEnabled = false;
			
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
							app.controls.canMoveCamera = true;
						}
					});
			
					document.addEventListener("mouseup", e => {
						if(e.which === 2) {
							app.controls.canMoveCamera = false;
						}
					});
			
					// Canvas camera zoom
					document.addEventListener("wheel", e => {
						if(app.controls.canMoveCamera) {
							if(e.deltaY < 0) {
								if(app.controls.cameraZoom < 150)
									app.controls.cameraZoom += 10;
							}
							else {
								if(app.controls.cameraZoom > 50)
									app.controls.cameraZoom -= 10;
							}
						}
					});
					
					// Canvas camera moving
					window.addEventListener("mousemove", e => {
						if(app.controls.canMoveCamera) {
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
			
					// Background
					context.fillStyle = app.projectData.roomData.settings.background ? app.projectData.roomData.settings.background : "#000000";
					context.fillRect(0, 0, canvas.width, canvas.height);
			
					// Sprites drawing
					for(let i in app.objects) {
						context.fillStyle = app.objects[i].fill;
						context.fillRect(app.objects[i].editorSettings.inEditorX, app.objects[i].editorSettings.inEditorY, app.objects[i].editorSettings.inEditorWidth, app.objects[i].editorSettings.inEditorHeight);
					}
			
					requestAnimationFrame(loop);
				}
				loop();
			}, 500);
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
// if(app.canUseEditor) {
// 	console.log("asd");
// 	const canvas = document.getElementById("editor");
// 	const context = canvas.getContext("2d");

// 	canvas.width = 600;
// 	canvas.height = 400;
// 	context.imageSmoothingEnabled = false;

// 	app.objects.push(
// 		{
// 			id: app.objectId++,
// 			type: "rectangle",
// 			fill: "cyan",
// 			x: 43,
// 			y: 52,
// 			width: 64,
// 			height: 64,
// 			editorSettings: {
// 				inEditorX: 43,
// 				inEditorY: 52,
// 				inEditorWidth: 64,
// 				inEditorHeight: 64,
// 				isSelected: false
// 			}
// 		},

// 		{
// 			id: app.objectId++,
// 			type: "rectangle",
// 			fill: "cyan",
// 			x: canvas.width/2,
// 			y: canvas.height/2,
// 			width: 64,
// 			height: 64,
// 			editorSettings: {
// 				inEditorX: canvas.width/2,
// 				inEditorY: canvas.height/2,
// 				inEditorWidth: 64,
// 				inEditorHeight: 64,
// 				isSelected: false
// 			}
// 		}
// 	);

// 	// Canvas camera
// 	function editorCam() {
// 		document.addEventListener("mousedown", e => {
// 			if(e.which === 2) {
// 				e.preventDefault();
// 				app.controls.canMoveCamera = true;
// 			}
// 		});

// 		document.addEventListener("mouseup", e => {
// 			if(e.which === 2) {
// 				app.controls.canMoveCamera = false;
// 			}
// 		});

// 		// Canvas camera zoom
// 		document.addEventListener("wheel", e => {
// 			if(app.controls.canMoveCamera) {
// 				if(e.deltaY < 0)
// 					app.controls.cameraZoom += 10;
// 				else
// 					app.controls.cameraZoom -= 10;
// 			}
// 		});
		
// 		// Canvas camera moving
// 		window.addEventListener("mousemove", e => {
// 			if(app.controls.canMoveCamera) {
// 				for(let i in app.objects) {
// 					app.objects[i].editorSettings.inEditorX += e.movementX;
// 					app.objects[i].editorSettings.inEditorY += e.movementY;
// 				}
// 			}
// 		});
// 	}
// 	editorCam();

// 	function loop() {
// 		context.clearRect(0, 0, canvas.width, canvas.height);

// 		// Background
// 		context.fillStyle = app.projectData.backgroundColor ? app.projectData.backgroundColor : "#000";
// 		context.fillRect(0, 0, canvas.width, canvas.height);

// 		// Sprites drawing
// 		for(let i in app.objects) {
// 			context.fillStyle = app.objects[i].fill;
// 			context.fillRect(app.objects[i].editorSettings.inEditorX, app.objects[i].editorSettings.inEditorY, app.objects[i].editorSettings.inEditorWidth, app.objects[i].editorSettings.inEditorHeight);
// 		}

// 		requestAnimationFrame(loop);
// 	}
// 	loop();
// }