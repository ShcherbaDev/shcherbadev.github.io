function controller(api) {
    api.keyboard.pressEvent(() => {
        api.world.setLevel("/resources/levels/set_language/languagesView.json");
    }, "enter");
}