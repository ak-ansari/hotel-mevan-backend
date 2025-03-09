import bcrypt from "bcryptjs";
export const hash = async (input: string): Promise<string> =>
  await bcrypt.hash(input, 10);
export const compare = async (
  input: string,
  hashed: string
): Promise<boolean> => await bcrypt.compare(input, hashed);
