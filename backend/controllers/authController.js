import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const adminEmail = (process.env.ADMIN_EMAIL || "")
      .trim()
      .toLowerCase();

    const jwtSecret = process.env.JWT_SECRET || "";
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || "";
    const adminPasswordPlain = process.env.ADMIN_PASSWORD || "";

    if (!adminEmail || !jwtSecret) {
      return res.status(500).json({
        success: false,
        message:
          "Admin authentication is not configured on the server.",
      });
    }

    let passwordValid = false;

    if (adminPasswordHash) {
      passwordValid = bcrypt.compareSync(password, adminPasswordHash);
    } else if (adminPasswordPlain) {
      // Backward-compatible fallback for plaintext env vars
      passwordValid = password === adminPasswordPlain;
    } else {
      return res.status(500).json({
        success: false,
        message:
          "Admin authentication is not configured on the server.",
      });
    }

    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin email or password.",
      });
    }

    const token = jwt.sign(
      {
        role: "ADMIN",
        email: adminEmail,
      },
      jwtSecret,
      {
        expiresIn: "8h",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Admin login successful.",
      token,
      admin: {
        email: adminEmail,
        role: "ADMIN",
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to login admin.",
    });
  }
};

const getCurrentAdmin = (req, res) => {
  return res.status(200).json({
    success: true,
    admin: req.admin,
  });
};

export {
  loginAdmin,
  getCurrentAdmin,
};