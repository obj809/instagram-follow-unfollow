// src/utils/igParse.js

/**
 * Read a File (Blob) as text (client-side).
 */
export function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(String(fr.result || ""));
      fr.onerror = reject;
      fr.readAsText(file);
    });
  }
  
  /**
   * Parse Instagram JSON export.
   * Expected shapes commonly seen:
   * [
   *   { "string_list_data": [{ "value": "username", "href": "...", "timestamp": 1736... }] },
   *   ...
   * ]
   */
  export function parseInstagramJSON(text) {
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return new Set(); // not valid JSON
    }
    const usernames = new Set();
  
    // Handle array-of-objects format
    if (Array.isArray(data)) {
      for (const item of data) {
        // Common export shape
        const arr = item?.string_list_data;
        if (Array.isArray(arr) && arr.length) {
          const val = (arr[0]?.value || "").trim();
          if (val) usernames.add(val.toLowerCase());
        }
        // Fallbacks
        const value = (item?.value || "").trim();
        if (value) usernames.add(value.toLowerCase());
        const username = (item?.username || "").trim();
        if (username) usernames.add(username.toLowerCase());
      }
    }
  
    // If object with nested arrays (edge cases)
    if (data && !usernames.size) {
      const flattened = JSON.stringify(data);
      const maybe = flattened.match(/"value"\s*:\s*"([^"]+)"/g) || [];
      for (const m of maybe) {
        const val = m.split(':')[1]?.replace(/["\s]/g, "");
        if (val) usernames.add(val.toLowerCase());
      }
    }
  
    return usernames;
  }
  
  /**
   * Parse Instagram HTML export.
   * Tries DOM parsing first, then falls back to regex if DOMParser isn't available.
   * Typical HTML contains <a href="https://www.instagram.com/username">username</a>
   */
  export function parseInstagramHTML(text) {
    const usernames = new Set();
  
    // DOMParser path (browser)
    if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
      try {
        const doc = new DOMParser().parseFromString(text, "text/html");
        const anchors = doc.querySelectorAll("a[href*='instagram.com']");
        anchors.forEach((a) => {
          const href = (a.getAttribute("href") || "").toLowerCase();
          // Prefer the visible anchor text if present
          const visible = (a.textContent || "").trim().toLowerCase();
          if (visible) usernames.add(visible);
  
          // Extract from href path
          const m = href.match(/instagram\.com\/([^/?#"']+)/i);
          if (m?.[1]) usernames.add(m[1].toLowerCase());
        });
      } catch {
        // fall through to regex
      }
    }
  
    // Regex fallback
    if (!usernames.size) {
      const hrefMatches = text.match(/https?:\/\/(?:www\.)?instagram\.com\/([^"'/\s?]+)/gi) || [];
      hrefMatches.forEach((u) => {
        const m = u.match(/instagram\.com\/([^"'/\s?]+)/i);
        if (m?.[1]) usernames.add(m[1].toLowerCase());
      });
    }
  
    return usernames;
  }
  
  /**
   * Auto-detect file type and parse to a Set of usernames (lowercased).
   */
  export async function parseInstagramFile(file) {
    const name = (file?.name || "").toLowerCase();
    const text = await readFileAsText(file);
  
    if (name.endsWith(".json")) {
      return parseInstagramJSON(text);
    }
    if (name.endsWith(".html") || name.endsWith(".htm")) {
      return parseInstagramHTML(text);
    }
    // Last resort: try JSON, then HTML
    const tryJson = parseInstagramJSON(text);
    if (tryJson.size) return tryJson;
    return parseInstagramHTML(text);
  }
  
  /**
   * Compare two sets: following vs followers.
   * - notFollowingYouBack: following minus followers
   * - youDontFollowBack: followers minus following
   */
  export function compareSets(followingSet, followersSet) {
    console.log("Comparing sets", { followingSet, followersSet });
    const notFollowingYouBack = [];
    const youDontFollowBack = [];
  
    followingSet.forEach((u) => {
      if (!followersSet.has(u)) notFollowingYouBack.push(u);
    });
    followersSet.forEach((u) => {
      if (!followingSet.has(u)) youDontFollowBack.push(u);
    });
  
    // Sort for consistent UI
    notFollowingYouBack.sort();
    youDontFollowBack.sort();
  
    return { notFollowingYouBack, youDontFollowBack };
  }
  