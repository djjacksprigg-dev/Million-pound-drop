import { getStore } from "@netlify/blobs";

// One blob per team, keyed "ROOM/teamId", so teams never overwrite each other.
const ROOM = /^[A-Z0-9]{4}$/;
const ID = /^[a-z0-9]{6,20}$/;
const MAX = 1_000_000;
const BUNDLE = 50_000;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export default async (req) => {
  const store = getStore({ name: "million-pound-drop", consistency: "strong" });
  const url = new URL(req.url);

  if (req.method === "GET") {
    const room = (url.searchParams.get("room") || "").toUpperCase();
    if (!ROOM.test(room)) return json({ error: "Room code must be 4 letters or numbers." }, 400);
    const { blobs } = await store.list({ prefix: `${room}/` });
    const teams = (await Promise.all(blobs.map((b) => store.get(b.key, { type: "json" })))).filter(Boolean);
    return json({ room, teams });
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch {
      return json({ error: "Send the score as JSON." }, 400);
    }
    const room = String(body.room || "").toUpperCase();
    const id = String(body.id || "");
    const team = String(body.team || "").trim().slice(0, 24) || "Team";
    const money = Number(body.money);
    const q = Number(body.q);
    const total = Number(body.total) || 7;
    if (!ROOM.test(room) || !ID.test(id)) return json({ error: "Missing room code or player id." }, 400);
    if (!Number.isInteger(money) || money < 0 || money > MAX || money % BUNDLE !== 0)
      return json({ error: "Money must be a whole number of £50,000 bundles." }, 400);
    if (!Number.isInteger(q) || q < 0 || q > 20) return json({ error: "Question number is out of range." }, 400);

    await store.setJSON(`${room}/${id}`, { id, team, money, q, total, done: !!body.done, updated: Date.now() });
    return json({ ok: true });
  }

  if (req.method === "DELETE") {
    const room = (url.searchParams.get("room") || "").toUpperCase();
    if (!ROOM.test(room)) return json({ error: "Room code must be 4 letters or numbers." }, 400);
    const { blobs } = await store.list({ prefix: `${room}/` });
    await Promise.all(blobs.map((b) => store.delete(b.key)));
    return json({ ok: true, cleared: blobs.length });
  }

  return json({ error: "Method not allowed." }, 405);
};

export const config = { path: "/api/scores" };
