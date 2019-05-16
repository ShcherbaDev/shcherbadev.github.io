async function controller(api) {
    const currentLevel = await api.world.levelManager.getActiveLevel();

    api.app.canvas.addEventListener('mousemove', (e) => {
        currentLevel.getObjectByName('test').settings.coords[0] = e.offsetX;
        currentLevel.getObjectByName('test').settings.coords[1] = e.offsetY;
    });

    function loop() {
        if (currentLevel.getObjectByName('test_trigger').isTouching('test')) {
            console.log('ow')
        }
        
        requestAnimationFrame(loop);
    }
    loop();
}