export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    'SELECT * FROM subgrupos ORDER BY nome'
  ).all();
  return Response.json(results);
}

export async function onRequestPost({ request, env }) {
  const body = await request.json();
  await env.DB.prepare(
    'INSERT INTO subgrupos (id, nome) VALUES (?, ?)'
  ).bind(body.id, body.nome).run();
  return Response.json({ ok: true });
}
