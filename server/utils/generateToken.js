import jwt from 'jsonwebtoken';

/**
 * Generates a signed JWT token
 * @param {string} id - The MongoDB User ID
 * @param {string} role - The User Role (admin, manager, or user)
 */
const generateToken = (id, role) => {
  // We include the role in the payload so the frontend knows 
  // which dashboard to render immediately.
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

export default generateToken;