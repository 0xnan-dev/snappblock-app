if (typeof __dirname === "undefined") global.__dirname = "/";
if (typeof __filename === "undefined") global.__filename = "";
if (typeof process === "undefined") {
  global.process = require("process");
} else {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const bProcess = require("process");
  for (const p in bProcess) {
    if (!(p in process)) {
      process[p] = bProcess[p];
    }
  }
}

process.browser = false;
// eslint-disable-next-line @typescript-eslint/no-var-requires
if (typeof Buffer === "undefined") global.Buffer = require("buffer").Buffer;

if (!global.atob || !global.btoa) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Buffer = require("buffer").Buffer;
  global.atob = (data) => {
    return Buffer.from(data, "base64").toString();
  };

  global.btoa = (data) => {
    return Buffer.from(data).toString("base64");
  };
}

const NODE_ENV = process.env.NODE_ENV || "development";
const isDev = NODE_ENV === "development";

if (typeof localStorage !== 'undefined') {
  localStorage.debug = isDev ? '*' : '';
}

// If using the crypto shim, uncomment the following line to ensure
// crypto is loaded first, so it can populate global.crypto
require('crypto');