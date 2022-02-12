kaboom({
  background: [0, 0, 0],
});
 
let bgImage = loadSprite(
  "background",
  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/54ff7af5-2e49-471e-8efc-69c98615ab82/d128hmk-5d073adb-0821-44d1-a2bf-1e936f5b16b1.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzU0ZmY3YWY1LTJlNDktNDcxZS04ZWZjLTY5Yzk4NjE1YWI4MlwvZDEyOGhtay01ZDA3M2FkYi0wODIxLTQ0ZDEtYTJiZi0xZTkzNmY1YjE2YjEuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.rrEKAOowLqMQiuUOrbKG4fWCAfn71GhnUWUirLQzy-o"
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
  sprite("apple"),
  // center() returns the center point vec2(width() / 2, height() / 2)
  pos(vec2(width() / 2.1, height() / 1.1)),
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
 
const score = add([
  text(0),
  pos(12, 12),
  fixed(),
])
 
const ENEMY_SPEED = 160
 
// loadSprite("ghosty", "/sprites/ghosty.png")
 
const enemy = add([
  sprite("alien2"),
  pos(width() / 4, height() / 5),
  scale(4),
  origin("center"),
  // This enemy cycle between 3 states, and start from "idle" state
  state("idle", [ "idle", "attack", "move", ]),
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
  if (player.exists()) {
 
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
 
// enemy.onStateEnter("move", async () => {
//  await wait(2)
//  enemy.enterState("idle")
// })
 
// enemy.onStateUpdate("move", () => {
//  if (!player.exists()) return
//  const dir = player.pos.sub(enemy.pos).unit()
//  enemy.move(dir.scale(ENEMY_SPEED))
// })
 
// // Have to manually call enterState() to trigger the onStateEnter("move") event we defined above.
// enemy.enterState("attack")
 
onCollide("bullet", "enemy", (e) => {
  addKaboom(enemy.pos.add(0))
  destroy(enemy)
  shake(10)
  cleanup()
  // addExplode(b.pos, 1, 24, 1)
})
// on("bullet", "enemy", (e) => {
//   // destroy(e)
//   addExplosion()
//   shake(2)
//   // addKaboom(e.pos)
// })
