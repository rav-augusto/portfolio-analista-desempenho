# Olhar da Base - Memoria do Projeto

## Sobre o Projeto
Sistema de gestao de atletas de futebol de base. Permite avaliar, acompanhar evolucao e comparar atletas.

**Stack:** Next.js, Supabase, Tailwind CSS, Chart.js

## Estrutura Principal
```
src/app/
  (admin)/        # Area administrativa
    analises/     # Analises de jogos
    atletas/      # Cadastro de atletas
    avaliacoes/   # Avaliacoes tecnicas
    clubes/       # Clubes parceiros
    comparar-atletas/
    dashboard-atletas/
    guia-avaliacao/
    jogos/        # Registro de jogos
    usuarios/     # Gestao de usuarios
  (portal)/       # Portal do atleta
    portal/dashboard/
```

## Banco de Dados (Supabase)
- `atletas` - Dados dos atletas
- `avaliacoes_atleta` - Avaliacoes tecnicas (20 criterios CBF + OFE + DEF)
- `clubes` - Clubes parceiros
- `jogos` - Registro de jogos
- `analises` - Analises de desempenho

### Campos de Avaliacao Fisica (006_avaliacao_fisica.sql)
- Antropometricos: altura, peso, envergadura
- Velocidade: 10m, 30m
- Potencia: salto vertical, agilidade
- Resistencia: yo-yo test (nivel, distancia)
- Maturacao: idade biologica, estagio PHV
- Flexibilidade: sentar e alcancar

## Padroes de Responsividade (Aplicados em 01/05/2026)
- Titulos: `text-xl sm:text-2xl lg:text-3xl`
- Padding: `p-3 sm:p-4` ou `p-4 sm:p-6`
- Gaps: `gap-3 sm:gap-4`
- Grids: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Icones: `w-4 h-4 sm:w-5 sm:h-5`
- Botoes: stack no mobile com texto reduzido (`hidden sm:inline`)
- Cards: `flex-col sm:flex-row` para empilhar no mobile
- Layout padding: `p-3 sm:p-4 md:p-6 lg:p-8`

## Commits Recentes
- `06161c3` fix: aplica responsividade em todas as paginas do admin e portal
- `b357b43` fix: recarrega dados do dashboard quando pagina recebe foco
- `b270573` fix: remove pasta admin antiga que servia rota /admin
- `18564a1` fix: adiciona inline-block nos quadrados da legenda
- `76f76b8` fix: usa classes Tailwind para cores dos quadrados da legenda

## Deploy
- Hospedado na Vercel
- Variaveis de ambiente necessarias:
  - `RESEND_API_KEY` - Para envio de emails
  - `RESEND_FROM_EMAIL` - Email remetente (ex: Olhar da Base <onboarding@resend.dev>)

## Proximos Passos / Pendencias
- [ ] Implementar campos de avaliacao fisica no frontend
- [ ] Testar responsividade em dispositivos reais
