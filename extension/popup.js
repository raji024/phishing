function extractFeatures(url) {
  const features = [];

  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname;
    const path = parsed.pathname;
    const query = parsed.search;

    // 1. URL length
    features.push(url.length);

    // 2. Hostname length
    features.push(hostname.length);

    // 3. Contains IP address?
    features.push(/(\d{1,3}\.){3}\d{1,3}/.test(hostname) ? 1 : 0);

    // 4. Count of "."
    features.push((hostname.match(/\./g) || []).length);

    // 5. Count of "-"
    features.push((hostname.match(/-/g) || []).length);

    // 6. Count of "@"
    features.push((url.match(/@/g) || []).length);

    // 7. Count of "?"
    features.push((url.match(/\?/g) || []).length);

    // 8. Count of "="
    features.push((url.match(/=/g) || []).length);

    // 9. Count of "&"
    features.push((url.match(/&/g) || []).length);

    // 10. Uses HTTPS token in URL path
    features.push(url.includes("https") && !url.startsWith("https") ? 1 : 0);

    // Pad to 89
    while (features.length < 89) {
      features.push(0);
    }

  } catch (e) {
    console.error("Error parsing URL:", e);
    return new Array(89).fill(0);
  }

  return features;
}
