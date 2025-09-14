import axios from 'axios';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

const googleAuth = (req, res) => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
        redirect_uri: `${process.env.SERVER_ROOT_URI}/api/auth/google/callback`,
        client_id: process.env.GOOGLE_CLIENT_ID,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"].join(" "),
    };
    const qs = new URLSearchParams(options);
    res.redirect(`${rootUrl}?${qs.toString()}`);
};

const googleAuthCallback = async (req, res) => {
    const code = req.query.code;
    try {
        const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: `${process.env.SERVER_ROOT_URI}/api/auth/google/callback`,
            grant_type: "authorization_code",
        });
        const { id_token, access_token } = tokenResponse.data;

        const googleUserResponse = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
            headers: { Authorization: `Bearer ${id_token}` },
        });
        const googleUser = googleUserResponse.data;

        await db.read();
        let user = db.data.users.find(u => u.googleId === googleUser.id);

        if (!user) {
            user = {
                _id: uuidv4(),
                googleId: googleUser.id,
                name: googleUser.name,
                email: googleUser.email,
                picture: googleUser.picture,
            };
            db.data.users.push(user);
        } else {
            user.name = googleUser.name;
            user.picture = googleUser.picture;
        }
        await db.write();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true, 
            sameSite: 'none', 
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.redirect(process.env.UI_ROOT_URI);
    } catch (error) {
        console.error("Error during Google OAuth callback:", error.response ? error.response.data : error.message);
        res.status(500).send("Authentication failed");
    }
};

const getCurrentUser = async (req, res) => {
    if (req.user) {
        res.json(req.user);
    } else {
        res.status(401).json({ message: 'Not authorized' });
    }
};

const logoutUser = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

export { googleAuth, googleAuthCallback, getCurrentUser, logoutUser };