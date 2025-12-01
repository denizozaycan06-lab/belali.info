const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
let animationId;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = {
    x: null,
    y: null,
    radius:150
}

window.addEventListener('mousemove',function(event) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
});

class Particle {
    constructor(x,y,text,size) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.size = size;
        this.baseX = this.x;
        this.baseY = this.y;

        this.directionX = (Math.random() * 0.3) - 0.02;
        this.directionY = (Math.random() * 0.3) - 0.02;
    }

    draw() {
        ctx.beginPath();

        ctx.arc(this.x, this.y, this.size / 3,0,Math.PI * 2, false);
        ctx.fillStyle = '#fff';
        ctx.fill();

        ctx.font = (this.size + 4) + 'px Courier New';
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillText(this.text,this.x + 10, this.y + 5);
    }

    update() {
        if (this.x > canvas.width || this.x<0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y<0) this.directionY = -this.directionY;

        let dx = mouse.x - this.x;
        let dy = mouse.y -this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);

        if ( distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy /distance;
            const force = (mouse.radius - distance) / mouse.radius;
            const directionX = forceDirectionX*force*1;
            const directionY = forceDirectionY*force*1;

            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX) {
                this.x += this.directionX;
                this.y += this.directionY;
            }
        }

        this.x += this.directionX;
        this.y += this.directionY;

        this.draw();
    }
}

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
            + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            
          
            
            
            if (particlesArray[a].group === particlesArray[b].group) {
                
               
                if (distance < (canvas.width/7) * (canvas.height/7)) {
                    opacityValue = 1 - (distance/20000);
                  
                    ctx.strokeStyle = 'rgba(255,255,255,' + opacityValue + ')'; 
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            } 
            
            else {
              
                if (distance < (canvas.width/15) * (canvas.height/15)) {
                    opacityValue = 1 - (distance/10000);

                    ctx.strokeStyle = 'rgba(255,255,255,' + (opacityValue * 0.2) + ')'; 
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }
}


async function initMindmap() {
    particlesArray = [];

    try {
        const response = await fetch('mindmap.json');
        const data = await response.json();

        data.forEach(node => {
            let size =node.val;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);

            particlesArray.push(new Particle(x,y,node.id, size, node.group));
        });

        animate();
    } catch(err) {
        console.error("mindmap data couldnt laod:",err);
    }
}

function animate() {
    requestAnimationFrame(animate);
     ctx.clearRect(0,0,innerWidth, innerHeight);
      for (let i =0; i< particlesArray.length; i++) {
        particlesArray[i].update();
      }
      connect();
}

window.addEventListener('resize',function(){
    canvas.width = this.innerWidth;
    canvas.height = this.innerHeight;
    initMindmap();
});

window.addEventListener('mouseout',function(){
    mouse.x = undefined;
    mouse.y = undefined;
})

initMindmap();