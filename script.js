// Dynamic Year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Letter Glitch Background Effect (React Bits style)
(function() {
    const canvas = document.createElement('canvas');
    canvas.id = 'glitch-canvas';
    document.body.insertBefore(canvas, document.body.firstChild);
    
    const vignette = document.createElement('div');
    vignette.className = 'glitch-vignette';
    document.body.insertBefore(vignette, document.body.firstChild);
    
    const ctx = canvas.getContext('2d');
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>,0123456789';
    const colors = ['#ff9933', '#ff6600', '#ffaa00'];
    
    let fontSize = 16;
    let charWidth = 10;
    let charHeight = 20;
    let updateSpeed = 150;
    let lastUpdate = 0;
    let grid = [];
    let cols, rows;
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        cols = Math.ceil(canvas.width / charWidth);
        rows = Math.ceil(canvas.height / charHeight);
        initGrid();
    }
    
    function initGrid() {
        grid = [];
        for (let i = 0; i < cols * rows; i++) {
            grid.push({
                char: chars[Math.floor(Math.random() * chars.length)],
                color: colors[Math.floor(Math.random() * colors.length)],
                targetChar: chars[Math.floor(Math.random() * chars.length)],
                changeProgress: 0
            });
        }
    }
    
    function draw(timestamp) {
        canvas.style.backgroundColor = '#000000';
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = `${fontSize}px monospace`;
        
        if (timestamp - lastUpdate > updateSpeed) {
            const updateCount = Math.floor(grid.length * 0.02);
            
            for (let i = 0; i < updateCount; i++) {
                const idx = Math.floor(Math.random() * grid.length);
                grid[idx].targetChar = chars[Math.floor(Math.random() * chars.length)];
                grid[idx].color = colors[Math.floor(Math.random() * colors.length)];
                grid[idx].changeProgress = 0;
            }
            lastUpdate = timestamp;
        }
        
        for (let i = 0; i < grid.length; i++) {
            const cell = grid[i];
            const x = (i % cols) * charWidth;
            const y = Math.floor(i / cols) * charHeight;
            
            if (cell.changeProgress < 1) {
                cell.changeProgress += 0.05;
                if (Math.random() > 0.7) {
                    cell.char = cell.targetChar;
                }
            }
            
            ctx.fillStyle = cell.color;
            ctx.fillText(cell.char, x, y);
        }
        
        requestAnimationFrame(draw);
    }
    
    window.addEventListener('resize', resize);
    resize();
    draw();
})();

// Terminal Resume Functionality
(function() {
    const commandInput = document.getElementById('commandInput');

    // Initialize terminal functionality
    if (commandInput) {
        // Focus input immediately
        commandInput.focus();
        
        // Add event listener for command input
        commandInput.addEventListener('keydown', handleKeydown);
        
        // Add input styling and placeholder
        commandInput.placeholder = 'Type a command...';
        
        // Add input feedback
        commandInput.addEventListener('input', () => {
            commandInput.style.caretColor = '#ff8000';
        });
    }

    // Keep focus on input when clicking anywhere in the terminal
    const terminal = document.querySelector('.terminal');
    const terminalBody = document.querySelector('.terminal-body');
    
    if (terminal) {
        terminal.addEventListener('click', (e) => {
            e.preventDefault();
            if (commandInput) {
                commandInput.focus();
            }
        });
    }

    if (terminalBody) {
        terminalBody.addEventListener('click', (e) => {
            e.preventDefault();
            if (commandInput) {
                commandInput.focus();
            }
        });
    }

    function handleKeydown(e) {
        if (e.key === 'Enter') {
            const command = commandInput.value.trim().toLowerCase();
            handleCommand(command);
            commandInput.value = '';
        }
    }

function handleCommand(cmd) {
        const outputs = document.querySelectorAll('.command-output');
        const output = document.getElementById('output');
        const commandLine = document.getElementById('commandLine');
        
        // Hide all outputs first
        outputs.forEach(el => el.style.display = 'none');
        
        // Show command echo - insert before command line
        const commandEcho = document.createElement('div');
        commandEcho.className = 'command-output';
        commandEcho.style.display = 'block';
        commandEcho.innerHTML = `<p><span class="prompt">guest@linux:~$</span> ${cmd}</p><br>`;
        output.insertBefore(commandEcho, commandLine);
        
        // Show appropriate output
        const commandMap = {
            'experience': 'experience',
            'cat experience.txt': 'experience',
            'education': 'education',
            'cat education.txt': 'education',
            'skills': 'skills',
            'ls skills': 'skills',
            'ls -la skills': 'skills',
            'interests': 'interests',
            'cat interests.txt': 'interests',
            'help': 'help'
        };

        const outputId = commandMap[cmd];
        
        if (outputId) {
            const outputEl = document.getElementById(outputId);
            if (outputEl) {
                const clone = outputEl.cloneNode(true);
                clone.style.display = 'block';
                clone.removeAttribute('id');
                output.insertBefore(clone, commandLine);
            }
        } else if (cmd === 'clear') {
            // Clear command - remove all dynamic outputs
            const dynamicOutputs = output.querySelectorAll('.command-output:not([id])');
            dynamicOutputs.forEach(el => el.remove());
            return;
        } else if (cmd !== '') {
            // Unknown command - show error
            const errorMsg = document.createElement('div');
            errorMsg.className = 'command-output';
            errorMsg.style.display = 'block';
            errorMsg.innerHTML = `<p class="error">Command not found: ${cmd}</p><p class="hint">Type 'help' for available commands</p><br>`;
            output.insertBefore(errorMsg, commandLine);
        }
        
        // Scroll to bottom
        commandLine.scrollIntoView({ behavior: 'smooth' });
    }
})();