export async function onRequestPut({ request, env, params }) {
  const body = await request.json();
  const sql = [
    'UPDATE contas SET',
    'descricao = ?, tipo = ?, valor = ?, vencimento = ?,',
    'referencia = ?, categoria = ?, obs = ?, pago = ?,',
    'data_pagamento = ?, valor_pago = ?,',
    'obs_pagamento = ?, subgrupo_id = ?',
    'WHERE id = ?',
  ].join(' ');
  await env.DB.prepare(sql).bind(
    body.descricao,
    body.tipo,
    body.valor,
    body.vencimento || null,
    body.referencia,
    body.categoria || null,
    body.obs || null,
    body.pago ? 1 : 0,
    body.dataPagamento || null,
    body.valorPago || null,
    body.obsPagamento || null,
    body.subgrupo || null,
    params.id
  ).run();
  return Response.json({ ok: true });
}

export async function onRequestDelete({ request, env, params }) {
  const url = new URL(request.url);
  if (url.searchParams.get('grupo')) {
    const { results } = await env.DB.prepare(
      'SELECT grupo_parcela FROM contas WHERE id = ?'
    ).bind(params.id).all();
    if (results[0] && results[0].grupo_parcela) {
      await env.DB.prepare(
        'DELETE FROM contas WHERE grupo_parcela = ?'
      ).bind(results[0].grupo_parcela).run();
    }
  } else {
    await env.DB.prepare(
      'DELETE FROM contas WHERE id = ?'
    ).bind(params.id).run();
  }
  return Response.json({ ok: true });
}
