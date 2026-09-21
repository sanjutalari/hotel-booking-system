/**
 * network.js — tiny helper to find the machine's LAN (WiFi/Ethernet) IPv4 address,
 * so the startup logs can show links reachable from other devices on the same network.
 */
const os = require("os");

function getNetworkInterfaces() {
  const all = [];
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        all.push({ name, address: net.address });
      }
    }
  }
  return all;
}

function score(iface) {
  const name = (iface.name || "").toLowerCase();
  if (
    /virtual|vmware|virtualbox|hyper-v|docker|vpn/.test(name) ||
    iface.address.startsWith("169.254")
  ) {
    return -1;
  }
  if (/wi-?fi|wlan|wireless|ethernet/.test(name)) return 1;
  return 0;
}

function getLanIP() {
  const list = getNetworkInterfaces();
  if (!list.length) return null;
  const sorted = list.slice().sort((a, b) => score(b) - score(a));
  return sorted[0].address;
}

module.exports = { getLanIP, getNetworkInterfaces };