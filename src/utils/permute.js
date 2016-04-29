
// Returns all possible permutations of an array of values.
export default function permute(inp) {
  const permArr = [];
  const usedChars = [];

  function perm(input) {
    let i;
    let ch; // eslint-disable-line
    for (i = 0; i < input.length; i++) {
      ch = input.splice(i, 1)[0];
      usedChars.push(ch);
      if (input.length === 0) {
        permArr.push(usedChars.slice());
      }
      perm(input);
      input.splice(i, 0, ch);
      usedChars.pop();
    }
    return permArr;
  }

  return perm(inp);
}
