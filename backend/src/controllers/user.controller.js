import { prisma } from "../utils/db.js";

export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { platformConnections: true, leads: true }
    });
    
    if (!user) return res.status(404).json({ error: "User not found" });
    
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { 
      firstName, lastName, displayName, gender, customGender, 
      country, timezone, phone, company, industry 
    } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: {
        fullName: displayName || `${firstName} ${lastName}`.trim(),
        gender: gender === "custom" ? customGender : gender,
        customGender,
        country,
        timezone,
        phone,
        company,
        industry,
        profileStepCompleted: true
      }
    });

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    next(error);
  }
};

export const enable2FA = async (req, res, next) => {
  try {
    const { twoFactorType } = req.body; // "authenticator"
    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: {
        twoFactorEnabled: true,
        twoFactorType: twoFactorType || "authenticator"
      }
    });

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    next(error);
  }
};
