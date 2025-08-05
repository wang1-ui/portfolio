const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Mouse tracker
const mouse = {
  x: null,
  y: null,
  radius: 100,
  hovering: false
};

canvas.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
  mouse.hovering = true;
});

canvas.addEventListener("mouseleave", () => {
  mouse.x = null;
  mouse.y = null;
  mouse.hovering = false;
});

class Particle {
  constructor(x = Math.random() * canvas.width, y = Math.random() * canvas.height) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 3 + 1;
    this.dx = (Math.random() - 0.5) * 1.5;
    this.dy = (Math.random() - 0.5) * 1.5;
    this.color = "#21bfb9";
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    // Repel from mouse
    if (mouse.x !== null && mouse.y !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius && distance > 0) {
        // Repulsion force
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const force = (mouse.radius - distance) / mouse.radius;

        // Apply the force
        this.x += forceDirectionX * force * 5;
        this.y += forceDirectionY * force * 5;
      }
    }

    // Move
    this.x += this.dx;
    this.y += this.dy;

    // Bounce
    if (this.x < 0 || this.x > canvas.width) this.dx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.dy *= -1;

    this.draw();
  }
}

const particles = [];
const initialCount = 200;
const maxParticles = 300;

for (let i = 0; i < initialCount; i++) {
  particles.push(new Particle());
}

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        ctx.beginPath();
        ctx.strokeStyle = `rgb(33, 191, 185, ${1 - distance / 100})`;
        ctx.lineWidth = 1;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.closePath();
      }
    }

    // Connect to mouse
    
    
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => p.update());
  connectParticles();
  requestAnimationFrame(animate);
}

animate();
