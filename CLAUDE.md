# Olhar da Base - Memoria do Projeto

## Sobre o Projeto
Sistema de gestao de atletas de futebol de base. Permite avaliar, acompanhar evolucao, comparar atletas, montar escalacao e dar devolutiva tatica em video/foto. Analista responsavel: certificado CBF Academy.

**Stack:** Next.js 16 (App Router), React 19, Supabase (DB + Auth + Storage), Tailwind CSS v4, Chart.js, html2canvas, Anthropic SDK (Claude).

## Estrutura Principal
```
src/app/
  (admin)/              # Area administrativa
    dashboard/
    dashboard-atletas/
    dashboard-avaliacoes/
    comparar-atletas/
    guia-avaliacao/
    clubes/             # Clubes parceiros
    atletas/            # Cadastro de atletas
    comissao-tecnica/    # Treinador, auxiliar, preparador fisico etc (por clube)
    escalacoes/          # Escalacao com drag-and-drop + exportacao JPG
    jogos/               # Registro de jogos (partidas ja realizadas)
    analises/            # Analises de jogo (adversario)
    avaliacoes/          # Avaliacoes tecnicas (8 dimensoes CBF)
    avaliacao-fisica/
    anotacoes/           # Anotacoes taticas em cima de foto/print de video
    prancheta/           # Prancheta tatica em campo em branco (jogada do zero)
    usuarios/            # Gestao de usuarios (so master)
  (portal)/              # Portal do atleta
    portal/dashboard/
  api/
    usuarios/            # Cria/edita usuario (precisa de SUPABASE_SERVICE_ROLE_KEY, so existe na Vercel)
    analise-ia/          # Gera texto de avaliacao a partir de dados estruturados via Claude (Haiku 4.5)

src/lib/
  formacoes.ts          # Coordenadas das posicoes por formacao (4-3-3, 4-4-2 etc.) pra escalacao
  desenho.ts             # Motor de desenho compartilhado (Anotacoes + Prancheta): tipos de
                          # seta (passe/conducao/corrida), circulo, area, texto, ficha de jogador
                          # (token numerado), + desenharCampo() (gramado/marcacoes via Canvas 2D)

src/components/
  escalacao/EscalacaoEditor.tsx    # Editor de escalacao (drag-and-drop) + template de exportacao
  comissao/ComissaoForm.tsx
  anotacoes/AnotacaoEditor.tsx     # Upload de foto OU video local (captura quadro) + desenho
  prancheta/PranchetaEditor.tsx   # Campo em branco + desenho, usa src/lib/desenho.ts
  desenho/BarraFerramentas.tsx    # Barra de ferramentas de desenho compartilhada
```

## Banco de Dados (Supabase)
- `usuarios` - role: master | analista | atleta | professor. `atleta_id` vincula role=atleta a 1 atleta; `clube_id` vincula role=professor a 1 clube (RLS restringe o professor so a atletas/comissao/escalacoes daquele clube)
- `clubes` - Clubes parceiros
- `atletas` - Dados dos atletas
- `comissao_tecnica` - Staff do clube (treinador, auxiliar, preparador fisico...), reutilizavel em varias escalacoes
- `jogos` - Registro de jogos JA REALIZADOS (com placar). Nao confundir com escalacao (que e pra jogo futuro)
- `escalacoes` / `escalacao_atletas` / `escalacao_staff` - Escalacao com titulares/suplentes/comissao + adversario/competicao/local/horarios (campos proprios, NAO vinculados a `jogos`)
- `analises_jogo` / `prints_taticos` - Analise tatica de ADVERSARIO (7 abas: org. ofensiva/defensiva, transicoes, bolas paradas)
- `avaliacoes_atleta` - Avaliacoes tecnicas (8 dimensoes CBF + OFE/DEF)
- `anotacoes_taticas` - Desenho (formas JSONB) em cima de uma foto/print, vinculado a 1 atleta — devolutiva individual
- `pranchetas` - Desenho (formas JSONB) em campo em branco, vinculado a 1 clube — esquema/jogada do zero

### Campos de Avaliacao Fisica (006_avaliacao_fisica.sql)
- Antropometricos: altura, peso, envergadura
- Velocidade: 10m, 30m
- Potencia: salto vertical, agilidade
- Resistencia: yo-yo test (nivel, distancia)
- Maturacao: idade biologica, estagio PHV
- Flexibilidade: sentar e alcancar

## Papeis de Usuario (RLS)
- **master** - acesso total
- **analista** - cria/edita o que ele mesmo criou (`criado_por`), nao ve o de outros analistas
- **atleta** - so ve o proprio perfil (via `atleta_id` em `usuarios`), fica preso em `/portal`
- **professor** - vinculado a 1 clube (`usuarios.clube_id`). So enxerga/cria Atletas, Comissao Tecnica e Escalacoes DAQUELE clube — nem no menu nem na RLS ele acessa Jogos/Analises/Avaliacoes/outros clubes. Redirecionado pra `/escalacoes` se tentar outra rota. Criar usuario professor: Usuarios > Novo usuario > papel Professor > selecionar clube (precisa de `SUPABASE_SERVICE_ROLE_KEY`, so existe na Vercel — nao da pra criar usuario rodando localmente sem login de master)

Ao adicionar pagina nova em `(admin)/`: se for restrita, incluir em `adminMenu` (layout.tsx) com `hideForProfessor`/`masterOnly` conforme o caso, E adicionar a rota em `src/middleware.ts` (`protectedPaths` + `matcher`) — **isso ja foi esquecido 2x nesta sessao** (escalacoes/comissao-tecnica e avaliacao-fisica ficaram sem redirect de servidor pra usuario deslogado ate serem corrigidas).

## Gotcha: html2canvas + Tailwind v4
O template de exportacao de imagem (escalacao) usa `html2canvas` pra rasterizar um `<div>` escondido. Duas armadilhas reais, ja corrigidas:
- **Nao usar classes Tailwind de espacamento** (`p-*`, `m-*`, `gap-*`) dentro do que sera capturado — Tailwind v4 gera essas classes com `calc(var(--spacing) * N)`, que o html2canvas nao resolve direito (some/vira 0, colando texto/foto). Usar `style={{ margin/padding: Npx }}` inline sempre.
- **Nao usar `display:flex`** no que sera capturado — suporte incompleto no html2canvas. Usar `float`/`position:absolute`/block normal.
- Gradiente CSS tambem nao renderiza bem — o campo da escalacao usa SVG (rects) em vez de `background: linear-gradient`.
- Fotos de outro dominio (Supabase Storage) precisam de `crossOrigin="anonymous"` na tag `<img>` + `useCORS: true` no html2canvas, senao ficam pretas.
- A Prancheta/Anotacoes NAO tem esse problema — usam `<canvas>` nativo (Canvas 2D API) em vez de html2canvas, o que e mais robusto. Preferir canvas nativo a html2canvas em features novas se possivel.

## Padroes de Responsividade
- Titulos: `text-xl sm:text-2xl lg:text-3xl`
- Padding: `p-3 sm:p-4` ou `p-4 sm:p-6`
- Gaps: `gap-3 sm:gap-4`
- Grids: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Icones: `w-4 h-4 sm:w-5 sm:h-5`
- Botoes: stack no mobile com texto reduzido (`hidden sm:inline`)
- Cards: `flex-col sm:flex-row` para empilhar no mobile
- Layout padding: `p-3 sm:p-4 md:p-6 lg:p-8`

Commits recentes: ver `git log` — nao manter lista manual aqui (fica desatualizada rapido).

## Seeds de teste
`supabase/seed-teste-atletas.sql` cria 22 atletas ficticios (2 por posicao, nome = a posicao) + 3 da comissao tecnica pro clube "Esporte Clube Laranja Mecanica", todos marcados `(Teste)` no nome pra limpar depois com `DELETE ... WHERE nome LIKE '%(Teste)%'`.

## Deploy
- Hospedado na Vercel, deploy automatico a cada push em `main`
- Variaveis de ambiente (Vercel):
  - `SUPABASE_SERVICE_ROLE_KEY` - so existe la, necessaria pra `/api/usuarios` criar conta de auth
  - `ANTHROPIC_API_KEY` - necessaria pra `/api/analise-ia`
  - `RESEND_API_KEY` / `RESEND_FROM_EMAIL` - envio de emails
- Buckets do Supabase Storage (todos publicos): `escudos`, `atletas`, `prints`, `comissao`, `anotacoes`, `pranchetas`. Criar via SQL as vezes falha por permissao em `storage.objects` — nesse caso criar manualmente pelo painel (Storage > New bucket > marcar "Public bucket")

## Proximos Passos / Pendencias
- [ ] Implementar campos de avaliacao fisica no frontend
- [ ] Testar responsividade em dispositivos reais
- [ ] Validar exportacao JPG da escalacao com elenco completo (11 titulares + suplentes + comissao)
