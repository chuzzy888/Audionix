"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const node_sdk_1 = require("@stream-io/node-sdk");
const apiKey = "grs7vtwsg6mr";
const apiSecret = "xk333hpgyccvf55bzdc5a6j32k7536npk5r9atzpxnqxfw8tn7ckh3828v79xq8p";
exports.client = new node_sdk_1.StreamClient(apiKey, apiSecret);
