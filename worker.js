const { parentPort } = require("worker_threads");
const crypto = require("crypto");

parentPort.on("message", (text) => {
  let data = text;

  // Do 100k SHA256 rounds
  for (let i = 0; i < 100000; i++) {
    data = crypto.createHash("sha256").update(data).digest("hex");
  }

  parentPort.postMessage(data);
});
