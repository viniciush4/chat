var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var persons = {}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.send(persons)
  socket.on('disconnect', () => {
    io.emit('out person', persons[socket.id].nome + ' saiu');
    delete persons[socket.id]
  });
  socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message', msg);
  });
  socket.on('new person', (msg) => {
  	persons[socket.id] = {
  		nome: msg
  	}
    io.emit('new person', msg + ' está conectado');
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
