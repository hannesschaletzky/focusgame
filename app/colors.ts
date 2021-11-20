const colors = [
  "black",
  "gray",
  "red",
  "purple",
  "green",
  "yellow",
  "blue",
  "coral",
  "darkgreen",
  "gold",
  "magenta",
  "aqua",
]

export const getRandomColor = ():string => {
  return colors[Math.floor(Math.random() * colors.length)]
}

