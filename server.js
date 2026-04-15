const crypto = require("crypto");
const http = require("http");
const { Worker } = require("worker_threads");
const os = require("os");

const numWorkers = os.availableParallelism();
console.log("Number of workers:", numWorkers);

// Create worker pool
const workers = [];
for (let i = 0; i < numWorkers; i++) {
  workers.push(new Worker("./worker.js"));
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/hash")) {
    const url = new URL(req.url, `http://${req.headers.host}`);

    const params = url.searchParams;

    const text = params.get("text");

    let currWorker = getRandomInt(0, numWorkers - 1);

    console.log(`Processing text ${text} with worker ${currWorker}`);

    workers[currWorker].postMessage(text);

    workers[currWorker].once("message", (data) => {
      res.end(data);
    });
  } else {
    res.end("OK");
  }
});

server.listen(8080, () => console.log("Server running on 8080"));
