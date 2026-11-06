export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    'SELECT nome FROM categorias ORDER BY nome'
  ).all();
  return Response.json(results.map(r => r.nome));
}

export async function onRequestPost({ request, env }) {
  const body = await request.json();
  await env.DB.prepare(
    'INSERT OR IGNORE INTO categorias (nome) VALUES (?)'
  ).bind(body.nome).run();
  return Response.json({ ok: true });
}
