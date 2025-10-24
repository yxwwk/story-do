// Confetti.js - 用于生成庆祝效果的粒子系统

// 创建一个Confetti类来管理粒子系统
class Confetti {
    constructor() {
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.isRunning = false;
    }

    // 初始化画布
    init() {
        // 检查是否已经有画布
        if (this.canvas) {
            return;
        }

        // 创建画布元素
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'confetti-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1000';
        
        // 添加到body
        document.body.appendChild(this.canvas);
        
        // 获取上下文
        this.ctx = this.canvas.getContext('2d');
        
        // 设置画布大小
        this.resizeCanvas();
        
        // 监听窗口大小变化
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    // 调整画布大小
    resizeCanvas() {
        if (!this.canvas) return;
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    // 创建粒子
    createParticles(count = 100, options = {}) {
        const defaults = {
            colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF8E8E', '#6BCB77', '#A8E6CF', '#DCEDC2', '#FFD3B5'],
            shapes: ['circle', 'square', 'triangle'],
            minSize: 5,
            maxSize: 15,
            minSpeed: 1,
            maxSpeed: 5,
            minRotation: -1,
            maxRotation: 1,
            spreadX: window.innerWidth,
            startY: -50
        };

        const config = { ...defaults, ...options };

        for (let i = 0; i < count; i++) {
            const size = config.minSize + Math.random() * (config.maxSize - config.minSize);
            const color = config.colors[Math.floor(Math.random() * config.colors.length)];
            const shape = config.shapes[Math.floor(Math.random() * config.shapes.length)];
            
            // 创建粒子对象
            const particle = {
                x: Math.random() * config.spreadX,
                y: config.startY,
                size: size,
                color: color,
                shape: shape,
                speedX: (Math.random() - 0.5) * 2,
                speedY: config.minSpeed + Math.random() * (config.maxSpeed - config.minSpeed),
                rotation: 0,
                rotationSpeed: config.minRotation + Math.random() * (config.maxRotation - config.minRotation),
                opacity: 1,
                gravity: 0.05,
                wind: 0.02 * (Math.random() - 0.5),
                life: Math.random() * 300 + 500 // 粒子生命周期（帧数）
            };

            this.particles.push(particle);
        }
    }

    // 绘制粒子
    drawParticles() {
        if (!this.ctx || this.particles.length === 0) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // 更新粒子位置
            particle.speedY += particle.gravity;
            particle.x += particle.speedX + particle.wind;
            particle.y += particle.speedY;
            particle.rotation += particle.rotationSpeed;
            particle.life--;
            
            // 根据生命周期更新透明度
            particle.opacity = particle.life / 500;
            
            // 移除已完成生命周期的粒子
            if (particle.life <= 0 || particle.y > this.canvas.height) {
                this.particles.splice(i, 1);
                continue;
            }

            // 保存当前状态
            this.ctx.save();
            
            // 移动到粒子中心
            this.ctx.translate(particle.x, particle.y);
            
            // 应用旋转
            this.ctx.rotate(particle.rotation);
            
            // 设置透明度
            this.ctx.globalAlpha = particle.opacity;
            
            // 设置填充颜色
            this.ctx.fillStyle = particle.color;
            
            // 根据形状绘制粒子
            switch (particle.shape) {
                case 'circle':
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
                    this.ctx.fill();
                    break;
                
                case 'square':
                    this.ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
                    break;
                
                case 'triangle':
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, -particle.size / 2);
                    this.ctx.lineTo(particle.size / 2, particle.size / 2);
                    this.ctx.lineTo(-particle.size / 2, particle.size / 2);
                    this.ctx.closePath();
                    this.ctx.fill();
                    break;
            }

            // 恢复之前的状态
            this.ctx.restore();
        }
    }

    // 动画循环
    animate() {
        if (!this.isRunning && this.particles.length === 0) {
            return;
        }

        this.drawParticles();
        
        // 如果还有粒子，继续动画
        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.isRunning = false;
        }
    }

    // 启动粒子效果
    start(options = {}) {
        this.init();
        
        // 创建新粒子
        const count = options.count || 200;
        this.createParticles(count, options);
        
        // 如果动画没有运行，启动它
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
        }
    }

    // 停止粒子效果
    stop() {
        this.particles = [];
        this.isRunning = false;
        
        // 清除画布
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    // 清除所有粒子和画布
    cleanup() {
        this.stop();
        
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
            this.canvas = null;
            this.ctx = null;
        }
    }
}

// 创建全局Confetti实例
const confetti = new Confetti();

// 添加便捷方法到window对象，以便在其他脚本中使用
window.confetti = {
    start: (options) => confetti.start(options),
    stop: () => confetti.stop(),
    cleanup: () => confetti.cleanup()
};

// 导出Confetti类（如果支持模块）
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Confetti;
}

// 粒子效果预设
const confettiPresets = {
    // 小型庆祝效果
    small: {
        count: 100,
        minSize: 3,
        maxSize: 8,
        minSpeed: 1,
        maxSpeed: 3
    },
    
    // 中型庆祝效果
    medium: {
        count: 200,
        minSize: 5,
        maxSize: 12,
        minSpeed: 1,
        maxSpeed: 4
    },
    
    // 大型庆祝效果
    large: {
        count: 300,
        minSize: 6,
        maxSize: 15,
        minSpeed: 2,
        maxSpeed: 5
    },
    
    // 胜利庆祝效果
    victory: {
        count: 400,
        minSize: 4,
        maxSize: 14,
        minSpeed: 1,
        maxSpeed: 6,
        colors: ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#FFE66D']
    },
    
    // 生日庆祝效果
    birthday: {
        count: 350,
        minSize: 5,
        maxSize: 12,
        colors: ['#FF69B4', '#FF1493', '#FF6347', '#FFD700', '#32CD32', '#4169E1']
    },
    
    // 新年庆祝效果
    newYear: {
        count: 500,
        minSize: 4,
        maxSize: 10,
        colors: ['#FF0000', '#FFA500', '#FFFF00', '#008000', '#0000FF', '#4B0082', '#800080']
    }
};

// 添加预设到全局对象
window.confettiPresets = confettiPresets;

// 自动清理函数（当页面卸载时）
window.addEventListener('beforeunload', () => {
    confetti.cleanup();
});

// 辅助函数：创建多个连续的烟花效果
function createFireworksBurst(count = 3, interval = 1000) {
    let burstCount = 0;
    
    const burstInterval = setInterval(() => {
        // 使用不同的预设
        const presets = ['victory', 'large', 'medium'];
        const preset = presets[burstCount % presets.length];
        
        window.confetti.start(confettiPresets[preset]);
        
        burstCount++;
        
        if (burstCount >= count) {
            clearInterval(burstInterval);
        }
    }, interval);
}

// 添加到全局对象
window.createFireworksBurst = createFireworksBurst;

// 导出函数（如果支持模块）
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        confetti,
        confettiPresets,
        createFireworksBurst
    };
}