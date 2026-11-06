export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(`
    SELECT c.*, s.nome as subgrupo_nome
    FROM contas c
    LEFT JOIN subgrupos s ON c.subgrupo_id = s.id
    ORDER BY c.referencia DESC, c.vencimento ASC
  `).all();
  return Response.json(results.map(r => ({
    id: r.id,
    descricao: r.descricao,
    tipo: r.tipo,
    valor: r.valor,
    valorTotal: r.valor_total,
    vencimento: r.vencimento,
    referencia: r.referencia,
    categoria: r.categoria,
    obs: r.obs,
    pago: r.pago === 1,
    dataPagamento: r.data_pagamento,
    valorPago: r.valor_pago,
    obsPagamento: r.obs_pagamento,
    grupoParcela: r.grupo_parcela,
    numParcela: r.num_parcela,
    totalParcelas: r.total_parcelas,
    subgrupo: r.subgrupo_id,
  })));
}

export async function onRequestPost({ request, env }) {
  const body = await request.json();
  const lista = Array.isArray(body) ? body : [body];
  const sql = [
    'INSERT INTO contas',
    '(id, descricao, tipo, valor, valor_total, vencimento,',
    ' referencia, categoria, obs, pago, grupo_parcela,',
    ' num_parcela, total_parcelas, subgrupo_id)',
    'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  ].join(' ');
  const stmt = env.DB.prepare(sql);
  for (const c of lista) {
    await stmt.bind(
      c.id,
      c.descricao,
      c.tipo,
      c.valor,
      c.valorTotal || null,
      c.vencimento || null,
      c.referencia,
      c.categoria || null,
      c.obs || null,
      c.pago ? 1 : 0,
      c.grupoParcela || null,
      c.numParcela || null,
      c.totalParcelas || null,
      c.subgrupo || null
    ).run();
  }
  return Response.json({ ok: true });
}
