import * as fs from "fs";

/*
 * Given a filename, encoding, and a filter callback, return an array of links
 * from the sitemap xml
 */
export default function getSitemapLinks(
  filename: string,
  encoding: BufferEncoding = "utf-8",
  filterCallback: (link: string) => boolean = (link: string) => link !== "",
) {
  return fs.readFileSync(filename, encoding).split("\n").filter(filterCallback);
}
