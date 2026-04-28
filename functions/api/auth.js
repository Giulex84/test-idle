// functions/api/auth.js
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });

async function getPiUser(accessToken) {
  const res = await fetch("https://api.minepi.com/v2/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  let data = null;

  try {
    data = await res.json();
  } catch {
    data = { error: "Invalid JSON from Pi API" };
  }

  return {
    ok: res.ok,
    status: res.status,
    data
  };
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const accessToken = String(body?.accessToken || "").trim();
    const walletAddress = body?.walletAddress
      ? String(body.walletAddress).trim()
      : null;

    if (!accessToken) {
      return json(
        {
          ok: false,
          error: "Missing accessToken"
        },
        400
      );
    }

    const me = await getPiUser(accessToken);

    if (!me.ok || !me.data?.uid) {
      return json(
        {
          ok: false,
          error: me.data || "Pi auth verification failed"
        },
        me.status || 401
      );
    }

    const now = new Date().toISOString();
    const uid = String(me.data.uid);
    const username = String(me.data.username || "");
    const usernameLc = username.toLowerCase();
    const scopes = JSON.stringify(me.data?.credentials?.scopes || []);

    await env.DB.prepare(
      `
      INSERT INTO users (
        uid, username, username_lc, wallet_address, scopes,
        created_at, updated_at, last_seen_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(uid) DO UPDATE SET
        username = excluded.username,
        username_lc = excluded.username_lc,
        wallet_address = COALESCE(excluded.wallet_address, users.wallet_address),
        scopes = excluded.scopes,
        updated_at = excluded.updated_at,
        last_seen_at = excluded.last_seen_at
      `
    )
      .bind(
        uid,
        username,
        usernameLc,
        walletAddress,
        scopes,
        now,
        now,
        now
      )
      .run();

    return json({
      ok: true,
      user: {
        uid,
        username,
        wallet_address: walletAddress,
        scopes: me.data?.credentials?.scopes || []
      }
    });
  } catch (error) {
    console.error("AUTH ERROR:", error);

    return json(
      {
        ok: false,
        error: "Server error"
      },
      500
    );
  }
}
