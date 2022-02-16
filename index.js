const mainCanvas = document.getElementById("main-screen")

kaboom({
  background: [213, 251, 249],
  height: 650,
  width: 750,
  canvas: mainCanvas,
});

loadSprite("player", "player.png");
loadSprite("trophy", "1.png");
loadSprite("heart4", "heart4.png");
loadSprite("ship4", "ship4.png");
loadSprite("laser", "energyBall.png");
loadSprite("rock", "rock2.png");
loadSprite("background", "planets.jpg");
loadSprite("ship5", "ship5.png");
loadSprite("player", "sprites/player.png");
loadSprite("heart4", "sprites/heart4.png");
loadSprite("ship4", "sprites/ship4.png");
loadSprite("laser", "sprites/energyBall.png");
loadSprite("playerLaser", "sprites/playerBullet.png");
loadSprite("explosion", "sprites/ex.png")
loadSprite("rock", "sprites/rock2.png");
loadSprite("background", "sprites/planets.jpg");

loadSound("pew", "sounds/pew.mp3");

scene("game", () => {
  let background = add([
    sprite("background"),
    pos(width() / 2, height() / 2),
    origin("center"),
    scale(2),
    fixed(),
  ]);

  const playerSpeed = 600;

  const player = add([
    sprite("player"),
    pos(vec2(width() / 2.1, height() / 1.3)),
    solid(),
    area(),
    "player",
  ]);

  onKeyDown("left", () => {
    player.move(-playerSpeed, 0);
    if (player.pos.x < 0) {
      player.pos.x = width();
    }
  });

  onKeyDown("right", () => {
    player.move(playerSpeed, 0);
    if (player.pos.x > width()) {
      player.pos.x = 0;
    }
  });

  onKeyDown("down", () => {
    if (background.height / 2 > player.pos.y) {
      player.move(0, playerSpeed);
    }
  });

  onKeyDown("up", () => {
    if (background.height / 3.3 <= player.pos.y) {
      player.move(0, -playerSpeed);
    }
  });

  const playerBullet = 900;

  function spawnBullet(p) {
    add([
      sprite("playerLaser"),
      area(),
      pos(p),
      origin("center"),
      move(UP, playerBullet),
      cleanup(),
      "bullet",
    ]);
  }

  onKeyPress("space", () => {
    spawnBullet(player.pos.add(30, 0));
    play("pew")
  });

  function late(t) {
    let timer = 0;
    return {
      add() {
        this.hidden = true;
      },
      update() {
        timer += dt();
        if (timer >= t) {
          this.hidden = false;
        }
      },
    };
  }

  add([
    text("DESTROY", { size: 160 }),
    color(220, 53, 69),
    pos(width() / 2, height() / 2),
    origin("center"),
    lifespan(1),
    fixed(),
  ]);

  add([
    text("THE", { size: 80 }),
    color(133, 64, 245),
    pos(width() / 2, height() / 2),
    origin("center"),
    lifespan(2),
    late(1),
    fixed(),
  ]);

  add([
    text("SHIP", { size: 120 }),
    color(253, 152, 67),
    pos(width() / 2, height() / 2),
    origin("center"),
    lifespan(4),
    late(2),
    fixed(),
  ]);

  onCollide("bullet", "enemy", (b, e) => {
    add([
      sprite("explosion"),
      pos("enemy")
    ])
    // addKaboom(e.pos.add(90));
    destroy(e);
    destroy(b);
    shake(10);
    cleanup();
  });

  const timer = add([
    text(0),
    {
      size: 20,
      width: 10,
    },
    pos(12, 30),
    fixed(),
    { time: 0 },
  ]);

  timer.onUpdate(() => {
    timer.time += dt();
    timer.text = timer.time.toFixed(2);
  });

  onCollide("eBullet", "player", (e, p) => {
    destroy(player);
  });

  let bossHealth = 15;
  const bossSpeed = 45;

  const boss = add([
    sprite("ship4"),
    area(),
    pos(width() / 2, 40),
    health(bossHealth),
    origin("top"),
    "boss",
    state("attack", ["idle", "attack", "move"]),
    {
      dir: 1,
    },
  ]);

  boss.onUpdate((p) => {
    boss.move(bossSpeed * boss.dir, 0);
    if (boss.dir === 1 && boss.pos.x >= width() - 120) {
      boss.dir = -1;
    }
    if (boss.dir === -1 && boss.pos.x <= 120) {
      boss.dir = 1;
    }
  });

  let healthBar = add([
    rect(1100, 33),
    pos(25.7, 0),
    fixed(),
    {
      max: bossHealth,
      set(hp) {
        this.width = (width() * hp) / this.max;
        this.flash = true;
      },
    },
  ]);

  healthBar.onUpdate(() => {
    if (healthBar.flash) {
      healthBar.color = rgb(255, 0, 0);
      healthBar.flash = false;
    } else {
      healthBar.color = rgb(25, 135, 84)
    };
  });

  boss.onHurt(() => {
    healthBar -= 5;
  });

  add([sprite("ship5"), pos(vec2(5, -6)), scale(1.1)]);

  on("hurt", "enemy", (e) => {
    shake(1);
  });

  onCollide("boss", "bullet", (bos, bul) => {
    shake(3), destroy(bul), healthBar.set((bossHealth -= 1));
    if (bossHealth <= 0) {
      destroy(bos);
    }
    if (bossHealth <= 0) {
      go("win", {});
    }
  });

  boss.onStateEnter("idle", async () => {
    await wait(1.5);
    boss.enterState("attack");
  });

  const enemyBullet = 500;

  boss.onStateEnter("attack", async () => {
    if (player.exists() && boss.exists()) {
      const dir = player.pos.sub(boss.pos).unit();
      add([
        pos(boss.pos.add(0, 150)),
        move(dir, enemyBullet),
        sprite("laser"),
        area(),
        cleanup(),
        origin("center"),
        "eBullet",
      ]);
    }

    await wait(2);
    boss.enterState("attack");
  });

  boss.onStateEnter("move", async () => {
    await wait(1);
    boss.enterState("idle");
  });

  boss.onStateUpdate("move", () => {
    if (!player.exists()) return;
    const dir = player.pos.sub(boss.pos).unit();
    boss.move(dir.scale(bossSpeed));
  });

  boss.enterState("idle");

  onCollide("eBullet", "player", (e, p) => {
    destroy(e);
    destroy(p);
    go("lose");
  });

  function spawnMinions(p) {
    add([sprite("rock"), pos(p), solid(), area(), "enemy"]);
  }

  loop(1.2, () => {
    spawnMinions(boss.pos.add(0, 170));
  });

  const direction = player.pos.sub(boss.pos).unit();

  action("enemy", (e) => {
    e.move(player.pos.angle(player.pos), 100);
  });

  onCollide("enemy", "player", (e, p) => {
    destroy(p);
    destroy(e);
    go("lose");
  });

  boss.onDeath(() => {
    go("win");
  });
});

scene("win", () => {
  add([
    text("YOU WIN", 40),
    origin("center"),
    pos(width() / 2, height() / 2.8),
    fixed(),
  ]);

  add([
    text("Press any key", {
      size: 48, 
  }),
    origin("center"),
    pos(width() / 2, height() / 1.5),
    fixed(),
  ]);

  add([
    text("to play again", {
      size: 48, 
  }),
    origin("center"),
    pos(width() / 2, height() / 1.3),
    fixed(),
  ]);

  add([
    text( + " Seconds"),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);

  wait(1, () => {
    onKeyPress(() => go("game"));
  });
});

scene("lose", () => {
  add([
    text("You Lose"),
    pos(width() / 2, height() / 2 + 20),
    origin("center"),
    color(0, 0, 0),
  ]);

add([
    text("Press any key", {
      size: 48, 
  }),
    origin("center"),
    pos(width() / 2, height() / 1.5),
    fixed(),
  ]);

  add([
    text("to play again", {
      size: 48, 
  }),
    origin("center"),
    pos(width() / 2, height() / 1.3),
    fixed(),
  ]);

  wait(1.5, () => {
    onKeyPress(() => go("game"));
  });
});

go("game");