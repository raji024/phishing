// Extracts 89 features from the URL
function extractFeatures(url) {
  const features = [];
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname;
    const path = parsed.pathname;

    features.push(url.length); // 1
    features.push(hostname.length); // 2
    features.push(/(\d{1,3}\.){3}\d{1,3}/.test(hostname) ? 1 : 0); // 3
    features.push((url.match(/\./g) || []).length); // 4
    features.push((url.match(/-/g) || []).length); // 5
    features.push((url.match(/@/g) || []).length); // 6
    features.push((url.match(/\?/g) || []).length); // 7
    features.push((url.match(/&/g) || []).length); // 8
    features.push((url.match(/\|/g) || []).length); // 9
    features.push((url.match(/=/g) || []).length); // 10
    features.push((url.match(/_/g) || []).length); // 11
    features.push((url.match(/~/g) || []).length); // 12
    features.push((url.match(/%/g) || []).length); // 13
    features.push((url.match(/\//g) || []).length); // 14
    features.push((url.match(/\*/g) || []).length); // 15
    features.push((url.match(/:/g) || []).length); // 16
    features.push((url.match(/,/g) || []).length); // 17
    features.push((url.match(/;/g) || []).length); // 18
    features.push((url.match(/\$/g) || []).length); // 19
    features.push((url.match(/ /g) || []).length); // 20

    features.push(url.includes("www") ? 1 : 0); // 21
    features.push(url.includes(".com") ? 1 : 0); // 22
    features.push(url.includes("//") ? 1 : 0); // 23
    features.push(path.includes("http") ? 1 : 0); // 24
    features.push(url.includes("https") && !url.startsWith("https") ? 1 : 0); // 25

    const digitCount = (url.match(/\d/g) || []).length;
    features.push(url.length > 0 ? digitCount / url.length : 0); // 26

    const digitHost = (hostname.match(/\d/g) || []).length;
    features.push(hostname.length > 0 ? digitHost / hostname.length : 0); // 27

    features.push(hostname.includes("xn--") ? 1 : 0); // 28
    features.push(parsed.port ? 1 : 0); // 29

    const parts = hostname.split(".");
    features.push(path.match(/\.(com|net|org)/) ? 1 : 0); // 30
    features.push(parts.length > 2 && parts[0].match(/\.(com|net|org)/) ? 1 : 0); // 31
    features.push(parts.length > 2 ? 1 : 0); // 32
    features.push(parts.length - 2); // 33

    features.push(hostname.includes("-") ? 1 : 0); // 34
    features.push(0); // 35. Random domain placeholder
    features.push(url.match(/bit\.ly|goo\.gl|tinyurl/) ? 1 : 0); // 36
    features.push(path.split("/").pop().includes(".") ? 1 : 0); // 37

    while (features.length < 89) features.push(0);
  } catch (e) {
    console.error("Feature extraction error:", e);
    return new Array(89).fill(0);
  }
  return features;
}

// ✅ Button click
document.getElementById("checkBtn").addEventListener("click", async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = tab.url;

    const features = extractFeatures(url);

    // Update popup
    document.getElementById("result").innerText = "Checking...";

    const res = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ features: features })
    });

    const data = await res.json();

    document.getElementById("result").innerText = `Prediction: ${data.prediction}`;
  } catch (err) {
    document.getElementById("result").innerText = "Error contacting server.";
    console.error("Extension error:", err);
  }
});
