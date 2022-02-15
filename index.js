kaboom({
  background: [213, 251, 249],
});

loadSprite("player", "player.png");
loadSprite("trophy", "1.png");
loadSprite("heart4", "heart4.png");
loadSprite("ship4", "ship4.png");
loadSprite("laser", "energyBall.png");
loadSprite("rock", "rock2.png");
loadSprite("background", "planets.jpg");

scene("game", () => {
  let background = add([
    sprite("background"),
    pos(width() / 2, height() / 2),
    origin("center"),
    scale(2),
    fixed(),
  ]);

  const SPEED = 700;

  const player = add([
    sprite("player"),
    pos(vec2(width() / 2.1, height() / 1.3)),
    solid(),
    area(),
    "player",
  ]);

  onKeyDown("left", () => {
    player.move(-SPEED, 0);
    if (player.pos.x < 0) {
      player.pos.x = width();
    }
  });

  onKeyDown("right", () => {
    player.move(SPEED, 0);
    if (player.pos.x > width()) {
      player.pos.x = 0;
    }
  });

  onKeyDown("down", () => {
    if (background.height / 2 > player.pos.y) {
      player.move(0, SPEED);
    }
  });

  onKeyDown("up", () => {
    if (background.height / 2.5 <= player.pos.y) {
      player.move(0, -SPEED);
    }
  });

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
      "bullet",
    ]);
  }

  onKeyPress("space", () => {
    spawnBullet(player.pos.add(30, 0));
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
    text("KILL", { size: 160 }),
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
    text("ALIENS", { size: 120 }),
    color(253, 152, 67),
    pos(width() / 2, height() / 2),
    origin("center"),
    lifespan(4),
    late(2),
    fixed(),
  ]);

  const ENEMY_SPEED = 160;

  onCollide("bullet", "enemy", (b, e) => {
    addKaboom(e.pos.add(90));
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

  let BOSS_HEALTH = 3;
  const BOSS_SPEED = 48;

  const boss = add([
    sprite("ship4"),
    area(),
    pos(width() / 2, 40),
    health(BOSS_HEALTH),
    origin("top"),
    "boss",
    state("attack", ["idle", "attack", "move"]),
    {
      dir: 1,
    },
  ]);

  boss.onUpdate((p) => {
    boss.move(BOSS_SPEED * boss.dir, 0);
    if (boss.dir === 1 && boss.pos.x >= width() - 120) {
      boss.dir = -1;
    }
    if (boss.dir === -1 && boss.pos.x <= 120) {
      boss.dir = 1;
    }
  });

  const healthbar = add([
    rect(1100, 33),
    pos(25.7, 0),
    fixed(),
    {
      max: BOSS_HEALTH,
      set(hp) {
        this.width = (width() * hp) / this.max;
        this.flash = true;
      },
    },
  ]);

  healthbar.onUpdate(() => {
    if (healthbar.flash) {
      healthbar.color = rgb(158, 85, 85);
      healthbar.flash = false;
    } else {
      healthbar.color = rgb(158, 85, 85);
    }
  });

  boss.onHurt(() => {
    healthbar -= 5;
  });

  add([sprite("heart4"), pos(vec2(2, -8)), scale(1)]);

  on("hurt", "enemy", (e) => {
    shake(1);
  });

  onCollide("boss", "bullet", (bos, bul) => {
    shake(3), destroy(bul), healthbar.set((BOSS_HEALTH -= 1));
    if (BOSS_HEALTH <= 0) {
      destroy(bos);
    }
    if (BOSS_HEALTH <= 0) {
      go("win", {});
    }
  });

  boss.onStateEnter("idle", async () => {
    await wait(1.5);
    boss.enterState("attack");
  });

  boss.onStateEnter("attack", async () => {
    if (player.exists() && boss.exists()) {
      const dir = player.pos.sub(boss.pos).unit();
      add([
        pos(boss.pos.add(0, 150)),
        move(dir, BULLET_SPEED),
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
    boss.move(dir.scale(boss_SPEED));
  });

  boss.enterState("idle");

  onCollide("eBullet", "player", (e, p) => {
    destroy(e);
    destroy(p);
    go("lose");
  });

  function spawnMinions(p) {
    add([sprite("rock"), pos(p), solid(0.2), area(), "enemy"]);
  }

  loop(1.5, () => {
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

scene("win", (timer) => {
  add([
    text("YOU WIN", 40),
    origin("center"),
    pos(width() / 2, height() / 2.5),
    fixed(),
  ]);

  add([
    text(timer.time + " Seconds"),
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
  wait(1.5, () => {
    onKeyPress(() => go("game"));
  });
});

go("game");
