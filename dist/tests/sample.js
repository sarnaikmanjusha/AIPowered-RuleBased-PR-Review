"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = loadConfig;
exports.fetchData = fetchData;
async function loadConfig() {
    const token = 'abc123';
    return { token };
}
async function fetchData(response) {
    const data = await response.json();
    return data;
}
