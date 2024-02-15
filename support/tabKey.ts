// Safari uses Alt+Tab vs Tab for webkit
export default function tabKeyForBrowser(browserType: string): string {
  const SafariNames = ["webkit", "Mobile Safari", "Safari"];
  let key = "Tab";

  if (SafariNames.includes(browserType)) {
    key = "Alt+Tab";
  }

  return key;
}
