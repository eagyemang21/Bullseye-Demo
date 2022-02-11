kaboom({
}
);

loadBean();

const SPEED = 800;

const player = add([
  sprite("bean"),
  // center() returns the center point vec2(width() / 2, height() / 2)
  pos(vec2(width() / 2.1, height() / 1.1)),
]);

onKeyDown("left", () => {
  // .move() is provided by pos() component, move by pixels per second
  player.move(-SPEED, 0);
});

onKeyDown("right", () => {
  player.move(SPEED, 0);
});

const BULLET_SPEED = 1000;

function spawnBullet(p) {
  add([
    rect(12, 48),
    area(),
    pos(p),
    origin("center"),
    color(127, 127, 255),
    outline(4),
    move(UP, BULLET_SPEED),
    cleanup(),
    // strings here means a tag
    "bullet",
  ]);
}

onKeyPress("space", () => {
  // spawnBullet(player.pos.sub(5, 90));
  spawnBullet(player.pos.add(30, 0));
});

function Collision() {
  kaboom.add([
    kaboom.pos(0, kaboom.height()),
    kaboom.rect(kaboom.width(), 50),
    kaboom.solid()
  ])
}