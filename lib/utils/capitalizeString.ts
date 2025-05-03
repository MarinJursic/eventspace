import { replaceSpecialWithSpace } from "./sanitizeString";

export function capitalizeString(title: string) {
  let titleCapitalzed = "";

  for (const word of replaceSpecialWithSpace(title).split(" ")) {
    titleCapitalzed +=
      word[0].toUpperCase() +
      word.substring(1, word.length).toLowerCase() +
      " ";
  }

  return titleCapitalzed;
}
