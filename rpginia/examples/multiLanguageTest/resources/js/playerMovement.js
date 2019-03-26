export function moveUp(player, speed) {
    if(player.settings.spriteIndex !== 0) player.settings.spriteIndex = 0;
    if(player.settings.frameTo !== 3) {
        player.settings.frameTo = 3;
        player.settings.frameIndex = 0;
    }

    player.settings.isPlaying = true;

    player.coords[1] -= speed;
}

export function moveDown(player, speed) {
    if(player.settings.spriteIndex !== 1) player.settings.spriteIndex = 1;
    if(player.settings.frameTo !== 3) {
        player.settings.frameTo = 3;
        player.settings.frameIndex = 0;
    }

    player.settings.isPlaying = true;

    player.coords[1] += speed;
}

export function moveLeft(player, speed) {
    if(player.settings.spriteIndex !== 2) player.settings.spriteIndex = 2;
    if(player.settings.frameTo !== 1) {
        player.settings.frameTo = 1;
        player.settings.frameIndex = 0;
    }

    player.settings.isPlaying = true;

    player.coords[0] -= speed;
}

export function moveRight(player, speed) {
    if(player.settings.spriteIndex !== 3) player.settings.spriteIndex = 3;
    if(player.settings.frameTo !== 1) {
        player.settings.frameTo = 1;
        player.settings.frameIndex = 0;
    }
    player.settings.isPlaying = true;

    player.coords[0] += speed;
}