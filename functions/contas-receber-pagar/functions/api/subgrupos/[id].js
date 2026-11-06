export async function onRequestPut({ request, env, params }) {
  const body = await request.json();
  await env.DB.prepare(
    'UPDATE subgrupos SET nome = ? WHERE id = ?'
  ).bind(body.nome, params.id).run();
  return Response.json({ ok: true });
}

export async function onRequestDelete({ env, params }) {
  await env.DB.prepare(
    'UPDATE contas SET subgrupo_id = NULL WHERE subgrupo_id = ?'
  ).bind(params.id).run();
  await env.DB.prepare(
    'DELETE FROM subgrupos WHERE id = ?'
  ).bind(params.id).run();
  return Response.json({ ok: true });
}
