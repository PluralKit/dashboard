export const randomId = () => {
  return (Math.random() + 1).toString(36).slice(2, 7)
}
