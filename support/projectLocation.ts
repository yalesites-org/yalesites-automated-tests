function getProjectName(url: string): string {
  if (!url) {
    return "yalesites-platform";
  }

  return new URL(url).hostname.split(".")[0];
}

export default function getLocationBasedOnUrl() {
  return `../${getProjectName(process.env.YALESITES_URL as string)}`;
}

