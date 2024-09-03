export const htmlEmail = (token: string, websiteURL: string): string => `
<div
  style="
    font-family: Verdana, sans-serif;
    text-align: center;
    color: #ffffff;
  "
>
  <div
    style="background: #fcba03; padding-top: 15px; padding-bottom: 15px;"
  >
    <h2 style="color: #030202d0;">Power Gym | Email verification</h1>
  </div>
  <div
    style="
      background: #030202d0;
      padding-top: 50px;
      padding-right: 15px;
      padding-left: 15px;
      padding-bottom: 50px;
      margin-right: auto;
      margin-left: auto;
    "
  >
    <p style="font-size: 20px; font-weight: 500;">
      You've received this email because you registered your account on the
      Power Gym Website.
    </p>
    <br />
    <p style="font-size: 20px; font-weight: 500;">
      Click on the button below to finish the registration process, if it was
      successfull, you will be redirected to the login page where you can put
      your credentials. (The link expires after 30 minutes.)
    </p>
    <br />
    <a
      style="
        text-decoration: none;
        padding-left: 50px;
        padding-right: 50px;
        padding-top: 15px;
        padding-bottom: 15px;
        border-radius: 20px;
        color: #ffffff;
        background: #ba20b8;
        font-weight: 700;
        font-size: large;
      "
      href="${websiteURL}/api/auth/activate?token=${token}"
    >
      Verify
    </a>
  </div>
  <div
    style="
      padding-top: 10px;
      padding-bottom: 10px;
      background: #fcba03;
      color: #030202d0;
    "
  >
    <div
      style="
        text-align: center;
      "
    >
    </div>
    <p style="font-weight: 600;">
      &copy; Copyright 2023 | Power Gym &#46; All rights reserved
    </p>
  </div>
</div>

`;
