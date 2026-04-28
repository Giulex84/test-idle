## Architecture

- **Frontend**: Single-page application (`index.html`) using Pi SDK v2.0.
- **Backend**: Cloudflare Workers (Serverless) for secure API interactions with Pi Network.
- **Database**: Cloudflare D1 for user profile and wallet address persistence.
- **Security**: All payment logic (approve/complete) is handled server-side to ensure transaction integrity.

privacy.html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - Idle Realm</title>
    <style>
        body { font-family: sans-serif; line-height: 1.6; color: #333; padding: 20px; max-width: 800px; margin: auto; }
        h1 { color: #5a6cff; }
        h2 { border-bottom: 1px solid #eee; padding-bottom: 10px; }
        .footer { margin-top: 40px; font-size: 0.9em; color: #777; }
    </style>
</head>
<body>
    <h1>Privacy Policy</h1>
    <p>Last Updated: April 2026</p>

    <p>Idle Realm ("we", "our", or "the App") is committed to protecting your privacy. This policy explains how we handle your information within the Pi Network ecosystem.</p>

    <h2>1. Information We Collect</h2>
    <p>When you authenticate through the Pi Network SDK, we collect the following data:</p>
    <ul>
        <li><strong>Pi Username:</strong> Used to identify you within the game.</li>
        <li><strong>Wallet Address:</strong> Used to verify transactions and manage in-game rewards or purchases.</li>
    </ul>

    <h2>2. How We Use Your Data</h2>
    <p>Your data is used exclusively to:</p>
    <ul>
        <li>Provide and maintain the game's core functionality.</li>
        <li>Process and verify payments made through the Pi Blockchain.</li>
        <li>Save your game progress and prevent data loss.</li>
    </ul>

    <h2>3. Data Storage and Security</h2>
    <p>Unlike previous versions, Idle Realm now utilizes <strong>Cloudflare Workers (Serverless Architecture)</strong> and <strong>Cloudflare D1 Databases</strong> to securely store and process your information. This ensures that your progress and transaction history are protected and accessible only by the App's logic. We do not sell or share your data with third-party advertisers.</p>

    <h2>4. Third-Party Services</h2>
    <p>The App operates within the Pi Browser and uses the Pi Network SDK. Please refer to the Pi Network Privacy Policy for information on how they handle data at the ecosystem level.</p>

    <h2>5. Your Rights</h2>
    <p>You can stop using the App at any time. Since data is tied to your Pi Network identity, you may request information regarding your stored profile by contacting us through the official Pi Network developer channels.</p>

    <div class="footer">
        <p>&copy; 2026 Idle Realm - Developed for the Pi Network Ecosystem.</p>
        <a href="index.html">Back to Game</a>
    </div>
</body>
</html>


terms.html

<!-- terms.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Terms of Service – Idle Realm</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <h1>Terms of Service</h1>

  <p>
    Idle Realm is provided <strong>“as is”</strong>, without warranties of any kind.
  </p>

  <p>
    The developers are not responsible for loss of progress, data, or gameplay
    interruptions caused by browser issues, device changes, or user actions.
  </p>

  <p>
    All in-game resources, progress, and mechanics have no real-world or monetary
    value.
  </p>

  <p>
    Use of this application is entirely at your own risk.
  </p>

  <p>
    Idle Realm is a game intended for entertainment purposes only.
  </p>

  <p>
    This page is fully readable without JavaScript enabled.
  </p>
</body>
</html>
