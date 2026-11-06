const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    if (method === 'OPTIONS') return new Response(null, { headers: CORS });

    if (path === '/' || path === '/index.html') {
      return env.ASSETS.fetch(request);
    }

    // SUBGRUPOS
    if (path === '/api/subgrupos') {
      if (method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM subgrupos ORDER BY nome').all();
        return json(results);
      }
      if (method === 'POST') {
        const body = await request.json();
        await env.DB.prepare('INSERT INTO subgrupos (id, nome) VALUES (?, ?)').bind(body.id, body.nome).run();
        return json({ ok: true });
      }
    }
    if (path.startsWith('/api/subgrupos/')) {
      const id = path.split('/')[3];
      if (method === 'PUT') {
        const body = await request.json();
        await env.DB.prepare('UPDATE subgrupos SET nome = ? WHERE id = ?').bind(body.nome, id).run();
        return json({ ok: true });
      }
      if (method === 'DELETE') {
        await env.DB.prepare('UPDATE contas SET subgrupo_id = NULL WHERE subgrupo_id = ?').bind(id).run();
        await env.DB.prepare('DELETE FROM subgrupos WHERE id = ?').bind(id).run();
        return json({ ok: true });
      }
    }

    // CATEGORIAS
    if (path === '/api/categorias') {
      if (method === 'GET') {
        const { results } = await env.DB.prepare('SELECT nome FROM categorias ORDER BY nome').all();
        return json(results.map(r => r.nome));
      }
      if (method === 'POST') {
        const body = await request.json();
        await env.DB.prepare('INSERT OR IGNORE INTO categorias (nome) VALUES (?)').bind(body.nome).run();
        return json({ ok: true });
      }
    }
    if (path.startsWith('/api/categorias/')) {
      const nome = decodeURIComponent(path.split('/')[3]);
      if (method === 'DELETE') {
        await env.DB.prepare('DELETE FROM categorias WHERE nome = ?').bind(nome).run();
        return json({ ok: true });
      }
    }

    // CONTAS
    if (path === '/api/contas') {
      if (method === 'GET') {
        const { results } = await env.DB.prepare(`
          SELECT c.*, s.nome as subgrupo_nome FROM contas c
          LEFT JOIN subgrupos s ON c.subgrupo_id = s.id
          ORDER BY c.referencia DESC, c.vencimento ASC
        `).all();
        return json(results.map(r => ({
          id: r.id, descricao: r.descricao, tipo: r.tipo, valor: r.valor,
          valorTotal: r.valor_total, vencimento: r.vencimento, referencia: r.referencia,
          categoria: r.categoria, obs: r.obs, pago: r.pago === 1,
          dataPagamento: r.data_pagamento, valorPago: r.valor_pago,
          obsPagamento: r.obs_pagamento, grupoParcela: r.grupo_parcela,
          numParcela: r.num_parcela, totalParcelas: r.total_parcelas, subgrupo: r.subgrupo_id,
        })));
      }
      if (method === 'POST') {
        const body = await request.json();
        const lista = Array.isArray(body) ? body : [body];
        const stmt = env.DB.prepare(`INSERT INTO contas (id,descricao,tipo,valor,valor_total,vencimento,referencia,categoria,obs,pago,grupo_parcela,num_parcela,total_parcelas,subgrupo_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);
        for (const c of lista) {
          await stmt.bind(c.id,c.descricao,c.tipo,c.valor,c.