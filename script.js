document.addEventListener('DOMContentLoaded', () => {
    console.log("Script loaded successfully");

    // Countdown timer
    const countdownElement = document.getElementById('countdown');
    const countdownContainer = document.getElementById('countdown-container');
    const content = document.getElementById('content');
    const overlay = document.getElementById('overlay');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const targetDate = new Date('2025-05-05T00:00:00').getTime();

    if (countdownElement && countdownContainer && content && overlay && backgroundMusic) {
        document.body.classList.add('body-hidden');

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(countdownInterval);
                countdownContainer.style.display = 'none';
                content.style.display = 'block';
                overlay.style.display = 'none';

                document.body.classList.remove('body-hidden');

                backgroundMusic.play();

                startAnimations();
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }

        overlay.style.display = 'flex';
        content.style.display = 'none';

        const countdownInterval = setInterval(updateCountdown, 1000);
    }

    // Fireworks animation
    function startAnimations() {
        console.log("Starting animations...");
        const canvas = document.getElementById('fireworksCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        class Firework {
            constructor(x, y, targetX, targetY) {
                this.x = x;
                this.y = y;
                this.targetX = targetX;
                this.targetY = targetY;
                this.distanceToTarget = Math.sqrt((targetX - x) ** 2 + (targetY - y) ** 2);
                this.coordinates = Array(3).fill([this.x, this.y]);
                this.angle = Math.atan2(targetY - y, targetX - x);
                this.speed = 2;
                this.acceleration = 1.05;
                this.brightness = Math.random() * 50 + 50;
                this.targetRadius = 1;
            }

            update(index) {
                this.coordinates.pop();
                this.coordinates.unshift([this.x, this.y]);

                if (this.targetRadius < 20) {
                    this.targetRadius += 0.3;
                } else {
                    this.targetRadius = 1;
                }

                this.speed *= this.acceleration;

                const vx = Math.cos(this.angle) * this.speed;
                const vy = Math.sin(this.angle) * this.speed;

                if (Math.sqrt((this.x + vx - this.x) ** 2 + (this.y + vy - this.y) ** 2) >= this.distanceToTarget) {
                    createParticles(this.targetX, this.targetY);
                    fireworks.splice(index, 1);
                } else {
                    this.x += vx;
                    this.y += vy;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
                ctx.lineTo(this.x, this.y);
                ctx.strokeStyle = `hsl(${Math.random() * 360}, 100%, ${this.brightness}%)`;
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(this.targetX, this.targetY, this.targetRadius, 0, Math.PI * 2);
                ctx.stroke();
            }
        }

        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.coordinates = Array(5).fill([this.x, this.y]);
                this.angle = Math.random() * Math.PI * 2;
                this.speed = Math.random() * 10 + 1;
                this.friction = 0.95;
                this.gravity = 1;
                this.hue = Math.random() * 360;
                this.brightness = Math.random() * 50 + 50;
                this.alpha = 1;
                this.decay = Math.random() * 0.03 + 0.01;
            }

            update(index) {
                this.coordinates.pop();
                this.coordinates.unshift([this.x, this.y]);

                this.speed *= this.friction;
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed + this.gravity;
                this.alpha -= this.decay;

                if (this.alpha <= this.decay) {
                    particles.splice(index, 1);
                }
            }

            draw() {
                ctx.beginPath();
                ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
                ctx.lineTo(this.x, this.y);
                ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
                ctx.stroke();
            }
        }

        const fireworks = [];
        const particles = [];

        function createParticles(x, y) {
            for (let i = 0; i < 100; i++) {
                particles.push(new Particle(x, y));
            }
        }

        function loop() {
            requestAnimationFrame(loop);
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = 'lighter';

            fireworks.forEach((firework, index) => {
                firework.draw();
                firework.update(index);
            });

            particles.forEach((particle, index) => {
                particle.draw();
                particle.update(index);
            });

            if (Math.random() < 0.05) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height / 2;
                fireworks.push(new Firework(canvas.width / 2, canvas.height, x, y));
            }
        }

        loop();
    }

    // Typing animation
    const text = "Fadia Fadhilatunnisa";
    let index = 0;
    const typingSpeed = 250;

    function type() {
        if (index < text.length) {
            document.getElementById('typing-text').innerHTML += text.charAt(index);
            index++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(() => {
                document.getElementById('typing-text').innerHTML = '';
                index = 0;
                type();
            }, 2000);
        }
    }

    type();

    function showPopup(element) {
        const modal = document.getElementById('popupModal');
        const iframe = modal.querySelector('iframe');
        const minigameUrl = element.getAttribute('data-minigame');

        iframe.src = minigameUrl;

        modal.style.display = 'block';
    }

    function closePopup() {
        const modal = document.getElementById('popupModal');
        const iframe = modal.querySelector('iframe');

        modal.style.display = 'none';
    }

    window.onclick = function (event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    };

    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init("ilmfPykiUy6WNMByS");
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            emailjs
                .send("service_fr0105", "template_bk5euok", {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    address: document.getElementById('address').value,
                    message: document.getElementById('message').value,
                })
                .then(
                    function (response) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Pesan Terkirim!',
                            text: 'Pesan Anda telah berhasil dikirim.',
                            confirmButtonText: 'OK'
                        });
                        contactForm.reset();
                    },
                    function (error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Gagal Mengirim Pesan',
                            text: 'Terjadi kesalahan. Silakan coba lagi.',
                            confirmButtonText: 'OK'
                        });
                        console.error(error);
                    }
                );
        });
    }
});

function showPopup(element) {
    const modal = document.getElementById('popupModal');
    const iframe = modal.querySelector('iframe');
    const minigameUrl = element.getAttribute('data-minigame');

    // Set URL iframe ke minigame yang sesuai
    iframe.src = minigameUrl;

    // Tampilkan modal
    modal.style.display = 'block';
}

function closePopup() {
    const modal = document.getElementById('popupModal');
    const iframe = modal.querySelector('iframe');

    // Sembunyikan modal dan reset iframe
    modal.style.display = 'none';
}

// Close the modals when clicking outside of them
window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};

function createBalloon() {
    const balloonContainer = document.getElementById('balloon-container');
    const balloon = document.createElement('div');
    balloon.classList.add('balloon');

    balloon.style.left = Math.random() * 100 + 'vw';

    const colors = ['red', 'blue', 'yellow', 'pink', 'green', 'purple'];
    balloon.style.background = `radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.8), ${colors[Math.floor(Math.random() * colors.length)]})`;

    const duration = Math.random() * 5 + 5;
    balloon.style.animationDuration = `${duration}s`;

    balloonContainer.appendChild(balloon);

    setTimeout(() => {
        balloon.remove();
    }, duration * 1000);
}

setInterval(createBalloon, 300);