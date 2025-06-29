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

    console.log(uid)

    // Try finding the user
    const user = await User.findOne({ uid: uid });

    if (user) {
      // Existing user: check if profile needs completion
      let isProfileComplete = true;

      // if (role === 'driver') {
      //   const driverProfile = await Driver.findOne({ userId: user._id });
      //   if (!driverProfile) {
      //     isProfileComplete = false;
      //   }
      // }

      // Generate JWT
      const jwtPayload = {
        uid: user.uid,
        email: user.email,
        phone: user.phone,
        role: user.role,
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


export const createProfile = async (req, res) => {
  const { firebaseIdToken, name, role, profilePicture, emergencyContact, addressName, addressType, coordinates } = req.body;

  if (!firebaseIdToken || !role) {
    return res.status(400).json({ message: 'Missing token or role' });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(firebaseIdToken);
    const { uid, email, phone_number: phone } = decodedToken;

    if (!name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user already exists
    let user = await User.findOne({ uid });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Validate location if provided
    let formattedLocation = undefined;
    if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
      formattedLocation = {
        type: 'Point',
        coordinates: coordinates
      };
    }
    console.log(formattedLocation)
    // Create new user
    user = new User({
      uid,
      name,
      phone,
      email,
      role,
      profilePicture,
      emergencyContact,
      addressName: addressName || null,
      addressType: addressType || 'home',
      location: formattedLocation
    });

    await user.save();

    return res.status(201).json({ message: 'Profile created successfully', user });
  } catch (err) {
    console.error('Error creating profile:', err);
    return res.status(500).json({ message: 'Failed to create profile' });
  }
};



