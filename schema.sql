-- Tabela de subgrupos
CREATE TABLE IF NOT EXISTS subgrupos (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categorias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL UNIQUE
);

-- Tabela de contas (a pagar e a receber)
CREATE TABLE IF NOT EXISTS contas (
  id TEXT PRIMARY KEY,
  descricao TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK(tipo IN ('pagar','receber')),
  valor REAL NOT NULL,
  valor_total REAL,
  vencimento TEXT,
  referencia TEXT NOT NULL,
  categoria TEXT,
  obs TEXT,
  pago INTEGER NOT NULL DEFAULT 0,
  data_pagamento TEXT,
  valor_pago REAL,
  obs_pagamento TEXT,
  grupo_parcela TEXT,
  num_parcela INTEGER,
  total_parcelas INTEGER,
  subgrupo_id TEXT,
  criado_em TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (subgrupo_id) REFERENCES subgrupos(id) ON DELETE SET NULL
);

-- Categorias padrão
INSERT OR IGNORE INTO categorias (nome) VALUES
  ('Aluguel'),('Energia'),('Água'),('Internet'),
  ('Alimentação'),('Saúde'),('Transporte'),
  ('Salário'),('Serviços'),('Outros');
