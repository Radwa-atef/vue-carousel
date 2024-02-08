export default function randomValue(randoms = []) {
  const randomNum = Math.floor(Math.random() * randoms.length);
  return randoms[randomNum]
}
