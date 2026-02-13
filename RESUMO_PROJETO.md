# OLHAR DA BASE - Resumo do Projeto

## Status Atual: Painel Admin Funcional

---

## O QUE JA FOI FEITO

### 1. Estrutura Base
- Next.js 14 com App Router
- Supabase (banco de dados + storage + auth)
- Tailwind CSS
- Lucide React (icones)

### 2. Autenticacao
- Login com email/senha
- Protecao de rotas admin
- Logout

### 3. CRUD Completo

#### Clubes
- Lista, criar, editar, excluir
- Upload de escudo (bucket: `escudos`)
- Campos: nome, cidade, estado, categoria, contato (nome, email, telefone)

#### Atletas
- Lista, criar, editar, excluir
- Upload de foto com **editor de corte** (arrastar e zoom)
- Bucket: `atletas`
- Campos: nome, data nascimento, posicao, **categoria** (Sub-9 a Profissional), numero camisa, pe dominante, altura, peso
- Badge de categoria na lista de atletas

#### Jogos
- Lista, criar, editar, excluir
- Campos: clube, adversario, data, local, competicao, fase, placar, video_url
- Botao "Assistir" que abre o link do video
- Data corrigida (fuso horario)
- Placar formatado bonito

#### Analises de Jogo
- Lista, criar, editar, excluir
- 7 abas: Org. Ofensiva, Org. Defensiva, Trans. Ofensiva, Trans. Defensiva, BP Ofensiva, BP Defensiva, Conclusoes
- Aba "Prints Taticos" para upload de imagens
- Bucket: `prints`
- Campos detalhados para cada momento do jogo

#### Avaliacoes de Atletas (8 Dimensoes CBF)
- Lista, criar, editar, excluir
- 8 dimensoes: Forca, Velocidade, Tecnica, Dinamica, Inteligencia, 1 contra 1, Atitude, Potencial
- Notas de 0.5 a 5.0 com slider
- Campos: pontos fortes, pontos a desenvolver, observacoes
- Vinculado a atleta e opcionalmente a jogo

### 4. Dashboard Principal (MELHORADO)
- Cards com contagem: Clubes, Atletas, Jogos, Analises, Avaliacoes
- **Grafico Doughnut**: Atletas por Categoria
- **Grafico Barras**: Atletas por Posicao
- **Ultimos Jogos**: Lista com placar colorido (vitoria/derrota/empate)
- **Ultimas Avaliacoes**: Lista com media geral
- Acoes rapidas: Novo Clube, Novo Atleta, Novo Jogo, Nova Avaliacao

### 5. Layout Admin
- Sidebar com menu
- Responsivo (mobile e desktop)
- Logo "Olhar da Base"
- Usuario logado + botao sair

### 6. Dashboard de Atletas (NOVO)
- Filtro para selecionar atleta
- Radar chart com as 8 dimensoes CBF
- Grafico de evolucao ao longo do tempo
- Grafico de media por dimensao
- Card com dados do atleta (idade, altura, peso, media geral)
- Historico de avaliacoes
- Pontos fortes e a desenvolver

### 7. Comparativo de Avaliacoes (NOVO)
- Filtros por clube
- Selecao de atleta para comparar
- **Benchmarks por posicao**: valores de referencia para cada posicao (Goleiro, Zagueiro, etc)
- **Radar comparativo**: atleta vs benchmark vs atleta externo
- **Diferenca do benchmark**: mostra quanto o atleta esta acima ou abaixo do esperado
- **Comparacao com atleta externo**: entrada manual de dados de atletas de outras plataformas
- **Visao geral por posicao**: grafico comparando media dos atletas vs benchmarks

### 8. Conversao Automatica WebP (NOVO)
- Todas as imagens sao convertidas para WebP automaticamente
- Fotos de atletas: qualidade 85%, max 400px
- Escudos de clubes: qualidade 85%, max 400px
- Prints taticos: qualidade 85%, max 1200px
- Reducao significativa no tamanho dos arquivos

---

## BUCKETS SUPABASE NECESSARIOS

Criar no Supabase Dashboard > Storage > New bucket (marcar "Public bucket"):

1. `escudos` - logos dos clubes
2. `atletas` - fotos dos atletas
3. `prints` - prints taticos das analises

---

## BIBLIOTECAS INSTALADAS

```json
{
  "@supabase/supabase-js": "^2.x",
  "@supabase/ssr": "^0.x",
  "lucide-react": "^0.x",
  "react-avatar-editor": "^14.x",
  "chart.js": "^4.x",
  "react-chartjs-2": "^5.x"
}
```

---

## ARQUIVOS PRINCIPAIS

```
src/
├── app/
│   ├── (admin)/
│   │   ├── layout.tsx              # Layout com sidebar
│   │   ├── dashboard/page.tsx      # Dashboard principal
│   │   ├── dashboard-atletas/page.tsx  # Dashboard de evolucao
│   │   ├── dashboard-avaliacoes/page.tsx # Comparativo com benchmarks
│   │   ├── clubes/
│   │   │   ├── page.tsx            # Lista
│   │   │   ├── novo/page.tsx       # Criar (com WebP)
│   │   │   └── [id]/page.tsx       # Editar (com WebP)
│   │   ├── atletas/
│   │   │   ├── page.tsx
│   │   │   ├── novo/page.tsx       # Editor de foto + WebP
│   │   │   └── [id]/page.tsx       # Editor de foto + WebP
│   │   ├── jogos/
│   │   │   ├── page.tsx            # Com botao Assistir
│   │   │   ├── novo/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── analises/
│   │   │   ├── page.tsx
│   │   │   ├── nova/page.tsx       # 7 abas taticas
│   │   │   └── [id]/page.tsx       # 8 abas + prints WebP
│   │   └── avaliacoes/
│   │       ├── page.tsx
│   │       ├── nova/page.tsx       # 8 dimensoes CBF
│   │       └── [id]/page.tsx
│   ├── login/page.tsx
│   ├── page.tsx                    # Pagina publica (portfolio)
│   └── globals.css
└── lib/
    ├── supabase/
    │   ├── client.ts
    │   └── server.ts
    └── imageUtils.ts               # Conversao WebP (NOVO)
```

---

## PROXIMOS PASSOS SUGERIDOS

### Dashboard Avancado de Atletas
- [x] Filtros para selecionar atleta
- [x] Grafico de evolucao das 8 dimensoes ao longo do tempo
- [x] Radar chart com as 8 dimensoes
- [x] Historico de avaliacoes por atleta
- [x] Media geral do atleta
- [x] Grafico de media por dimensao
- [ ] Comparativo entre atletas (selecionar 2 atletas)
- [ ] Ranking de atletas por dimensao
- [ ] Historico de peso e altura (requer nova tabela)

### Integracao Pagina Publica
- [ ] Mostrar analises realizadas dinamicamente
- [ ] Radar chart na pagina publica
- [ ] Modal com detalhes da analise

### Relatorios
- [ ] PDF de avaliacao do atleta
- [ ] PDF de analise de jogo
- [ ] Exportar dados para Excel/CSV

---

## COMO CONTINUAR

1. Abra o terminal na pasta do projeto
2. Rode `npm run dev`
3. Acesse `http://localhost:3000`
4. Continue de onde parou!

---

## SCHEMA DO BANCO (Supabase)

Arquivo: `supabase/001_schema.sql`

Tabelas:
- clubes
- atletas
- jogos
- analises_jogo
- avaliacoes_atleta
- prints_taticos

---

Ultima atualizacao: 11 Fevereiro 2026 (v1.3)

---

## NOTAS DE VERSAO

### v1.3 (11/02/2026)
- **Campo Categoria no Atleta**: Sub-9 ao Sub-17 (todas), Sub-20, Profissional
- Badge de categoria na lista de atletas
- Dashboard Principal melhorado com graficos
- Grafico Doughnut de atletas por categoria
- Grafico de barras de atletas por posicao
- Lista dos ultimos jogos com placar colorido
- Lista das ultimas avaliacoes com media

### v1.2 (11/02/2026)
- Dashboard Comparativo de Avaliacoes
- Benchmarks de referencia por posicao
- Comparacao atleta vs benchmark
- Entrada manual de dados de atletas externos
- Radar comparativo multi-atleta
- Visao geral por posicao

### v1.1 (11/02/2026)
- Dashboard de Evolucao de Atletas com graficos
- Conversao automatica de imagens para WebP
- Radar chart das 8 dimensoes CBF
- Grafico de evolucao ao longo do tempo

### v1.0 (Fevereiro 2026)
- CRUD completo (Clubes, Atletas, Jogos, Analises, Avaliacoes)
- Editor de fotos com crop
- Autenticacao admin
- Layout responsivo
