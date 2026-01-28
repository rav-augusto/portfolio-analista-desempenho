# PLANO DO SISTEMA COMPLETO - PLATAFORMA DE ANÁLISE DE DESEMPENHO

## Data: 27/01/2026

---

## VISÃO GERAL

Sistema web completo para análise de desempenho de futebol, onde:
- **Analista** (você) gerencia análises, clubes e atletas
- **Clubes** acessam com login/senha para ver suas análises
- **Dashboard** mostra evolução dos atletas ao longo do tempo

---

## ARQUITETURA TÉCNICA

```
┌─────────────────────────────────────────────────────────────────┐
│                         SISTEMA COMPLETO                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  FRONTEND (Vercel - Grátis)                                      │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Next.js / React                                           │  │
│  │  • Página pública (portfólio)                              │  │
│  │  • Login para clubes                                       │  │
│  │  • Dashboard do clube                                      │  │
│  │  • Painel admin (você)                                     │  │
│  └────────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  BACKEND + DATABASE (Supabase - Grátis)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │   Database   │  │   Storage    │  │     Auth     │            │
│  │   500MB      │  │    1GB       │  │   50k users  │            │
│  │              │  │              │  │              │            │
│  │ • Usuários   │  │ • Fotos      │  │ • Login      │            │
│  │ • Clubes     │  │   atletas    │  │ • Sessões    │            │
│  │ • Atletas    │  │ • Escudos    │  │ • Permissões │            │
│  │ • Análises   │  │ • Prints     │  │ • Tokens     │            │
│  │ • Avaliações │  │   táticos    │  │              │            │
│  │ • Evolução   │  │              │  │              │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                  │
│  SERVIÇOS EXTERNOS (Grátis)                                      │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  YouTube (não listado) = Vídeos completos dos jogos        │  │
│  │  Cloudinary (opcional) = Backup de imagens (25GB grátis)   │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  GERADO NO NAVEGADOR (0 bytes de armazenamento)                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  • Gráficos Radar (Canvas/Chart.js)                        │  │
│  │  • Gráficos de evolução (linha do tempo)                   │  │
│  │  • Comparativos entre análises                             │  │
│  │  • Exportação PDF (gerado no browser)                      │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## ESTRUTURA DO BANCO DE DADOS

### Tabela: usuarios
```sql
id              UUID (PK)
email           VARCHAR(255) UNIQUE
nome            VARCHAR(255)
tipo            ENUM('admin', 'clube')
clube_id        UUID (FK) -- NULL para admin
created_at      TIMESTAMP
```

### Tabela: clubes
```sql
id              UUID (PK)
nome            VARCHAR(255)
escudo_url      VARCHAR(500)
cidade          VARCHAR(100)
estado          VARCHAR(2)
categoria       VARCHAR(50) -- Ex: "Sub-16", "Sub-17"
contato_nome    VARCHAR(255)
contato_email   VARCHAR(255)
contato_telefone VARCHAR(20)
ativo           BOOLEAN
created_at      TIMESTAMP
```

### Tabela: atletas
```sql
id              UUID (PK)
clube_id        UUID (FK)
nome            VARCHAR(255)
foto_url        VARCHAR(500)
data_nascimento DATE
posicao         VARCHAR(50)
numero_camisa   INTEGER
pe_dominante    ENUM('direito', 'esquerdo', 'ambidestro')
altura          DECIMAL(3,2)
peso            DECIMAL(4,1)
ativo           BOOLEAN
created_at      TIMESTAMP
```

### Tabela: jogos
```sql
id              UUID (PK)
clube_id        UUID (FK)
competicao      VARCHAR(255)
fase            VARCHAR(100) -- Ex: "Final", "Semifinal", "Fase de grupos"
data_jogo       DATE
local           VARCHAR(255)
adversario      VARCHAR(255)
placar_clube    INTEGER
placar_adversario INTEGER
video_url       VARCHAR(500) -- Link YouTube
created_at      TIMESTAMP
```

### Tabela: analises_jogo
```sql
id              UUID (PK)
jogo_id         UUID (FK)
-- Organização Ofensiva
sistema_tatico          VARCHAR(20) -- Ex: "1-4-3-3"
org_ofensiva_obs        TEXT
saida_bola              TEXT
participacao_goleiro    TEXT
linhas_passe            TEXT
amplitude               TEXT
criacao_central         TEXT
criacao_direita         TEXT
criacao_esquerda        TEXT
finalizacoes_total      INTEGER
finalizacoes_gol        INTEGER
finalizacoes_fora       INTEGER
finalizacoes_bloqueadas INTEGER
-- Organização Defensiva
bloco_defensivo         VARCHAR(20) -- Alto/Médio/Baixo
org_defensiva_obs       TEXT
tipo_marcacao           VARCHAR(50)
pressao                 VARCHAR(50)
coberturas              TEXT
linha_defensiva         TEXT
vulnerabilidades        TEXT
-- Transição Ofensiva
trans_ofensiva_obs      TEXT
primeira_acao           VARCHAR(50)
velocidade_transicao    VARCHAR(50)
contra_ataques          INTEGER
contra_ataques_finalizados INTEGER
gols_contra_ataque      INTEGER
-- Transição Defensiva
trans_defensiva_obs     TEXT
reacao_perda            TEXT
tempo_reacao            VARCHAR(50)
-- Bolas Paradas Ofensivas
escanteio_cobrador      VARCHAR(100)
escanteio_tipo          VARCHAR(50)
escanteio_movimentacoes TEXT
faltas_caracteristicas  TEXT
-- Bolas Paradas Defensivas
escanteio_def_marcacao  VARCHAR(50)
escanteio_def_posicao_gk TEXT
escanteio_def_primeiro_pau VARCHAR(50)
escanteio_def_segundo_pau VARCHAR(50)
bp_vulnerabilidades     TEXT
-- Geral
conclusoes              TEXT
recomendacoes_treino    TEXT
created_at              TIMESTAMP
updated_at              TIMESTAMP
```

### Tabela: avaliacoes_atleta
```sql
id              UUID (PK)
atleta_id       UUID (FK)
jogo_id         UUID (FK) -- Pode ser NULL para avaliação de treino
data_avaliacao  DATE
tipo            ENUM('jogo', 'treino', 'geral')
-- 8 Dimensões CBF (notas de 0.5 a 5.0)
forca           DECIMAL(2,1)
velocidade      DECIMAL(2,1)
tecnica         DECIMAL(2,1)
dinamica        DECIMAL(2,1)
inteligencia    DECIMAL(2,1)
um_contra_um    DECIMAL(2,1)
atitude         DECIMAL(2,1)
potencial       DECIMAL(2,1)
media           DECIMAL(2,1) -- Calculada automaticamente
-- Observações
pontos_fortes   TEXT
pontos_desenvolver TEXT
observacoes     TEXT
created_at      TIMESTAMP
```

### Tabela: prints_taticos
```sql
id              UUID (PK)
analise_id      UUID (FK)
imagem_url      VARCHAR(500)
descricao       TEXT
momento         VARCHAR(50) -- ofensiva, defensiva, transicao, bola_parada
tempo_jogo      VARCHAR(10) -- Ex: "23:45"
created_at      TIMESTAMP
```

---

## FUNCIONALIDADES POR FASE

### FASE 1 - MVP (Mínimo Viável)
- [x] Site portfólio estático (FEITO)
- [ ] Migrar para Next.js
- [ ] Integrar Supabase
- [ ] Login para admin (você)
- [ ] CRUD de clubes
- [ ] CRUD de análises de jogo
- [ ] Página pública do portfólio

### FASE 2 - Acesso dos Clubes
- [ ] Login para clubes
- [ ] Dashboard do clube
- [ ] Visualização de análises
- [ ] Lista de atletas do clube
- [ ] Gráficos radar por atleta

### FASE 3 - Evolução e Histórico
- [ ] Histórico de avaliações por atleta
- [ ] Gráfico de evolução ao longo do tempo
- [ ] Comparativo entre análises
- [ ] Indicadores de melhora/piora

### FASE 4 - Recursos Avançados
- [ ] Exportação de relatórios em PDF
- [ ] Notificações por email (nova análise disponível)
- [ ] Upload de vídeos curtos (clipes)
- [ ] Comentários em prints táticos
- [ ] App mobile (PWA)

---

## LIMITES DO PLANO GRATUITO

| Recurso | Limite Grátis | Capacidade Estimada |
|---------|---------------|---------------------|
| **Database (Supabase)** | 500MB | ~10.000 análises completas |
| **Storage (Supabase)** | 1GB | ~20.000 fotos de atletas |
| **Auth (Supabase)** | 50.000 usuários | 50.000 logins de clubes |
| **Bandwidth (Supabase)** | 2GB/mês | ~40.000 pageviews/mês |
| **Hosting (Vercel)** | 100GB/mês | ~200.000 visitas/mês |
| **Vídeos (YouTube)** | Ilimitado | ∞ jogos |
| **Gráficos** | Gerado no browser | ∞ |

**Conclusão:** Suficiente para anos de operação no plano grátis.

---

## CUSTOS SE ESCALAR

Se o negócio crescer muito e precisar de upgrade:

| Serviço | Plano Pago | Preço |
|---------|------------|-------|
| Supabase Pro | 8GB database, 100GB storage | $25/mês |
| Vercel Pro | Mais banda, analytics | $20/mês |
| Domínio .com.br | Registro.br | R$40/ano |

**Total se precisar escalar:** ~$45/mês (~R$230/mês)

---

## DOMÍNIO

### Opções Gratuitas (subdomínio)
- seusite.vercel.app
- seusite.netlify.app
- usuario.github.io

### Opções Pagas (domínio próprio)
- .com.br = ~R$40/ano (Registro.br)
- .com = ~R$50/ano (Namecheap, Cloudflare)

**Sugestões de nome:**
- analistadesempenho.com.br
- adperformance.com.br
- seuNomeanalista.com.br

---

## TECNOLOGIAS ESCOLHIDAS

| Camada | Tecnologia | Por quê? |
|--------|------------|----------|
| Frontend | **Next.js 14** | React + SSR + API routes |
| Estilização | **Tailwind CSS** | Rápido, responsivo |
| Database | **Supabase (PostgreSQL)** | Grátis, completo, fácil |
| Auth | **Supabase Auth** | Já integrado |
| Storage | **Supabase Storage** | Já integrado |
| Gráficos | **Chart.js** ou **Recharts** | Leve, customizável |
| Hospedagem | **Vercel** | Grátis, deploy automático |
| Vídeos | **YouTube** | Grátis, ilimitado |

---

## PRÓXIMOS PASSOS

### Amanhã
1. [ ] Decidir nome do projeto/domínio
2. [ ] Criar conta no GitHub (se não tiver)
3. [ ] Criar conta no Supabase
4. [ ] Criar conta no Vercel
5. [ ] Subir site estático atual (portfólio)

### Próxima Semana
1. [ ] Configurar projeto Next.js
2. [ ] Integrar Supabase
3. [ ] Criar estrutura do banco de dados
4. [ ] Implementar login admin
5. [ ] CRUD básico de clubes

### Próximo Mês
1. [ ] CRUD de análises
2. [ ] Login de clubes
3. [ ] Dashboard do clube
4. [ ] Gráficos de evolução

---

## ARQUIVOS DO PROJETO ATUAL

```
C:\Sistemas\Portfolio\
├── index.html          # Site estático atual
├── styles.css          # Estilos
├── script.js           # JavaScript
├── RESUMO_PROJETO.md   # Resumo anterior
└── PLANO_SISTEMA_COMPLETO.md  # Este arquivo
```

---

*Última atualização: 27/01/2026*
*Versão: 1.0*
