

const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let centers = {};
let rawData = [];
let groupLeaders = {};

let centerY = canvas.height * 0.58;


class Node {
    constructor(id, label, group, size) {
        this.id = id;
        this.label = label;
        this.group = group;
        this.radius = size*2;

if (this.group === 1) {
    this.x = canvas.width / 2;
    this.y = centerY;
} else {

        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.vx = 0;
        this.vy = 0;
     }
}
update(allNodes) {

    if (this.group === 1) {
            this.x = canvas.width / 2;
            this.y = centerY;
            this.draw();
            return; 
        }

    const target = centers[this.group] || centers[0];

    const dx = target.x - this.x;
    const dy = target.y - this.y;
    
    this.vx += dx * 0.005;
    this.vy += dy * 0.005;

    this.vx *= 0.9;
    this.vy *= 0.9;

    allNodes.forEach(other => {
        if (other === this) return;

        const distX = this.x - other.x;
        const distY = this.y - other.y;
        const distance = Math.sqrt(distX * distX + distY * distY);

        const myVisualRadius = this.radius / 2;
        const otherVisualRadius = other.radius / 2;

        let extraPush = (other.group === 1) ? 60 : 0;

        const minDist = myVisualRadius + otherVisualRadius + 80;

        if (distance < minDist) {
            const angle = Math.atan2(distY, distX);
            const force = (minDist - distance) * 0.05;
            const PushX = Math.cos(angle) * force;
            const PushY = Math.sin(angle) * force;

            this.vx += PushX;
            this.vy += PushY;
        }
    });

    this.x += this.vx;
    this.y += this.vy;

    

    this.draw();
}

draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius / 2, 0, Math.PI * 2);


    if (this.group === 1) {
             ctx.fillStyle = '#fff'; 
        } else {
             ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        }

    const size = this.radius * 1.5;
    ctx.fillStyle = '#fff';
    ctx.fill();

    ctx.font = this.group === 1 ? 'bold 14px "Montserrat"' : '500 11px "Montserrat"';
    ctx.fillStyle = this.group === 1 ? '#fff' : '#ccc';
    ctx.textAlign = 'center';

    ctx.fillText(this.label, this.x, this.y + (this.radius/2) + 15);
    }
}

function drawConnections() {
    
    ctx.lineWidth = 1;

    
    const coreNode = particles.find(p => p.group === 1);
    
    if (coreNode) {
        particles.forEach(p => {
            
            const isLeader = groupLeaders[p.group] === p;
            const isMainCategory = p.group === 2;

            if (p !== coreNode && (isLeader || isMainCategory)) {
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'; 
                ctx.moveTo(coreNode.x, coreNode.y);
                ctx.lineTo(p.x, p.y);
                ctx.stroke();
            }
        });
    }

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {

            const p1 = particles[i];
            const p2 = particles[j];
            if (p1.group === 1 || p2.group === 1) continue;

            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120 && (p1.group === p2.group || distance < 60)) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
    }
}

function calculateCenters() {
    centers[0] = {x : canvas.width/2, y : centerY};

    if (!rawData || rawData.length === 0) return;

    const groups = [...new Set(rawData.map(item => item.group))].filter(g => g !==1 && g !== undefined);

    const orbitRadius = Math.min(canvas.width, canvas.height) * 0.22;

    const angleStep = (Math.PI*2) / groups.length;

    groups.forEach((groupId, Index) => {

        const angle = Index * angleStep;


        centers[groupId] = {
            x: (canvas.width/2) + Math.cos(angle) * orbitRadius,
            y: (canvas.height/2) + Math.sin(angle) * orbitRadius
        };
    });
}

function findGroupLeaders() {
    rawData.forEach(item => {
        if (!groupLeaders[item.group] || item.size > groupLeaders[item.group].size) {
        }    
    });
}


async function initCortex() {
    try {
        const res = await fetch('mindmap.json');
        rawData = await res.json();

        calculateCenters();

        particles = [];

        rawData.forEach(item => {
             particles.push(new Node(item.id, item.label, item.group, item.size));
        });

        particles.forEach(p => {
            if (!groupLeaders[p.group] || p.radius > groupLeaders[p.group].radius) {
                groupLeaders[p.group] = p;
            }
        });

        animate();

    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    drawConnections();
    particles.forEach(p => p.update(particles));

}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    calculateCenters();
});

initCortex();