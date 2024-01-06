export {};
declare global {
  interface Array<T> {
    shuffle(): Array<T>;
    asc(): Array<T>;
  }
}

Array.prototype.shuffle = function () {
  let length = this.length;
  while (length) {
    const index = Math.floor(length-- * Math.random());
    const temp = this[length];
    this[length] = this[index];
    this[index] = temp;
  }
  return this;
};

Array.prototype.asc = function () {
  return this.sort((a, b) => a - b);
};
