// Safari uses Alt+Tab vs Tab for webkit
export default function tabKeyForBrowser(browserType: string) {
    let key = "Tab";
    if (browserType === "webkit") {
        key = "Alt+Tab";
    }

    return key;
}
