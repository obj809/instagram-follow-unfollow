// backend/compare_instagram_follow_data.js
// Inputs:   ./data/followers_and_following/followers_1.json + following.json
// Outputs:  ./data/results/

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project root = one level up from /backend
const BASE_DIR = path.resolve(__dirname, "..");

// Input/output directories
const DATA_DIR = path.join(BASE_DIR, "data", "followers_and_following");
const RESULTS_DIR = path.join(BASE_DIR, "data", "results");

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

// Helpers
function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}
function saveJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

// Input files (adjust if you change names)
const followersPath = path.join(DATA_DIR, "followers_1.json");
const followingPath = path.join(DATA_DIR, "following.json");

// Debug logging
console.log("📂 Followers file:", path.relative(BASE_DIR, followersPath));
console.log("📂 Following file:", path.relative(BASE_DIR, followingPath));
console.log("📂 Results dir:   ", path.relative(BASE_DIR, RESULTS_DIR));

// Load input files
const followers = new Set(loadJson(followersPath));
const following = new Set(loadJson(followingPath));

// Compute differences
const notFollowingBack = [...following].filter((u) => !followers.has(u));
const notFollowedBack = [...followers].filter((u) => !following.has(u));

// Save outputs
saveJson(path.join(RESULTS_DIR, "not_following_back.json"), notFollowingBack);
saveJson(path.join(RESULTS_DIR, "not_followed_back.json"), notFollowedBack);

console.log(`✅ Results saved in ${path.relative(BASE_DIR, RESULTS_DIR)}`);
