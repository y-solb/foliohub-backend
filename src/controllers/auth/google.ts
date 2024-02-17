import { google } from "googleapis";
import { Request, Response, NextFunction } from "express";

const REDIRECT_PATH = `/v1/auth/callback/`;
const REDIRECT_URI =
  process.env.NODE_ENV === "development"
    ? `http://localhost:3001${REDIRECT_PATH}`
    : `http://localhost:3001${REDIRECT_PATH}`;

const generators = {
  google() {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${REDIRECT_URI}google`
    );
    const url = oauth2Client.generateAuthUrl({
      scope: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
      ],
    });

    return url;
  },
};

/**
 * Redirect to Social Login Link
 *
 * GET /v1/auth/redirect/:provider (google)
 */
export const socialRedirect = async (req: Request, res: Response) => {
  const { provider } = req.params;

  if (provider !== "google") {
    res.status(400).send();
    return;
  }

  const loginUrl = generators[provider]();
  res.redirect(loginUrl);
};

/**
 * /v1/auth/callback/google
 */
export const googleCallback = async (
  req: Request,
  res: Response
  // next: NextFunction
) => {
  const { code }: { code?: string } = req.query;
  if (!code) {
    res.status(400).send();
    return;
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID || "",
      process.env.GOOGLE_CLIENT_SECRET || "",
      `${REDIRECT_URI}google`
    );
    const { tokens } = await oauth2Client.getToken(code);
    if (!tokens.access_token)
      throw new Error("Failed to retrieve google access token");

    oauth2Client.setCredentials(tokens);
    const { data } = await google
      .oauth2("v2")
      .userinfo.get({ auth: oauth2Client });

    console.log(data);
    res.redirect("http://localhost:3000/");
  } catch (e) {
    res.status(500).send("Internal Error");
  }
};
