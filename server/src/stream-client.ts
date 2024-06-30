import { StreamClient } from "@stream-io/node-sdk";

const apiKey = "grs7vtwsg6mr";
const apiSecret =
  "xk333hpgyccvf55bzdc5a6j32k7536npk5r9atzpxnqxfw8tn7ckh3828v79xq8p";

export const client = new StreamClient(apiKey, apiSecret);
