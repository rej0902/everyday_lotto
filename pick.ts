import './types/extension';
export const pick = (size = 6) => {
  let number = Array.from(Array(45), (_, i) => i + 1);

  //extract 6 numbers in number array during each shuffle
  const slots = Array.from(Array(size), () => {
    return number.shuffle().pop();
  }).asc() as number[];

  return slots;
};
