import * as bcrypt from 'bcrypt'

/**
 * @description
 * Genera un JWT que dura 180 días utilizando una palabra secreta
 * 
 * @param {Payload} payload - Los datos que se incluirán en el token JWT
 * @returns {string} El token JWT generado
 */
// export function generateToken(payload: Payload) {
//   const options = {
//     expiresIn: "180d",
//   };
//   const token = jwt.sign(payload, process.env.JWT_SECRET, options);
//   return token;
// }

/**
 * @description
 * Hashea la contraseña con bcrypt y un salt de 10
 * 
 * @param {string} password - La contraseña en texto plano que será hasheada
 * @returns {Promise<string>} El hash de la contraseña
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * @description
 * Verifica si la contraseña hasheada es correcta
 * 
 * @param {string} enteredPassword - La contraseña que puso el usuario
 * @param {string} storedHash - La contraseña hasheada
 * @returns {Promise<boolean>} `true` si las contraseñas coinciden, `false` en caso contrario
 */
export const checkPassword = async (enteredPassword: string, storedHash: string): Promise<boolean> => {
  return await bcrypt.compare(enteredPassword, storedHash)
}