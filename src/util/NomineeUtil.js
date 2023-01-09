export function getWinnerValue(nominee) {
  if (nominee["type"] === "song") {
    return nominee["song"]
  }
  if (nominee["type"] === "person" || nominee["type"] === "crew") {
    return nominee["person"];
  }
  return nominee["media"];
}

export function getSubtitle(nominee) {
  if (nominee["type"] === "song" || nominee["type"] === "crew") {
    return nominee["media"]
  }
  if (nominee["type"] === "person") {
    return nominee["media"];
  }
  return nominee["studio"];
}
