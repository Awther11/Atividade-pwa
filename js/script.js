class Personagem {
    constructor(nome, descricao, caracteristica, idade) {
        this.nome = nome;
        this.descricao = descricao;
        this.caracteristica = caracteristica;
        this.idade = idade;

        // Lê o próximo ID diretamente do localStorage a cada instanciação,
        // garantindo que reloads não causem IDs duplicados
        const proximoId = parseInt(localStorage.getItem("idGlobalPersonagem") || "1");
        this.identifier = proximoId;
        localStorage.setItem("idGlobalPersonagem", proximoId + 1);
    }
}


(function initStarfield() {
    const canvas = document.getElementById("starfield");
    const ctx = canvas.getContext("2d");
    let stars = [];
    let W, H;
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        generateStars();
    }

    function generateStars() {
        stars = [];
        const count = Math.floor((W * H) / 4000);
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * W,
                y: Math.random() * H,
                r: Math.random() * 1.5 + 0.2,
                alpha: Math.random() * 0.7 + 0.1,
                speed: Math.random() * 0.4 + 0.05,
                // parallax layer (0 = near, 1 = far)
                layer: Math.random()
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        // lerp (suaviza o movimento do parallax)
        targetX += (mouseX - targetX) * 0.04;
        targetY += (mouseY - targetY) * 0.04;

        const cx = W / 2, cy = H / 2;

        for (const s of stars) {
            const depth = 1 - s.layer; // objetos próximos movem mais
            const px = s.x + (targetX - cx) * depth * 0.04;
            const py = s.y + (targetY - cy) * depth * 0.04;

            // pulse sutil
            const pulse = 0.6 + 0.4 * Math.sin(Date.now() * s.speed * 0.001 + s.x);

            ctx.beginPath();
            ctx.arc(px, py, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(201, 168, 76, ${s.alpha * pulse})`;
            ctx.fill();
        }

        requestAnimationFrame(draw);
    }

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Suporte touch para mobile
    window.addEventListener("touchmove", (e) => {
        if (e.touches.length > 0) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
        }
    }, { passive: true });

    window.addEventListener("resize", resize);
    resize();
    draw();
})();