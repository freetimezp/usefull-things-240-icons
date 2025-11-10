// GSAP floating icons
gsap.utils.toArray("ul li a i").forEach((icon, i) => {
    gsap.to(icon, {
        y: -10,
        duration: 2 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.2,
    });
});

// Initial setup
const body = document.body;
const themeToggle = document.querySelector(".theme-toggle");

if (localStorage.getItem("theme") === "light") {
    body.classList.remove("dark");
    body.classList.add("light");
} else {
    body.classList.remove("light");
    body.classList.add("dark");
}

// Theme switch
themeToggle.addEventListener("click", () => {
    body.classList.toggle("light");
    body.classList.toggle("dark");

    gsap.fromTo(
        body,
        { opacity: 0.5, filter: "blur(4px)" },
        { opacity: 1, filter: "blur(0)", duration: 0.6, ease: "power2.out" }
    );

    const theme = body.classList.contains("light") ? "light" : "dark";
    localStorage.setItem("theme", theme);
});

// === Rain Animation ===
const rainCanvas = document.getElementById("rainCanvas");
const skyCanvas = document.getElementById("skyCanvas");
const ctxR = rainCanvas.getContext("2d");
let rainDrops = [];

function resizeCanvases() {
    rainCanvas.width = window.innerWidth;
    rainCanvas.height = window.innerHeight;
    skyCanvas.width = window.innerWidth;
    skyCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvases);
resizeCanvases();

for (let i = 0; i < 200; i++) {
    rainDrops.push({
        x: Math.random() * rainCanvas.width,
        y: Math.random() * rainCanvas.height,
        len: 10 + Math.random() * 20,
        speed: 4 + Math.random() * 4,
    });
}

function drawRain() {
    ctxR.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
    ctxR.strokeStyle = "rgba(0,255,255,0.3)";
    ctxR.lineWidth = 1;
    ctxR.lineCap = "round";
    for (let d of rainDrops) {
        ctxR.beginPath();
        ctxR.moveTo(d.x, d.y);
        ctxR.lineTo(d.x, d.y + d.len);
        ctxR.stroke();
        d.y += d.speed;
        if (d.y > rainCanvas.height) {
            d.y = -20;
            d.x = Math.random() * rainCanvas.width;
        }
    }
    requestAnimationFrame(drawRain);
}
drawRain();

// === Sky / Water Animation ===
const ctxS = skyCanvas.getContext("2d");
let t = 0;

// === Raindrops on icon hover ===
const iconWraps = document.querySelectorAll(".icon-wrap");

iconWraps.forEach((wrap) => {
    wrap.addEventListener("mouseenter", () => {
        if (!body.classList.contains("dark")) return; // Only in dark theme
        for (let i = 0; i < 12; i++) {
            const drop = document.createElement("div");
            drop.classList.add("rain-drop");
            drop.style.left = `${10 + Math.random() * 60}px`;
            drop.style.top = `${Math.random() * 10}px`;
            drop.style.animationDelay = `${Math.random() * 0.3}s`;
            wrap.appendChild(drop);

            setTimeout(() => drop.remove(), 800); // remove after animation
        }
    });
});

// === Sunshine & Ripple Effect (Light Mode) ===
iconWraps.forEach((wrap) => {
    wrap.addEventListener("mouseenter", () => {
        if (!body.classList.contains("light")) return; // Only in light mode

        // Create expanding ripples
        for (let i = 0; i < 3; i++) {
            const ripple = document.createElement("div");
            ripple.classList.add("ripple");
            ripple.style.animationDelay = `${i * 0.3}s`;
            wrap.appendChild(ripple);

            setTimeout(() => ripple.remove(), 1500);
        }
    });
});

// Optional floating clouds
let cloudsArr = [];

for (let i = 0; i < 10; i++) {
    const cloud = {
        x: Math.random() * skyCanvas.width,
        y: 50 + Math.random() * 120,
        speed: 0.2 + Math.random() * 0.3,
        size: 60 + Math.random() * 80,
    };
    cloudsArr.push(cloud); // reuse array, optional
}

function drawClouds(ctx, clouds) {
    clouds.forEach((c) => {
        const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.size);
        grad.addColorStop(0, "rgba(255,255,255,0.8)");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
        ctx.fill();
        c.x += c.speed;
        if (c.x - c.size > skyCanvas.width) c.x = -c.size;
    });
}

// === Fish Animation (Light Mode) ===
const fishLeft = new Image();
const fishRight = new Image();
fishLeft.src = "./assets/images/fish-look-right.png";
fishRight.src = "./assets/images/fish-look-left.png";

const fishes = [];
for (let i = 0; i < 6; i++) {
    fishes.push({
        x: Math.random() * skyCanvas.width,
        y: skyCanvas.height * 0.65 + Math.random() * 80, // near water surface
        speed: 0.4 + Math.random() * 0.6,
        dir: Math.random() > 0.5 ? 1 : -1, // 1 = right, -1 = left
        size: 40 + Math.random() * 60,
        flipTimer: Math.random() * 200 + 200, // frame counter to change direction
    });
}

function drawFishes(ctx, fishes) {
    for (let f of fishes) {
        // pick correct image
        const img = f.dir === 1 ? fishRight : fishLeft;

        // draw image
        ctx.drawImage(img, f.x - f.size / 2, f.y - f.size / 2, f.size, f.size);

        // move fish
        f.x += f.speed * f.dir;

        // occasionally change direction
        f.flipTimer--;
        if (f.flipTimer <= 0) {
            f.dir *= -1;
            f.flipTimer = Math.random() * 200 + 200;
        }

        // wrap around screen
        if (f.x < -f.size) f.x = skyCanvas.width + f.size;
        if (f.x > skyCanvas.width + f.size) f.x = -f.size;
    }
}

// === Enhanced Water & Sky Animation ===

function drawSky() {
    const w = skyCanvas.width;
    const h = skyCanvas.height;
    t += 0.015;

    // Clear previous frame
    ctxS.clearRect(0, 0, w, h);

    // --- Sky gradient ---
    const skyGrad = ctxS.createLinearGradient(0, 0, 0, h * 0.7);
    skyGrad.addColorStop(0, "#aee1f9");
    skyGrad.addColorStop(1, "#ffffff");
    ctxS.fillStyle = skyGrad;
    ctxS.fillRect(0, 0, w, h);

    // --- Draw clouds before sun & water ---
    drawClouds(ctxS, cloudsArr);

    // --- Sun reflection (glow spot) ---
    const sunY = h * 0.3 + Math.sin(t * 0.5) * 10;
    const glowGrad = ctxS.createRadialGradient(w / 2, sunY, 0, w / 2, sunY, 250);
    glowGrad.addColorStop(0, "rgba(255,255,200,0.5)");
    glowGrad.addColorStop(1, "rgba(255,255,200,0)");
    ctxS.fillStyle = glowGrad;
    ctxS.fillRect(0, 0, w, h);

    // --- Water area ---
    ctxS.beginPath();
    ctxS.moveTo(0, h * 0.55);

    for (let x = 0; x <= w; x += 20) {
        const y = h * 0.55 + Math.sin(x * 0.015 + t) * 10 + Math.sin(x * 0.03 + t * 1.3) * 5;
        ctxS.lineTo(x, y);
    }
    ctxS.lineTo(w, h);
    ctxS.lineTo(0, h);
    ctxS.closePath();

    const waterGrad = ctxS.createLinearGradient(0, h * 0.55, 0, h);
    waterGrad.addColorStop(0, "#4facfe");
    waterGrad.addColorStop(1, "#00f2fe");
    ctxS.fillStyle = waterGrad;
    ctxS.fill();

    // --- Sparkling highlights on water ---
    for (let i = 0; i < 40; i++) {
        const sparkleX = Math.random() * w;
        const sparkleY =
            h * 0.55 +
            Math.sin(sparkleX * 0.015 + t) * 10 +
            Math.sin(sparkleX * 0.03 + t * 1.3) * 5 +
            Math.random() * 4;
        ctxS.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.7})`;
        ctxS.fillRect(sparkleX, sparkleY, 2, 2);
    }

    if (body.classList.contains("light")) {
        drawFishes(ctxS, fishes);
    }

    requestAnimationFrame(drawSky);
}
drawSky();
