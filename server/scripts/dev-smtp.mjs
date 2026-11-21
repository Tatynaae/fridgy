// Локальный приёмник писем для разработки: принимает SMTP на :1025 и печатает письма в консоль.
// Нужен, чтобы «Забыли пароль?» работало без настоящей почты. Токен сброса виден в выводе.
import net from 'node:net';

net
  .createServer((socket) => {
    let data = false;
    let body = '';
    socket.write('220 fridgy-dev ESMTP\r\n');
    let buf = '';
    socket.on('data', (chunk) => {
      buf += chunk.toString();
      let i;
      while ((i = buf.indexOf('\r\n')) !== -1) {
        const line = buf.slice(0, i);
        buf = buf.slice(i + 2);
        if (data) {
          if (line === '.') {
            data = false;
            const decoded = body
              .replace(/=\n/g, '')
              .replace(/=([0-9A-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
            console.log('\n=== MAIL ===\n' + decoded + '\n============');
            body = '';
            socket.write('250 OK\r\n');
          } else body += line + '\n';
          continue;
        }
        const cmd = line.slice(0, 4).toUpperCase();
        if (cmd === 'EHLO') socket.write('250-fridgy-dev\r\n250 AUTH PLAIN LOGIN\r\n');
        else if (cmd === 'AUTH') socket.write('235 OK\r\n');
        else if (cmd === 'DATA') { data = true; socket.write('354 go\r\n'); }
        else if (cmd === 'QUIT') { socket.write('221 bye\r\n'); socket.end(); }
        else socket.write('250 OK\r\n');
      }
    });
  })
  .listen(1025, '127.0.0.1', () => console.log('dev SMTP on :1025'));
