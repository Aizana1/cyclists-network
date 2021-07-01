const http = require("http")
const app = require("./app")
const port = process.env.PORT || 3000
 const server = http.createServer(app)

// const server = http.createServer((req, res) => {

//   // Устанавливаем HTTP-заголовок ответа с HTTP статусом и Content type
//   res.writeHead(200, {'Content-Type': 'text/plain'});

//   // Отсылаем тело ответа "Hello World"
//   res.end('Hello World\n');
//});

server.listen(port, () => console.log("Listening on " + port))
