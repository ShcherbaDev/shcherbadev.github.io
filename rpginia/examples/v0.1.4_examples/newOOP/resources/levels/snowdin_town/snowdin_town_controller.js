async function controller(api) {
	const { app, world, audioManager, keyboard } = api;

	const background = await world.getObjectByName('Main background');

	const camera = world.camera;
	const camSpeed = app.getGlobalVariable('cameraSpeed');
	const minCamX = app.getGlobalVariable('minCameraX');
	const maxCamX = app.getGlobalVariable('maxCameraX');

	const backgroundMovementSpeed = camSpeed/20;

	const handleKeyboard = async () => {
		const currentLevel = await world.getActiveLevel();

		if (keyboard.isPressed('arrLeft') && camera.x > minCamX) {
			camera.move(-camSpeed, 0);
			background.settings.coords[0] = background.settings.coords[0] + backgroundMovementSpeed;
		}

		if (api.keyboard.isPressed('arrRight') && camera.x < maxCamX) {
			camera.move(camSpeed, 0);
			background.settings.coords[0] = background.settings.coords[0] - backgroundMovementSpeed;
		}

		if (currentLevel.name === 'Snowdin town') {
			requestAnimationFrame(handleKeyboard);
		}
		else {
			cancelAnimationFrame(handleKeyboard);
		}
	}

	await handleKeyboard();

	// Через 100 мс. - увімкнути фонову музику.
	setTimeout(() => {
		audioManager.play('backgroundMusic');
	}, 500);
}