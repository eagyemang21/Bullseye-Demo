kaboom({
  background: [213, 251, 249],
});
 
let bgImage = loadSprite(
  "background",
  "planets.jpg"
)
 
let background = add([
  sprite("background"),
  pos(width() / 2, height() / 2),
  origin("center"),
  scale(2),
  fixed()
])
 
loadBean();
// loadSprite("froggy", "froggy.png")
loadSprite("apple", "https://kaboomjs.com/sprites/apple.png")
 
// for alien created in replit
loadSprite("alien2", "alien2.png");
loadSprite("player", "player.png")
loadSprite("apple", "https://kaboomjs.com/sprites/apple.png", {
    sliceX: 0,
    sliceY: 0,
    // anims: {
    //     run: {
    //         from: 0,
    //         to: 3,
    //     },
    //     jump: {
    //         from: 3,
    //         to: 3,
    //     },
    // },
})
 
const SPEED = 800;
 
const player = add([
  sprite("player"),
  // center() returns the center point vec2(width() / 2, height() / 2)
  pos(vec2(width() / 2.1, height() / 1.2)),
]);
 
onKeyDown("left", () => {
  player.move(-SPEED, 0)
  if (player.pos.x < 0) {
    player.pos.x = width()
  }
})
 
onKeyDown("right", () => {
  player.move(SPEED, 0)
  if (player.pos.x > width()) {
    player.pos.x = 0
  }
})
 
const BULLET_SPEED = 1000;
 
function spawnBullet(p) {
  add([
    rect(12, 48),
    area(),
    pos(p),
    origin("center"),
    color(255, 0, 0),
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
 
function late(t) {
  let timer = 0
  return {
    add() {
      this.hidden = true
    },
    update() {
      timer += dt()
      if (timer >= t) {
        this.hidden = false
      }
    },
  }
}
 
add([
  text("KILL", { size: 160 }),
  color(220, 53, 69),
  pos(width() / 2, height() / 2),
  origin("center"),
  lifespan(1),
  fixed(),
])
 
add([
  text("THE", { size: 80 }),
  color(133, 64, 245),
  pos(width() / 2, height() / 2),
  origin("center"),
  lifespan(2),
  late(1),
  fixed(),
])
 
add([
  text('ALIENS', { size: 120 }),
  color(253, 152, 67),
  pos(width() / 2, height() / 2),
  origin("center"),
  lifespan(4),
  late(2),
  fixed(),
])
 
let score = 0;
const scoreLabel = add([
  text(score),
  pos(24, 24)
]);
 
const ENEMY_SPEED = 160
 
// loadSprite("ghosty", "/sprites/ghosty.png")
 
const enemy = add([
  sprite("alien2"),
  pos(width() / 4, height() / 5),
  scale(2),
  origin("center"),
  // This enemy cycle between 3 states, and start from "idle" state
  state("attack", [ "idle", "attack", "move", ]),
  "enemy",
  solid(),
  area(),
])
 
enemy.onStateEnter("idle", async () => {
  await wait(0.5)
  enemy.enterState("attack")
})
 
enemy.onStateEnter("attack", async () => {
 
  // Don't do anything if player doesn't exist anymore
  if (player.exists() && enemy.exists()) {
 
    const dir = player.pos.sub(enemy.pos).unit()
 
    add([
      pos(enemy.pos),
      move(dir, BULLET_SPEED),
      rect(12, 12),
      area(),
      cleanup(),
      origin("center"),
      color(BLUE),
      "bullet",
    ])
 
  }
 
  await wait(1)
  enemy.enterState("move")
 
})
 
enemy.onStateEnter("move", async () => {
 await wait(2)
 enemy.enterState("idle")
})
 
enemy.onStateUpdate("move", () => {
 if (!player.exists()) return
 const dir = player.pos.sub(enemy.pos).unit()
 enemy.move(dir.scale(ENEMY_SPEED))
})
 
// Have to manually call enterState() to trigger the onStateEnter("move") event we defined above.
enemy.enterState("move")

for (let i = 0; i < 5; i++) {

	// generate a random point on screen
	// width() and height() gives the game dimension
	const x = rand(0, width() / 1.3)
	const y = rand(0, height() / 2)

	add([
		sprite("alien2"),
		pos(x, y),
    scale(2.2),
    solid(),
    area(),
    "enemy",
	])
}

onCollide("bullet", "enemy", (b, e) => {
  addKaboom(e.pos.add(90))
  destroy(e)
  destroy(b)
  shake(10)
  cleanup()
  score++;
  scoreLabel.text = score;
})
