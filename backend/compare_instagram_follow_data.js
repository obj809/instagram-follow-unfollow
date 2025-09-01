// backend/compare_instagram_follow_data.js

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_DIR = path.resolve(__dirname, "..");

const DATA_DIR = path.join(BASE_DIR, "data", "followers_and_following");
const RESULTS_DIR = path.join(BASE_DIR, "data", "results");

if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}
function saveJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

const followersPath = path.join(DATA_DIR, "followers_1.json");
const followingPath = path.join(DATA_DIR, "following.json");

console.log("📂 Followers file:", path.relative(BASE_DIR, followersPath));
console.log("📂 Following file:", path.relative(BASE_DIR, followingPath));
console.log("📂 Results dir:   ", path.relative(BASE_DIR, RESULTS_DIR));

const followers = new Set(loadJson(followersPath));
const following = new Set(loadJson(followingPath));

const notFollowingBack = [...following].filter((u) => !followers.has(u));
const notFollowedBack = [...followers].filter((u) => !following.has(u));

saveJson(path.join(RESULTS_DIR, "not_following_back.json"), notFollowingBack);
saveJson(path.join(RESULTS_DIR, "not_followed_back.json"), notFollowedBack);

console.log(`✅ Results saved in ${path.relative(BASE_DIR, RESULTS_DIR)}`);
