export async function onRequestDelete({ env, params }) {
  const nome = decodeURIComponent(params.nome);
  await env.DB.prepare(
    'DELETE FROM categorias WHERE nome = ?'
  ).bind(nome).run();
  return Response.json({ ok: true });
}
