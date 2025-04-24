window.onload = () => {
    const lines = document.querySelectorAll('.manifesto p, .manifesto h1, .manifesto h2');
    let index = 0;
  
    lines.forEach(line => {
      line.dataset.text = line.textContent;
      line.textContent = '';
      line.style.opacity = '1';
    });
  
    function typeWriter(line, text, i, done) {
      if (i < text.length) {
        line.innerHTML = text.substring(0, i + 1);
        setTimeout(() => typeWriter(line, text, i + 1, done), 40);
      } else {
        done();
      }
    }
  
    function revealNextLine() {
      if (index >= lines.length) return;
  
      const line = lines[index];
      const fullText = line.dataset.text;
      line.innerHTML = '';
      line.style.opacity = '1';
  
      typeWriter(line, fullText, 0, () => {
        index++;
        setTimeout(() => {
          revealNextLine();
          if (index === lines.length) {
            showTerminal();
          }
        }, 600);
      });
    }
  
    revealNextLine();
  };
  
  function showTerminal() {
    const terminal = document.getElementById('terminal');
    terminal.classList.add('show');
  
    const form = document.getElementById('terminalForm');
    const input = document.getElementById('terminalInput');
    const output = document.getElementById('terminalOutput');
  
    let isAwaitingPassword = false;
    let currentUser = '';
  
    const keySound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-typewriter-key-1121.mp3');
    keySound.volume = 0.1;
  
    input.addEventListener('keypress', () => {
      keySound.currentTime = 0;
      keySound.play();
    });
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const command = input.value.trim().toLowerCase();
      input.value = '';
      output.textContent += `\n> ${command}`;
      let response = '';
  
      if (isAwaitingPassword) {
        if (command === 'shadowcode2025') {
          response = `> WELCOME BACK, ${currentUser.toUpperCase()}.`;
        } else {
          response = '> ACCESS DENIED. INCORRECT PASSWORD.';
        }
        isAwaitingPassword = false;
        currentUser = '';
        output.textContent += `\n${response}`;
        output.scrollTop = output.scrollHeight;
        return;
      }
  
      const args = command.split(' ');
  
      switch (args[0]) {
        case 'login':
          if (args[1]) {
            currentUser = args[1];
            response = '> ENTER PASSWORD:';
            isAwaitingPassword = true;
          } else {
            response = '> USAGE: login [username]';
          }
          break;
  
        case 'awake':
          terminal.classList.add('flicker');
          response = '> ACCESS GRANTED. THE CODE IS WITHIN YOU.';
          setTimeout(() => {
            terminal.classList.remove('flicker');
            output.classList.add('glow-text');
            setTimeout(() => output.classList.remove('glow-text'), 2000);
          }, 600);
          break;
  
        case 'decrypt':
          response = '> DECRYPTION IN PROGRESS';
          output.textContent += `\n${response}`;
          const dots = document.createElement('span');
          dots.classList.add('typing');
          output.appendChild(dots);
          setTimeout(() => {
            dots.remove();
            output.textContent += '\n> COMPLETE.';
            output.scrollTop = output.scrollHeight;
          }, 3000);
          return;
  
        case 'system':
          response = '> SHADOW SYSTEM ONLINE.';
          break;
  
        case 'unlock':
          if (args[1] === 'truth') {
            response = '> SYSTEM OVERRIDE. INITIATING TRUTH PROTOCOL...\n>> YOU ARE THE CODE.';
            output.classList.add('glow-text');
            setTimeout(() => output.classList.remove('glow-text'), 2000);
          } else {
            response = '> UNKNOWN UNLOCK KEY.';
          }
          break;
  
        case 'help':
          response = '> Try: awake, decrypt, system, login, unlock truth';
          break;
  
        default:
          response = '> COMMAND NOT RECOGNIZED.';
      }
  
      output.textContent += `\n${response}`;
      output.scrollTop = output.scrollHeight;
    });
  }
  