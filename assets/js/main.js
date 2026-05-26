
function $(id) {
  return document.getElementById(id);
}

function initPageReady() {
  requestAnimationFrame(() => {
    document.body.classList.add("page-ready");
  });
}

function initPageTransitions() {
  document.querySelectorAll("a[href$='.html']").forEach(link => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      event.preventDefault();
      document.body.classList.add("page-leaving");
      setTimeout(() => {
        window.location.href = href;
      }, 320);
    });
  });
}

function initMotionItems() {
  const selectors = [
    ".kicker",
    "h1",
    "h2",
    ".lead",
    ".btn-row",
    ".countdown .time-card",
    ".story-item",
    ".photo-card",
    ".friend-link",
    ".friend-photo",
    ".letter p",
    ".footer-note"
  ];

  const items = [...document.querySelectorAll(selectors.join(","))]
    .filter(el => !el.dataset.motionReady);

  items.forEach((el, index) => {
    el.dataset.motionReady = "true";
    el.classList.add("motion-item");
    el.style.setProperty("--delay", `${Math.min(index * 85, 700)}ms`);
  });

  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach(el => el.classList.add("in-view", "force-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: "0px 0px 80px 0px"
  });

  items.forEach(el => observer.observe(el));

  // Safety fallback: after a short moment, force everything visible.
  // This prevents any page from staying blurred/hidden on mobile browsers.
  setTimeout(() => {
    items.forEach(el => el.classList.add("in-view", "force-visible"));
  }, 1200);
}

function initMusic() {
  const audio = document.getElementById("bgMusic");
  const btn = document.getElementById("musicBtn");

  if (!audio || !btn) return;

  const MUSIC_STATUS_KEY = "birthdayMusic";
  const MUSIC_TIME_KEY = "birthdayMusicTime";

  function updateButton() {
    btn.textContent = audio.paused ? "♫" : "❚❚";
  }

  function saveMusicTime() {
    if (!isNaN(audio.currentTime)) {
      localStorage.setItem(MUSIC_TIME_KEY, audio.currentTime.toString());
    }
  }

  function restoreMusicTime() {
    const savedTime = parseFloat(localStorage.getItem(MUSIC_TIME_KEY) || "0");

    if (!isNaN(savedTime) && savedTime > 0) {
      try {
        audio.currentTime = savedTime;
      } catch (e) {
        console.log("Music time restore failed:", e);
      }
    }
  }

  audio.addEventListener("loadedmetadata", function () {
    restoreMusicTime();

    if (localStorage.getItem(MUSIC_STATUS_KEY) === "on") {
      audio.play().then(updateButton).catch(updateButton);
    }
  });

  audio.addEventListener("timeupdate", saveMusicTime);

  window.addEventListener("beforeunload", function () {
    saveMusicTime();
  });

  btn.addEventListener("click", function () {
    if (audio.paused) {
      restoreMusicTime();

      audio.play().then(function () {
        localStorage.setItem(MUSIC_STATUS_KEY, "on");
        updateButton();
      }).catch(function () {
        updateButton();
      });

    } else {
      audio.pause();
      localStorage.setItem(MUSIC_STATUS_KEY, "off");
      saveMusicTime();
      updateButton();
    }
  });

  updateButton();
}

function floatingHearts() {
  const layer = document.querySelector(".bg-layer");
  if (!layer) return;

  setInterval(() => {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.textContent = Math.random() > 0.5 ? "❤" : "♡";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = 15 + Math.random() * 28 + "px";
    heart.style.animationDuration = 6 + Math.random() * 5 + "s";
    layer.appendChild(heart);
    setTimeout(() => heart.remove(), 12000);
  }, 650);
}

function fallingPetals() {
  const petals = ["♡", "❤", "✦", "❀"];
  setInterval(() => {
    const petal = document.createElement("div");
    petal.className = "petal";
    petal.textContent = petals[Math.floor(Math.random() * petals.length)];
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.fontSize = 12 + Math.random() * 18 + "px";
    petal.style.animationDuration = 7 + Math.random() * 6 + "s";
    petal.style.setProperty("--drift", `${(Math.random() - 0.5) * 190}px`);
    document.body.appendChild(petal);
    setTimeout(() => petal.remove(), 14000);
  }, 1200);
}

function createOrbs() {
  const layer = document.querySelector(".bg-layer");
  if (!layer || layer.querySelector(".orb")) return;

  for (let i = 0; i < 8; i++) {
    const orb = document.createElement("div");
    orb.className = "orb";
    const size = 46 + Math.random() * 95;
    orb.style.width = size + "px";
    orb.style.height = size + "px";
    orb.style.left = Math.random() * 100 + "%";
    orb.style.top = Math.random() * 100 + "%";
    orb.style.animationDuration = 4 + Math.random() * 5 + "s";
    orb.style.animationDelay = Math.random() * 2 + "s";
    layer.appendChild(orb);
  }
}

function celebrate(x, y) {
  for (let i = 0; i < 34; i++) {
    const spark = document.createElement("span");
    spark.className = "sparkle";
    const size = 5 + Math.random() * 7;
    spark.style.width = size + "px";
    spark.style.height = size + "px";
    spark.style.left = x + "px";
    spark.style.top = y + "px";
    spark.style.setProperty("--x", `${(Math.random() - 0.5) * 310}px`);
    spark.style.setProperty("--y", `${(Math.random() - 0.5) * 310}px`);
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 760);
  }
}

function clickSparkles() {
  document.addEventListener("click", (event) => {
    if (event.target.closest("a") || event.target.closest("button")) return;
    celebrate(event.clientX, event.clientY);
  });
}

function initTyping() {
  const box = $("typeBox");
  if (!box) return;

  let i = 0;
  let c = 0;
  let deleting = false;

  function tick() {
    const msg = SITE.typeMessages[i];
    if (!deleting) {
      box.textContent = msg.slice(0, c++);
      if (c > msg.length + 18) deleting = true;
    } else {
      box.textContent = msg.slice(0, c--);
      if (c <= 0) {
        deleting = false;
        i = (i + 1) % SITE.typeMessages.length;
      }
    }
    setTimeout(tick, deleting ? 28 : 58);
  }

  tick();
}

function initCountdown() {
  const days = $("days");
  if (!days) return;

  function update() {
    let diff = new Date(SITE.birthday).getTime() - Date.now();

    if (diff <= 0) {
      ["days", "hours", "minutes", "seconds"].forEach(id => $(id).textContent = "00");
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff %= 1000 * 60 * 60 * 24;
    const h = Math.floor(diff / (1000 * 60 * 60));
    diff %= 1000 * 60 * 60;
    const m = Math.floor(diff / (1000 * 60));
    diff %= 1000 * 60;
    const s = Math.floor(diff / 1000);

    $("days").textContent = String(d).padStart(2, "0");
    $("hours").textContent = String(h).padStart(2, "0");
    $("minutes").textContent = String(m).padStart(2, "0");
    $("seconds").textContent = String(s).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

function initMemories() {
  const grid = $("memoryGrid");
  if (!grid) return;

  grid.innerHTML = SITE.memories.map(item => `
    <article class="photo-card small-card">
      <img src="${item.image}" alt="${item.title}">
      <div>
        <h3>${item.title}</h3>
        <p class="lead">${item.text}</p>
      </div>
    </article>
  `).join("");

  // Add motion to dynamically created cards.
  initMotionItems();
}

function initFriendsHub() {
  const grid = $("friendsGrid");
  if (!grid) return;

  grid.innerHTML = SITE.friends.map((friend, index) => `
    <a class="friend-link small-card" href="friend-${index + 1}.html">
      <img src="${friend.image}" alt="${friend.name}">
      <div>
        <h3>${friend.name}</h3>
        <p class="lead"> 打开祝福 →</p>
      </div>
    </a>
  `).join("");

  // Add motion to dynamically created friend cards.
  initMotionItems();
  initPageTransitions();
}

function typeFriendMessage(text) {
  const msg = $("friendMessage");
  if (!msg || !text) return;

  msg.innerHTML = "";
  let i = 0;

  function safeText(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br>");
  }

  function write() {
    msg.innerHTML = safeText(text.slice(0, i++));
    if (i <= text.length) {
      setTimeout(write, 32);
    }
  }

  setTimeout(write, 600);
}

function initFriendPage() {
  const box = $("friendPage");
  if (!box) return;

  const index = Number(box.dataset.friendIndex || 1) - 1;
  const friend = SITE.friends[index];

  if (!friend) {
    box.innerHTML = `<p class="lead">This friend page is empty. Please edit assets/js/config.js.</p>`;
    return;
  }

  $("friendName").textContent = friend.name;
  $("friendPhoto").src = friend.image;
  $("friendMessage").textContent = "";
  typeFriendMessage(friend.message);

  const videoWrap = $("friendVideoBox");
  const video = $("friendVideo");
  const videoBtn = $("videoBtn");

  if (friend.video) {
    video.src = friend.video;
    videoBtn.style.display = "inline-flex";
    videoBtn.addEventListener("click", () => {
      videoWrap.classList.toggle("show");
      if (videoWrap.classList.contains("show")) video.play().catch(() => {});
      celebrate(window.innerWidth / 2, window.innerHeight / 2);
    });
  } else {
    videoBtn.style.display = "none";
  }
}

function initSecret() {
  const btn = $("secretBtn");
  const msg = $("secretMessage");
  if (!btn || !msg) return;

  btn.addEventListener("click", () => {
    msg.classList.add("show");
    celebrate(window.innerWidth / 2, window.innerHeight / 2);
  });
}


function initHomePlayMusic() {
  const btn = $("homePlayMusicBtn");
  const audio = $("bgMusic");
  const floatingBtn = $("musicBtn");
  const box = document.querySelector(".music-invite");
  if (!btn || !audio) return;

  function markPlaying() {
    btn.textContent = "Playing";
    if (floatingBtn) floatingBtn.textContent = "❚❚";
    if (box) box.classList.add("playing");
    localStorage.setItem("birthdayMusic", "on");
    celebrate(window.innerWidth / 2, window.innerHeight / 2);
  }

  btn.addEventListener("click", () => {
    audio.play().then(markPlaying).catch(() => {
      btn.textContent = "Tap again to play 再点一次";
    });
  });

  if (localStorage.getItem("birthdayMusic") === "on" && !audio.paused) {
    markPlaying();
  }
}


function initGiftOpen() {
  const btn = $("openGiftBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const gift = document.querySelector(".gift");
    if (gift) gift.classList.add("opening");
    celebrate(window.innerWidth / 2, window.innerHeight / 2);
    setTimeout(() => {
      document.body.classList.add("page-leaving");
    }, 900);
    setTimeout(() => {
      location.href = "birthday.html";
    }, 1250);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initPageReady();
  initMusic();
  createOrbs();
  floatingHearts();
  fallingPetals();
  clickSparkles();

  initTyping();
  initCountdown();
  initMemories();
  initFriendsHub();
  initFriendPage();
  initSecret();
  initHomePlayMusic();
  initGiftOpen();

  initMotionItems();
  initPageTransitions();
});


// Final clear-content fallback
window.addEventListener("load", () => {
  setTimeout(() => {
    document.querySelectorAll(".motion-item, .letter p, .friend-photo").forEach(el => {
      el.classList.add("in-view", "force-visible");
      el.style.filter = "none";
    });
  }, 600);
});
