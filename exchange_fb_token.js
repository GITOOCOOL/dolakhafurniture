/**
 * FACEBOOK TOKEN EXCHANGE HELPER
 *
 * This script help you exchange a short-lived User Access Token
 * for a Long-Lived Page Access Token that doesn't expire.
 *
 * 1. Fill in the values below.
 * 2. Run with: node exchange_fb_token.js
 */

const APP_ID = "YOUR_APP_ID";
const APP_SECRET = "YOUR_APP_SECRET";
const USER_TOKEN = "YOUR_USER_TOKEN"; // From Graph API Explorer

async function exchangeTokens() {
  if (APP_ID === "YOUR_APP_ID") {
    console.error(
      "❌ Please fill in your App ID, App Secret, and User Token first.",
    );
    return;
  }

  try {
    console.log("--- Step 1: Getting Long-Lived User Token ---");
    const userExchangeUrl = `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${APP_ID}&client_secret=${APP_SECRET}&fb_exchange_token=${USER_TOKEN}`;

    const userRes = await fetch(userExchangeUrl);
    const userData = await userRes.json();

    if (!userRes.ok) throw new Error(JSON.stringify(userData));

    const longLivedUserToken = userData.access_token;
    console.log("✅ Long-Lived User Token obtained.");

    console.log("\n--- Step 2: Fetching Page Access Tokens ---");
    const pageUrl = `https://graph.facebook.com/v21.0/me/accounts?access_token=${longLivedUserToken}`;
    const pageRes = await fetch(pageUrl);
    const pageData = await pageRes.json();

    if (!pageRes.ok) throw new Error(JSON.stringify(pageData));

    console.log("\n🚀 FOUND PAGES:");
    pageData.data.forEach((page) => {
      console.log(`\n📄 Page Name: ${page.name}`);
      console.log(`🆔 Page ID:   ${page.id}`);
      console.log(`🔑 Token:     ${page.access_token}`);
      console.log("-------------------------------------------");
    });

    console.log(
      '\n✅ DONE! Copy the token for "Dolakha Furniture" and add it to your .env file.',
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

exchangeTokens();
