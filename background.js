export function makeBackground() {
    // Create and append the canvas dynamically
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);

    // Set canvas as a background
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "-1"; // Send it to the background

    const ctx = canvas.getContext("2d");

    // Set canvas size to match window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawHalftone();
    }

    const dotSpacing = 40; // Spacing between dots
    const maxRadius = 25;  // Maximum dot radius
    let time = 0;          // Animation time variable

    function drawHalftone() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let y = 0; y < canvas.height + maxRadius; y += dotSpacing) {
            for (let x = 0; x < canvas.width + maxRadius; x += dotSpacing) {
                let radius = Math.abs(Math.sin(x * 0.002 + y * 0.003 + time) * maxRadius); // Sinusoidal variation


                // Generate gradient colors based on position
                let hue = 20 + (x / canvas.width) * 50;       // Hue varies
                let lightness = 32 + Math.sin(y * 0.01) * 3;  // lightness oscillates

                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = `hsl(${hue}, 100%, ${lightness}%)`;
                ctx.fill();
            }
        }
        ctx.restore();
    }

    function animate() {
        time -= 0.003; // Slow animation speed
        drawHalftone();
        requestAnimationFrame(animate);
    }

    // Resize and redraw on window resize
    window.addEventListener("resize", resizeCanvas);

    resizeCanvas();
    animate();
}