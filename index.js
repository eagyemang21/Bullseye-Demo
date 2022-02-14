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
 
const SPEED = 800;
 
const player = add([
  sprite("apple"),
  // center() returns the center point vec2(width() / 2, height() / 2)
  pos(vec2(width() / 2.1, height() / 1.2)),
  solid(), 
  area()
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
  pos(24, 40)
]);
 
const ENEMY_SPEED = 160
 
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
      move(DOWN, BULLET_SPEED),
      rect(12, 12),
      area(),
      cleanup(),
      origin("center"),
      color(BLUE),
      "eBullet",
    ])
 
  }
 
  await wait(2)
  enemy.enterState("attack")
 
})
 
// enemy.onStateEnter("move", async () => {
//  await wait(1)
//  enemy.enterState("idle")
// })
 
// enemy.onStateUpdate("move", () => {
//  if (!player.exists()) return
//  const dir = player.pos.sub(enemy.pos).unit()
//  enemy.move(dir.scale(ENEMY_SPEED))
// })
 
// // Have to manually call enterState() to trigger the onStateEnter("move") event we defined above.
enemy.enterState("attack")

// for (let i = 0; i < 5; i++) {

// 	// generate a random point on screen
// 	// width() and height() gives the game dimension
// 	const x = rand(0, width() / 1.3)
// 	const y = rand(0, height() / 2)

// 	add([
// 		sprite("alien2"),
// 		pos(x, y),
//     scale(2.2),
//     solid(),
//     area(),
//     "enemy",
// 	])
// }

onCollide("bullet", "enemy", (b, e) => {
  addKaboom(e.pos.add(90))
  destroy(e)
  destroy(b)
  shake(10)
  cleanup()
  score++;
  scoreLabel.text = score;
})

onCollide("eBullet", "player", (e, p) => {
  destroy(player)
  // destroy(e)
})

const dir = player.pos.sub(enemy.pos).unit()

addLevel([
  "                           ",
  "=                          ",
  "                           ",
  "                           ",
  "                           ",
  "                           ",
  "                           ",
], {
  // define the size of each block
  width: 70,
  height: 90,
  // define what each symbol means, by a function returning a component list (what will be passed to add())
  "=": () => [
      sprite("alien2"),
      area(),
      solid(),
      scale(2),
      "enemy"
  ],
})

let BOSS_HEALTH = 10
const BOSS_SPEED = 48

const boss = add([
  sprite("bean"),
  area(),
  pos(width() / 2, 40),
  health(BOSS_HEALTH),
  scale(3),
  origin("top"),
  "boss",
  {
    dir: 1,
  },
])

boss.onUpdate((p) => {
  boss.move(BOSS_SPEED * boss.dir, 0)
  if (boss.dir === 1 && boss.pos.x >= width() - 120) {
    boss.dir = -1
  }
  if (boss.dir === -1 && boss.pos.x <= 120) {
    boss.dir = 1
  }
})

const healthbar = add([
  rect(width(), 40),
  pos(0, 0),
  color([228, 19, 0]),
  fixed(),
  {
    max: BOSS_HEALTH,
    set(hp) {
      this.width = width() * hp / this.max
      this.flash = true
    },
  },
])

healthbar.onUpdate(() => {
  if (healthbar.flash) {
    healthbar.color = rgb(228, 19, 0)
    healthbar.flash = false
  } else {
    healthbar.color = rgb(228, 19, 0)
  } 
})

boss.onHurt(() => {
  healthbar.set(BOSS_HEALTH - 5)
})

on("hurt", "enemy", (e) => {
  shake(1)
  // play("hit", {
  //   detune: rand(-1200, 1200),
  //   speed: rand(0.2, 2),
  // })
})

onCollide("boss", "bullet", (bos, bul) => {
  shake(3),
  destroy(bul), 
  healthbar.set(BOSS_HEALTH -= 1)
  if (BOSS_HEALTH <= 0) {
    destroy(bos)
  }
})

add([
  text('BOSS HEALTH', { size: 30 }),
  color(253, 152, 67),
  pos(width() / 10, height() / 40),
  origin("center"),
  fixed(),
])








