export default function (nickname: string): boolean {
  const validateSymbol = /^[a-z\d\._]*$/.test(nickname);
  const validateSize = nickname.length > 0 && nickname.length <= 16;
  return validateSize && validateSymbol;
}
