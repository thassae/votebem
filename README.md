# Comparador de Propostas — VoteBem (MVP)

Estrutura mínima de um site estático que exibe uma tabela comparativa de propostas por tema.


Como usar (desenvolvimento com Vite + React + TypeScript + Tailwind)

- Instalar dependências:

```bash
cd comparador-propostas
npm install
```

- Rodar servidor de desenvolvimento (Vite):

```bash
npm run dev
```

- Validar dados JSON contra schemas (permanece disponível):

```bash
npm run validate-data
```

Ao rodar `npm run dev`, abra `http://localhost:5000` (configurado no `vite.config.ts`) para ver a aplicação.

Estrutura principal

- `data/` — arquivos JSON com `temas.json`, `chapas.json`, `perfis.json`, `propostas.json`.
- `schemas/` — JSON Schemas usados na validação.
- `src/` — páginas estáticas e scripts que renderizam a tabela e perfis.
- `scripts/validar-dados.js` — script Node para validar os JSONs.

Observações

- Os exemplos incluídos são minimalistas. Para produção, hospede o conteúdo em CDN e configure cache e CSP conforme descrito no documento de arquitetura.
