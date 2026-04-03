const crypto = require("crypto");
const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/hash")) {
    const url = new URL(req.url, `http://${req.headers.host}`);

    const params = url.searchParams;

    const text = params.get("text");

    console.log(`Received request with text: ${text}`);

    // Do 100k SHA256 rounds
    let data = text;
    for (let i = 0; i < 100000; i++) {
      data = crypto.createHash("sha256").update(data).digest("hex");
    }

    res.end(data);
  } else {
    res.end("OK");
  }
});

server.listen(8080, () => console.log("Server running on 8080"));
