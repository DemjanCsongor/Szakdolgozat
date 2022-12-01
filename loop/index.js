const canvas = document.querySelector("canvas")
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const scaledCanvas = {
    width: canvas.width / 4,
    height: canvas.height / 4
}

let floorCollisions2D = []
let collisionBlocks = []
let platformCollision2D = []
let platformCollisionBlocks = []
let background
//TODO: wrap around another... add level & levels
//change map
let map = 1
let maps = {
    1: {
        init: () => {

            //clear arrays
            floorCollisions2D.splice(0, floorCollisions2D.length)
            collisionBlocks.splice(0, collisionBlocks.length)
            platformCollision2D.splice(0, platformCollision2D.length)
            platformCollisionBlocks.splice(0, platformCollisionBlocks.length)

            for (let i = 0; i < floorCollisions.length; i += 36) {
                floorCollisions2D.push(floorCollisions.slice(i, i + 36))
            }

            floorCollisions2D.forEach((row, y) => {
                row.forEach((symbol, x) => {
                    if(symbol === 202) {
                        collisionBlocks.push(new CollisionBlock({
                            position: {
                                x: x * 16,
                                y: y * 16,
                            },
                        }))
                    }
                })
            })

            for (let i = 0; i < platformCollisions.length; i += 36) {
                platformCollision2D.push(platformCollisions.slice(i, i + 36))
            }

            platformCollision2D.forEach((row, y) => {
                row.forEach((symbol, x) => {
                    if(symbol === 202) {
                        platformCollisionBlocks.push(new CollisionBlock({
                            position: {
                                x: x * 16,
                                y: y * 16,
                            },
                            height: 4,
                        }))
                    }
                })
            })

            player.collisionBlocks = collisionBlocks
            player.platformCollisionBlocks = platformCollisionBlocks
            background = new Sprite({
                position: {
                    x: 0,
                    y: 0,
                },
                imageSrc: "./img/background.png",
            })
        }
    },
    2: {
        init: () => {

            floorCollisions2D.splice(0, floorCollisions2D.length)
            collisionBlocks.splice(0, collisionBlocks.length)
            platformCollision2D.splice(0, platformCollision2D.length)
            platformCollisionBlocks.splice(0, platformCollisionBlocks.length)

            for (let i = 0; i < floorCollisions2.length; i += 36) {
                floorCollisions2D.push(floorCollisions2.slice(i, i + 36))
            }

            floorCollisions2D.forEach((row, y) => {
                row.forEach((symbol, x) => {
                    if(symbol === 202) {
                        collisionBlocks.push(new CollisionBlock({
                            position: {
                                x: x * 16,
                                y: y * 16,
                            },
                        }))
                    }
                })
            })

            for (let i = 0; i < platformCollisions2.length; i += 36) {
                platformCollision2D.push(platformCollisions2.slice(i, i + 36))
            }

            platformCollision2D.forEach((row, y) => {
                row.forEach((symbol, x) => {
                    if(symbol === 202) {
                        platformCollisionBlocks.push(new CollisionBlock({
                            position: {
                                x: x * 16,
                                y: y * 16,
                            },
                            height: 4,
                        }))
                    }
                })
            })

            player.collisionBlocks = collisionBlocks
            player.platformCollisionBlocks = platformCollisionBlocks
            background = new Sprite({
                position: {
                    x: 0,
                    y: 0,
                },
                imageSrc: "./img/background2.png",
            })
        }
    }
}

const gravity = 0.2

const player = new Player({
    position: {
        x: 100,
        y: 300,
    },
    imageSrc: './img/warrior/Idle.png',
    frameRate: 8,
    animations: {
        Idle: {
            imageSrc: './img/warrior/Idle.png',
            frameRate: 8,
            frameBuffer: 3,
        },
        IdleLeft: {
            imageSrc: './img/warrior/IdleLeft.png',
            frameRate: 8,
            frameBuffer: 3,
        },
        Run: {
            imageSrc: './img/warrior/Run.png',
            frameRate: 8,
            frameBuffer: 5,
        },
        RunLeft: {
            imageSrc: './img/warrior/RunLeft.png',
            frameRate: 8,
            frameBuffer: 5,
        },
        Jump: {
            imageSrc: './img/warrior/Jump.png',
            frameRate: 2,
            frameBuffer: 3,
        },
        JumpLeft: {
            imageSrc: './img/warrior/JumpLeft.png',
            frameRate: 2,
            frameBuffer: 3,
        },
        Fall: {
            imageSrc: './img/warrior/Fall.png',
            frameRate: 2,
            frameBuffer: 3,
        },
        FallLeft: {
            imageSrc: './img/warrior/FallLeft.png',
            frameRate: 2,
            frameBuffer: 3,
        },
    },
})

const keys = {
    d: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
}

const backgroundImageHeight = 432

const camera = {
    position: {
        x: 0,
        y: -backgroundImageHeight + scaledCanvas.height,
    },
}

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)

    c.save()
    c.scale(4, 4)
    c.translate(camera.position.x, camera.position.y)
    background.update()
    /*
    collisionBlocks.forEach((collisionBlocks) => {
        collisionBlocks.update()
    })
    platformCollisionBlocks.forEach((block) => {
        block.update()
    })
     */

    player.checkForHorizontalCanvasCollision()
    player.update()

    player.velocity.x = 0
    if (keys.d.pressed) {
        player.switchSprite('Run')
        player.velocity.x = 2
        player.lastDirection = 'right'
        player.shouldPanCameraToTheLeft({canvas, camera})
    } else if (keys.a.pressed) {
        player.velocity.x = -2
        player.lastDirection = 'left'
        player.switchSprite('RunLeft')
        player.shouldPanCameraToTheRight({canvas, camera})
    } else if (player.velocity.y === 0) {
        if (player.lastDirection === 'right')
            player.switchSprite('Idle')
        else player.switchSprite('IdleLeft')
    }

    if (player.velocity.y < 0) {
        player.shouldPanCameraToDown({canvas, camera})
        if (player.lastDirection === 'right')
            player.switchSprite('Jump')
        else player.switchSprite('JumpLeft')
    } else if (player.velocity.y > 0) {
        player.shouldPanCameraToUp({canvas, camera})
        if (player.lastDirection === 'right')
            player.switchSprite('Fall')
        else player.switchSprite('FallLeft')
    }

    c.restore()
}
maps[map].init()
animate()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            break
        case 'a':
            keys.a.pressed = true
            break
        case 'w':
            if (player.velocity.y === 0) {
                player.velocity.y = -5
            }
            break
        case 'l':
            if (map === 1) {
                map++
                maps[map].init()
            } else {
                map--
                maps[map].init()
            }
            break
    }
})
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }
})
