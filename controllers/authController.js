import jwt from 'jsonwebtoken';
import { adminAuth } from '../utils/firebase.js';
import { User } from '../models/User.js';
import { Driver } from '../models/Driver.js';

export const tokenExchange = async (req, res) => {
  const { firebaseIdToken, role } = req.body;

  if (!firebaseIdToken || !role) {
    return res.status(400).json({ message: 'Missing token or role' });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(firebaseIdToken);
    const { uid, email, phone_number } = decodedToken;

    // Try finding the user
    const user = await User.findOne({
      $or: [{ email }, { phone: phone_number }]
    });

    if (user) {
      // Existing user: check if profile needs completion
      let isProfileComplete = true;

      if (role === 'driver') {
        const driverProfile = await Driver.findOne({ userId: user._id });
        if (!driverProfile) {
          isProfileComplete = false;
        }
      }

      // Generate JWT
      const jwtPayload = {
        uid: user._id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified
      };

      const accessToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
      });

      return res.json({
        accessToken,
        user: jwtPayload,
        requiresProfileSetup: !isProfileComplete
      });
    } else {
      // New user: signal frontend to open registration/profile form
      return res.status(200).json({
        message: 'User not found in database. Needs profile setup.',
        requiresProfileSetup: true,
        tempUser: {
          uid,
          email: email || null,
          phone: phone_number || null,
          role
        }
      });
    }
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(401).json({ message: 'Invalid Firebase token' });
  }
};
