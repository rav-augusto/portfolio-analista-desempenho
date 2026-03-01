'use client'

import { useState } from 'react'
import {
  BookOpen,
  Target,
  CheckCircle2,
  Eye,
  BarChart3,
  Star,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  AlertTriangle,
  Video,
  ClipboardList,
  FileText,
  Users
} from 'lucide-react'

const categorias = [
  { id: 'sub7', label: 'Sub-7 / Sub-9', idade: '6-9 anos' },
  { id: 'sub11', label: 'Sub-11', idade: '10-11 anos' },
  { id: 'sub13', label: 'Sub-13', idade: '12-13 anos' },
  { id: 'sub15', label: 'Sub-15', idade: '14-15 anos' },
  { id: 'sub17', label: 'Sub-17', idade: '16-17 anos' },
]

const tabs = [
  { id: 'carreira', label: 'Carreira do Analista', icon: Users },
  { id: 'metodo', label: 'Método do Analista', icon: BookOpen },
  { id: 'dimensoes', label: '20 Dimensões', icon: Target },
  { id: 'categorias', label: 'Checklist por Categoria', icon: ClipboardList },
  { id: 'talento', label: 'Identificar Talento', icon: Star },
  { id: 'decisao', label: 'Como Decidir', icon: BarChart3 },
  { id: 'campo', label: 'Guia de Campo', icon: Eye },
]

export default function GuiaAvaliacaoPage() {
  const [activeTab, setActiveTab] = useState('carreira')
  const [categoriaAberta, setCategoriaAberta] = useState<string | null>('sub7')
  const [talentoCategoria, setTalentoCategoria] = useState<string | null>(null)
  const [decisaoCategoria, setDecisaoCategoria] = useState<string | null>(null)

  const toggleCategoria = (id: string) => {
    setCategoriaAberta(categoriaAberta === id ? null : id)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100">Guia de Avaliação</h1>
        <p className="text-slate-400 mt-1">Metodologia completa para análise e avaliação de atletas de base</p>
      </div>

      {/* Tabs */}
      <div className="rounded-2xl shadow-sm mb-6" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
        <div className="p-3" style={{ borderBottom: '1px solid #475569' }}>
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all"
                style={
                  activeTab === tab.id
                    ? { backgroundColor: '#e2e8f0', color: '#1e293b' }
                    : { backgroundColor: '#334155', color: '#94a3b8' }
                }
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Tab Carreira do Analista */}
          {activeTab === 'carreira' && (
            <div className="space-y-8">
              {/* Intro */}
              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl p-6 border border-amber-500/30">
                <h3 className="text-xl font-bold text-amber-400 mb-2">O que é um Analista de Desempenho?</h3>
                <p className="text-slate-300">
                  O analista de desempenho é o profissional responsável por <strong>transformar dados em decisões</strong>.
                  Ele observa, registra, analisa e comunica informações que ajudam treinadores e jogadores a evoluírem.
                  É uma profissão em crescimento no Brasil, com cada vez mais clubes estruturando departamentos de análise.
                </p>
              </div>

              {/* O que clubes buscam */}
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-500" />
                  O que os Clubes Buscam
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <h4 className="font-semibold text-green-400 mb-3">✓ Habilidades Técnicas</h4>
                    <ul className="text-sm text-slate-300 space-y-2">
                      <li>• Domínio de softwares de análise (Wyscout, Hudl, LongoMatch)</li>
                      <li>• Edição de vídeo (cortes, clipes, compilações)</li>
                      <li>• Conhecimento de estatística básica e visualização de dados</li>
                      <li>• Excel/Google Sheets avançado</li>
                      <li>• Apresentações claras e objetivas</li>
                    </ul>
                  </div>
                  <div className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <h4 className="font-semibold text-blue-400 mb-3">✓ Conhecimento de Jogo</h4>
                    <ul className="text-sm text-slate-300 space-y-2">
                      <li>• Compreensão tática profunda (sistemas, princípios)</li>
                      <li>• Leitura de padrões ofensivos e defensivos</li>
                      <li>• Entendimento de transições e bolas paradas</li>
                      <li>• Conhecimento das diferentes posições</li>
                      <li>• Visão crítica para identificar pontos fortes/fracos</li>
                    </ul>
                  </div>
                  <div className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <h4 className="font-semibold text-purple-400 mb-3">✓ Soft Skills</h4>
                    <ul className="text-sm text-slate-300 space-y-2">
                      <li>• Comunicação clara com comissão técnica</li>
                      <li>• Capacidade de síntese (menos é mais)</li>
                      <li>• Trabalho sob pressão e prazos</li>
                      <li>• Discrição e confidencialidade</li>
                      <li>• Proatividade e iniciativa</li>
                    </ul>
                  </div>
                  <div className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <h4 className="font-semibold text-orange-400 mb-3">✓ Diferenciais</h4>
                    <ul className="text-sm text-slate-300 space-y-2">
                      <li>• Certificação CBF Academy</li>
                      <li>• Experiência prévia (mesmo voluntária)</li>
                      <li>• Portfólio com análises reais</li>
                      <li>• Conhecimento de idiomas (inglês/espanhol)</li>
                      <li>• Rede de contatos no futebol</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Construindo Portfolio */}
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-500" />
                  Como Construir seu Portfólio
                </h3>
                <div className="space-y-4">
                  <div className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center font-bold">1</div>
                      <h4 className="font-semibold text-slate-100">Comece Localmente</h4>
                    </div>
                    <p className="text-sm text-slate-400 ml-11">
                      Ofereça trabalho voluntário para times amadores, escolinhas ou categorias de base.
                      A experiência real é mais valiosa que qualquer curso.
                    </p>
                  </div>
                  <div className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center font-bold">2</div>
                      <h4 className="font-semibold text-slate-100">Documente Tudo</h4>
                    </div>
                    <p className="text-sm text-slate-400 ml-11">
                      Crie relatórios em PDF de jogos que você assistir. Análises de partidas da TV,
                      scouts de jogadores, relatórios de adversários. Tudo conta.
                    </p>
                  </div>
                  <div className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center font-bold">3</div>
                      <h4 className="font-semibold text-slate-100">Compartilhe Online</h4>
                    </div>
                    <p className="text-sm text-slate-400 ml-11">
                      LinkedIn, Twitter/X, Instagram. Poste análises táticas, threads, vídeos curtos.
                      Mostre seu olhar único. Seja consistente.
                    </p>
                  </div>
                  <div className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center font-bold">4</div>
                      <h4 className="font-semibold text-slate-100">Faça Networking</h4>
                    </div>
                    <p className="text-sm text-slate-400 ml-11">
                      Participe de comunidades de analistas, eventos, congressos.
                      Conheça pessoas da área. Oportunidades surgem de indicações.
                    </p>
                  </div>
                </div>
              </div>

              {/* Ferramentas */}
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                  <Video className="w-5 h-5 text-amber-500" />
                  Ferramentas do Mercado
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="rounded-lg p-3 text-center shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <p className="font-semibold text-slate-100">Wyscout</p>
                    <p className="text-xs text-slate-400">Vídeo e dados</p>
                  </div>
                  <div className="rounded-lg p-3 text-center shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <p className="font-semibold text-slate-100">Hudl</p>
                    <p className="text-xs text-slate-400">Análise de vídeo</p>
                  </div>
                  <div className="rounded-lg p-3 text-center shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <p className="font-semibold text-slate-100">LongoMatch</p>
                    <p className="text-xs text-slate-400">Tagging gratuito</p>
                  </div>
                  <div className="rounded-lg p-3 text-center shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <p className="font-semibold text-slate-100">Sportscode</p>
                    <p className="text-xs text-slate-400">Elite/profissional</p>
                  </div>
                  <div className="rounded-lg p-3 text-center shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <p className="font-semibold text-slate-100">InStat</p>
                    <p className="text-xs text-slate-400">Dados e estatísticas</p>
                  </div>
                  <div className="rounded-lg p-3 text-center shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <p className="font-semibold text-slate-100">Tactical Pad</p>
                    <p className="text-xs text-slate-400">Diagramas táticos</p>
                  </div>
                  <div className="rounded-lg p-3 text-center shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <p className="font-semibold text-slate-100">Canva/Figma</p>
                    <p className="text-xs text-slate-400">Apresentações</p>
                  </div>
                  <div className="rounded-lg p-3 text-center shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <p className="font-semibold text-slate-100">Excel/Sheets</p>
                    <p className="text-xs text-slate-400">Dados e gráficos</p>
                  </div>
                </div>
              </div>

              {/* Áreas de atuação */}
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-500" />
                  Áreas de Atuação
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-xl p-4 border border-blue-700">
                    <h4 className="font-semibold text-blue-300 mb-2">🏟️ Clubes</h4>
                    <p className="text-sm text-blue-200">
                      Análise de jogos, treinos, adversários. Apoio direto à comissão técnica.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 rounded-xl p-4 border border-green-700">
                    <h4 className="font-semibold text-green-300 mb-2">🔍 Captação/Scout</h4>
                    <p className="text-sm text-green-200">
                      Identificação de talentos, relatórios de mercado, avaliação de atletas.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-xl p-4 border border-purple-700">
                    <h4 className="font-semibold text-purple-300 mb-2">📊 Dados/Tecnologia</h4>
                    <p className="text-sm text-purple-200">
                      Empresas de dados, plataformas de análise, desenvolvimento de ferramentas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Dica final */}
              <div className="bg-green-900/30 rounded-xl p-4 border border-green-700">
                <p className="text-sm text-green-300">
                  <strong>💡 Dica:</strong> O mercado brasileiro está em expansão. A Licença CBF de Analista de Desempenho
                  está se tornando requisito em muitos clubes. Invista em formação contínua e construa sua reputação
                  com trabalho consistente e de qualidade.
                </p>
              </div>
            </div>
          )}

          {/* Tab Método */}
          {activeTab === 'metodo' && (
            <div className="space-y-8">
              {/* Intro */}
              <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
                <p className="text-sm text-slate-300">
                  <strong>Segredo:</strong> Você não analisa "futebol", você analisa o futebol <em>daquele contexto</em>.
                  Cada categoria, cada modelo de jogo, cada adversário exige um olhar específico.
                </p>
              </div>

              {/* Passo 0 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center text-sm font-bold">0</div>
                  <h3 className="text-lg font-semibold text-slate-100">Contexto do Jogo</h3>
                </div>
                <div className="rounded-xl p-4 ml-11 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                  <p className="text-sm text-slate-400 mb-3">Antes de analisar, anote:</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Categoria / idade / tempo de jogo</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Sistema do time e modelo do treinador</strong> (o que ele pede?)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Adversário</strong> (pressiona alto? bloco baixo? transições rápidas?)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Objetivo do dia</strong> (construir? pressionar? defender baixo?)</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Passo 1 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center text-sm font-bold">1</div>
                  <h3 className="text-lg font-semibold text-slate-100">Filmagem Útil</h3>
                  <Video className="w-5 h-5 text-slate-500" />
                </div>
                <div className="rounded-xl p-4 ml-11 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Plano aberto</strong> (pra ver espaço)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Se der: <strong>segundo ângulo "meio-campo"</strong> (pra ver linhas e distâncias)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Áudio ajuda</strong> (comunicação/treinador)</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Passo 2 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center text-sm font-bold">2</div>
                  <h3 className="text-lg font-semibold text-slate-100">Tagging (Marcação de Lances)</h3>
                  <Target className="w-5 h-5 text-slate-500" />
                </div>
                <div className="rounded-xl p-4 ml-11 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                  <p className="text-sm text-slate-400 mb-3">Marque sempre em 3 camadas:</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="rounded-lg p-3 shadow-sm" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                      <p className="font-medium text-sm text-slate-100 mb-1">Ações com bola</p>
                      <p className="text-xs text-slate-500">1v1, passe, condução, finalização, cruzamento</p>
                    </div>
                    <div className="rounded-lg p-3 shadow-sm" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                      <p className="font-medium text-sm text-slate-100 mb-1">Ações sem bola</p>
                      <p className="text-xs text-slate-500">Desmarque, cobertura, pressão, posicionamento</p>
                    </div>
                    <div className="rounded-lg p-3 shadow-sm" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                      <p className="font-medium text-sm text-slate-100 mb-1">Momentos do jogo</p>
                      <p className="text-xs text-slate-500">Org. ofensiva/defensiva, transição, bola parada</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Passo 3 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center text-sm font-bold">3</div>
                  <h3 className="text-lg font-semibold text-slate-100">Clipes Curtos e "Ensináveis"</h3>
                </div>
                <div className="rounded-xl p-4 ml-11 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-sm text-slate-100 mb-2">Por atleta (base)</p>
                      <p className="text-2xl font-bold text-amber-500">8-15 clipes</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-slate-100 mb-2">Coletivo por tema</p>
                      <p className="text-2xl font-bold text-amber-500">6-10 clipes</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-yellow-900/30 rounded-lg border border-yellow-700">
                    <p className="text-sm text-yellow-300">
                      <strong>Sempre com:</strong> o que foi feito + por que foi bom/ruim + alternativa
                    </p>
                  </div>
                </div>
              </div>

              {/* Passo 4 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center text-sm font-bold">4</div>
                  <h3 className="text-lg font-semibold text-slate-100">Relatório</h3>
                  <FileText className="w-5 h-5 text-slate-500" />
                </div>
                <div className="rounded-xl p-4 ml-11 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                  <p className="text-sm text-slate-400 mb-3">Base não é relatório gigante: é <strong>clareza</strong>.</p>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-amber-500 text-slate-900 flex items-center justify-center text-xs font-bold">5</span>
                      <span>pontos do time</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-amber-500 text-slate-900 flex items-center justify-center text-xs font-bold">3</span>
                      <span>pontos por setor (defesa/meio/ataque) ou por função</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-amber-500 text-slate-900 flex items-center justify-center text-xs font-bold">3</span>
                      <span>metas de treino "treináveis" (o treinador consegue aplicar amanha)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab Dimensões */}
          {activeTab === 'dimensoes' && (
            <div className="space-y-8">
              {/* Intro */}
              <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
                <p className="text-sm text-slate-300">
                  O sistema avalia atletas em <strong>20 dimensões</strong> divididas em 3 grupos:
                  <span className="text-amber-400 font-medium"> CBF (8)</span>,
                  <span className="text-green-400 font-medium"> Ofensivas (6)</span> e
                  <span className="text-red-400 font-medium"> Defensivas (6)</span>.
                  Cada dimensão recebe nota de 1 a 5 e é comparada com benchmarks por categoria.
                </p>
              </div>

              {/* CBF - 8 dimensões */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30">
                    <span className="text-amber-400 font-bold">CBF</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-100">8 Dimensões Técnico-Comportamentais</h3>
                </div>
                <p className="text-sm text-slate-400 mb-4">Baseadas na metodologia da CBF Academy para formação de jogadores de base.</p>

                <div className="space-y-6">
                  {/* Força */}
                  <div className="rounded-xl p-5 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">💪</span>
                      <div>
                        <h4 className="font-bold text-amber-400 text-lg">Força</h4>
                        <p className="text-xs text-slate-400">Capacidade física de disputar bolas, manter posição corporal, resistir a cargas e proteger a bola</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 mt-4">
                      <div className="flex items-start gap-3 p-3 bg-purple-900/30 rounded-lg border border-purple-700">
                        <span className="text-purple-400 font-bold text-lg w-6">5</span>
                        <div>
                          <p className="text-sm font-medium text-purple-300">Excelente - Diferencial claro</p>
                          <p className="text-xs text-purple-200 mt-1">Domina fisicamente todos os duelos. Nunca é deslocado. Protege a bola com o corpo de forma natural. Ganha divididas aéreas e terrestres com facilidade. Impõe respeito físico aos adversários.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-green-900/30 rounded-lg border border-green-700">
                        <span className="text-green-400 font-bold text-lg w-6">4</span>
                        <div>
                          <p className="text-sm font-medium text-green-300">Acima da média - Destaque positivo</p>
                          <p className="text-xs text-green-200 mt-1">Vence a maioria dos duelos físicos. Consegue proteger a bola sob pressão. Raramente é deslocado. Ganha divididas contra adversários do mesmo porte.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-900/30 rounded-lg border border-blue-700">
                        <span className="text-blue-400 font-bold text-lg w-6">3</span>
                        <div>
                          <p className="text-sm font-medium text-blue-300">Na média - Adequado para idade</p>
                          <p className="text-xs text-blue-200 mt-1">Disputa bem quando bem posicionado. Ganha algumas divididas e perde outras. Consegue manter a bola em situações normais. Não se destaca nem compromete.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-orange-900/30 rounded-lg border border-orange-700">
                        <span className="text-orange-400 font-bold text-lg w-6">2</span>
                        <div>
                          <p className="text-sm font-medium text-orange-300">Abaixo - Precisa desenvolver</p>
                          <p className="text-xs text-orange-200 mt-1">Perde maioria das divididas. É deslocado com facilidade. Tem dificuldade em proteger a bola. Evita contato quando possível.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-red-900/30 rounded-lg border border-red-700">
                        <span className="text-red-400 font-bold text-lg w-6">1</span>
                        <div>
                          <p className="text-sm font-medium text-red-300">Muito abaixo - Deficiência clara</p>
                          <p className="text-xs text-red-200 mt-1">Evita qualquer contato físico. Perde todas as divididas. Não consegue manter posição. Cai facilmente. Fisicamente muito inferior aos demais.</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 rounded-lg shadow-sm" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                      <p className="text-xs text-slate-400"><strong>⚠️ Atenção por idade:</strong> U11-U13 não supervalorize - diferenças físicas são muito influenciadas pela maturação. U15+ a força se torna mais relevante e estável.</p>
                    </div>
                  </div>

                  {/* Velocidade */}
                  <div className="rounded-xl p-5 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">⚡</span>
                      <div>
                        <h4 className="font-bold text-amber-400 text-lg">Velocidade</h4>
                        <p className="text-xs text-slate-400">Rapidez em sprints, capacidade de aceleração, mudanças de direção e velocidade de reação</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 mt-4">
                      <div className="flex items-start gap-3 p-3 bg-purple-900/30 rounded-lg border border-purple-700">
                        <span className="text-purple-400 font-bold text-lg w-6">5</span>
                        <div>
                          <p className="text-sm font-medium text-purple-300">Excelente - Diferencial claro</p>
                          <p className="text-xs text-purple-200 mt-1">Explosão impressionante. Ganha todas as corridas. Muda de direção sem perder velocidade. Reage instantaneamente. É o mais rápido do time com folga.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-green-900/30 rounded-lg border border-green-700">
                        <span className="text-green-400 font-bold text-lg w-6">4</span>
                        <div>
                          <p className="text-sm font-medium text-green-300">Acima da média - Destaque positivo</p>
                          <p className="text-xs text-green-200 mt-1">Ganha maioria das corridas. Boa aceleração inicial. Consegue recuperar em contra-ataques. Raramente é "comido" nas costas.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-900/30 rounded-lg border border-blue-700">
                        <span className="text-blue-400 font-bold text-lg w-6">3</span>
                        <div>
                          <p className="text-sm font-medium text-blue-300">Na média - Adequado para idade</p>
                          <p className="text-xs text-blue-200 mt-1">Velocidade normal para a categoria. Acompanha o ritmo do jogo. Ganha algumas corridas, perde outras. Não é lento nem rápido.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-orange-900/30 rounded-lg border border-orange-700">
                        <span className="text-orange-400 font-bold text-lg w-6">2</span>
                        <div>
                          <p className="text-sm font-medium text-orange-300">Abaixo - Precisa desenvolver</p>
                          <p className="text-xs text-orange-200 mt-1">Perde maioria das corridas. Demora para acelerar. Chega atrasado em várias jogadas. Compensa tentando antecipar.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-red-900/30 rounded-lg border border-red-700">
                        <span className="text-red-400 font-bold text-lg w-6">1</span>
                        <div>
                          <p className="text-sm font-medium text-red-300">Muito abaixo - Deficiência clara</p>
                          <p className="text-xs text-red-200 mt-1">Sempre o mais lento. Nunca ganha corridas. Chega atrasado em quase todas as jogadas. A lentidão compromete claramente o desempenho.</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 rounded-lg shadow-sm" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                      <p className="text-xs text-slate-400"><strong>⚠️ Atenção por idade:</strong> U11-U13 velocidade pode mudar muito com maturação. O menino lento pode ficar rápido. Não descarte por isso.</p>
                    </div>
                  </div>

                  {/* Técnica */}
                  <div className="rounded-xl p-5 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">🎯</span>
                      <div>
                        <h4 className="font-bold text-amber-400 text-lg">Técnica</h4>
                        <p className="text-xs text-slate-400">Domínio de bola, qualidade de passes, dribles, condução, primeiro toque e finalização</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 mt-4">
                      <div className="flex items-start gap-3 p-3 bg-purple-900/30 rounded-lg border border-purple-700">
                        <span className="text-purple-400 font-bold text-lg w-6">5</span>
                        <div>
                          <p className="text-sm font-medium text-purple-300">Excelente - Diferencial claro</p>
                          <p className="text-xs text-purple-200 mt-1">Excelente com ambos os pés. Domina em qualquer situação, mesmo sob pressão intensa. Passes precisos de curta e longa distância. Dribles efetivos. Primeiro toque sempre limpo e orientado.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-green-900/30 rounded-lg border border-green-700">
                        <span className="text-green-400 font-bold text-lg w-6">4</span>
                        <div>
                          <p className="text-sm font-medium text-green-300">Acima da média - Destaque positivo</p>
                          <p className="text-xs text-green-200 mt-1">Muito bom com pé dominante, usa o outro quando necessário. Domina bem sob pressão normal. Passes geralmente precisos. Consegue driblar em situações favoráveis.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-900/30 rounded-lg border border-blue-700">
                        <span className="text-blue-400 font-bold text-lg w-6">3</span>
                        <div>
                          <p className="text-sm font-medium text-blue-300">Na média - Adequado para idade</p>
                          <p className="text-xs text-blue-200 mt-1">Bom com pé dominante apenas. Domina em situações normais, pode errar sob pressão. Passes curtos geralmente certos. Tenta dribles mas nem sempre funciona.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-orange-900/30 rounded-lg border border-orange-700">
                        <span className="text-orange-400 font-bold text-lg w-6">2</span>
                        <div>
                          <p className="text-sm font-medium text-orange-300">Abaixo - Precisa desenvolver</p>
                          <p className="text-xs text-orange-200 mt-1">Dificuldade no domínio mesmo em situações normais. Erra passes simples. Não consegue driblar. Primeiro toque geralmente ruim. Quase não usa o pé não-dominante.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-red-900/30 rounded-lg border border-red-700">
                        <span className="text-red-400 font-bold text-lg w-6">1</span>
                        <div>
                          <p className="text-sm font-medium text-red-300">Muito abaixo - Deficiência clara</p>
                          <p className="text-xs text-red-200 mt-1">Não consegue dominar a bola direito. Perde a bola em quase todos os toques. Passes sempre errados. Não tenta driblar. Técnica compromete completamente o jogo.</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 rounded-lg shadow-sm" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                      <p className="text-xs text-slate-400"><strong>⚠️ Atenção por idade:</strong> U11-U12 é a "Idade de Ouro" - técnica aprendida aqui fica para sempre. Valorize muito quem tem boa técnica nessa idade.</p>
                    </div>
                  </div>

                  {/* Dinâmica */}
                  <div className="rounded-xl p-5 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">🔄</span>
                      <div>
                        <h4 className="font-bold text-amber-400 text-lg">Dinâmica</h4>
                        <p className="text-xs text-slate-400">Movimentação constante, cobertura de espaços, capacidade de transição e intensidade de jogo</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 mt-4">
                      <div className="flex items-start gap-3 p-3 bg-purple-900/30 rounded-lg border border-purple-700">
                        <span className="text-purple-400 font-bold text-lg w-6">5</span>
                        <div>
                          <p className="text-sm font-medium text-purple-300">Excelente - Diferencial claro</p>
                          <p className="text-xs text-purple-200 mt-1">Está SEMPRE em movimento. Cobre muito campo em ataque e defesa. Nunca para. Faz transições instantâneas. Parece estar em todo lugar. Intensidade do início ao fim.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-green-900/30 rounded-lg border border-green-700">
                        <span className="text-green-400 font-bold text-lg w-6">4</span>
                        <div>
                          <p className="text-sm font-medium text-green-300">Acima da média - Destaque positivo</p>
                          <p className="text-xs text-green-200 mt-1">Movimenta-se muito bem. Faz coberturas e apoios constantes. Transições rápidas. Mantém intensidade na maior parte do jogo. Raramente para.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-900/30 rounded-lg border border-blue-700">
                        <span className="text-blue-400 font-bold text-lg w-6">3</span>
                        <div>
                          <p className="text-sm font-medium text-blue-300">Na média - Adequado para idade</p>
                          <p className="text-xs text-blue-200 mt-1">Movimenta-se quando necessário. Participa do jogo normalmente. Faz algumas coberturas. Transições em velocidade normal. Tem momentos de mais e menos intensidade.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-orange-900/30 rounded-lg border border-orange-700">
                        <span className="text-orange-400 font-bold text-lg w-6">2</span>
                        <div>
                          <p className="text-sm font-medium text-orange-300">Abaixo - Precisa desenvolver</p>
                          <p className="text-xs text-orange-200 mt-1">Pouco movimento. Fica parado esperando a bola. Não faz coberturas. Demora nas transições. Intensidade baixa. "Some" do jogo por períodos.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-red-900/30 rounded-lg border border-red-700">
                        <span className="text-red-400 font-bold text-lg w-6">1</span>
                        <div>
                          <p className="text-sm font-medium text-red-300">Muito abaixo - Deficiência clara</p>
                          <p className="text-xs text-red-200 mt-1">Estático. Espera a bola chegar nele. Não cobre ninguém. Não faz transição. Zero intensidade. Parece que não quer jogar. Anda em vez de correr.</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 rounded-lg shadow-sm" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                      <p className="text-xs text-slate-400"><strong>⚠️ Atenção por idade:</strong> Importante desde U11. Indica atitude e entendimento do jogo. Dinâmica baixa pode ser preguiça ou falta de entendimento tático.</p>
                    </div>
                  </div>

                  {/* Inteligência */}
                  <div className="rounded-xl p-5 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">🧠</span>
                      <div>
                        <h4 className="font-bold text-amber-400 text-lg">Inteligência</h4>
                        <p className="text-xs text-slate-400">Leitura de jogo, tomada de decisão rápida, antecipação de jogadas e visão de jogo</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 mt-4">
                      <div className="flex items-start gap-3 p-3 bg-purple-900/30 rounded-lg border border-purple-700">
                        <span className="text-purple-400 font-bold text-lg w-6">5</span>
                        <div>
                          <p className="text-sm font-medium text-purple-300">Excelente - Diferencial claro</p>
                          <p className="text-xs text-purple-200 mt-1">Sempre decide certo e rápido. Antecipa jogadas antes dos outros. "Escaneia" o campo constantemente. Vê passes que ninguém vê. Entende o jogo profundamente. Raramente é surpreendido.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-green-900/30 rounded-lg border border-green-700">
                        <span className="text-green-400 font-bold text-lg w-6">4</span>
                        <div>
                          <p className="text-sm font-medium text-green-300">Acima da média - Destaque positivo</p>
                          <p className="text-xs text-green-200 mt-1">Boas decisões na maioria das vezes. Lê bem o jogo. Antecipa situações simples. Olha antes de receber. Escolhe bem entre opções disponíveis.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-900/30 rounded-lg border border-blue-700">
                        <span className="text-blue-400 font-bold text-lg w-6">3</span>
                        <div>
                          <p className="text-sm font-medium text-blue-300">Na média - Adequado para idade</p>
                          <p className="text-xs text-blue-200 mt-1">Decisões razoáveis. Às vezes erra a leitura. Demora um pouco para decidir. Entende o básico do jogo. Algumas boas jogadas, alguns erros de escolha.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-orange-900/30 rounded-lg border border-orange-700">
                        <span className="text-orange-400 font-bold text-lg w-6">2</span>
                        <div>
                          <p className="text-sm font-medium text-orange-300">Abaixo - Precisa desenvolver</p>
                          <p className="text-xs text-orange-200 mt-1">Decisões ruins frequentes. Não vê opções óbvias. Demora muito para decidir. Faz a jogada errada mesmo com tempo. Não antecipa nada.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-red-900/30 rounded-lg border border-red-700">
                        <span className="text-red-400 font-bold text-lg w-6">1</span>
                        <div>
                          <p className="text-sm font-medium text-red-300">Muito abaixo - Deficiência clara</p>
                          <p className="text-xs text-red-200 mt-1">Não entende o jogo. Sempre faz a escolha errada. Zero antecipação. Parece perdido em campo. Não sabe o que fazer com a bola. Decisões comprometem o time.</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 rounded-lg shadow-sm" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                      <p className="text-xs text-slate-400"><strong>⚠️ Atenção por idade:</strong> DIFERENCIAL em todas as idades. Inteligência é muito difícil de ensinar. U13+ começa a ser decisiva. Valorize muito quem tem.</p>
                    </div>
                  </div>

                  {/* 1 contra 1 */}
                  <div className="rounded-xl p-5 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">⚔️</span>
                      <div>
                        <h4 className="font-bold text-amber-400 text-lg">1 contra 1</h4>
                        <p className="text-xs text-slate-400">Capacidade de vencer duelos individuais no ataque (dribles, fintas) e na defesa (desarmes, bloqueios)</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 mt-4">
                      <div className="flex items-start gap-3 p-3 bg-purple-900/30 rounded-lg border border-purple-700">
                        <span className="text-purple-400 font-bold text-lg w-6">5</span>
                        <div>
                          <p className="text-sm font-medium text-purple-300">Excelente - Diferencial claro</p>
                          <p className="text-xs text-purple-200 mt-1">Vence quase todos os duelos. No ataque: dribles efetivos, passa pelo marcador com facilidade. Na defesa: desarma, intercepta, bloqueia. Não tem medo do duelo. É decisivo.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-green-900/30 rounded-lg border border-green-700">
                        <span className="text-green-400 font-bold text-lg w-6">4</span>
                        <div>
                          <p className="text-sm font-medium text-green-300">Acima da média - Destaque positivo</p>
                          <p className="text-xs text-green-200 mt-1">Ganha maioria dos duelos. Dribla bem em situações favoráveis. Defende bem 1v1. Não evita confronto. Geralmente sai vencedor.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-900/30 rounded-lg border border-blue-700">
                        <span className="text-blue-400 font-bold text-lg w-6">3</span>
                        <div>
                          <p className="text-sm font-medium text-blue-300">Na média - Adequado para idade</p>
                          <p className="text-xs text-blue-200 mt-1">Ganha alguns, perde outros. Equilibrado nos duelos. Tenta mas nem sempre consegue. Não é ponto forte nem fraco.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-orange-900/30 rounded-lg border border-orange-700">
                        <span className="text-orange-400 font-bold text-lg w-6">2</span>
                        <div>
                          <p className="text-sm font-medium text-orange-300">Abaixo - Precisa desenvolver</p>
                          <p className="text-xs text-orange-200 mt-1">Perde maioria dos duelos. Evita confronto direto quando pode. Dribles não funcionam. Na defesa é facilmente passado. Prefere passar a bola a tentar.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-red-900/30 rounded-lg border border-red-700">
                        <span className="text-red-400 font-bold text-lg w-6">1</span>
                        <div>
                          <p className="text-sm font-medium text-red-300">Muito abaixo - Deficiência clara</p>
                          <p className="text-xs text-red-200 mt-1">Evita todos os duelos. Quando obrigado, sempre perde. Zero tentativa de drible. Na defesa é sempre passado. Medo do confronto. Foge da bola quando pressionado.</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 rounded-lg shadow-sm" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                      <p className="text-xs text-slate-400"><strong>⚠️ Atenção por idade:</strong> U11-U13 valorize a TENTATIVA, mesmo que erre. U15+ valorize a EFETIVIDADE. Quem tenta desde cedo evolui mais.</p>
                    </div>
                  </div>

                  {/* Atitude */}
                  <div className="rounded-xl p-5 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">🔥</span>
                      <div>
                        <h4 className="font-bold text-amber-400 text-lg">Atitude</h4>
                        <p className="text-xs text-slate-400">Mentalidade competitiva, comprometimento, resiliência, liderança e comunicação em campo</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 mt-4">
                      <div className="flex items-start gap-3 p-3 bg-purple-900/30 rounded-lg border border-purple-700">
                        <span className="text-purple-400 font-bold text-lg w-6">5</span>
                        <div>
                          <p className="text-sm font-medium text-purple-300">Excelente - Diferencial claro</p>
                          <p className="text-xs text-purple-200 mt-1">Líder nato. Nunca desiste, independente do placar. Puxa o time com voz e exemplo. Comunica constantemente. Quer a bola nos momentos difíceis. Compete até o final. Inspira os companheiros.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-green-900/30 rounded-lg border border-green-700">
                        <span className="text-green-400 font-bold text-lg w-6">4</span>
                        <div>
                          <p className="text-sm font-medium text-green-300">Acima da média - Destaque positivo</p>
                          <p className="text-xs text-green-200 mt-1">Muito comprometido. Não desiste. Compete bem. Comunica quando necessário. Mantém foco no jogo todo. Aceita correção e tenta melhorar. Bom profissionalismo.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-900/30 rounded-lg border border-blue-700">
                        <span className="text-blue-400 font-bold text-lg w-6">3</span>
                        <div>
                          <p className="text-sm font-medium text-blue-300">Na média - Adequado para idade</p>
                          <p className="text-xs text-blue-200 mt-1">Comprometido normalmente. Compete quando está bem. Ocasionalmente reclama ou desanima. Foco razoável. Faz o que é pedido.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-orange-900/30 rounded-lg border border-orange-700">
                        <span className="text-orange-400 font-bold text-lg w-6">2</span>
                        <div>
                          <p className="text-sm font-medium text-orange-300">Abaixo - Precisa desenvolver</p>
                          <p className="text-xs text-orange-200 mt-1">Desanima fácil quando o time está perdendo. Reclama de decisões. Não aceita bem correção. Foge de responsabilidade. "Some" em momentos difíceis.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-red-900/30 rounded-lg border border-red-700">
                        <span className="text-red-400 font-bold text-lg w-6">1</span>
                        <div>
                          <p className="text-sm font-medium text-red-300">Muito abaixo - Deficiência clara</p>
                          <p className="text-xs text-red-200 mt-1">Desiste ao primeiro sinal de dificuldade. Reclama de tudo. Se esconde do jogo. Zero comunicação. Culpa os outros. Não aceita feedback. Atitude prejudica o time.</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 rounded-lg shadow-sm" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                      <p className="text-xs text-slate-400"><strong>⚠️ Atenção por idade:</strong> FUNDAMENTAL em todas as idades. É o maior preditor de evolução futura. Atleta com atitude evolui; sem atitude, estagna. Observe em momentos de adversidade.</p>
                    </div>
                  </div>

                  {/* Potencial */}
                  <div className="rounded-xl p-5 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">⭐</span>
                      <div>
                        <h4 className="font-bold text-amber-400 text-lg">Potencial</h4>
                        <p className="text-xs text-slate-400">Projeção de evolução futura baseada em margem de crescimento, características e capacidade de aprendizado</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 mt-4">
                      <div className="flex items-start gap-3 p-3 bg-purple-900/30 rounded-lg border border-purple-700">
                        <span className="text-purple-400 font-bold text-lg w-6">5</span>
                        <div>
                          <p className="text-sm font-medium text-purple-300">Excelente - Diferencial claro</p>
                          <p className="text-xs text-purple-200 mt-1">Altíssimo potencial. Aprende MUITO rápido (1 correção e já muda). Margem enorme de crescimento. Características físicas favoráveis. Inteligência acima da média. Perfil de profissional.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-green-900/30 rounded-lg border border-green-700">
                        <span className="text-green-400 font-bold text-lg w-6">4</span>
                        <div>
                          <p className="text-sm font-medium text-green-300">Acima da média - Destaque positivo</p>
                          <p className="text-xs text-green-200 mt-1">Bom potencial. Aprende rápido. Boa margem de evolução. Características adequadas. Evolui bem com treino. Projeção positiva.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-900/30 rounded-lg border border-blue-700">
                        <span className="text-blue-400 font-bold text-lg w-6">3</span>
                        <div>
                          <p className="text-sm font-medium text-blue-300">Na média - Adequado para idade</p>
                          <p className="text-xs text-blue-200 mt-1">Potencial normal. Evolui em ritmo esperado. Aprende com repetição. Margem de crescimento mediana. Pode ou não chegar ao profissional - depende muito de trabalho.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-orange-900/30 rounded-lg border border-orange-700">
                        <span className="text-orange-400 font-bold text-lg w-6">2</span>
                        <div>
                          <p className="text-sm font-medium text-orange-300">Abaixo - Precisa desenvolver</p>
                          <p className="text-xs text-orange-200 mt-1">Potencial limitado. Demora para aprender. Pouca margem de evolução visível. Características físicas podem ser limitantes. Teto parece próximo.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-red-900/30 rounded-lg border border-red-700">
                        <span className="text-red-400 font-bold text-lg w-6">1</span>
                        <div>
                          <p className="text-sm font-medium text-red-300">Muito abaixo - Deficiência clara</p>
                          <p className="text-xs text-red-200 mt-1">Baixo potencial visível. Não aprende mesmo com repetição. Teto já alcançado. Características muito limitantes. Projeção muito difícil para níveis superiores.</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 rounded-lg shadow-sm" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                      <p className="text-xs text-slate-400"><strong>⚠️ Atenção por idade:</strong> Mais importante em U11-U15. Em U17+ o atleta já "é o que é" em grande parte. Cuidado para não confundir maturação precoce com potencial real.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ofensivas - 6 dimensões */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="px-3 py-1 rounded-lg bg-green-500/20 border border-green-500/30">
                    <span className="text-green-400 font-bold">OFE</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-100">6 Dimensões Ofensivas</h3>
                </div>
                <p className="text-sm text-slate-400 mb-4">Princípios táticos da fase ofensiva do jogo.</p>

                <div className="space-y-6">
                  {/* Penetração */}
                  <div className="rounded-xl p-5 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">🎯</span>
                      <div>
                        <h4 className="font-bold text-green-400 text-lg">Penetração</h4>
                        <p className="text-xs text-slate-400">Capacidade de atacar espaços, progredir com bola em direção ao gol e finalizar jogadas</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 mt-4">
                      <div className="flex items-start gap-3 p-3 bg-purple-900/30 rounded-lg border border-purple-700">
                        <span className="text-purple-400 font-bold text-lg w-6">5</span>
                        <div>
                          <p className="text-sm font-medium text-purple-300">Excelente - Diferencial claro</p>
                          <p className="text-xs text-purple-200 mt-1">Ataca espaços com precisão e timing perfeito. Sempre busca a profundidade. Conduz em velocidade e finaliza com qualidade. Desequilibra defesas. É referência ofensiva do time.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-green-900/30 rounded-lg border border-green-700">
                        <span className="text-green-400 font-bold text-lg w-6">4</span>
                        <div>
                          <p className="text-sm font-medium text-green-300">Acima da média - Destaque positivo</p>
                          <p className="text-xs text-green-200 mt-1">Busca profundidade com frequência. Ataca bem os espaços quando identifica. Conduz com objetividade. Finaliza adequadamente. Ameaça constante.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-900/30 rounded-lg border border-blue-700">
                        <span className="text-blue-400 font-bold text-lg w-6">3</span>
                        <div>
                          <p className="text-sm font-medium text-blue-300">Na média - Adequado para idade</p>
                          <p className="text-xs text-blue-200 mt-1">Progride quando tem espaço claro. Ataca às vezes, mas não é constante. Conduz em situações favoráveis. Finalização irregular.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-orange-900/30 rounded-lg border border-orange-700">
                        <span className="text-orange-400 font-bold text-lg w-6">2</span>
                        <div>
                          <p className="text-sm font-medium text-orange-300">Abaixo - Precisa desenvolver</p>
                          <p className="text-xs text-orange-200 mt-1">Raramente busca profundidade. Prefere jogar para trás ou para o lado. Não arrisca condução. Evita finalizar. Pouca ameaça ofensiva.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-red-900/30 rounded-lg border border-red-700">
                        <span className="text-red-400 font-bold text-lg w-6">1</span>
                        <div>
                          <p className="text-sm font-medium text-red-300">Muito abaixo - Deficiência clara</p>
                          <p className="text-xs text-red-200 mt-1">Nunca busca profundidade. Sempre joga para trás. Não conduz, não finaliza. Zero ameaça. Comportamento totalmente passivo no ataque.</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 rounded-lg shadow-sm" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                      <p className="text-xs text-slate-400"><strong>⚠️ Atenção por idade:</strong> U11-U13 valorize a INTENÇÃO de atacar, mesmo que erre. U15+ exija também a efetividade. Atacantes devem ter nota alta aqui.</p>
                    </div>
                  </div>

                  {/* Cobertura Ofensiva */}
                  <div className="rounded-xl p-5 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">🤝</span>
                      <div>
                        <h4 className="font-bold text-green-400 text-lg">Cobertura Ofensiva</h4>
                        <p className="text-xs text-slate-400">Apoio aos companheiros no ataque, oferecendo opções de passe e criando linhas de passe</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 mt-4">
                      <div className="flex items-start gap-3 p-3 bg-purple-900/30 rounded-lg border border-purple-700">
                        <span className="text-purple-400 font-bold text-lg w-6">5</span>
                        <div>
                          <p className="text-sm font-medium text-purple-300">Excelente - Diferencial claro</p>
                          <p className="text-xs text-purple-200 mt-1">Sempre oferece opção de passe. Timing perfeito de aproximação. Cria linha de passe antes do companheiro precisar. Nunca deixa o portador da bola sozinho. Facilita a vida de todos.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-green-900/30 rounded-lg border border-green-700">
                        <span className="text-green-400 font-bold text-lg w-6">4</span>
                        <div>
                          <p className="text-sm font-medium text-green-300">Acima da média - Destaque positivo</p>
                          <p className="text-xs text-green-200 mt-1">Oferece apoio com frequência. Bom timing de aproximação. Cria opções em momentos importantes. Raramente deixa companheiro sem saída.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-900/30 rounded-lg border border-blue-700">
                        <span className="text-blue-400 font-bold text-lg w-6">3</span>
                        <div>
                          <p className="text-sm font-medium text-blue-300">Na média - Adequado para idade</p>
                          <p className="text-xs text-blue-200 mt-1">Oferece apoio adequado em situações normais. Às vezes chega atrasado. Cria opções quando percebe a necessidade. Inconsistente.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-orange-900/30 rounded-lg border border-orange-700">
                        <span className="text-orange-400 font-bold text-lg w-6">2</span>
                        <div>
                          <p className="text-sm font-medium text-orange-300">Abaixo - Precisa desenvolver</p>
                          <p className="text-xs text-orange-200 mt-1">Raramente se aproxima para apoiar. Deixa companheiros sem opção frequentemente. Timing ruim. Fica longe da jogada.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-red-900/30 rounded-lg border border-red-700">
                        <span className="text-red-400 font-bold text-lg w-6">1</span>
                        <div>
                          <p className="text-sm font-medium text-red-300">Muito abaixo - Deficiência clara</p>
                          <p className="text-xs text-red-200 mt-1">Nunca se oferece. Deixa companheiros sozinhos sempre. Zero apoio. Fica parado esperando a bola chegar nele. Não entende o conceito de apoio.</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 rounded-lg shadow-sm" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                      <p className="text-xs text-slate-400"><strong>⚠️ Atenção por idade:</strong> Fundamental desde U11. Indica entendimento coletivo do jogo. Meias e volantes devem ter nota alta aqui.</p>
                    </div>
                  </div>

                  {/* Espaço com Bola */}
                  <div className="rounded-xl p-5 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">⚽</span>
                      <div>
                        <h4 className="font-bold text-green-400 text-lg">Espaço com Bola</h4>
                        <p className="text-xs text-slate-400">Qualidade na posse de bola, criação de jogadas, manutenção da bola e criação de espaços</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 mt-4">
                      <div className="flex items-start gap-3 p-3 bg-purple-900/30 rounded-lg border border-purple-700">
                        <span className="text-purple-400 font-bold text-lg w-6">5</span>
                        <div>
                          <p className="text-sm font-medium text-purple-300">Excelente - Diferencial claro</p>
                          <p className="text-xs text-purple-200 mt-1">Cria jogadas do nada. Mantém posse sob pressão intensa. Abre espaços com conduções e passes. Dita o ritmo do jogo. Criativo e efetivo. Diferencial técnico.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-green-900/30 rounded-lg border border-green-700">
                        <span className="text-green-400 font-bold text-lg w-6">4</span>
                        <div>
                          <p className="text-sm font-medium text-green-300">Acima da média - Destaque positivo</p>
                          <p className="text-xs text-green-200 mt-1">Mantém bem a posse. Cria jogadas com frequência. Protege a bola sob pressão normal. Abre espaços para si e para companheiros.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-900/30 rounded-lg border border-blue-700">
                        <span className="text-blue-400 font-bold text-lg w-6">3</span>
                        <div>
                          <p className="text-sm font-medium text-blue-300">Na média - Adequado para idade</p>
                          <p className="text-xs text-blue-200 mt-1">Boa manutenção em situações normais. Cria algumas jogadas. Perde a bola sob pressão intensa. Abre espaços ocasionalmente.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-orange-900/30 rounded-lg border border-orange-700">
                        <span className="text-orange-400 font-bold text-lg w-6">2</span>
                        <div>
                          <p className="text-sm font-medium text-orange-300">Abaixo - Precisa desenvolver</p>
                          <p className="text-xs text-orange-200 mt-1">Perde a bola com facilidade. Não cria jogadas. Sem criatividade. Não consegue manter posse sob qualquer pressão.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-red-900/30 rounded-lg border border-red-700">
                        <span className="text-red-400 font-bold text-lg w-6">1</span>
                        <div>
                          <p className="text-sm font-medium text-red-300">Muito abaixo - Deficiência clara</p>
                          <p className="text-xs text-red-200 mt-1">Perde bola em quase todos os toques. Zero criatividade. Não consegue manter posse nem sem marcação. Entrega a bola para o adversário constantemente.</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 rounded-lg shadow-sm" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                      <p className="text-xs text-slate-400"><strong>⚠️ Atenção por idade:</strong> Meias e atacantes devem ter nota alta. Zagueiros podem ter nota mais baixa sem ser problema. U11-U13 é idade de ouro para desenvolver isso.</p>
                    </div>
                  </div>

                  {/* Espaço sem Bola */}
                  <div className="rounded-xl p-5 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">👟</span>
                      <div>
                        <h4 className="font-bold text-green-400 text-lg">Espaço sem Bola</h4>
                        <p className="text-xs text-slate-400">Movimentação inteligente para receber, criar linhas de passe e desmarques</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 mt-4">
                      <div className="flex items-start gap-3 p-3 bg-purple-900/30 rounded-lg border border-purple-700">
                        <span className="text-purple-400 font-bold text-lg w-6">5</span>
                        <div>
                          <p className="text-sm font-medium text-purple-300">Excelente - Diferencial claro</p>
                          <p className="text-xs text-purple-200 mt-1">Movimentação constante e inteligente. Sempre criando linhas de passe. Desmarques perfeitos. Aparece nos espaços certos nos momentos certos. Difícil de marcar.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-green-900/30 rounded-lg border border-green-700">
                        <span className="text-green-400 font-bold text-lg w-6">4</span>
                        <div>
                          <p className="text-sm font-medium text-green-300">Acima da média - Destaque positivo</p>
                          <p className="text-xs text-green-200 mt-1">Boa movimentação. Cria linhas de passe com frequência. Desmarques efetivos. Entende os espaços. Facilita o jogo dos companheiros.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-900/30 rounded-lg border border-blue-700">
                        <span className="text-blue-400 font-bold text-lg w-6">3</span>
                        <div>
                          <p className="text-sm font-medium text-blue-300">Na média - Adequado para idade</p>
                          <p className="text-xs text-blue-200 mt-1">Se movimenta quando percebe espaço. Alguns desmarques funcionam. Às vezes fica parado demais. Movimentação inconsistente.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-orange-900/30 rounded-lg border border-orange-700">
                        <span className="text-orange-400 font-bold text-lg w-6">2</span>
                        <div>
                          <p className="text-sm font-medium text-orange-300">Abaixo - Precisa desenvolver</p>
                          <p className="text-xs text-orange-200 mt-1">Pouca movimentação. Fica na sombra do marcador. Não cria linhas de passe. Desmarques ineficazes. Fácil de marcar.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-red-900/30 rounded-lg border border-red-700">
                        <span className="text-red-400 font-bold text-lg w-6">1</span>
                        <div>
                          <p className="text-sm font-medium text-red-300">Muito abaixo - Deficiência clara</p>
                          <p className="text-xs text-red-200 mt-1">Estático. Espera a bola chegar nele. Zero movimentação. Sempre na sombra. Não entende o conceito de criar espaço. Prejudica a equipe.</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 rounded-lg shadow-sm" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                      <p className="text-xs text-slate-400"><strong>⚠️ Atenção por idade:</strong> Fundamental para meias e atacantes. Indica inteligência tática. U13+ essa dimensão se torna cada vez mais importante.</p>
                    </div>
                  </div>

                  {/* Mobilidade */}
                  <div className="rounded-xl p-5 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">🔀</span>
                      <div>
                        <h4 className="font-bold text-green-400 text-lg">Mobilidade</h4>
                        <p className="text-xs text-slate-400">Capacidade de trocar posições, surpreender e desorganizar defesas adversárias</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 mt-4">
                      <div className="flex items-start gap-3 p-3 bg-purple-900/30 rounded-lg border border-purple-700">
                        <span className="text-purple-400 font-bold text-lg w-6">5</span>
                        <div>
                          <p className="text-sm font-medium text-purple-300">Excelente - Diferencial claro</p>
                          <p className="text-xs text-purple-200 mt-1">Imprevisível. Troca de posição com inteligência e timing. Desorganiza defesas. Aparece em posições inesperadas. Dificulta marcação. Joga em múltiplas posições naturalmente.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-green-900/30 rounded-lg border border-green-700">
                        <span className="text-green-400 font-bold text-lg w-6">4</span>
                        <div>
                          <p className="text-sm font-medium text-green-300">Acima da média - Destaque positivo</p>
                          <p className="text-xs text-green-200 mt-1">Troca posições com frequência. Surpreende em alguns momentos. Entende quando trocar. Causa confusão na defesa adversária.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-900/30 rounded-lg border border-blue-700">
                        <span className="text-blue-400 font-bold text-lg w-6">3</span>
                        <div>
                          <p className="text-sm font-medium text-blue-300">Na média - Adequado para idade</p>
                          <p className="text-xs text-blue-200 mt-1">Algumas trocas de posição efetivas. Às vezes surpreende. Entende o básico de mobilidade. Inconsistente nas trocas.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-orange-900/30 rounded-lg border border-orange-700">
                        <span className="text-orange-400 font-bold text-lg w-6">2</span>
                        <div>
                          <p className="text-sm font-medium text-orange-300">Abaixo - Precisa desenvolver</p>
                          <p className="text-xs text-orange-200 mt-1">Raramente troca de posição. Previsível. Sempre no mesmo lugar. Fácil de anular taticamente.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-red-900/30 rounded-lg border border-red-700">
                        <span className="text-red-400 font-bold text-lg w-6">1</span>
                        <div>
                          <p className="text-sm font-medium text-red-300">Muito abaixo - Deficiência clara</p>
                          <p className="text-xs text-red-200 mt-1">Sempre na mesma posição. Zero mobilidade. Totalmente previsível. Não entende o conceito de troca. Muito fácil de marcar.</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 rounded-lg shadow-sm" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                      <p className="text-xs text-slate-400"><strong>⚠️ Atenção por idade:</strong> Diferencial em meias e atacantes modernos. U15+ torna-se cada vez mais importante. Jogadores "inteligentes" têm nota alta aqui.</p>
                    </div>
                  </div>

                  {/* Unidade Ofensiva */}
                  <div className="rounded-xl p-5 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">🔗</span>
                      <div>
                        <h4 className="font-bold text-green-400 text-lg">Unidade Ofensiva</h4>
                        <p className="text-xs text-slate-400">Conexão com o coletivo no ataque, sincronismo com companheiros e combinações</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 mt-4">
                      <div className="flex items-start gap-3 p-3 bg-purple-900/30 rounded-lg border border-purple-700">
                        <span className="text-purple-400 font-bold text-lg w-6">5</span>
                        <div>
                          <p className="text-sm font-medium text-purple-300">Excelente - Diferencial claro</p>
                          <p className="text-xs text-purple-200 mt-1">Joga junto naturalmente. Combinações perfeitas. Sincronismo total com companheiros. Entende o jogo coletivo profundamente. Melhora o time todo quando joga.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-green-900/30 rounded-lg border border-green-700">
                        <span className="text-green-400 font-bold text-lg w-6">4</span>
                        <div>
                          <p className="text-sm font-medium text-green-300">Acima da média - Destaque positivo</p>
                          <p className="text-xs text-green-200 mt-1">Combina bem. Bom sincronismo. Participa das jogadas coletivas com qualidade. Entende o movimento dos companheiros.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-900/30 rounded-lg border border-blue-700">
                        <span className="text-blue-400 font-bold text-lg w-6">3</span>
                        <div>
                          <p className="text-sm font-medium text-blue-300">Na média - Adequado para idade</p>
                          <p className="text-xs text-blue-200 mt-1">Participa das jogadas coletivas. Algumas combinações funcionam. Sincronismo irregular. Às vezes conecta, às vezes não.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-orange-900/30 rounded-lg border border-orange-700">
                        <span className="text-orange-400 font-bold text-lg w-6">2</span>
                        <div>
                          <p className="text-sm font-medium text-orange-300">Abaixo - Precisa desenvolver</p>
                          <p className="text-xs text-orange-200 mt-1">Pouca conexão com companheiros. Combinações falham frequentemente. Fora de sincronismo. Joga mais individual que coletivo.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-red-900/30 rounded-lg border border-red-700">
                        <span className="text-red-400 font-bold text-lg w-6">1</span>
                        <div>
                          <p className="text-sm font-medium text-red-300">Muito abaixo - Deficiência clara</p>
                          <p className="text-xs text-red-200 mt-1">Joga sozinho. Zero combinação. Não se conecta com ninguém. Parece estar em outro jogo. Prejudica o coletivo ofensivo.</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 rounded-lg shadow-sm" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                      <p className="text-xs text-slate-400"><strong>⚠️ Atenção por idade:</strong> Importante em todas as idades. Indica maturidade tática. Jogadores "egoístas" têm nota baixa aqui. U13+ essa dimensão é fundamental.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Defensivas - 6 dimensões */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/30">
                    <span className="text-red-400 font-bold">DEF</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-100">6 Dimensões Defensivas</h3>
                </div>
                <p className="text-sm text-slate-400 mb-4">Princípios táticos da fase defensiva do jogo.</p>

                <div className="space-y-6">
                  {/* Contenção */}
                  <div className="rounded-xl p-5 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">🛡️</span>
                      <div>
                        <h4 className="font-bold text-red-400 text-lg">Contenção</h4>
                        <p className="text-xs text-slate-400">Capacidade de marcar, pressionar o portador da bola e retardar ataques adversários</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 mt-4">
                      <div className="flex items-start gap-3 p-3 bg-purple-900/30 rounded-lg border border-purple-700">
                        <span className="text-purple-400 font-bold text-lg w-6">5</span>
                        <div>
                          <p className="text-sm font-medium text-purple-300">Excelente - Diferencial claro</p>
                          <p className="text-xs text-purple-200 mt-1">Pressão intensa e inteligente. Recupera bolas por pressão constante. Marca apertado sem cometer faltas. Retarda ataques com eficiência. Dificulta qualquer saída de bola adversária.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-green-900/30 rounded-lg border border-green-700">
                        <span className="text-green-400 font-bold text-lg w-6">4</span>
                        <div>
                          <p className="text-sm font-medium text-green-300">Acima da média - Destaque positivo</p>
                          <p className="text-xs text-green-200 mt-1">Boa pressão. Marca de perto na maioria das situações. Recupera bolas com frequência. Retarda ataques adequadamente.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-900/30 rounded-lg border border-blue-700">
                        <span className="text-blue-400 font-bold text-lg w-6">3</span>
                        <div>
                          <p className="text-sm font-medium text-blue-300">Na média - Adequado para idade</p>
                          <p className="text-xs text-blue-200 mt-1">Marca adequadamente em situações normais. Faz pressão quando orientado. Às vezes dá espaço demais. Contenção inconsistente.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-orange-900/30 rounded-lg border border-orange-700">
                        <span className="text-orange-400 font-bold text-lg w-6">2</span>
                        <div>
                          <p className="text-sm font-medium text-orange-300">Abaixo - Precisa desenvolver</p>
                          <p className="text-xs text-orange-200 mt-1">Marca de longe. Dá muito espaço ao adversário. Pouca pressão. Raramente recupera bola por marcação. Passivo na contenção.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-red-900/30 rounded-lg border border-red-700">
                        <span className="text-red-400 font-bold text-lg w-6">1</span>
                        <div>
                          <p className="text-sm font-medium text-red-300">Muito abaixo - Deficiência clara</p>
                          <p className="text-xs text-red-200 mt-1">Não marca. Dá todo espaço ao adversário. Zero pressão. Adversário faz o que quer quando ele está marcando. Compromete a defesa.</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 rounded-lg shadow-sm" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                      <p className="text-xs text-slate-400"><strong>⚠️ Atenção por idade:</strong> Fundamental desde U11. Indica comprometimento defensivo. Volantes e zagueiros devem ter nota alta aqui. Atacantes também precisam marcar no futebol moderno.</p>
                    </div>
                  </div>

                  {/* Cobertura Defensiva */}
                  <div className="rounded-xl p-5 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">🤝</span>
                      <div>
                        <h4 className="font-bold text-red-400 text-lg">Cobertura Defensiva</h4>
                        <p className="text-xs text-slate-400">Apoio aos companheiros na defesa, cobertura de espaços vulneráveis e dobras de marcação</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 mt-4">
                      <div className="flex items-start gap-3 p-3 bg-purple-900/30 rounded-lg border border-purple-700">
                        <span className="text-purple-400 font-bold text-lg w-6">5</span>
                        <div>
                          <p className="text-sm font-medium text-purple-300">Excelente - Diferencial claro</p>
                          <p className="text-xs text-purple-200 mt-1">Sempre dá cobertura. Posicionamento perfeito. Antecipa quando o companheiro vai ser driblado. Faz dobras no momento certo. Nunca deixa espaço nas costas do marcador.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-green-900/30 rounded-lg border border-green-700">
                        <span className="text-green-400 font-bold text-lg w-6">4</span>
                        <div>
                          <p className="text-sm font-medium text-green-300">Acima da média - Destaque positivo</p>
                          <p className="text-xs text-green-200 mt-1">Boa cobertura na maioria das situações. Faz dobras quando necessário. Posicionamento adequado. Raramente deixa companheiro sozinho.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-900/30 rounded-lg border border-blue-700">
                        <span className="text-blue-400 font-bold text-lg w-6">3</span>
                        <div>
                          <p className="text-sm font-medium text-blue-300">Na média - Adequado para idade</p>
                          <p className="text-xs text-blue-200 mt-1">Cobre quando necessário. Às vezes chega atrasado. Algumas dobras funcionam. Cobertura inconsistente.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-orange-900/30 rounded-lg border border-orange-700">
                        <span className="text-orange-400 font-bold text-lg w-6">2</span>
                        <div>
                          <p className="text-sm font-medium text-orange-300">Abaixo - Precisa desenvolver</p>
                          <p className="text-xs text-orange-200 mt-1">Raramente dá cobertura. Deixa companheiro sozinho com frequência. Não faz dobras. Mal posicionado para ajudar.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-red-900/30 rounded-lg border border-red-700">
                        <span className="text-red-400 font-bold text-lg w-6">1</span>
                        <div>
                          <p className="text-sm font-medium text-red-300">Muito abaixo - Deficiência clara</p>
                          <p className="text-xs text-red-200 mt-1">Nunca dá cobertura. Sempre deixa companheiros sozinhos. Zero noção de ajuda defensiva. Não entende o conceito. Time sofre gols por falta de cobertura dele.</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 rounded-lg shadow-sm" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                      <p className="text-xs text-slate-400"><strong>⚠️ Atenção por idade:</strong> Fundamental para zagueiros e volantes. Indica inteligência tática defensiva. U13+ essa dimensão é essencial para jogadores de defesa.</p>
                    </div>
                  </div>

                  {/* Equilíbrio Recuperação */}
                  <div className="rounded-xl p-5 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">🔄</span>
                      <div>
                        <h4 className="font-bold text-red-400 text-lg">Equilíbrio Recuperação</h4>
                        <p className="text-xs text-slate-400">Recomposição rápida após perda de bola, transição defensiva e reação à perda</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 mt-4">
                      <div className="flex items-start gap-3 p-3 bg-purple-900/30 rounded-lg border border-purple-700">
                        <span className="text-purple-400 font-bold text-lg w-6">5</span>
                        <div>
                          <p className="text-sm font-medium text-purple-300">Excelente - Diferencial claro</p>
                          <p className="text-xs text-purple-200 mt-1">Transição imediata. Sempre volta correndo. Reage à perda instantaneamente. Primeiro a pressionar após perda. Time nunca sofre contra-ataque por culpa dele.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-green-900/30 rounded-lg border border-green-700">
                        <span className="text-green-400 font-bold text-lg w-6">4</span>
                        <div>
                          <p className="text-sm font-medium text-green-300">Acima da média - Destaque positivo</p>
                          <p className="text-xs text-green-200 mt-1">Boa transição. Volta na grande maioria das vezes. Reage rápido à perda. Raramente é pego fora de posição.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-900/30 rounded-lg border border-blue-700">
                        <span className="text-blue-400 font-bold text-lg w-6">3</span>
                        <div>
                          <p className="text-sm font-medium text-blue-300">Na média - Adequado para idade</p>
                          <p className="text-xs text-blue-200 mt-1">Volta na maioria das vezes. Às vezes demora para reagir. Transição em velocidade normal. Inconsistente na recuperação.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-orange-900/30 rounded-lg border border-orange-700">
                        <span className="text-orange-400 font-bold text-lg w-6">2</span>
                        <div>
                          <p className="text-sm font-medium text-orange-300">Abaixo - Precisa desenvolver</p>
                          <p className="text-xs text-orange-200 mt-1">Demora para voltar. Reação lenta à perda. Fica parado reclamando em vez de correr. Time sofre contra-ataques por causa dele.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-red-900/30 rounded-lg border border-red-700">
                        <span className="text-red-400 font-bold text-lg w-6">1</span>
                        <div>
                          <p className="text-sm font-medium text-red-300">Muito abaixo - Deficiência clara</p>
                          <p className="text-xs text-red-200 mt-1">Não volta. Zero transição defensiva. Não reage à perda. Anda enquanto o time corre. Responsável direto por contra-ataques sofridos. Prejudica gravemente a equipe.</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 rounded-lg shadow-sm" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                      <p className="text-xs text-slate-400"><strong>⚠️ Atenção por idade:</strong> FUNDAMENTAL em todas as idades e posições. Indica atitude e comprometimento. Jogadores "preguiçosos" têm nota baixa aqui. Diferencial para meias e atacantes.</p>
                    </div>
                  </div>

                  {/* Equilíbrio Defensivo */}
                  <div className="rounded-xl p-5 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">⚖️</span>
                      <div>
                        <h4 className="font-bold text-red-400 text-lg">Equilíbrio Defensivo</h4>
                        <p className="text-xs text-slate-400">Posicionamento correto, organização tática, compactação e distâncias entre linhas</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 mt-4">
                      <div className="flex items-start gap-3 p-3 bg-purple-900/30 rounded-lg border border-purple-700">
                        <span className="text-purple-400 font-bold text-lg w-6">5</span>
                        <div>
                          <p className="text-sm font-medium text-purple-300">Excelente - Diferencial claro</p>
                          <p className="text-xs text-purple-200 mt-1">Sempre bem posicionado. Organiza a linha. Mantém distâncias certas. Compacta quando necessário. Lê o jogo defensivamente. Raramente é pego fora de posição.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-green-900/30 rounded-lg border border-green-700">
                        <span className="text-green-400 font-bold text-lg w-6">4</span>
                        <div>
                          <p className="text-sm font-medium text-green-300">Acima da média - Destaque positivo</p>
                          <p className="text-xs text-green-200 mt-1">Bom posicionamento na maioria das situações. Entende as distâncias. Compacta adequadamente. Poucos erros de posição.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-900/30 rounded-lg border border-blue-700">
                        <span className="text-blue-400 font-bold text-lg w-6">3</span>
                        <div>
                          <p className="text-sm font-medium text-blue-300">Na média - Adequado para idade</p>
                          <p className="text-xs text-blue-200 mt-1">Posicionamento adequado na maioria. Às vezes fica longe demais ou perto demais. Entende o básico de compactação. Alguns erros de posição.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-orange-900/30 rounded-lg border border-orange-700">
                        <span className="text-orange-400 font-bold text-lg w-6">2</span>
                        <div>
                          <p className="text-sm font-medium text-orange-300">Abaixo - Precisa desenvolver</p>
                          <p className="text-xs text-orange-200 mt-1">Mal posicionado com frequência. Cria buracos na defesa. Não entende distâncias. Não compacta. Adversários exploram seu posicionamento.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-red-900/30 rounded-lg border border-red-700">
                        <span className="text-red-400 font-bold text-lg w-6">1</span>
                        <div>
                          <p className="text-sm font-medium text-red-300">Muito abaixo - Deficiência clara</p>
                          <p className="text-xs text-red-200 mt-1">Sempre mal posicionado. Cria buracos enormes. Zero noção de equilíbrio. Desorganiza a defesa do time. Time sofre gols por erros de posicionamento dele.</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 rounded-lg shadow-sm" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                      <p className="text-xs text-slate-400"><strong>⚠️ Atenção por idade:</strong> Essencial para zagueiros e laterais. Indica inteligência tática. U13+ começa a ser diferencial importante. Jogadores "inteligentes" têm nota alta aqui.</p>
                    </div>
                  </div>

                  {/* Concentração */}
                  <div className="rounded-xl p-5 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">🎯</span>
                      <div>
                        <h4 className="font-bold text-red-400 text-lg">Concentração</h4>
                        <p className="text-xs text-slate-400">Atenção constante, antecipação de jogadas e capacidade de interceptar passes</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 mt-4">
                      <div className="flex items-start gap-3 p-3 bg-purple-900/30 rounded-lg border border-purple-700">
                        <span className="text-purple-400 font-bold text-lg w-6">5</span>
                        <div>
                          <p className="text-sm font-medium text-purple-300">Excelente - Diferencial claro</p>
                          <p className="text-xs text-purple-200 mt-1">Sempre atento. Antecipa jogadas antes dos outros. Intercepta passes com frequência. Nunca é pego de surpresa. Concentrado do início ao fim. Lê o jogo defensivamente.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-green-900/30 rounded-lg border border-green-700">
                        <span className="text-green-400 font-bold text-lg w-6">4</span>
                        <div>
                          <p className="text-sm font-medium text-green-300">Acima da média - Destaque positivo</p>
                          <p className="text-xs text-green-200 mt-1">Boa concentração. Antecipa situações simples. Intercepta alguns passes. Mantém foco na maior parte do jogo. Raramente é surpreendido.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-900/30 rounded-lg border border-blue-700">
                        <span className="text-blue-400 font-bold text-lg w-6">3</span>
                        <div>
                          <p className="text-sm font-medium text-blue-300">Na média - Adequado para idade</p>
                          <p className="text-xs text-blue-200 mt-1">Mantém foco na maioria do jogo. Algumas antecipações. Às vezes é pego desatento. Concentração inconsistente. Erros pontuais de atenção.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-orange-900/30 rounded-lg border border-orange-700">
                        <span className="text-orange-400 font-bold text-lg w-6">2</span>
                        <div>
                          <p className="text-sm font-medium text-orange-300">Abaixo - Precisa desenvolver</p>
                          <p className="text-xs text-orange-200 mt-1">Desatento com frequência. Pego de surpresa várias vezes. Não antecipa. Perde concentração fácil. Erros por falta de atenção.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-red-900/30 rounded-lg border border-red-700">
                        <span className="text-red-400 font-bold text-lg w-6">1</span>
                        <div>
                          <p className="text-sm font-medium text-red-300">Muito abaixo - Deficiência clara</p>
                          <p className="text-xs text-red-200 mt-1">Completamente desatento. Sempre pego de surpresa. Zero antecipação. "Dorme" em campo. Time sofre gols por desatenção dele. Não pode jogar em posições de responsabilidade.</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 rounded-lg shadow-sm" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                      <p className="text-xs text-slate-400"><strong>⚠️ Atenção por idade:</strong> Crítico para zagueiros e goleiros. Indica maturidade. U15+ a concentração se torna cada vez mais importante. Erros de concentração custam gols.</p>
                    </div>
                  </div>

                  {/* Unidade Defensiva */}
                  <div className="rounded-xl p-5 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">🔗</span>
                      <div>
                        <h4 className="font-bold text-red-400 text-lg">Unidade Defensiva</h4>
                        <p className="text-xs text-slate-400">Conexão com o coletivo na defesa, comunicação, coesão e trabalho em equipe defensivo</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 mt-4">
                      <div className="flex items-start gap-3 p-3 bg-purple-900/30 rounded-lg border border-purple-700">
                        <span className="text-purple-400 font-bold text-lg w-6">5</span>
                        <div>
                          <p className="text-sm font-medium text-purple-300">Excelente - Diferencial claro</p>
                          <p className="text-xs text-purple-200 mt-1">Comunica constantemente. Organiza a defesa. Defende junto com os companheiros. Coeso no sistema. Entende o jogo coletivo defensivo profundamente. Líder defensivo.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-green-900/30 rounded-lg border border-green-700">
                        <span className="text-green-400 font-bold text-lg w-6">4</span>
                        <div>
                          <p className="text-sm font-medium text-green-300">Acima da média - Destaque positivo</p>
                          <p className="text-xs text-green-200 mt-1">Boa comunicação. Defende bem junto. Entende o sistema defensivo. Conectado com companheiros. Participa da organização.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-900/30 rounded-lg border border-blue-700">
                        <span className="text-blue-400 font-bold text-lg w-6">3</span>
                        <div>
                          <p className="text-sm font-medium text-blue-300">Na média - Adequado para idade</p>
                          <p className="text-xs text-blue-200 mt-1">Participa da organização defensiva. Alguma comunicação. Às vezes defende sozinho. Conexão inconsistente com o grupo.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-orange-900/30 rounded-lg border border-orange-700">
                        <span className="text-orange-400 font-bold text-lg w-6">2</span>
                        <div>
                          <p className="text-sm font-medium text-orange-300">Abaixo - Precisa desenvolver</p>
                          <p className="text-xs text-orange-200 mt-1">Pouca comunicação. Defende mais sozinho que junto. Fora do sistema às vezes. Pouca conexão com companheiros na defesa.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-red-900/30 rounded-lg border border-red-700">
                        <span className="text-red-400 font-bold text-lg w-6">1</span>
                        <div>
                          <p className="text-sm font-medium text-red-300">Muito abaixo - Deficiência clara</p>
                          <p className="text-xs text-red-200 mt-1">Defende sozinho sempre. Zero comunicação. Fora do sistema. Não se conecta com ninguém. Desorganiza a defesa. Time fica vulnerável quando ele está em campo.</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 rounded-lg shadow-sm" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                      <p className="text-xs text-slate-400"><strong>⚠️ Atenção por idade:</strong> Fundamental para zagueiros e volantes. Indica maturidade e liderança. Zagueiro central precisa ter nota alta aqui. U15+ essa dimensão define carreiras.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Escala de notas */}
              <div className="rounded-xl p-6 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Escala de Notas (1 a 5)</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <div className="text-center p-3 bg-red-900/30 rounded-lg border border-red-700">
                    <p className="text-2xl font-bold text-red-400">1</p>
                    <p className="text-xs text-red-300">Muito abaixo</p>
                    <p className="text-xs text-slate-400 mt-1">Deficiência clara</p>
                  </div>
                  <div className="text-center p-3 bg-orange-900/30 rounded-lg border border-orange-700">
                    <p className="text-2xl font-bold text-orange-400">2</p>
                    <p className="text-xs text-orange-300">Abaixo</p>
                    <p className="text-xs text-slate-400 mt-1">Precisa desenvolver</p>
                  </div>
                  <div className="text-center p-3 bg-blue-900/30 rounded-lg border border-blue-700">
                    <p className="text-2xl font-bold text-blue-400">3</p>
                    <p className="text-xs text-blue-300">Na media</p>
                    <p className="text-xs text-slate-400 mt-1">Adequado p/ idade</p>
                  </div>
                  <div className="text-center p-3 bg-green-900/30 rounded-lg border border-green-700">
                    <p className="text-2xl font-bold text-green-400">4</p>
                    <p className="text-xs text-green-300">Acima</p>
                    <p className="text-xs text-slate-400 mt-1">Destaque positivo</p>
                  </div>
                  <div className="text-center p-3 bg-purple-900/30 rounded-lg border border-purple-700">
                    <p className="text-2xl font-bold text-purple-400">5</p>
                    <p className="text-xs text-purple-300">Excelente</p>
                    <p className="text-xs text-slate-400 mt-1">Diferencial claro</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Categorias */}
          {activeTab === 'categorias' && (
            <div className="space-y-4">
              {/* Intro */}
              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl p-4 border border-amber-500/30 mb-6">
                <p className="text-sm text-slate-300">
                  <strong>Como usar:</strong> Abra a categoria que vai avaliar e use como checklist durante a observação.
                  Cada idade tem <strong>prioridades diferentes</strong> - o que importa no Sub-9 não é o mesmo que no Sub-17.
                </p>
              </div>

              {/* Sub-7/9 */}
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #475569' }}>
                <button
                  onClick={() => toggleCategoria('sub7')}
                  className="w-full flex items-center justify-between p-4 transition-colors hover:opacity-80"
                  style={{ backgroundColor: '#1e293b' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg text-white flex items-center justify-center font-bold text-lg" style={{ backgroundColor: '#3b82f6' }}>7-9</div>
                    <div className="text-left">
                      <p className="font-semibold text-white text-lg">Sub-7 / Sub-9</p>
                      <p className="text-sm text-white">"Bola e coragem" - Formar gosto pelo jogo e base motora/técnica</p>
                    </div>
                  </div>
                  {categoriaAberta === 'sub7' ? <ChevronDown className="w-6 h-6 text-white" /> : <ChevronRight className="w-6 h-6 text-white" />}
                </button>
                {categoriaAberta === 'sub7' && (
                  <div className="p-5 space-y-5" style={{ backgroundColor: '#0f172a' }}>
                    {/* Foco da Categoria */}
                    <div className="bg-blue-900/40 rounded-lg p-4 border border-blue-700">
                      <h4 className="font-bold text-blue-300 mb-2">🎯 FOCO PRINCIPAL DESTA IDADE</h4>
                      <p className="text-sm text-blue-200">
                        Nesta fase, <strong>NÃO avalie resultado</strong>. Avalie <strong>COMPORTAMENTO e ATITUDE</strong>.
                        O menino que tenta, erra e tenta de novo vale mais que o que acerta por medo de errar.
                        Busque: <strong>coragem + curiosidade + coordenação</strong>.
                      </p>
                    </div>

                    {/* Checklist Técnico */}
                    <div>
                      <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                        <span className="text-xl">⚽</span> Técnico - O que observar
                      </h4>
                      <div className="rounded-lg p-4 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium text-sm text-green-400 mb-2">✓ SINAIS POSITIVOS</p>
                            <ul className="text-sm text-slate-300 space-y-2">
                              <li>• Conduz a bola sem olhar para ela toda hora</li>
                              <li>• Protege a bola colocando corpo entre ela e o adversário</li>
                              <li>• TENTA usar os dois pés (mesmo errando)</li>
                              <li>• Tenta drible 1v1 sem medo</li>
                              <li>• Muda de direção com a bola</li>
                              <li>• Chuta com intenção de gol (não só "afasta")</li>
                              <li>• Consegue receber a bola em movimento</li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium text-sm text-red-400 mb-2">✗ SINAIS DE ALERTA</p>
                            <ul className="text-sm text-slate-400 space-y-2">
                              <li>• Olha só para a bola, nunca levanta cabeça</li>
                              <li>• Sempre chuta para longe quando pressionado</li>
                              <li>• Só usa um pé, evita o outro completamente</li>
                              <li>• Nunca tenta driblar, sempre passa</li>
                              <li>• Fica "duro" com a bola, sem naturalidade</li>
                              <li>• Perde a bola ao menor contato</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Checklist Físico/Motor */}
                    <div>
                      <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                        <span className="text-xl">🏃</span> Físico/Motor - O que observar
                      </h4>
                      <div className="rounded-lg p-4 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium text-sm text-green-400 mb-2">✓ SINAIS POSITIVOS</p>
                            <ul className="text-sm text-slate-300 space-y-2">
                              <li>• Coordenação: freia, arranca, muda direção</li>
                              <li>• Equilíbrio: não cai fácil em contato</li>
                              <li>• Agilidade: reage rápido a mudanças</li>
                              <li>• Consegue correr E pensar ao mesmo tempo</li>
                              <li>• Movimenta-se naturalmente pelo campo</li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium text-sm text-amber-400 mb-2">⚠️ CUIDADO</p>
                            <ul className="text-sm text-slate-400 space-y-2">
                              <li>• NÃO supervalorize tamanho - o grande de hoje pode ser normal amanhã</li>
                              <li>• NÃO supervalorize velocidade pura - maturação precoce engana</li>
                              <li>• VALORIZE coordenação - isso indica potencial real</li>
                              <li>• Menino pequeno e coordenado &gt; grande e desengonçado</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Checklist Mental/Comportamental */}
                    <div>
                      <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                        <span className="text-xl">🧠</span> Mental/Comportamental - O MAIS IMPORTANTE
                      </h4>
                      <div className="rounded-lg p-4 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium text-sm text-green-400 mb-2">✓ SINAIS POSITIVOS</p>
                            <ul className="text-sm text-slate-300 space-y-2">
                              <li>• <strong>NÃO SE ESCONDE</strong> - quer a bola sempre</li>
                              <li>• <strong>TENTA DE NOVO</strong> após errar</li>
                              <li>• <strong>CURIOSO</strong> - quer aprender coisas novas</li>
                              <li>• Compete mesmo perdendo</li>
                              <li>• Não chora/reclama quando erra</li>
                              <li>• Olha para o treinador querendo aprender</li>
                              <li>• Comemora gol do colega</li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium text-sm text-red-400 mb-2">✗ SINAIS DE ALERTA</p>
                            <ul className="text-sm text-slate-400 space-y-2">
                              <li>• Se esconde quando o time está com a bola</li>
                              <li>• Desiste após primeiro erro</li>
                              <li>• Chora/reclama constantemente</li>
                              <li>• Só quer jogar se for fácil/ganhar</li>
                              <li>• Culpa os colegas pelos erros</li>
                              <li>• Não aceita correção do treinador</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tático Básico */}
                    <div>
                      <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                        <span className="text-xl">📋</span> Tático Básico - Só o essencial
                      </h4>
                      <div className="rounded-lg p-4 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                        <p className="text-sm text-slate-400 mb-3">Nesta idade, só observe se ele entende o BÁSICO:</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="p-3 bg-green-900/30 rounded-lg border border-green-700">
                            <p className="text-sm text-green-300 font-medium">✓ Entende "atacar o gol"</p>
                            <p className="text-xs text-green-200">Quando tem a bola, vai em direção ao gol adversário</p>
                          </div>
                          <div className="p-3 bg-green-900/30 rounded-lg border border-green-700">
                            <p className="text-sm text-green-300 font-medium">✓ Entende "defender o gol"</p>
                            <p className="text-xs text-green-200">Quando perde, volta para ajudar</p>
                          </div>
                          <div className="p-3 bg-green-900/30 rounded-lg border border-green-700">
                            <p className="text-sm text-green-300 font-medium">✓ Vê companheiro livre</p>
                            <p className="text-xs text-green-200">Às vezes passa para quem está melhor posicionado</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Perguntas Práticas */}
                    <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700">
                      <p className="font-bold text-sm text-purple-300 mb-3 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" /> PERGUNTAS QUE VOCÊ DEVE FAZER ENQUANTO OBSERVA
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <ul className="text-sm text-purple-200 space-y-2">
                          <li>• Quantas vezes ele PEDIU a bola?</li>
                          <li>• Quantas vezes TENTOU driblar (1v1)?</li>
                          <li>• Quantas vezes RECUPEROU bola por iniciativa?</li>
                          <li>• Depois de ERRAR, voltou pro jogo ou sumiu?</li>
                        </ul>
                        <ul className="text-sm text-purple-200 space-y-2">
                          <li>• Ele COMPETE mesmo perdendo?</li>
                          <li>• Ele TENTA coisas difíceis ou só o fácil?</li>
                          <li>• Ele se DIVERTE jogando?</li>
                          <li>• Ele OUVE o treinador?</li>
                        </ul>
                      </div>
                    </div>

                    {/* Resumo Final */}
                    <div className="flex items-start gap-3 p-4 bg-green-900/30 rounded-lg border border-green-700">
                      <Star className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-green-300 text-lg">TALENTO NESTA IDADE =</p>
                        <p className="text-green-200 mt-1">"Corajoso + Curioso + Coordenado"</p>
                        <p className="text-sm text-green-200 mt-2">O menino que tenta, erra, tenta de novo. Que quer a bola. Que não tem medo. Que se movimenta bem. Mesmo que erre muito - o que importa é a ATITUDE.</p>
                        <div className="mt-3 p-2 bg-red-900/50 rounded border border-red-700">
                          <p className="text-xs text-red-300 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> <strong>ARMADILHA CLÁSSICA:</strong> Escolher o maior/mais forte/mais rápido. Na base, isso é maturação precoce - não talento real.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sub-11 */}
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #475569' }}>
                <button
                  onClick={() => toggleCategoria('sub11')}
                  className="w-full flex items-center justify-between p-4 transition-colors hover:opacity-80"
                  style={{ backgroundColor: '#1e293b' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg text-white flex items-center justify-center font-bold text-lg" style={{ backgroundColor: '#22c55e' }}>11</div>
                    <div className="text-left">
                      <p className="font-semibold text-white text-lg">Sub-11</p>
                      <p className="text-sm text-white">"Cabeça levantada" - Transformar "eu e a bola" em "eu, a bola e o espaço"</p>
                    </div>
                  </div>
                  {categoriaAberta === 'sub11' ? <ChevronDown className="w-6 h-6 text-white" /> : <ChevronRight className="w-6 h-6 text-white" />}
                </button>
                {categoriaAberta === 'sub11' && (
                  <div className="p-5 space-y-5" style={{ backgroundColor: '#0f172a' }}>
                    {/* Foco da Categoria */}
                    <div className="bg-green-900/40 rounded-lg p-4 border border-green-700">
                      <h4 className="font-bold text-green-300 mb-2">🎯 FOCO PRINCIPAL DESTA IDADE</h4>
                      <p className="text-sm text-green-200">
                        <strong>"IDADE DE OURO"</strong> - O que ele aprender agora fica para sempre. Foco em:
                        <strong> levantar a cabeça</strong> (ver o jogo), <strong>primeiro toque orientado</strong> e
                        <strong> começar a entender espaços</strong>. Busque: velocidade de decisão + variedade de soluções.
                      </p>
                    </div>

                    {/* Nota Sub-10 vs Sub-11 */}
                    <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-600">
                      <h4 className="font-bold text-blue-300 mb-2 flex items-center gap-2">
                        <span>📝</span> NOTA: Avaliando Sub-10 vs Sub-11
                      </h4>
                      <div className="text-sm text-blue-200 space-y-2">
                        <p><strong>Sub-10</strong> = está <strong>começando</strong> a transição. Use este checklist, mas:</p>
                        <ul className="ml-4 space-y-1">
                          <li>• Aceite que ainda olha muito para a bola (normal)</li>
                          <li>• Valorize MOMENTOS de cabeça levantada, não consistência</li>
                          <li>• Primeiro toque orientado pode ser raro ainda</li>
                          <li>• Foque na TENDÊNCIA de melhora, não no nível atual</li>
                        </ul>
                        <p className="mt-2"><strong>Sub-11</strong> = deve mostrar esses comportamentos com mais frequência. É a idade de FIXAR esses hábitos.</p>
                      </div>
                    </div>

                    {/* Checklist Técnico */}
                    <div>
                      <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                        <span className="text-xl">⚽</span> Técnico - O que observar
                      </h4>
                      <div className="rounded-lg p-4 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium text-sm text-green-400 mb-2">✓ SINAIS POSITIVOS</p>
                            <ul className="text-sm text-slate-300 space-y-2">
                              <li>• <strong>Primeiro toque ORIENTADO</strong> - não só domina, já prepara a próxima ação</li>
                              <li>• Conduz E levanta a cabeça ao mesmo tempo</li>
                              <li>• Passe curto com qualidade e intenção</li>
                              <li>• Finaliza com colocação (não só força)</li>
                              <li>• Usa os dois pés em situações de jogo</li>
                              <li>• Drible com OBJETIVO (progredir, não show)</li>
                              <li>• Consegue receber de costas e girar</li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium text-sm text-red-400 mb-2">✗ SINAIS DE ALERTA</p>
                            <ul className="text-sm text-slate-400 space-y-2">
                              <li>• Domina "para baixo" - sempre para o pé</li>
                              <li>• Não levanta a cabeça enquanto conduz</li>
                              <li>• Só chuta forte, sem colocação</li>
                              <li>• Evita completamente o pé não-dominante</li>
                              <li>• Dribla só por driblar (sem objetivo)</li>
                              <li>• Passe sempre no mesmo ritmo</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Checklist Tático */}
                    <div>
                      <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                        <span className="text-xl">📋</span> Tático - Começa a ser importante
                      </h4>
                      <div className="rounded-lg p-4 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium text-sm text-green-400 mb-2">✓ SINAIS POSITIVOS</p>
                            <ul className="text-sm text-slate-300 space-y-2">
                              <li>• <strong>ESCANEIA</strong> antes de receber (olha ao redor)</li>
                              <li>• Ocupa espaços (abre largura, dá profundidade)</li>
                              <li>• Entende triângulos simples (apoio, linha de passe)</li>
                              <li>• Entende 2v1 básico (quando passar, quando conduzir)</li>
                              <li>• Reage à perda (pressiona ou volta)</li>
                              <li>• Se oferece para receber a bola</li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium text-sm text-red-400 mb-2">✗ SINAIS DE ALERTA</p>
                            <ul className="text-sm text-slate-400 space-y-2">
                              <li>• Nunca olha antes de receber</li>
                              <li>• Fica atrás do marcador (na sombra)</li>
                              <li>• Não entende quando é 2v1</li>
                              <li>• Não volta quando perde a bola</li>
                              <li>• Fica parado esperando a bola chegar</li>
                              <li>• Sempre na mesma posição</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Checklist Mental/Decisão */}
                    <div>
                      <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                        <span className="text-xl">🧠</span> Mental/Decisão - Diferencial nesta idade
                      </h4>
                      <div className="rounded-lg p-4 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium text-sm text-green-400 mb-2">✓ SINAIS POSITIVOS</p>
                            <ul className="text-sm text-slate-300 space-y-2">
                              <li>• <strong>DECIDE RÁPIDO</strong> - não segura a bola demais</li>
                              <li>• Escolhe bem entre passe vs drible</li>
                              <li>• Tem MAIS DE UMA solução (variedade)</li>
                              <li>• Entende "momento" (acelerar x pausar)</li>
                              <li>• Sob pressão, encontra saída</li>
                              <li>• Aceita correção e aplica</li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium text-sm text-red-400 mb-2">✗ SINAIS DE ALERTA</p>
                            <ul className="text-sm text-slate-400 space-y-2">
                              <li>• Segura a bola até perder</li>
                              <li>• Só tem uma solução (ou só dribla ou só passa)</li>
                              <li>• Sempre no mesmo ritmo</li>
                              <li>• Apavora sob pressão</li>
                              <li>• Não aprende com os erros</li>
                              <li>• Repete o mesmo erro várias vezes</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Perguntas Práticas */}
                    <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700">
                      <p className="font-bold text-sm text-purple-300 mb-3 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" /> PERGUNTAS QUE VOCÊ DEVE FAZER ENQUANTO OBSERVA
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <ul className="text-sm text-purple-200 space-y-2">
                          <li>• Antes de receber: ele OLHA ao redor?</li>
                          <li>• Primeiro toque: prepara a próxima ação?</li>
                          <li>• Quando pressionado: se livra bem ou apavora?</li>
                          <li>• Quando tem 2 opções: escolhe a melhor?</li>
                        </ul>
                        <ul className="text-sm text-purple-200 space-y-2">
                          <li>• Ele tem MAIS DE UMA solução?</li>
                          <li>• Ele ACELERA quando precisa, PAUSA quando precisa?</li>
                          <li>• Depois de perder, ele REAGE (pressiona/volta)?</li>
                          <li>• Ele APRENDE durante o jogo?</li>
                        </ul>
                      </div>
                    </div>

                    {/* Resumo Final */}
                    <div className="flex items-start gap-3 p-4 bg-green-900/30 rounded-lg border border-green-700">
                      <Star className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-green-300 text-lg">TALENTO NESTA IDADE =</p>
                        <p className="text-green-200 mt-1">"Pensa cedo + Executa simples + Tem variedade"</p>
                        <p className="text-sm text-green-200 mt-2">O menino que olha antes de receber, que decide rápido, que tem mais de uma solução. Que não segura a bola demais. Que encontra saída sob pressão.</p>
                        <div className="mt-3 p-2 bg-red-900/50 rounded border border-red-700">
                          <p className="text-xs text-red-300 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> <strong>ARMADILHA CLÁSSICA:</strong> Achar que "driblador" é sempre o melhor. O que dribla 10 e acerta 2 perde para quem pensa rápido e executa simples.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sub-13 */}
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #475569' }}>
                <button
                  onClick={() => toggleCategoria('sub13')}
                  className="w-full flex items-center justify-between p-4 transition-colors hover:opacity-80"
                  style={{ backgroundColor: '#1e293b' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg text-white flex items-center justify-center font-bold text-lg" style={{ backgroundColor: '#eab308' }}>13</div>
                    <div className="text-left">
                      <p className="font-semibold text-white text-lg">Sub-13</p>
                      <p className="text-sm text-white">"O jogo começa sem a bola" - Consolidar técnica sob pressão + princípios táticos</p>
                    </div>
                  </div>
                  {categoriaAberta === 'sub13' ? <ChevronDown className="w-6 h-6 text-white" /> : <ChevronRight className="w-6 h-6 text-white" />}
                </button>
                {categoriaAberta === 'sub13' && (
                  <div className="p-5 space-y-5" style={{ backgroundColor: '#0f172a' }}>
                    {/* Foco da Categoria */}
                    <div className="bg-yellow-900/40 rounded-lg p-4 border border-yellow-700">
                      <h4 className="font-bold text-yellow-300 mb-2">🎯 FOCO PRINCIPAL DESTA IDADE</h4>
                      <p className="text-sm text-yellow-200">
                        Aqui o jogo muda: <strong>o que ele faz SEM A BOLA</strong> importa tanto quanto com a bola.
                        Foco em: <strong>técnica sob pressão</strong>, <strong>princípios táticos</strong> e
                        <strong> ações sem bola</strong>. Busque: quem entende espaço + aprende rápido + compete.
                      </p>
                    </div>

                    {/* Nota Sub-12 vs Sub-13 */}
                    <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-600">
                      <h4 className="font-bold text-blue-300 mb-2 flex items-center gap-2">
                        <span>📝</span> NOTA: Avaliando Sub-12 vs Sub-13
                      </h4>
                      <div className="text-sm text-blue-200 space-y-2">
                        <p><strong>Sub-12</strong> = está <strong>entrando</strong> nesta fase. Use este checklist, mas com régua mais leve:</p>
                        <ul className="ml-4 space-y-1">
                          <li>• Aceite mais erros de execução sob pressão</li>
                          <li>• Valorize quem TENTA fazer sem bola, mesmo errando</li>
                          <li>• Foque na ATITUDE de buscar princípios táticos</li>
                          <li>• Técnica individual ainda pode estar em desenvolvimento</li>
                        </ul>
                        <p className="mt-2"><strong>Sub-13</strong> = deve <strong>demonstrar</strong> esses conceitos com mais consistência. Cobrança maior.</p>
                      </div>
                    </div>

                    {/* Checklist Técnico */}
                    <div>
                      <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                        <span className="text-xl">⚽</span> Técnico SOB PRESSÃO - O diferencial
                      </h4>
                      <div className="rounded-lg p-4 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium text-sm text-green-400 mb-2">✓ SINAIS POSITIVOS</p>
                            <ul className="text-sm text-slate-300 space-y-2">
                              <li>• Primeiro toque para FUGIR da pressão</li>
                              <li>• Passe em apoio E passe vertical (tem os dois)</li>
                              <li>• Condução para ATRAIR e SOLTAR</li>
                              <li>• 1v1 com OBJETIVO (progredir, não show)</li>
                              <li>• Mantém qualidade mesmo cansado</li>
                              <li>• Gira bem quando recebe de costas</li>
                              <li>• Finaliza sob pressão</li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium text-sm text-red-400 mb-2">✗ SINAIS DE ALERTA</p>
                            <ul className="text-sm text-slate-400 space-y-2">
                              <li>• Perde qualidade sob pressão</li>
                              <li>• Só tem passe curto OU só tem passe longo</li>
                              <li>• Conduz sem objetivo (não atrai ninguém)</li>
                              <li>• 1v1 só para aparecer (sem ganho real)</li>
                              <li>• Apavora quando marcado de perto</li>
                              <li>• Não consegue girar, sempre volta</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Checklist Tático */}
                    <div>
                      <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                        <span className="text-xl">📋</span> Tático - Princípios de jogo
                      </h4>
                      <div className="rounded-lg p-4 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                        <p className="text-xs text-amber-400 mb-3">⚠️ Nesta idade, comece a avaliar PRINCÍPIOS TÁTICOS, não só ações individuais</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium text-sm text-green-400 mb-2">✓ FASE OFENSIVA</p>
                            <ul className="text-sm text-slate-300 space-y-2">
                              <li>• <strong>Amplitude</strong>: abre o campo, dá largura</li>
                              <li>• <strong>Profundidade</strong>: ataca espaços nas costas</li>
                              <li>• <strong>Entrelinhas</strong>: acha espaço entre linhas adversárias</li>
                              <li>• <strong>Apoio</strong>: se oferece para o portador da bola</li>
                              <li>• <strong>Mobilidade</strong>: troca de posição com inteligência</li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium text-sm text-green-400 mb-2">✓ FASE DEFENSIVA</p>
                            <ul className="text-sm text-slate-300 space-y-2">
                              <li>• <strong>Pressão com direção</strong>: força para um lado</li>
                              <li>• <strong>Cobertura</strong>: protege o companheiro</li>
                              <li>• <strong>Balanço</strong>: mantém distâncias</li>
                              <li>• <strong>Transição</strong>: recompõe por dentro</li>
                              <li>• <strong>Concentração</strong>: não desliga nunca</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* O SEGREDO: Jogo sem bola */}
                    <div>
                      <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                        <span className="text-xl">👟</span> JOGO SEM BOLA - Onde você vê o talento real
                      </h4>
                      <div className="rounded-lg p-4 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                        <p className="text-sm text-amber-300 mb-3 font-medium">🔑 SEGREDO: O talento de verdade aparece no que ele faz QUANDO NÃO TEM A BOLA</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium text-sm text-green-400 mb-2">✓ SINAIS DE TALENTO REAL</p>
                            <ul className="text-sm text-slate-300 space-y-2">
                              <li>• <strong>Cria linha de passe</strong> antes de pedir</li>
                              <li>• <strong>Desmarca</strong> com timing certo</li>
                              <li>• <strong>Dá cobertura</strong> sem ninguém pedir</li>
                              <li>• <strong>Fecha linha</strong> quando time perde</li>
                              <li>• <strong>Comunica</strong>: "vira", "homem", "tempo"</li>
                              <li>• <strong>Antecipa</strong>: está no lugar certo antes</li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium text-sm text-red-400 mb-2">✗ SINAIS DE ALERTA</p>
                            <ul className="text-sm text-slate-400 space-y-2">
                              <li>• Só aparece quando tem a bola</li>
                              <li>• Fica na sombra do marcador</li>
                              <li>• Não dá cobertura</li>
                              <li>• Não volta quando perde</li>
                              <li>• Não comunica nada</li>
                              <li>• Sempre chega atrasado</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Perguntas Práticas */}
                    <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700">
                      <p className="font-bold text-sm text-purple-300 mb-3 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" /> PERGUNTAS QUE VOCÊ DEVE FAZER ENQUANTO OBSERVA
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <ul className="text-sm text-purple-200 space-y-2">
                          <li>• Quantas AÇÕES ÚTEIS sem bola ele faz por minuto?</li>
                          <li>• Sob PRESSÃO: acha solução ou perde?</li>
                          <li>• Ele entende QUANDO pressionar e quando esperar?</li>
                          <li>• Ele DÁ COBERTURA sem ninguém pedir?</li>
                        </ul>
                        <ul className="text-sm text-purple-200 space-y-2">
                          <li>• Ele COMUNICA em campo?</li>
                          <li>• Consegue cumprir FUNÇÃO + ser criativo?</li>
                          <li>• Ele APRENDE rápido (uma correção basta)?</li>
                          <li>• Ele tenta PASSE VERTICAL (valorize a intenção)?</li>
                        </ul>
                      </div>
                    </div>

                    {/* Resumo Final */}
                    <div className="flex items-start gap-3 p-4 bg-green-900/30 rounded-lg border border-green-700">
                      <Star className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-green-300 text-lg">TALENTO NESTA IDADE =</p>
                        <p className="text-green-200 mt-1">"Entende espaço + Aprende rápido + Compete + Joga sem bola"</p>
                        <p className="text-sm text-green-200 mt-2">O menino que sabe onde estar ANTES da bola chegar. Que dá cobertura sem pedir. Que comunica. Que entende o jogo coletivo. Que aprende com uma correção.</p>
                        <div className="mt-3 p-2 bg-red-900/50 rounded border border-red-700">
                          <p className="text-xs text-red-300 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> <strong>ARMADILHA CLÁSSICA:</strong> Punir quem tenta passe vertical e erra. Olhe a INTENÇÃO - quem tenta progredir o jogo é mais valioso que quem só joga para trás.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sub-15 */}
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #475569' }}>
                <button
                  onClick={() => toggleCategoria('sub15')}
                  className="w-full flex items-center justify-between p-4 transition-colors hover:opacity-80"
                  style={{ backgroundColor: '#1e293b' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg text-white flex items-center justify-center font-bold text-lg" style={{ backgroundColor: '#f97316' }}>15</div>
                    <div className="text-left">
                      <p className="font-semibold text-white text-lg">Sub-15</p>
                      <p className="text-sm text-white">"Função e intensidade" - Aplicar modelo do treinador, repetição e competitividade</p>
                    </div>
                  </div>
                  {categoriaAberta === 'sub15' ? <ChevronDown className="w-6 h-6 text-white" /> : <ChevronRight className="w-6 h-6 text-white" />}
                </button>
                {categoriaAberta === 'sub15' && (
                  <div className="p-5 space-y-5" style={{ backgroundColor: '#0f172a' }}>
                    {/* Foco da Categoria */}
                    <div className="bg-orange-900/40 rounded-lg p-4 border border-orange-700">
                      <h4 className="font-bold text-orange-300 mb-2">🎯 FOCO PRINCIPAL DESTA IDADE</h4>
                      <p className="text-sm text-orange-200">
                        Aqui começa o futebol "de verdade": <strong>função específica</strong>, <strong>consistência</strong> e
                        <strong> intensidade</strong>. Não basta ter talento - precisa REPETIR o correto 10x no jogo.
                        Busque: rendimento repetível + disciplina tática + competitividade.
                      </p>
                    </div>

                    {/* Nota Sub-14 vs Sub-15 */}
                    <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-600">
                      <h4 className="font-bold text-blue-300 mb-2 flex items-center gap-2">
                        <span>📝</span> NOTA: Avaliando Sub-14 vs Sub-15
                      </h4>
                      <div className="text-sm text-blue-200 space-y-2">
                        <p><strong>Sub-14</strong> = está <strong>aprendendo</strong> a função. Use este checklist, mas:</p>
                        <ul className="ml-4 space-y-1">
                          <li>• Aceite inconsistência na execução da função (3-4 acertos em 10)</li>
                          <li>• Valorize quem ENTENDE o que deveria fazer, mesmo errando</li>
                          <li>• Foque na capacidade de APRENDER e CORRIGIR durante o jogo</li>
                          <li>• Tolere mais oscilação física (puberdade em andamento)</li>
                          <li>• Observe a ATITUDE diante da cobrança tática</li>
                        </ul>
                        <p className="mt-2"><strong>Sub-15</strong> = deve <strong>dominar</strong> a função. Cobrança por consistência (7-8 acertos em 10). Quem ainda "não sabe o que fazer" está atrasado.</p>
                      </div>
                    </div>

                    {/* Checklist por Função */}
                    <div>
                      <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                        <span className="text-xl">👤</span> CHECKLIST POR POSIÇÃO - O que cada função DEVE fazer
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div className="rounded-lg p-4 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                          <p className="font-bold text-sm text-blue-400 mb-2">🔵 LATERAL</p>
                          <ul className="text-xs text-slate-300 space-y-1">
                            <li>✓ Timing de apoio (quando subir)</li>
                            <li>✓ Cobertura ao zagueiro</li>
                            <li>✓ Cruzamento com qualidade</li>
                            <li>✓ 1v1 defensivo</li>
                            <li>✓ Transição: volta rápido</li>
                            <li className="text-red-400">✗ Sobe e não volta</li>
                            <li className="text-red-400">✗ Cruza sem olhar</li>
                          </ul>
                        </div>
                        <div className="rounded-lg p-4 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                          <p className="font-bold text-sm text-green-400 mb-2">🟢 ZAGUEIRO</p>
                          <ul className="text-xs text-slate-300 space-y-1">
                            <li>✓ Linha alta ou baixa (conforme time)</li>
                            <li>✓ Cobertura ao companheiro</li>
                            <li>✓ Passe de ruptura (vertical)</li>
                            <li>✓ Duelo aéreo</li>
                            <li>✓ Comunicação constante</li>
                            <li className="text-red-400">✗ Chutão sem necessidade</li>
                            <li className="text-red-400">✗ Não comunica</li>
                          </ul>
                        </div>
                        <div className="rounded-lg p-4 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                          <p className="font-bold text-sm text-yellow-400 mb-2">🟡 VOLANTE</p>
                          <ul className="text-xs text-slate-300 space-y-1">
                            <li>✓ Primeiro passe com qualidade</li>
                            <li>✓ Orientação corporal (ver o jogo)</li>
                            <li>✓ Cobertura central</li>
                            <li>✓ Filtro: interceptações</li>
                            <li>✓ Distribuição: curto e longo</li>
                            <li className="text-red-400">✗ Só joga para trás</li>
                            <li className="text-red-400">✗ Perde posição</li>
                          </ul>
                        </div>
                        <div className="rounded-lg p-4 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                          <p className="font-bold text-sm text-purple-400 mb-2">🟣 MEIA</p>
                          <ul className="text-xs text-slate-300 space-y-1">
                            <li>✓ Receber entrelinhas</li>
                            <li>✓ Girar e progredir</li>
                            <li>✓ Acelerar o jogo</li>
                            <li>✓ Último passe</li>
                            <li>✓ Chegada na área</li>
                            <li className="text-red-400">✗ Só recebe de frente</li>
                            <li className="text-red-400">✗ Segura demais</li>
                          </ul>
                        </div>
                        <div className="rounded-lg p-4 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                          <p className="font-bold text-sm text-cyan-400 mb-2">🔷 PONTA</p>
                          <ul className="text-xs text-slate-300 space-y-1">
                            <li>✓ Amplitude (abrir o campo)</li>
                            <li>✓ 1v1 com objetivo</li>
                            <li>✓ Ataque ao espaço</li>
                            <li>✓ Finalização</li>
                            <li>✓ Recomposição defensiva</li>
                            <li className="text-red-400">✗ Só dribla, não finaliza</li>
                            <li className="text-red-400">✗ Não volta</li>
                          </ul>
                        </div>
                        <div className="rounded-lg p-4 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                          <p className="font-bold text-sm text-red-400 mb-2">🔴 CENTROAVANTE</p>
                          <ul className="text-xs text-slate-300 space-y-1">
                            <li>✓ Apoios (pivô, referência)</li>
                            <li>✓ Ataque à profundidade</li>
                            <li>✓ Pressão inicial (primeiro defensor)</li>
                            <li>✓ Finalização variada</li>
                            <li>✓ Jogo aéreo</li>
                            <li className="text-red-400">✗ Só espera cruzamento</li>
                            <li className="text-red-400">✗ Não pressiona</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Fase Defensiva e Físico/Mental */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                          <span className="text-xl">🛡️</span> FASE DEFENSIVA - Todos
                        </h4>
                        <div className="rounded-lg p-4 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                          <ul className="text-sm text-slate-300 space-y-2">
                            <li>✓ <strong>Compactação</strong>: distância entre linhas</li>
                            <li>✓ <strong>Pressão coordenada</strong>: time junto</li>
                            <li>✓ <strong>Reação pós-perda</strong>: gatilhos de pressão</li>
                            <li>✓ <strong>Transição</strong>: volta rápido por dentro</li>
                            <li>✓ <strong>Marcação</strong>: individual ou por zona</li>
                          </ul>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                          <span className="text-xl">🏃</span> FÍSICO/MENTAL - Diferencial
                        </h4>
                        <div className="rounded-lg p-4 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                          <ul className="text-sm text-slate-300 space-y-2">
                            <li>✓ <strong>Repetição</strong>: alta intensidade o jogo todo</li>
                            <li>✓ <strong>Consistência</strong>: 2º tempo igual ao 1º</li>
                            <li>✓ <strong>Disciplina</strong>: segue o modelo tático</li>
                            <li>✓ <strong>Competitividade</strong>: quer ganhar</li>
                            <li>✓ <strong>Aceita correção</strong>: aplica o que ouve</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Perguntas Práticas */}
                    <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700">
                      <p className="font-bold text-sm text-purple-300 mb-3 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" /> PERGUNTAS QUE VOCÊ DEVE FAZER ENQUANTO OBSERVA
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <ul className="text-sm text-purple-200 space-y-2">
                          <li>• Quantas vezes cumpre a FUNÇÃO corretamente?</li>
                          <li>• Ele REPETE o correto ou só faz uma vez?</li>
                          <li>• Participa das TRANSIÇÕES (ataque e defesa)?</li>
                          <li>• Tem quedas de CONCENTRAÇÃO?</li>
                        </ul>
                        <ul className="text-sm text-purple-200 space-y-2">
                          <li>• 2º tempo igual ao 1º (CONSISTÊNCIA)?</li>
                          <li>• Segue o MODELO TÁTICO do treinador?</li>
                          <li>• ACEITA correção e APLICA?</li>
                          <li>• COMPETE mesmo quando difícil?</li>
                        </ul>
                      </div>
                    </div>

                    {/* Resumo Final */}
                    <div className="flex items-start gap-3 p-4 bg-green-900/30 rounded-lg border border-green-700">
                      <Star className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-green-300 text-lg">TALENTO NESTA IDADE =</p>
                        <p className="text-green-200 mt-1">"Rendimento repetível + Disciplina tática + Competitividade"</p>
                        <p className="text-sm text-green-200 mt-2">O jogador que faz o correto 10x no jogo, não só uma vez. Que mantém intensidade. Que segue a função. Que compete até o final. Que aceita correção e aplica.</p>
                        <div className="mt-3 p-2 bg-red-900/50 rounded border border-red-700">
                          <p className="text-xs text-red-300 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> <strong>ARMADILHA CLÁSSICA:</strong> Escolher só por físico/velocidade. O rápido que não pensa perde para o inteligente que repete. Maturação precoce ainda engana muito nessa idade.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sub-17 */}
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #475569' }}>
                <button
                  onClick={() => toggleCategoria('sub17')}
                  className="w-full flex items-center justify-between p-4 transition-colors hover:opacity-80"
                  style={{ backgroundColor: '#1e293b' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg text-white flex items-center justify-center font-bold text-lg" style={{ backgroundColor: '#ef4444' }}>17</div>
                    <div className="text-left">
                      <p className="font-semibold text-white text-lg">Sub-17</p>
                      <p className="text-sm text-white">"Pronto para competir" - Performance, consistência, decisões sob pressão</p>
                    </div>
                  </div>
                  {categoriaAberta === 'sub17' ? <ChevronDown className="w-6 h-6 text-white" /> : <ChevronRight className="w-6 h-6 text-white" />}
                </button>
                {categoriaAberta === 'sub17' && (
                  <div className="p-5 space-y-5" style={{ backgroundColor: '#0f172a' }}>
                    {/* Foco da Categoria */}
                    <div className="bg-red-900/40 rounded-lg p-4 border border-red-700">
                      <h4 className="font-bold text-red-300 mb-2">🎯 FOCO PRINCIPAL DESTA IDADE</h4>
                      <p className="text-sm text-red-200">
                        Aqui a pergunta é: <strong>"Se eu colocar no Sub-20/Profissional amanhã, ele aguenta?"</strong>
                        Foco em: <strong>transferência</strong> (o que ele faz serve em nível acima),
                        <strong> consistência total</strong> e <strong>decisões sob pressão máxima</strong>.
                        Busque: confiável + competitivo + inteligente.
                      </p>
                    </div>

                    {/* Nota Sub-16 vs Sub-17 */}
                    <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-600">
                      <h4 className="font-bold text-blue-300 mb-2 flex items-center gap-2">
                        <span>📝</span> NOTA: Avaliando Sub-16 vs Sub-17
                      </h4>
                      <div className="text-sm text-blue-200 space-y-2">
                        <p><strong>Sub-16</strong> = está <strong>finalizando</strong> a formação. Use este checklist, mas:</p>
                        <ul className="ml-4 space-y-1">
                          <li>• Aceite alguma oscilação de rendimento (ainda amadurecendo)</li>
                          <li>• Valorize PICOS de performance, não só média</li>
                          <li>• Fisicamente pode ainda estar em desenvolvimento final</li>
                          <li>• Observe como reage à pressão de "última chance"</li>
                          <li>• Foque na TRAJETÓRIA de evolução no último ano</li>
                        </ul>
                        <p className="mt-2"><strong>Sub-17</strong> = é a "vitrine final". Deve estar PRONTO ou muito próximo. Pouca margem para "vai melhorar". O que ele é agora é o que vai para o profissional.</p>
                      </div>
                    </div>

                    {/* Performance/Técnico */}
                    <div>
                      <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                        <span className="text-xl">⚽</span> PERFORMANCE - Execução em alta velocidade
                      </h4>
                      <div className="rounded-lg p-4 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium text-sm text-green-400 mb-2">✓ SINAIS DE "PRONTO"</p>
                            <ul className="text-sm text-slate-300 space-y-2">
                              <li>• Executa técnico + tático em ALTA VELOCIDADE</li>
                              <li>• Qualidade se mantém sob PRESSÃO e CANSAÇO</li>
                              <li>• Consegue MUDAR O JOGO com uma decisão</li>
                              <li>• Resolve em ESPAÇO REDUZIDO</li>
                              <li>• Finaliza sob marcação</li>
                              <li>• Passes decisivos em momentos importantes</li>
                              <li>• Duelos: ganha a maioria</li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium text-sm text-red-400 mb-2">✗ SINAIS DE "NÃO ESTÁ PRONTO"</p>
                            <ul className="text-sm text-slate-400 space-y-2">
                              <li>• Perde qualidade quando acelera</li>
                              <li>• Desaparece sob pressão ou cansaço</li>
                              <li>• Só funciona com espaço</li>
                              <li>• Não resolve jogos</li>
                              <li>• Perde duelos importantes</li>
                              <li>• Evita responsabilidade em momentos-chave</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Inteligência Tática */}
                    <div>
                      <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                        <span className="text-xl">🧠</span> INTELIGÊNCIA TÁTICA - Leitura de jogo avançada
                      </h4>
                      <div className="rounded-lg p-4 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium text-sm text-green-400 mb-2">✓ SINAIS DE "PRONTO"</p>
                            <ul className="text-sm text-slate-300 space-y-2">
                              <li>• Reconhece GATILHOS (quando pressionar/saltar/temporizar)</li>
                              <li>• Joga com o TEMPO DO JOGO (acelera/pausa conforme situação)</li>
                              <li>• INTELIGÊNCIA DEFENSIVA (falta tática, proteger zona)</li>
                              <li>• ANTECIPA jogadas (está no lugar certo)</li>
                              <li>• Entende MOMENTO (quando arriscar, quando segurar)</li>
                              <li>• Adapta ao adversário durante o jogo</li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium text-sm text-red-400 mb-2">✗ SINAIS DE "NÃO ESTÁ PRONTO"</p>
                            <ul className="text-sm text-slate-400 space-y-2">
                              <li>• Não lê os gatilhos do jogo</li>
                              <li>• Sempre no mesmo ritmo</li>
                              <li>• Não faz falta tática quando precisa</li>
                              <li>• Chega atrasado nas jogadas</li>
                              <li>• Não adapta ao que acontece</li>
                              <li>• Arrisca na hora errada</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Físico e Mental */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                          <span className="text-xl">🏃</span> FÍSICO - Robustez
                        </h4>
                        <div className="rounded-lg p-4 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                          <p className="font-medium text-sm text-green-400 mb-2">✓ SINAIS DE "PRONTO"</p>
                          <ul className="text-sm text-slate-300 space-y-2">
                            <li>• Intensidade SUSTENTADA (90 min)</li>
                            <li>• ROBUSTEZ: aguenta duelos, contato</li>
                            <li>• RECUPERAÇÃO: volta rápido após esforço</li>
                            <li>• 2º tempo IGUAL ao 1º</li>
                            <li>• Não "some" nos minutos finais</li>
                          </ul>
                          <p className="font-medium text-sm text-red-400 mt-3 mb-2">✗ ALERTA</p>
                          <ul className="text-sm text-slate-400 space-y-1">
                            <li>• Cai de rendimento no 2º tempo</li>
                            <li>• Evita contato físico</li>
                            <li>• "Some" quando cansa</li>
                          </ul>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                          <span className="text-xl">🔥</span> MENTAL - Competidor
                        </h4>
                        <div className="rounded-lg p-4 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                          <p className="font-medium text-sm text-green-400 mb-2">✓ SINAIS DE "PRONTO"</p>
                          <ul className="text-sm text-slate-300 space-y-2">
                            <li>• LIDERANÇA: comunica, organiza</li>
                            <li>• FRIEZA em jogo grande</li>
                            <li>• RESPONSABILIDADE: quer a bola na hora difícil</li>
                            <li>• COMPETE até o final</li>
                            <li>• Não desiste quando está perdendo</li>
                          </ul>
                          <p className="font-medium text-sm text-red-400 mt-3 mb-2">✗ ALERTA</p>
                          <ul className="text-sm text-slate-400 space-y-1">
                            <li>• Se esconde em momentos decisivos</li>
                            <li>• Reclama demais</li>
                            <li>• Desiste quando difícil</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* A Pergunta Final */}
                    <div className="bg-blue-900/40 rounded-lg p-4 border border-blue-700">
                      <p className="font-bold text-blue-300 mb-2 flex items-center gap-2">
                        <Eye className="w-5 h-5" /> A PERGUNTA QUE VOCÊ DEVE FAZER
                      </p>
                      <p className="text-lg text-blue-200 font-medium">
                        "Se eu colocar esse jogador num Sub-20 ou Profissional AMANHÃ, ele SOBREVIVE?"
                      </p>
                      <p className="text-sm text-blue-200 mt-2">
                        Não basta ser bom contra jogadores da mesma idade. Avalie TRANSFERÊNCIA:
                        o que ele faz serve em nível acima? Ele aguenta o ritmo? A pressão? O físico?
                      </p>
                    </div>

                    {/* Perguntas Práticas */}
                    <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700">
                      <p className="font-bold text-sm text-purple-300 mb-3 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" /> PERGUNTAS QUE VOCÊ DEVE FAZER ENQUANTO OBSERVA
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <ul className="text-sm text-purple-200 space-y-2">
                          <li>• 2º tempo igual ao 1º (CONSISTÊNCIA)?</li>
                          <li>• Decide bem SOB PRESSÃO e cansaço?</li>
                          <li>• Participa dos MOMENTOS-CHAVE?</li>
                          <li>• QUER a bola na hora difícil?</li>
                        </ul>
                        <ul className="text-sm text-purple-200 space-y-2">
                          <li>• Resolve em ESPAÇO REDUZIDO?</li>
                          <li>• LIDERA e comunica?</li>
                          <li>• AGUENTA o físico 90 min?</li>
                          <li>• Serve para NÍVEL ACIMA?</li>
                        </ul>
                      </div>
                    </div>

                    {/* Resumo Final */}
                    <div className="flex items-start gap-3 p-4 bg-green-900/30 rounded-lg border border-green-700">
                      <Star className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-green-300 text-lg">TALENTO NESTA IDADE =</p>
                        <p className="text-green-200 mt-1">"Confiável + Competitivo + Inteligente + Pronto para subir"</p>
                        <p className="text-sm text-green-200 mt-2">O jogador que você confia em colocar em qualquer jogo. Que quer a bola na hora difícil. Que decide bem sob pressão. Que aguenta o jogo todo. Que serve para o próximo nível.</p>
                        <div className="mt-3 p-2 bg-red-900/50 rounded border border-red-700">
                          <p className="text-xs text-red-300 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> <strong>ARMADILHA CLÁSSICA:</strong> Confundir "muito intenso" com "inteligente". O que corre muito mas decide errado perde para o que pensa bem. Aqui já não tem mais desculpa de maturação.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab Talento */}
          {activeTab === 'talento' && (
            <div className="space-y-6">
              {/* Régua de Ouro - Conceito Universal */}
              <div className="bg-gradient-to-r from-yellow-900/40 to-amber-900/40 rounded-xl p-6 border border-yellow-600">
                <h3 className="text-xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6" />
                  A RÉGUA DE OURO - Vale para TODA a base
                </h3>
                <p className="text-sm text-yellow-200 mb-4">Antes de olhar por categoria, entenda o princípio universal. Avalie sempre 3 coisas:</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-blue-900/50 rounded-xl p-4 border border-blue-600">
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold mb-2">1</div>
                    <h4 className="font-bold text-blue-300 mb-1">PERCEPÇÃO</h4>
                    <p className="text-sm text-blue-200">Ele VÊ o jogo antes dos outros?</p>
                    <ul className="text-xs text-blue-300 mt-2 space-y-1">
                      <li>• Escaneia antes de receber</li>
                      <li>• Entende onde está o espaço</li>
                      <li>• Antecipa a jogada</li>
                    </ul>
                  </div>
                  <div className="bg-green-900/50 rounded-xl p-4 border border-green-600">
                    <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center text-lg font-bold mb-2">2</div>
                    <h4 className="font-bold text-green-300 mb-1">DECISÃO</h4>
                    <p className="text-sm text-green-200">Ele ESCOLHE a solução certa?</p>
                    <ul className="text-xs text-green-300 mt-2 space-y-1">
                      <li>• Decisão adequada ao momento</li>
                      <li>• Não complica o simples</li>
                      <li>• Tem mais de uma solução</li>
                    </ul>
                  </div>
                  <div className="bg-purple-900/50 rounded-xl p-4 border border-purple-600">
                    <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center text-lg font-bold mb-2">3</div>
                    <h4 className="font-bold text-purple-300 mb-1">EXECUÇÃO</h4>
                    <p className="text-sm text-purple-200">Ele CONSEGUE fazer?</p>
                    <ul className="text-xs text-purple-300 mt-2 space-y-1">
                      <li>• Técnica para executar</li>
                      <li>• Físico adequado</li>
                      <li>• Consistência na ação</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-800/50 rounded-lg p-4 border border-yellow-500">
                  <p className="text-yellow-200 font-medium">
                    <strong className="text-yellow-100">⭐ CHAVE DO TALENTO:</strong> Percepção + Decisão acima da média = TALENTO REAL.
                  </p>
                  <p className="text-sm text-yellow-300 mt-1">
                    Execução vem com treino e maturação. O menino que VÊ e DECIDE bem, mas ainda não executa perfeitamente,
                    é mais valioso que o que executa bem mas não pensa.
                  </p>
                </div>
              </div>

              {/* IDENTIFICAÇÃO POR CATEGORIA */}
              <div>
                <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                  <Star className="w-6 h-6 text-amber-500" />
                  IDENTIFICAR TALENTO POR CATEGORIA
                </h3>
                <p className="text-slate-400 mb-4">Clique na categoria para ver os indicadores específicos de talento para aquela idade:</p>

                <div className="space-y-3">
                  {/* Sub-7/9 Talento */}
                  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #475569' }}>
                    <button
                      onClick={() => setTalentoCategoria(talentoCategoria === 'sub7' ? null : 'sub7')}
                      className="w-full flex items-center justify-between p-4 transition-colors hover:opacity-80"
                      style={{ backgroundColor: '#1e293b' }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg text-white flex items-center justify-center font-bold text-lg" style={{ backgroundColor: '#06b6d4' }}>7/9</div>
                        <div className="text-left">
                          <p className="font-semibold text-white text-lg">Talento no Sub-7 / Sub-9</p>
                          <p className="text-sm text-white">"O brilho nos olhos" - Indicadores precoces de potencial</p>
                        </div>
                      </div>
                      {talentoCategoria === 'sub7' ? <ChevronDown className="w-6 h-6 text-white" /> : <ChevronRight className="w-6 h-6 text-white" />}
                    </button>
                    {talentoCategoria === 'sub7' && (
                      <div className="p-5 space-y-5" style={{ backgroundColor: '#0f172a' }}>
                        {/* O que define talento nesta idade */}
                        <div className="bg-cyan-900/40 rounded-lg p-4 border border-cyan-700">
                          <h4 className="font-bold text-cyan-300 mb-2">🎯 O QUE DEFINE TALENTO NESTA IDADE</h4>
                          <p className="text-sm text-cyan-200">
                            Nesta idade, <strong>NÃO</strong> existe "talento formado". O que existe são <strong>INDICADORES PRECOCES</strong>
                            de potencial. Você está procurando: <strong>coordenação acima da média</strong>, <strong>gosto genuíno pelo jogo</strong>,
                            e <strong>capacidade de aprender rápido</strong>. Cuidado: 80% do que parece "talento" aqui é só maturação precoce.
                          </p>
                        </div>

                        {/* Indicadores de Talento */}
                        <div>
                          <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                            <span className="text-xl">✨</span> INDICADORES REAIS DE POTENCIAL
                          </h4>
                          <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="font-medium text-sm text-green-400 mb-2">✓ SINAIS VERDADEIROS</p>
                                <ul className="text-sm text-slate-300 space-y-2">
                                  <li>• <strong>Coordenação natural</strong> - movimentos fluidos, não "travados"</li>
                                  <li>• <strong>Aprende rápido</strong> - mostra 1x e ele tenta imitar</li>
                                  <li>• <strong>Curiosidade com a bola</strong> - experimenta coisas diferentes</li>
                                  <li>• <strong>Não tem medo de errar</strong> - tenta de novo</li>
                                  <li>• <strong>Olha para cima às vezes</strong> - já começa a perceber o entorno</li>
                                  <li>• <strong>Usa os dois pés naturalmente</strong> - sem "fugir" do pé fraco</li>
                                  <li>• <strong>Gosta de ter a bola</strong> - pede, busca, quer participar</li>
                                  <li>• <strong>Equilíbrio bom</strong> - não cai fácil, gira bem</li>
                                </ul>
                              </div>
                              <div>
                                <p className="font-medium text-sm text-amber-400 mb-2">⚠️ CUIDADO - ISSO NÃO É TALENTO</p>
                                <ul className="text-sm text-slate-400 space-y-2">
                                  <li>• <strong>Ser o maior/mais forte</strong> - vantagem física temporária</li>
                                  <li>• <strong>Correr mais que todos</strong> - pode ser só maturação</li>
                                  <li>• <strong>Fazer muitos gols</strong> - geralmente é só tamanho</li>
                                  <li>• <strong>Driblar todo mundo</strong> - oponentes ainda não marcam</li>
                                  <li>• <strong>Pai/mãe jogou futebol</strong> - genética não é garantia</li>
                                  <li>• <strong>Treina desde os 4 anos</strong> - tempo não é qualidade</li>
                                  <li>• <strong>É "intenso" demais</strong> - pode ser só energia</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Perguntas-chave */}
                        <div>
                          <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                            <span className="text-xl">❓</span> PERGUNTAS PARA SE FAZER
                          </h4>
                          <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                            <ul className="text-sm text-slate-300 space-y-2">
                              <li>• "Se eu tirar a vantagem física dele, ainda sobra algo especial?"</li>
                              <li>• "Ele parece GOSTAR de jogar ou só faz porque colocaram?"</li>
                              <li>• "Quando erra, ele fica frustrado e para OU tenta de novo?"</li>
                              <li>• "Os movimentos dele são naturais ou parecem robóticos?"</li>
                              <li>• "Ele tenta coisas novas ou sempre faz a mesma coisa?"</li>
                              <li>• "Daqui a 3 anos, quando todos tiverem o mesmo tamanho, o que sobra?"</li>
                            </ul>
                          </div>
                        </div>

                        {/* O Teste Final */}
                        <div className="bg-green-900/30 rounded-lg p-4 border border-green-700">
                          <h4 className="font-bold text-green-300 mb-2 flex items-center gap-2">
                            <Star className="w-5 h-5" /> O TESTE DO TALENTO SUB-7/9
                          </h4>
                          <p className="text-green-200 text-sm">
                            <strong>Imagine esse menino com 13-14 anos, do mesmo tamanho que os outros.</strong>
                            O que você vê nele HOJE que ainda vai existir? Se a resposta for "coordenação,
                            gosto pelo jogo, curiosidade, velocidade de aprendizado" = potencial real.
                            Se for "ele é maior, mais forte, mais rápido" = provavelmente vantagem temporária.
                          </p>
                        </div>

                        {/* Armadilha */}
                        <div className="bg-red-900/30 rounded-lg p-4 border border-red-700">
                          <p className="text-sm text-red-300 flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span><strong>ARMADILHA CLÁSSICA:</strong> O "craque" do Sub-7 que faz 5 gols por jogo.
                            Geralmente é só o maior da turma. Quando chega no Sub-13 e todos têm o mesmo tamanho,
                            ele não sabe jogar porque nunca precisou pensar - só corria e chutava.</span>
                          </p>
                        </div>

                        {/* PERFIL IDEAL */}
                        <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 rounded-xl p-5 border border-cyan-600">
                          <h4 className="font-bold text-cyan-300 mb-4 flex items-center gap-2 text-lg">
                            <Star className="w-6 h-6" /> PERFIL IDEAL DO ATLETA SUB-7/9
                          </h4>
                          <p className="text-cyan-200 text-sm mb-4">O menino com REAL potencial nesta idade apresenta:</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="font-semibold text-cyan-300 mb-2">🎯 MOTOR / COORDENAÇÃO</p>
                              <ul className="text-sm text-cyan-100 space-y-1">
                                <li>✓ Movimentos fluidos e naturais (não "travado")</li>
                                <li>✓ Equilíbrio bom - não cai fácil, gira bem</li>
                                <li>✓ Usa os dois pés naturalmente</li>
                                <li>✓ Corrida coordenada (braços e pernas em harmonia)</li>
                                <li>✓ Domina a bola com diferentes partes do corpo</li>
                              </ul>
                            </div>
                            <div>
                              <p className="font-semibold text-cyan-300 mb-2">🧠 MENTAL / ATITUDE</p>
                              <ul className="text-sm text-cyan-100 space-y-1">
                                <li>✓ Curiosidade genuína com a bola</li>
                                <li>✓ Não tem medo de errar - tenta de novo</li>
                                <li>✓ Aprende rápido - mostra 1x e ele imita</li>
                                <li>✓ GOSTA de jogar (brilho nos olhos)</li>
                                <li>✓ Pede a bola, quer participar</li>
                              </ul>
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="font-semibold text-cyan-300 mb-2">⚽ TÉCNICO (emergente)</p>
                              <ul className="text-sm text-cyan-100 space-y-1">
                                <li>✓ Conduz olhando para frente às vezes</li>
                                <li>✓ Chuta com intenção de direção</li>
                                <li>✓ Experimenta coisas diferentes</li>
                                <li>✓ Consegue parar a bola e sair com ela</li>
                              </ul>
                            </div>
                            <div>
                              <p className="font-semibold text-cyan-300 mb-2">👁️ PERCEPÇÃO (primeiros sinais)</p>
                              <ul className="text-sm text-cyan-100 space-y-1">
                                <li>✓ Olha para cima às vezes (percebe entorno)</li>
                                <li>✓ Reage ao que acontece no jogo</li>
                                <li>✓ Começa a entender "eu e outro"</li>
                                <li>✓ Sabe onde está o gol</li>
                              </ul>
                            </div>
                          </div>

                          <div className="mt-4 p-3 bg-cyan-800/50 rounded-lg border border-cyan-500">
                            <p className="text-cyan-200 text-sm">
                              <strong>EM RESUMO:</strong> Coordenação natural + Curiosidade + Aprende rápido + Gosta de bola + Não depende do tamanho.
                              Se tirar a vantagem física, ainda sobra algo especial.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sub-11 Talento */}
                  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #475569' }}>
                    <button
                      onClick={() => setTalentoCategoria(talentoCategoria === 'sub11' ? null : 'sub11')}
                      className="w-full flex items-center justify-between p-4 transition-colors hover:opacity-80"
                      style={{ backgroundColor: '#1e293b' }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg text-white flex items-center justify-center font-bold text-lg" style={{ backgroundColor: '#22c55e' }}>11</div>
                        <div className="text-left">
                          <p className="font-semibold text-white text-lg">Talento no Sub-11</p>
                          <p className="text-sm text-white">"A idade de ouro" - Onde o talento começa a se revelar de verdade</p>
                        </div>
                      </div>
                      {talentoCategoria === 'sub11' ? <ChevronDown className="w-6 h-6 text-white" /> : <ChevronRight className="w-6 h-6 text-white" />}
                    </button>
                    {talentoCategoria === 'sub11' && (
                      <div className="p-5 space-y-5" style={{ backgroundColor: '#0f172a' }}>
                        {/* O que define talento nesta idade */}
                        <div className="bg-green-900/40 rounded-lg p-4 border border-green-700">
                          <h4 className="font-bold text-green-300 mb-2">🎯 O QUE DEFINE TALENTO NESTA IDADE</h4>
                          <p className="text-sm text-green-200">
                            Esta é a <strong>"IDADE DE OURO"</strong> - onde o talento REAL começa a aparecer.
                            O menino com potencial aqui já mostra <strong>visão de jogo emergente</strong>,
                            <strong>primeiro toque inteligente</strong> e <strong>velocidade de decisão</strong>.
                            É aqui que você separa quem TEM daquele que só PARECIA ter.
                          </p>
                        </div>

                        {/* Nota Sub-10 vs Sub-11 */}
                        <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-600">
                          <h4 className="font-bold text-blue-300 mb-2 flex items-center gap-2">
                            <span>📝</span> NOTA: Identificando talento Sub-10 vs Sub-11
                          </h4>
                          <div className="text-sm text-blue-200 space-y-2">
                            <p><strong>Sub-10</strong> = os indicadores estão <strong>emergindo</strong>. Seja mais tolerante:</p>
                            <ul className="ml-4 space-y-1">
                              <li>• Aceite que os "lampejos" de visão de jogo ainda são raros</li>
                              <li>• Valorize TENTATIVAS de levantar a cabeça, mesmo que falhe</li>
                              <li>• Primeiro toque orientado pode aparecer 1-2x no jogo apenas</li>
                              <li>• Foque na TENDÊNCIA de evolução, não no nível atual</li>
                            </ul>
                            <p className="mt-2"><strong>Sub-11</strong> = os indicadores devem aparecer com <strong>frequência</strong>. Se nunca levanta a cabeça, nunca orienta o primeiro toque - o potencial é limitado.</p>
                          </div>
                        </div>

                        {/* Indicadores de Talento */}
                        <div>
                          <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                            <span className="text-xl">✨</span> INDICADORES REAIS DE TALENTO
                          </h4>
                          <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="font-medium text-sm text-green-400 mb-2">✓ SINAIS DE TALENTO REAL</p>
                                <ul className="text-sm text-slate-300 space-y-2">
                                  <li>• <strong>Levanta a cabeça ANTES de receber</strong> - já sabe para onde vai</li>
                                  <li>• <strong>Primeiro toque orientado</strong> - não só domina, já prepara</li>
                                  <li>• <strong>Tem mais de uma solução</strong> - não é previsível</li>
                                  <li>• <strong>Velocidade de decisão</strong> - não segura a bola demais</li>
                                  <li>• <strong>Usa os dois pés com intenção</strong> - escolhe qual usar</li>
                                  <li>• <strong>Entende espaço</strong> - vai para onde a bola VAI estar</li>
                                  <li>• <strong>Pede bola em situação difícil</strong> - não se esconde</li>
                                  <li>• <strong>Aprende correção em 1-2 tentativas</strong></li>
                                  <li>• <strong>Faz os companheiros jogarem melhor</strong></li>
                                </ul>
                              </div>
                              <div>
                                <p className="font-medium text-sm text-amber-400 mb-2">⚠️ CUIDADO - ISSO NÃO É TALENTO</p>
                                <ul className="text-sm text-slate-400 space-y-2">
                                  <li>• <strong>Dribla muito mas não passa</strong> - egoísta, não talentoso</li>
                                  <li>• <strong>Sempre faz a mesma coisa</strong> - previsível</li>
                                  <li>• <strong>Só joga bem com a bola</strong> - some sem ela</li>
                                  <li>• <strong>Depende do físico</strong> - ainda usa força/velocidade</li>
                                  <li>• <strong>Não aceita correção</strong> - acha que já sabe</li>
                                  <li>• <strong>Só aparece quando ganha fácil</strong> - some na dificuldade</li>
                                  <li>• <strong>Técnica bonita sem objetivo</strong> - embaixadinha não é futebol</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* O Diferencial */}
                        <div>
                          <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                            <span className="text-xl">🔑</span> O GRANDE DIFERENCIAL DO SUB-11
                          </h4>
                          <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                            <p className="text-slate-300 mb-3">
                              <strong className="text-amber-400">A pergunta central:</strong> "Ele pensa ANTES de agir ou pensa DEPOIS?"
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-green-900/30 p-3 rounded-lg border border-green-700">
                                <p className="font-medium text-green-400 mb-1">TALENTO (pensa antes)</p>
                                <ul className="text-xs text-green-200 space-y-1">
                                  <li>• Recebe já sabendo o que vai fazer</li>
                                  <li>• Corpo posicionado para a próxima ação</li>
                                  <li>• Domina para onde precisa, não "para o pé"</li>
                                  <li>• Passe/drible com propósito claro</li>
                                </ul>
                              </div>
                              <div className="bg-red-900/30 p-3 rounded-lg border border-red-700">
                                <p className="font-medium text-red-400 mb-1">NÃO É TALENTO (pensa depois)</p>
                                <ul className="text-xs text-red-200 space-y-1">
                                  <li>• Domina e depois olha o que fazer</li>
                                  <li>• Corpo "fechado", tem que se ajustar</li>
                                  <li>• Domina sempre igual, independente da situação</li>
                                  <li>• Passe/drible reativo, não planejado</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Perguntas-chave */}
                        <div>
                          <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                            <span className="text-xl">❓</span> PERGUNTAS PARA SE FAZER
                          </h4>
                          <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                            <ul className="text-sm text-slate-300 space-y-2">
                              <li>• "Quando ele recebe a bola, já sabe o que vai fazer?"</li>
                              <li>• "Ele tem DUAS soluções ou sempre faz a mesma coisa?"</li>
                              <li>• "Sem a bola, ele EXISTE ou desaparece?"</li>
                              <li>• "Quando o jogo aperta, ele aparece ou some?"</li>
                              <li>• "Ele faz os outros jogarem melhor ou piores?"</li>
                              <li>• "Se eu corrigir, ele muda na próxima ou ignora?"</li>
                              <li>• "O que ele faz de especial que NÃO depende de tamanho/força?"</li>
                            </ul>
                          </div>
                        </div>

                        {/* O Teste Final */}
                        <div className="bg-green-900/30 rounded-lg p-4 border border-green-700">
                          <h4 className="font-bold text-green-300 mb-2 flex items-center gap-2">
                            <Star className="w-5 h-5" /> O TESTE DO TALENTO SUB-11
                          </h4>
                          <p className="text-green-200 text-sm">
                            <strong>Coloque-o contra oponentes 1-2 anos mais velhos.</strong> O talento REAL não desaparece -
                            ele se adapta, pensa mais rápido, encontra soluções mesmo em desvantagem física.
                            O "falso talento" entra em pânico porque não consegue mais usar força/velocidade.
                          </p>
                        </div>

                        {/* Armadilha */}
                        <div className="bg-red-900/30 rounded-lg p-4 border border-red-700">
                          <p className="text-sm text-red-300 flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span><strong>ARMADILHA CLÁSSICA:</strong> O driblador que passa por 5 e chuta para fora.
                            Parece espetacular, mas é individualista e não resolve. O talento REAL é o que passa
                            por 1, vê o companheiro livre e dá o passe. Menos bonito, mais efetivo.</span>
                          </p>
                        </div>

                        {/* PERFIL IDEAL */}
                        <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-xl p-5 border border-green-600">
                          <h4 className="font-bold text-green-300 mb-4 flex items-center gap-2 text-lg">
                            <Star className="w-6 h-6" /> PERFIL IDEAL DO ATLETA SUB-11
                          </h4>
                          <p className="text-green-200 text-sm mb-4">O menino com REAL talento nesta idade ("idade de ouro") apresenta:</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="font-semibold text-green-300 mb-2">👁️ VISÃO DE JOGO</p>
                              <ul className="text-sm text-green-100 space-y-1">
                                <li>✓ Levanta a cabeça ANTES de receber</li>
                                <li>✓ Sabe para onde vai antes de dominar</li>
                                <li>✓ Percebe companheiros e adversários</li>
                                <li>✓ Entende onde está o espaço</li>
                                <li>✓ Antecipa a jogada (vai onde a bola VAI estar)</li>
                              </ul>
                            </div>
                            <div>
                              <p className="font-semibold text-green-300 mb-2">⚡ VELOCIDADE DE DECISÃO</p>
                              <ul className="text-sm text-green-100 space-y-1">
                                <li>✓ Decide rápido o que fazer</li>
                                <li>✓ Não segura a bola demais</li>
                                <li>✓ Tem mais de uma solução (não é previsível)</li>
                                <li>✓ Escolhe a solução adequada ao momento</li>
                                <li>✓ Pensa ANTES de agir, não depois</li>
                              </ul>
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="font-semibold text-green-300 mb-2">⚽ TÉCNICO INTELIGENTE</p>
                              <ul className="text-sm text-green-100 space-y-1">
                                <li>✓ Primeiro toque ORIENTADO (não só domina, prepara)</li>
                                <li>✓ Conduz E levanta a cabeça ao mesmo tempo</li>
                                <li>✓ Usa os dois pés com INTENÇÃO (escolhe qual usar)</li>
                                <li>✓ Passe com qualidade e propósito</li>
                                <li>✓ Drible com OBJETIVO (progredir, não aparecer)</li>
                                <li>✓ Consegue receber de costas e girar</li>
                              </ul>
                            </div>
                            <div>
                              <p className="font-semibold text-green-300 mb-2">🧠 MENTAL / ATITUDE</p>
                              <ul className="text-sm text-green-100 space-y-1">
                                <li>✓ Aprende correção em 1-2 tentativas</li>
                                <li>✓ Pede bola em situação difícil (não se esconde)</li>
                                <li>✓ Faz os companheiros jogarem MELHOR</li>
                                <li>✓ Aparece quando o jogo aperta</li>
                                <li>✓ Erra tentando jogar, não por preguiça</li>
                              </ul>
                            </div>
                          </div>

                          <div className="mt-4 p-3 bg-green-800/50 rounded-lg border border-green-500">
                            <p className="text-green-200 text-sm">
                              <strong>EM RESUMO:</strong> Levanta a cabeça + Primeiro toque orientado + Velocidade de decisão + Variedade de soluções + Usa dois pés + Faz o time jogar melhor.
                              É o menino que PENSA o jogo, não só executa.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sub-13 Talento */}
                  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #475569' }}>
                    <button
                      onClick={() => setTalentoCategoria(talentoCategoria === 'sub13' ? null : 'sub13')}
                      className="w-full flex items-center justify-between p-4 transition-colors hover:opacity-80"
                      style={{ backgroundColor: '#1e293b' }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg text-white flex items-center justify-center font-bold text-lg" style={{ backgroundColor: '#eab308' }}>13</div>
                        <div className="text-left">
                          <p className="font-semibold text-white text-lg">Talento no Sub-13</p>
                          <p className="text-sm text-white">"O jogo sem bola" - Onde se separa jogador de atleta</p>
                        </div>
                      </div>
                      {talentoCategoria === 'sub13' ? <ChevronDown className="w-6 h-6 text-white" /> : <ChevronRight className="w-6 h-6 text-white" />}
                    </button>
                    {talentoCategoria === 'sub13' && (
                      <div className="p-5 space-y-5" style={{ backgroundColor: '#0f172a' }}>
                        {/* O que define talento nesta idade */}
                        <div className="bg-yellow-900/40 rounded-lg p-4 border border-yellow-700">
                          <h4 className="font-bold text-yellow-300 mb-2">🎯 O QUE DEFINE TALENTO NESTA IDADE</h4>
                          <p className="text-sm text-yellow-200">
                            Aqui o jogo MUDA. O talento não é mais só "o que faz com a bola" - é <strong>O QUE FAZ SEM ELA</strong>.
                            Nesta idade você procura: <strong>inteligência tática</strong>, <strong>execução sob pressão</strong>,
                            <strong>movimentação inteligente</strong> e <strong>capacidade de aprender princípios</strong>.
                            Quem só sabe "eu e a bola" começa a ficar para trás.
                          </p>
                        </div>

                        {/* Nota Sub-12 vs Sub-13 */}
                        <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-600">
                          <h4 className="font-bold text-blue-300 mb-2 flex items-center gap-2">
                            <span>📝</span> NOTA: Identificando talento Sub-12 vs Sub-13
                          </h4>
                          <div className="text-sm text-blue-200 space-y-2">
                            <p><strong>Sub-12</strong> = está <strong>entrando</strong> nessa fase de transição. Seja mais tolerante:</p>
                            <ul className="ml-4 space-y-1">
                              <li>• Aceite que ainda vai errar muito sob pressão</li>
                              <li>• Valorize quem TENTA se movimentar sem bola, mesmo sem sucesso</li>
                              <li>• Princípios táticos podem ser confusos ainda</li>
                              <li>• Foque na ATITUDE de querer aprender o "jogo sem bola"</li>
                            </ul>
                            <p className="mt-2"><strong>Sub-13</strong> = deve <strong>demonstrar</strong> esses conceitos com mais frequência. Se ainda só "existe" com a bola, o potencial de evolução é limitado.</p>
                          </div>
                        </div>

                        {/* Indicadores de Talento */}
                        <div>
                          <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                            <span className="text-xl">✨</span> INDICADORES REAIS DE TALENTO
                          </h4>
                          <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="font-medium text-sm text-green-400 mb-2">✓ SINAIS DE TALENTO REAL</p>
                                <ul className="text-sm text-slate-300 space-y-2">
                                  <li>• <strong>Mantém qualidade sob pressão</strong> - não apavora</li>
                                  <li>• <strong>Entende princípios táticos</strong> - largura, profundidade, apoio</li>
                                  <li>• <strong>Movimentação sem bola inteligente</strong> - cria espaço</li>
                                  <li>• <strong>Lê a marcação</strong> - sabe onde está o espaço</li>
                                  <li>• <strong>Gira bem de costas</strong> - não é refém de receber de frente</li>
                                  <li>• <strong>Passe vertical</strong> - não só lateraliza</li>
                                  <li>• <strong>Compete mas pensa</strong> - intensidade com inteligência</li>
                                  <li>• <strong>Adapta comportamento</strong> - muda se o jogo pede</li>
                                  <li>• <strong>Corrige durante o jogo</strong> - não precisa do intervalo</li>
                                </ul>
                              </div>
                              <div>
                                <p className="font-medium text-sm text-amber-400 mb-2">⚠️ CUIDADO - ISSO NÃO É TALENTO</p>
                                <ul className="text-sm text-slate-400 space-y-2">
                                  <li>• <strong>Só joga bem "solto"</strong> - perde qualidade quando marcado</li>
                                  <li>• <strong>Não sabe jogar sem bola</strong> - para quando não tem</li>
                                  <li>• <strong>Sempre precisa de tempo</strong> - não resolve rápido</li>
                                  <li>• <strong>Só pensa em si</strong> - não vê o coletivo</li>
                                  <li>• <strong>Não aprende princípios</strong> - sempre improvisa</li>
                                  <li>• <strong>Depende de espaço</strong> - inútil em jogo travado</li>
                                  <li>• <strong>Físico compensa tudo</strong> - ainda usa tamanho/força</li>
                                  <li>• <strong>Não compete</strong> - desiste quando perde o duelo</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* O Grande Diferencial */}
                        <div>
                          <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                            <span className="text-xl">🔑</span> O GRANDE DIFERENCIAL DO SUB-13
                          </h4>
                          <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                            <p className="text-slate-300 mb-3">
                              <strong className="text-amber-400">A pergunta central:</strong> "O que ele faz quando NÃO TEM a bola?"
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-green-900/30 p-3 rounded-lg border border-green-700">
                                <p className="font-medium text-green-400 mb-1">TALENTO (joga sem bola)</p>
                                <ul className="text-xs text-green-200 space-y-1">
                                  <li>• Se movimenta para criar linha de passe</li>
                                  <li>• Abre espaço para o companheiro</li>
                                  <li>• Ataca a profundidade no momento certo</li>
                                  <li>• Oferece apoio ao portador da bola</li>
                                  <li>• Está sempre "ligado" no jogo</li>
                                </ul>
                              </div>
                              <div className="bg-red-900/30 p-3 rounded-lg border border-red-700">
                                <p className="font-medium text-red-400 mb-1">NÃO É TALENTO (só com bola)</p>
                                <ul className="text-xs text-red-200 space-y-1">
                                  <li>• Fica parado esperando a bola</li>
                                  <li>• "Desliga" quando não tem a bola</li>
                                  <li>• Não oferece solução ao companheiro</li>
                                  <li>• Posicionamento estático</li>
                                  <li>• Só "acorda" quando recebe</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Perguntas-chave */}
                        <div>
                          <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                            <span className="text-xl">❓</span> PERGUNTAS PARA SE FAZER
                          </h4>
                          <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                            <ul className="text-sm text-slate-300 space-y-2">
                              <li>• "Quando marcam ele de perto, ele resolve ou apavora?"</li>
                              <li>• "Ele entende QUANDO dar largura e QUANDO dar profundidade?"</li>
                              <li>• "Sem a bola, ele cria espaço ou fica parado?"</li>
                              <li>• "Ele tenta passes verticais ou só lateraliza?"</li>
                              <li>• "Quando recebe de costas, ele consegue girar ou sempre volta?"</li>
                              <li>• "Ele mantém intensidade E inteligência ou é só um ou outro?"</li>
                              <li>• "Quando eu peço algo tático, ele entende e aplica?"</li>
                            </ul>
                          </div>
                        </div>

                        {/* O Teste Final */}
                        <div className="bg-green-900/30 rounded-lg p-4 border border-green-700">
                          <h4 className="font-bold text-green-300 mb-2 flex items-center gap-2">
                            <Star className="w-5 h-5" /> O TESTE DO TALENTO SUB-13
                          </h4>
                          <p className="text-green-200 text-sm">
                            <strong>Observe um jogo inteiro focando APENAS no que ele faz sem a bola.</strong>
                            Se ele continua trabalhando, criando espaço, oferecendo solução = talento.
                            Se ele desaparece, fica parado, só "existe" com a bola = limitado.
                            No futebol profissional, você fica SEM a bola 95% do tempo.
                          </p>
                        </div>

                        {/* Armadilha */}
                        <div className="bg-red-900/30 rounded-lg p-4 border border-red-700">
                          <p className="text-sm text-red-300 flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span><strong>ARMADILHA CLÁSSICA:</strong> O meia "craque" que recebe a bola 30x no jogo,
                            dribla 20x, mas o time não cria chances claras. Ele PARECE jogar bem, mas o time não
                            melhora com ele. Compare com o meia que recebe 15x, mas cada bola vira jogada de gol.</span>
                          </p>
                        </div>

                        {/* PERFIL IDEAL */}
                        <div className="bg-gradient-to-r from-yellow-900/50 to-amber-900/50 rounded-xl p-5 border border-yellow-600">
                          <h4 className="font-bold text-yellow-300 mb-4 flex items-center gap-2 text-lg">
                            <Star className="w-6 h-6" /> PERFIL IDEAL DO ATLETA SUB-13
                          </h4>
                          <p className="text-yellow-200 text-sm mb-4">O atleta com REAL talento nesta idade de transição apresenta:</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="font-semibold text-yellow-300 mb-2">🎯 EXECUÇÃO SOB PRESSÃO</p>
                              <ul className="text-sm text-yellow-100 space-y-1">
                                <li>✓ Mantém qualidade quando marcado de perto</li>
                                <li>✓ Primeiro toque para FUGIR da pressão</li>
                                <li>✓ Gira bem quando recebe de costas</li>
                                <li>✓ Resolve rápido em espaço reduzido</li>
                                <li>✓ Não apavora, encontra solução</li>
                                <li>✓ Mantém qualidade mesmo cansado</li>
                              </ul>
                            </div>
                            <div>
                              <p className="font-semibold text-yellow-300 mb-2">📋 JOGO SEM BOLA</p>
                              <ul className="text-sm text-yellow-100 space-y-1">
                                <li>✓ Se movimenta para criar linha de passe</li>
                                <li>✓ Abre espaço para o companheiro</li>
                                <li>✓ Ataca profundidade no momento certo</li>
                                <li>✓ Oferece apoio ao portador da bola</li>
                                <li>✓ Está sempre "ligado" no jogo</li>
                                <li>✓ Não "desliga" quando não tem a bola</li>
                              </ul>
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="font-semibold text-yellow-300 mb-2">🧠 INTELIGÊNCIA TÁTICA</p>
                              <ul className="text-sm text-yellow-100 space-y-1">
                                <li>✓ Entende largura e profundidade</li>
                                <li>✓ Sabe quando dar apoio vs atacar espaço</li>
                                <li>✓ Lê a marcação (sabe onde está o espaço)</li>
                                <li>✓ Adapta comportamento ao que o jogo pede</li>
                                <li>✓ Corrige durante o jogo (não precisa do intervalo)</li>
                                <li>✓ Entende princípios ofensivos e defensivos</li>
                              </ul>
                            </div>
                            <div>
                              <p className="font-semibold text-yellow-300 mb-2">🔥 COMPETITIVIDADE</p>
                              <ul className="text-sm text-yellow-100 space-y-1">
                                <li>✓ Compete mas PENSA (intensidade + inteligência)</li>
                                <li>✓ Não desiste quando perde o duelo</li>
                                <li>✓ Aparece nos momentos difíceis</li>
                                <li>✓ Quer a bola mesmo sob pressão</li>
                                <li>✓ Tenta passes verticais (não só lateraliza)</li>
                                <li>✓ Tem atitude de resolver o jogo</li>
                              </ul>
                            </div>
                          </div>

                          <div className="mt-4 p-3 bg-yellow-800/50 rounded-lg border border-yellow-500">
                            <p className="text-yellow-200 text-sm">
                              <strong>EM RESUMO:</strong> Executa sob pressão + Joga BEM sem bola + Entende princípios táticos + Compete com inteligência + Resolve rápido.
                              O menino que já entende que futebol é 95% SEM a bola.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sub-15 Talento */}
                  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #475569' }}>
                    <button
                      onClick={() => setTalentoCategoria(talentoCategoria === 'sub15' ? null : 'sub15')}
                      className="w-full flex items-center justify-between p-4 transition-colors hover:opacity-80"
                      style={{ backgroundColor: '#1e293b' }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg text-white flex items-center justify-center font-bold text-lg" style={{ backgroundColor: '#f97316' }}>15</div>
                        <div className="text-left">
                          <p className="font-semibold text-white text-lg">Talento no Sub-15</p>
                          <p className="text-sm text-white">"Função e repetição" - Quem consegue REPETIR no nível exigido</p>
                        </div>
                      </div>
                      {talentoCategoria === 'sub15' ? <ChevronDown className="w-6 h-6 text-white" /> : <ChevronRight className="w-6 h-6 text-white" />}
                    </button>
                    {talentoCategoria === 'sub15' && (
                      <div className="p-5 space-y-5" style={{ backgroundColor: '#0f172a' }}>
                        {/* O que define talento nesta idade */}
                        <div className="bg-orange-900/40 rounded-lg p-4 border border-orange-700">
                          <h4 className="font-bold text-orange-300 mb-2">🎯 O QUE DEFINE TALENTO NESTA IDADE</h4>
                          <p className="text-sm text-orange-200">
                            No Sub-15, talento significa <strong>CONSISTÊNCIA + FUNÇÃO</strong>. Não basta fazer bonito uma vez -
                            precisa REPETIR 10x no mesmo jogo. Aqui você avalia: <strong>domina a função da posição?</strong>,
                            <strong>faz contra adversários de nível?</strong>, <strong>mantém qualidade sob pressão e cansaço?</strong>.
                            A régua sobe muito.
                          </p>
                        </div>

                        {/* Nota Sub-14 vs Sub-15 */}
                        <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-600">
                          <h4 className="font-bold text-blue-300 mb-2 flex items-center gap-2">
                            <span>📝</span> NOTA: Identificando talento Sub-14 vs Sub-15
                          </h4>
                          <div className="text-sm text-blue-200 space-y-2">
                            <p><strong>Sub-14</strong> = está <strong>aprendendo</strong> a função e a consistência. Seja mais tolerante:</p>
                            <ul className="ml-4 space-y-1">
                              <li>• Aceite inconsistência (3-4 de 10 acertos é aceitável)</li>
                              <li>• Valorize quem ENTENDE a função, mesmo errando na execução</li>
                              <li>• Tolere oscilação física (puberdade em andamento)</li>
                              <li>• Foque na CAPACIDADE de aprender e corrigir</li>
                              <li>• Observe a ATITUDE diante da cobrança por função</li>
                            </ul>
                            <p className="mt-2"><strong>Sub-15</strong> = deve <strong>dominar</strong> a função (7-8 de 10 acertos). Quem ainda não sabe o que a posição pede está atrasado no desenvolvimento.</p>
                          </div>
                        </div>

                        {/* Indicadores de Talento */}
                        <div>
                          <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                            <span className="text-xl">✨</span> INDICADORES REAIS DE TALENTO
                          </h4>
                          <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="font-medium text-sm text-green-400 mb-2">✓ SINAIS DE TALENTO REAL</p>
                                <ul className="text-sm text-slate-300 space-y-2">
                                  <li>• <strong>Domina a função</strong> - sabe EXATAMENTE o que a posição pede</li>
                                  <li>• <strong>Consistência</strong> - faz bem 8 de 10 vezes, não 2 de 10</li>
                                  <li>• <strong>Aguenta pressão tática</strong> - não perde quando cobrado</li>
                                  <li>• <strong>Mantém nível cansado</strong> - não cai no 2º tempo</li>
                                  <li>• <strong>Compete sempre</strong> - não escolhe quando jogar</li>
                                  <li>• <strong>Aplicável em nível acima</strong> - funciona contra mais velhos</li>
                                  <li>• <strong>Entende modelo de jogo</strong> - não só "joga", executa plano</li>
                                  <li>• <strong>Lidera pelo exemplo</strong> - não só fala, faz</li>
                                  <li>• <strong>Gerencia emoção</strong> - não perde a cabeça</li>
                                </ul>
                              </div>
                              <div>
                                <p className="font-medium text-sm text-amber-400 mb-2">⚠️ CUIDADO - ISSO NÃO É TALENTO</p>
                                <ul className="text-sm text-slate-400 space-y-2">
                                  <li>• <strong>Faz bonito às vezes</strong> - inconsistente</li>
                                  <li>• <strong>Só funciona em jogo fácil</strong> - desaparece no difícil</li>
                                  <li>• <strong>Não cumpre função</strong> - quer jogar "livre"</li>
                                  <li>• <strong>Cai fisicamente</strong> - só joga bem 60 min</li>
                                  <li>• <strong>Depende de confiança</strong> - oscila muito</li>
                                  <li>• <strong>Não entende cobrança</strong> - leva para o pessoal</li>
                                  <li>• <strong>Tática da escolinha</strong> - não evoluiu o pensamento</li>
                                  <li>• <strong>Brilha só com espaço</strong> - jogo europeu não dá espaço</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* O Grande Diferencial */}
                        <div>
                          <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                            <span className="text-xl">🔑</span> O GRANDE DIFERENCIAL DO SUB-15
                          </h4>
                          <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                            <p className="text-slate-300 mb-3">
                              <strong className="text-amber-400">A pergunta central:</strong> "Ele REPETE o correto ou só acerta às vezes?"
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-green-900/30 p-3 rounded-lg border border-green-700">
                                <p className="font-medium text-green-400 mb-1">TALENTO (consistente)</p>
                                <ul className="text-xs text-green-200 space-y-1">
                                  <li>• Faz 8-10 de 10 ações certas</li>
                                  <li>• Mesmo rendimento 1º e 2º tempo</li>
                                  <li>• Funciona contra adversário forte</li>
                                  <li>• Cumpre função sem reclamar</li>
                                  <li>• Resolve sob pressão do placar</li>
                                </ul>
                              </div>
                              <div className="bg-red-900/30 p-3 rounded-lg border border-red-700">
                                <p className="font-medium text-red-400 mb-1">NÃO É TALENTO (oscilante)</p>
                                <ul className="text-xs text-red-200 space-y-1">
                                  <li>• Faz 3-4 de 10 ações certas</li>
                                  <li>• Joga bem 60 min, depois some</li>
                                  <li>• Só funciona contra adversário fraco</li>
                                  <li>• Quer jogar "do jeito dele"</li>
                                  <li>• Se esconde quando está perdendo</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Por Posição */}
                        <div>
                          <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                            <span className="text-xl">👤</span> TALENTO POR POSIÇÃO - O que cada função PRECISA mostrar
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div className="rounded-lg p-3" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-bold text-sm text-blue-400 mb-2">LATERAL</p>
                              <ul className="text-xs text-slate-300 space-y-1">
                                <li>✓ Timing de apoio perfeito</li>
                                <li>✓ Cruzamento com qualidade</li>
                                <li>✓ 1v1 defensivo consistente</li>
                                <li>✓ Transição rápida (vai e volta)</li>
                              </ul>
                            </div>
                            <div className="rounded-lg p-3" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-bold text-sm text-green-400 mb-2">ZAGUEIRO</p>
                              <ul className="text-xs text-slate-300 space-y-1">
                                <li>✓ Leitura de jogo antecipada</li>
                                <li>✓ Duelo aéreo dominante</li>
                                <li>✓ Passe vertical quando tem</li>
                                <li>✓ Comunicação constante</li>
                              </ul>
                            </div>
                            <div className="rounded-lg p-3" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-bold text-sm text-yellow-400 mb-2">VOLANTE</p>
                              <ul className="text-xs text-slate-300 space-y-1">
                                <li>✓ Proteção à defesa constante</li>
                                <li>✓ Recupera e já sai jogando</li>
                                <li>✓ Leitura de interceptação</li>
                                <li>✓ Circula bola com critério</li>
                              </ul>
                            </div>
                            <div className="rounded-lg p-3" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-bold text-sm text-purple-400 mb-2">MEIA</p>
                              <ul className="text-xs text-slate-300 space-y-1">
                                <li>✓ Último passe com frequência</li>
                                <li>✓ Joga entre linhas</li>
                                <li>✓ Finalização de meia-distância</li>
                                <li>✓ Conecta setores do time</li>
                              </ul>
                            </div>
                            <div className="rounded-lg p-3" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-bold text-sm text-orange-400 mb-2">PONTA</p>
                              <ul className="text-xs text-slate-300 space-y-1">
                                <li>✓ 1v1 decisivo (ganha mais que perde)</li>
                                <li>✓ Finalização e assistência</li>
                                <li>✓ Recomposição defensiva</li>
                                <li>✓ Joga por dentro e por fora</li>
                              </ul>
                            </div>
                            <div className="rounded-lg p-3" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-bold text-sm text-red-400 mb-2">CENTROAVANTE</p>
                              <ul className="text-xs text-slate-300 space-y-1">
                                <li>✓ Finalização variada</li>
                                <li>✓ Jogo de costas quando precisa</li>
                                <li>✓ Movimentação para criar espaço</li>
                                <li>✓ Oportunismo (está no lugar certo)</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* O Teste Final */}
                        <div className="bg-green-900/30 rounded-lg p-4 border border-green-700">
                          <h4 className="font-bold text-green-300 mb-2 flex items-center gap-2">
                            <Star className="w-5 h-5" /> O TESTE DO TALENTO SUB-15
                          </h4>
                          <p className="text-green-200 text-sm">
                            <strong>Observe 3 jogos seguidos contra adversários de nível.</strong> O talento REAL mostra
                            consistência nos 3 jogos - mesma qualidade, mesma função, mesma atitude. O "falso talento"
                            joga bem em 1, mal em 1, médio em 1. No profissional, você joga 60+ jogos por ano -
                            oscilação não é aceitável.
                          </p>
                        </div>

                        {/* Armadilha */}
                        <div className="bg-red-900/30 rounded-lg p-4 border border-red-700">
                          <p className="text-sm text-red-300 flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span><strong>ARMADILHA CLÁSSICA:</strong> O atacante que faz 3 gols num jogo fácil e
                            nenhum nos próximos 5 difíceis. Ele "parece" artilheiro, mas é oportunista contra
                            defesas fracas. Compare com o que faz 1 gol em cada jogo - mesmo contra adversário bom.</span>
                          </p>
                        </div>

                        {/* PERFIL IDEAL */}
                        <div className="bg-gradient-to-r from-orange-900/50 to-amber-900/50 rounded-xl p-5 border border-orange-600">
                          <h4 className="font-bold text-orange-300 mb-4 flex items-center gap-2 text-lg">
                            <Star className="w-6 h-6" /> PERFIL IDEAL DO ATLETA SUB-15
                          </h4>
                          <p className="text-orange-200 text-sm mb-4">Nesta idade, o perfil ideal é POR POSIÇÃO. O atleta deve DOMINAR a função:</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div className="rounded-lg p-3" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-bold text-sm text-blue-400 mb-2">🧤 GOLEIRO IDEAL</p>
                              <ul className="text-xs text-slate-300 space-y-1">
                                <li>✓ Posicionamento correto</li>
                                <li>✓ Saídas de gol seguras</li>
                                <li>✓ Jogo com os pés básico</li>
                                <li>✓ Comunicação com defesa</li>
                                <li>✓ Concentração o jogo todo</li>
                                <li>✓ Coragem nas divididas</li>
                              </ul>
                            </div>
                            <div className="rounded-lg p-3" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-bold text-sm text-green-400 mb-2">🛡️ ZAGUEIRO IDEAL</p>
                              <ul className="text-xs text-slate-300 space-y-1">
                                <li>✓ Leitura de jogo antecipada</li>
                                <li>✓ Duelo aéreo dominante</li>
                                <li>✓ Passe de saída com qualidade</li>
                                <li>✓ Cobertura ao companheiro</li>
                                <li>✓ Comunicação constante</li>
                                <li>✓ Linha alta ou baixa conforme time</li>
                              </ul>
                            </div>
                            <div className="rounded-lg p-3" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-bold text-sm text-cyan-400 mb-2">↔️ LATERAL IDEAL</p>
                              <ul className="text-xs text-slate-300 space-y-1">
                                <li>✓ Timing de apoio perfeito</li>
                                <li>✓ Cruzamento com qualidade</li>
                                <li>✓ 1v1 defensivo consistente</li>
                                <li>✓ Transição rápida (vai e volta)</li>
                                <li>✓ Cobertura ao zagueiro</li>
                                <li>✓ Resistência física boa</li>
                              </ul>
                            </div>
                            <div className="rounded-lg p-3" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-bold text-sm text-yellow-400 mb-2">⚙️ VOLANTE IDEAL</p>
                              <ul className="text-xs text-slate-300 space-y-1">
                                <li>✓ Proteção à defesa constante</li>
                                <li>✓ Recupera e já sai jogando</li>
                                <li>✓ Leitura de interceptação</li>
                                <li>✓ Circula bola com critério</li>
                                <li>✓ Chegada na área em momento certo</li>
                                <li>✓ Equilíbrio tático do time</li>
                              </ul>
                            </div>
                            <div className="rounded-lg p-3" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-bold text-sm text-purple-400 mb-2">🎯 MEIA IDEAL</p>
                              <ul className="text-xs text-slate-300 space-y-1">
                                <li>✓ Último passe com frequência</li>
                                <li>✓ Joga entre linhas</li>
                                <li>✓ Finalização de meia-distância</li>
                                <li>✓ Conecta setores do time</li>
                                <li>✓ Visão de jogo apurada</li>
                                <li>✓ Recomposição defensiva</li>
                              </ul>
                            </div>
                            <div className="rounded-lg p-3" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-bold text-sm text-pink-400 mb-2">⚡ PONTA IDEAL</p>
                              <ul className="text-xs text-slate-300 space-y-1">
                                <li>✓ 1v1 decisivo (ganha mais que perde)</li>
                                <li>✓ Finalização e assistência</li>
                                <li>✓ Joga por dentro e por fora</li>
                                <li>✓ Recomposição defensiva</li>
                                <li>✓ Velocidade com bola</li>
                                <li>✓ Decisão rápida no último terço</li>
                              </ul>
                            </div>
                          </div>

                          <div className="mt-4 rounded-lg p-3" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                            <p className="font-bold text-sm text-red-400 mb-2">⚽ CENTROAVANTE IDEAL</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <ul className="text-xs text-slate-300 space-y-1">
                                <li>✓ Finalização variada (pé, cabeça, primeira)</li>
                                <li>✓ Jogo de costas quando precisa</li>
                                <li>✓ Movimentação para criar espaço</li>
                              </ul>
                              <ul className="text-xs text-slate-300 space-y-1">
                                <li>✓ Oportunismo (está no lugar certo)</li>
                                <li>✓ Pressão na saída de bola adversária</li>
                                <li>✓ Referência para bola aérea</li>
                              </ul>
                            </div>
                          </div>

                          <div className="mt-4 p-3 bg-orange-800/50 rounded-lg border border-orange-500">
                            <p className="text-orange-200 text-sm">
                              <strong>UNIVERSAL (todas as posições):</strong> Consistência (8 de 10 acertos) + Cumpre função sem reclamar + Compete em todos os jogos + Aguenta 90 min + Entende modelo de jogo do treinador.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sub-17 Talento */}
                  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #475569' }}>
                    <button
                      onClick={() => setTalentoCategoria(talentoCategoria === 'sub17' ? null : 'sub17')}
                      className="w-full flex items-center justify-between p-4 transition-colors hover:opacity-80"
                      style={{ backgroundColor: '#1e293b' }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg text-white flex items-center justify-center font-bold text-lg" style={{ backgroundColor: '#ef4444' }}>17</div>
                        <div className="text-left">
                          <p className="font-semibold text-white text-lg">Talento no Sub-17</p>
                          <p className="text-sm text-white">"Pronto para subir?" - Avaliação final antes do profissional</p>
                        </div>
                      </div>
                      {talentoCategoria === 'sub17' ? <ChevronDown className="w-6 h-6 text-white" /> : <ChevronRight className="w-6 h-6 text-white" />}
                    </button>
                    {talentoCategoria === 'sub17' && (
                      <div className="p-5 space-y-5" style={{ backgroundColor: '#0f172a' }}>
                        {/* O que define talento nesta idade */}
                        <div className="bg-red-900/40 rounded-lg p-4 border border-red-700">
                          <h4 className="font-bold text-red-300 mb-2">🎯 O QUE DEFINE TALENTO NESTA IDADE</h4>
                          <p className="text-sm text-red-200">
                            No Sub-17, a pergunta é direta: <strong>"Se eu colocar ele no Sub-20 ou profissional AMANHÃ, ele aguenta?"</strong>.
                            Não há mais "vai melhorar" - o que ele É é o que vai para cima. Você avalia:
                            <strong>transferência do que faz para nível superior</strong>, <strong>consistência absoluta</strong>,
                            <strong>decisões sob pressão máxima</strong> e <strong>maturidade competitiva</strong>.
                          </p>
                        </div>

                        {/* Nota Sub-16 vs Sub-17 */}
                        <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-600">
                          <h4 className="font-bold text-blue-300 mb-2 flex items-center gap-2">
                            <span>📝</span> NOTA: Identificando talento Sub-16 vs Sub-17
                          </h4>
                          <div className="text-sm text-blue-200 space-y-2">
                            <p><strong>Sub-16</strong> = está <strong>finalizando</strong> a formação. Ainda há margem:</p>
                            <ul className="ml-4 space-y-1">
                              <li>• Aceite alguma oscilação de rendimento</li>
                              <li>• Valorize PICOS de performance como indicador de teto</li>
                              <li>• Fisicamente ainda pode estar em desenvolvimento final</li>
                              <li>• Observe a TRAJETÓRIA de evolução no último ano</li>
                              <li>• Foque em como ele REAGE à pressão de "última chance"</li>
                            </ul>
                            <p className="mt-2"><strong>Sub-17</strong> = é a <strong>"vitrine final"</strong>. Deve estar PRONTO ou muito próximo. Pouca margem para "vai melhorar depois". O que ele é agora é o que vai para o profissional.</p>
                          </div>
                        </div>

                        {/* Indicadores de Talento */}
                        <div>
                          <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                            <span className="text-xl">✨</span> INDICADORES DE "PRONTO PARA SUBIR"
                          </h4>
                          <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="font-medium text-sm text-green-400 mb-2">✓ SINAIS DE "PRONTO"</p>
                                <ul className="text-sm text-slate-300 space-y-2">
                                  <li>• <strong>Executa em ALTA VELOCIDADE</strong> - técnica + tática rápidas</li>
                                  <li>• <strong>Qualidade sob PRESSÃO e CANSAÇO</strong> - não cai</li>
                                  <li>• <strong>Resolve em ESPAÇO REDUZIDO</strong> - futebol moderno é apertado</li>
                                  <li>• <strong>DECISIVO em momentos importantes</strong> - quer a bola</li>
                                  <li>• <strong>LIDERA</strong> - pelo exemplo, pela voz, pela presença</li>
                                  <li>• <strong>PROFISSIONAL fora de campo</strong> - alimentação, descanso, foco</li>
                                  <li>• <strong>TRANSFERÍVEL</strong> - funciona contra adultos</li>
                                  <li>• <strong>CONFIÁVEL</strong> - treinador sabe o que esperar</li>
                                  <li>• <strong>Gerencia PRESSÃO</strong> - família, empresário, expectativa</li>
                                </ul>
                              </div>
                              <div>
                                <p className="font-medium text-sm text-amber-400 mb-2">⚠️ SINAIS DE "NÃO ESTÁ PRONTO"</p>
                                <ul className="text-sm text-slate-400 space-y-2">
                                  <li>• <strong>Precisa de tempo</strong> - futebol profissional não dá tempo</li>
                                  <li>• <strong>Só funciona contra iguais</strong> - não transfere para cima</li>
                                  <li>• <strong>Oscila muito</strong> - inconsistência inaceitável</li>
                                  <li>• <strong>Some em jogo grande</strong> - não é decisivo</li>
                                  <li>• <strong>Não aguenta fisicamente</strong> - 90 min é o mínimo</li>
                                  <li>• <strong>Imaturidade mental</strong> - não lida com cobrança</li>
                                  <li>• <strong>Problemas extra-campo</strong> - comportamento duvidoso</li>
                                  <li>• <strong>Não entende o jogo</strong> - ainda joga na intuição</li>
                                  <li>• <strong>Ego inflado</strong> - acha que já chegou</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* O Grande Diferencial */}
                        <div>
                          <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                            <span className="text-xl">🔑</span> O GRANDE DIFERENCIAL DO SUB-17
                          </h4>
                          <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                            <p className="text-slate-300 mb-3">
                              <strong className="text-amber-400">A pergunta central:</strong> "O que ele faz TRANSFERE para o profissional?"
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-green-900/30 p-3 rounded-lg border border-green-700">
                                <p className="font-medium text-green-400 mb-1">TRANSFERÍVEL (vai funcionar)</p>
                                <ul className="text-xs text-green-200 space-y-1">
                                  <li>• O que faz, faz contra qualquer um</li>
                                  <li>• Velocidade de decisão é alta</li>
                                  <li>• Executa bem em espaço apertado</li>
                                  <li>• Aguenta 90 min + prorrogação</li>
                                  <li>• Rendimento independe de adversário</li>
                                </ul>
                              </div>
                              <div className="bg-red-900/30 p-3 rounded-lg border border-red-700">
                                <p className="font-medium text-red-400 mb-1">NÃO TRANSFERÍVEL (vai sofrer)</p>
                                <ul className="text-xs text-red-200 space-y-1">
                                  <li>• Só funciona contra mais novos</li>
                                  <li>• Precisa de tempo para pensar</li>
                                  <li>• Depende de espaço para jogar</li>
                                  <li>• Cai fisicamente aos 70 min</li>
                                  <li>• Rendimento cai contra "mais fortes"</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Checklist Final */}
                        <div>
                          <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                            <span className="text-xl">✅</span> CHECKLIST FINAL - ELE ESTÁ PRONTO?
                          </h4>
                          <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                            <p className="text-sm text-slate-400 mb-3">Se a maioria for "SIM", ele pode subir. Se tiver muitos "NÃO", ainda precisa de tempo:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-slate-300">
                                  <div className="w-5 h-5 rounded border border-slate-500 flex-shrink-0"></div>
                                  <span>Funciona contra adversários adultos?</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-300">
                                  <div className="w-5 h-5 rounded border border-slate-500 flex-shrink-0"></div>
                                  <span>Mantém rendimento 90 min?</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-300">
                                  <div className="w-5 h-5 rounded border border-slate-500 flex-shrink-0"></div>
                                  <span>Decide bem sob pressão máxima?</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-300">
                                  <div className="w-5 h-5 rounded border border-slate-500 flex-shrink-0"></div>
                                  <span>Consistente em 10+ jogos seguidos?</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-300">
                                  <div className="w-5 h-5 rounded border border-slate-500 flex-shrink-0"></div>
                                  <span>Lidera ou pelo menos não atrapalha?</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-slate-300">
                                  <div className="w-5 h-5 rounded border border-slate-500 flex-shrink-0"></div>
                                  <span>Profissional fora de campo?</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-300">
                                  <div className="w-5 h-5 rounded border border-slate-500 flex-shrink-0"></div>
                                  <span>Lida bem com cobrança e pressão?</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-300">
                                  <div className="w-5 h-5 rounded border border-slate-500 flex-shrink-0"></div>
                                  <span>Entende e executa modelo de jogo?</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-300">
                                  <div className="w-5 h-5 rounded border border-slate-500 flex-shrink-0"></div>
                                  <span>Tem diferencial claro na posição?</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-300">
                                  <div className="w-5 h-5 rounded border border-slate-500 flex-shrink-0"></div>
                                  <span>Treinador pode CONFIAR nele?</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* O Teste Final */}
                        <div className="bg-green-900/30 rounded-lg p-4 border border-green-700">
                          <h4 className="font-bold text-green-300 mb-2 flex items-center gap-2">
                            <Star className="w-5 h-5" /> O TESTE DEFINITIVO DO SUB-17
                          </h4>
                          <p className="text-green-200 text-sm">
                            <strong>Coloque-o 3 jogos com o Sub-20 ou profissional.</strong> Se ele SUMIR, não está pronto -
                            não importa o que faz no Sub-17. Se ele JOGAR (mesmo com erros, mas participando, tentando,
                            competindo), está pronto. O talento REAL não se intimida - se adapta, mesmo sofrendo.
                          </p>
                        </div>

                        {/* Armadilha */}
                        <div className="bg-red-900/30 rounded-lg p-4 border border-red-700">
                          <p className="text-sm text-red-300 flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span><strong>ARMADILHA CLÁSSICA:</strong> O "craque do Sub-17" que domina a categoria mas
                            nunca sobe de verdade. Parece que "falta uma chance", mas na verdade o que ele faz não
                            transfere. Compare com o cara mais "simples" que todo técnico do profissional quer -
                            porque é CONFIÁVEL, não ESPETACULAR.</span>
                          </p>
                        </div>

                        {/* PERFIL IDEAL */}
                        <div className="bg-gradient-to-r from-red-900/50 to-rose-900/50 rounded-xl p-5 border border-red-600">
                          <h4 className="font-bold text-red-300 mb-4 flex items-center gap-2 text-lg">
                            <Star className="w-6 h-6" /> PERFIL IDEAL DO ATLETA SUB-17 (Pronto para Subir)
                          </h4>
                          <p className="text-red-200 text-sm mb-4">A régua aqui é PROFISSIONAL. O atleta ideal por posição deve:</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div className="rounded-lg p-3" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-bold text-sm text-blue-400 mb-2">🧤 GOLEIRO PRONTO</p>
                              <ul className="text-xs text-slate-300 space-y-1">
                                <li>✓ Domina TODAS as situações de gol</li>
                                <li>✓ Jogo com os pés de qualidade</li>
                                <li>✓ Comanda a defesa com autoridade</li>
                                <li>✓ Saídas precisas (timing + técnica)</li>
                                <li>✓ Gerencia pressão do jogo</li>
                                <li>✓ Zero erro de concentração</li>
                                <li>✓ Funciona contra adultos</li>
                              </ul>
                            </div>
                            <div className="rounded-lg p-3" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-bold text-sm text-green-400 mb-2">🛡️ ZAGUEIRO PRONTO</p>
                              <ul className="text-xs text-slate-300 space-y-1">
                                <li>✓ Lê o jogo antes de acontecer</li>
                                <li>✓ Domina duelo físico e aéreo</li>
                                <li>✓ Sai jogando sob pressão</li>
                                <li>✓ Zero erro de posicionamento</li>
                                <li>✓ Líder da defesa (voz + exemplo)</li>
                                <li>✓ Consistente 90 min</li>
                                <li>✓ Aguenta atacante profissional</li>
                              </ul>
                            </div>
                            <div className="rounded-lg p-3" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-bold text-sm text-cyan-400 mb-2">↔️ LATERAL PRONTO</p>
                              <ul className="text-xs text-slate-300 space-y-1">
                                <li>✓ Box-to-box em alta intensidade</li>
                                <li>✓ Cruza com qualidade consistente</li>
                                <li>✓ 1v1 defensivo ganha 70%+</li>
                                <li>✓ Timing de apoio perfeito</li>
                                <li>✓ Resistência de 90 min+</li>
                                <li>✓ Zero apagão defensivo</li>
                                <li>✓ Funciona contra ponta profissional</li>
                              </ul>
                            </div>
                            <div className="rounded-lg p-3" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-bold text-sm text-yellow-400 mb-2">⚙️ VOLANTE PRONTO</p>
                              <ul className="text-xs text-slate-300 space-y-1">
                                <li>✓ Cérebro tático do time</li>
                                <li>✓ Recupera bola em quantidade</li>
                                <li>✓ Distribui com critério alto</li>
                                <li>✓ Chegada na área (gols/assistências)</li>
                                <li>✓ Não toma cartão bobo</li>
                                <li>✓ Lidera pelo posicionamento</li>
                                <li>✓ Domina ritmo do jogo</li>
                              </ul>
                            </div>
                            <div className="rounded-lg p-3" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-bold text-sm text-purple-400 mb-2">🎯 MEIA PRONTO</p>
                              <ul className="text-xs text-slate-300 space-y-1">
                                <li>✓ Último passe é marca registrada</li>
                                <li>✓ Gols importantes de meia distância</li>
                                <li>✓ Joga entre linhas sob pressão</li>
                                <li>✓ Resolve em espaço reduzido</li>
                                <li>✓ Decisivo em jogo grande</li>
                                <li>✓ Cria + finaliza + recupera</li>
                                <li>✓ Diferencial claro vs meias adultos</li>
                              </ul>
                            </div>
                            <div className="rounded-lg p-3" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-bold text-sm text-pink-400 mb-2">⚡ PONTA PRONTO</p>
                              <ul className="text-xs text-slate-300 space-y-1">
                                <li>✓ 1v1 desequilibrador</li>
                                <li>✓ Gols + assistências consistentes</li>
                                <li>✓ Joga por dentro e por fora</li>
                                <li>✓ Decisivo no último terço</li>
                                <li>✓ Recompõe sem reclamar</li>
                                <li>✓ Velocidade em alta intensidade</li>
                                <li>✓ Vence lateral profissional</li>
                              </ul>
                            </div>
                          </div>

                          <div className="mt-4 rounded-lg p-3" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                            <p className="font-bold text-sm text-red-400 mb-2">⚽ CENTROAVANTE PRONTO</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <ul className="text-xs text-slate-300 space-y-1">
                                <li>✓ Artilheiro consistente (não só em jogo fácil)</li>
                                <li>✓ Finalização variada em alta velocidade</li>
                                <li>✓ Jogo de costas de qualidade</li>
                                <li>✓ Presença em bola aérea</li>
                              </ul>
                              <ul className="text-xs text-slate-300 space-y-1">
                                <li>✓ Movimentação que cria espaço pros outros</li>
                                <li>✓ Decisivo em jogo grande</li>
                                <li>✓ Marca gols contra zagueiros profissionais</li>
                                <li>✓ Referência que o time pode confiar</li>
                              </ul>
                            </div>
                          </div>

                          <div className="mt-4 p-3 bg-red-800/50 rounded-lg border border-red-500">
                            <p className="text-red-200 text-sm">
                              <strong>UNIVERSAL (todas as posições):</strong> Funciona contra adultos + Consistência absoluta + Decisivo sob pressão + Profissional fora de campo + Lidera ou não atrapalha + O que faz TRANSFERE para cima.
                            </p>
                          </div>

                          <div className="mt-4 p-3 bg-purple-900/50 rounded-lg border border-purple-500">
                            <p className="text-purple-200 text-sm">
                              <strong>A PERGUNTA FINAL:</strong> "Se eu colocar ele no profissional AMANHÃ contra um time de Série A, ele aguenta?"
                              Se a resposta for sim = pronto. Se for "talvez" ou "precisa de mais tempo" = ainda não.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Resumo Geral */}
              <div className="bg-gradient-to-r from-amber-900/40 to-yellow-900/40 rounded-xl p-6 border border-amber-600">
                <h3 className="text-xl font-bold text-amber-300 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6" />
                  RESUMO: EVOLUÇÃO DO "TALENTO" POR IDADE
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-amber-700">
                        <th className="text-left py-2 px-3 text-amber-300 font-medium">Categoria</th>
                        <th className="text-left py-2 px-3 text-amber-300 font-medium">O que define talento</th>
                        <th className="text-left py-2 px-3 text-amber-300 font-medium">Armadilha principal</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-300">
                      <tr className="border-b border-slate-700">
                        <td className="py-2 px-3 font-medium text-cyan-400">Sub-7/9</td>
                        <td className="py-2 px-3">Coordenação + Curiosidade + Aprendizado rápido</td>
                        <td className="py-2 px-3 text-red-400">Confundir tamanho com talento</td>
                      </tr>
                      <tr className="border-b border-slate-700">
                        <td className="py-2 px-3 font-medium text-green-400">Sub-11</td>
                        <td className="py-2 px-3">Visão de jogo + Primeiro toque + Velocidade de decisão</td>
                        <td className="py-2 px-3 text-red-400">Confundir drible com inteligência</td>
                      </tr>
                      <tr className="border-b border-slate-700">
                        <td className="py-2 px-3 font-medium text-yellow-400">Sub-13</td>
                        <td className="py-2 px-3">Jogo sem bola + Execução sob pressão + Princípios táticos</td>
                        <td className="py-2 px-3 text-red-400">Só olhar o que faz COM a bola</td>
                      </tr>
                      <tr className="border-b border-slate-700">
                        <td className="py-2 px-3 font-medium text-orange-400">Sub-15</td>
                        <td className="py-2 px-3">Consistência + Função da posição + Competitividade</td>
                        <td className="py-2 px-3 text-red-400">Valorizar "lampejos" vs consistência</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium text-red-400">Sub-17</td>
                        <td className="py-2 px-3">Transferência + Confiabilidade + Maturidade total</td>
                        <td className="py-2 px-3 text-red-400">Achar que "bom no sub-17" = bom no profissional</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab Como Decidir */}
          {activeTab === 'decisao' && (
            <div className="space-y-6">
              {/* Intro */}
              <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-xl p-6 border border-purple-600">
                <h3 className="text-xl font-bold text-purple-300 mb-2">Por que escolher A e não B?</h3>
                <p className="text-slate-300">
                  Uma das perguntas mais difíceis na formação. Dois atletas podem ter notas parecidas,
                  mas <strong>contexto, potencial, perfil e IDADE</strong> mudam tudo. Os critérios de decisão
                  são DIFERENTES em cada categoria. Aqui está o framework completo para decidir com segurança.
                </p>
              </div>

              {/* Princípio Universal */}
              <div className="bg-gradient-to-r from-amber-900/40 to-yellow-900/40 rounded-xl p-6 border border-amber-600">
                <h3 className="text-xl font-bold text-amber-300 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6" />
                  O PRINCÍPIO UNIVERSAL DE DECISÃO
                </h3>
                <p className="text-amber-200 mb-4">Antes de qualquer decisão, aplique este filtro:</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-green-900/50 rounded-lg p-4 border border-green-600">
                    <h4 className="font-bold text-green-300 mb-2">1. APRENDE RÁPIDO?</h4>
                    <p className="text-sm text-green-200">Quem aprende rápido vai evoluir. Quem não aprende, estagna.</p>
                    <p className="text-xs text-green-300 mt-2 italic">"Se eu corrigir, ele muda na próxima?"</p>
                  </div>
                  <div className="bg-blue-900/50 rounded-lg p-4 border border-blue-600">
                    <h4 className="font-bold text-blue-300 mb-2">2. PENSA O JOGO?</h4>
                    <p className="text-sm text-blue-200">Percepção + Decisão são mais difíceis de ensinar que técnica.</p>
                    <p className="text-xs text-blue-300 mt-2 italic">"Ele entende o que está fazendo ou só faz?"</p>
                  </div>
                  <div className="bg-purple-900/50 rounded-lg p-4 border border-purple-600">
                    <h4 className="font-bold text-purple-300 mb-2">3. QUER COMPETIR?</h4>
                    <p className="text-sm text-purple-200">Atitude e mentalidade são fundamentais em qualquer nível.</p>
                    <p className="text-xs text-purple-300 mt-2 italic">"Ele aparece quando aperta ou some?"</p>
                  </div>
                </div>

                <div className="bg-yellow-800/50 rounded-lg p-4 border border-yellow-500">
                  <p className="text-yellow-200">
                    <strong className="text-yellow-100">⭐ REGRA DE OURO:</strong> Na dúvida entre dois atletas com níveis parecidos,
                    escolha o que <strong>aprende mais rápido</strong>. O futebol muda constantemente, e quem aprende se adapta.
                  </p>
                </div>
              </div>

              {/* Matriz de Pesos por Categoria */}
              <div>
                <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-amber-500" />
                  MATRIZ DE PESOS POR CATEGORIA
                </h3>
                <p className="text-slate-400 mb-4">As dimensões têm pesos DIFERENTES dependendo da idade. Use estas tabelas como referência para decisões:</p>

                {/* Critérios Gerais */}
                <div className="mb-6">
                  <h4 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                    <span className="text-lg">📊</span> Critérios Gerais de Decisão
                  </h4>
                  <div className="rounded-xl p-4 overflow-x-auto" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-left py-2 px-2 text-slate-400 font-medium">Critério</th>
                          <th className="text-center py-2 px-2 text-cyan-400 font-medium">Sub-7/9</th>
                          <th className="text-center py-2 px-2 text-green-400 font-medium">Sub-11</th>
                          <th className="text-center py-2 px-2 text-yellow-400 font-medium">Sub-13</th>
                          <th className="text-center py-2 px-2 text-orange-400 font-medium">Sub-15</th>
                          <th className="text-center py-2 px-2 text-red-400 font-medium">Sub-17</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-300">
                        <tr className="border-b border-slate-700">
                          <td className="py-2 px-2 font-medium">Capacidade de Aprender</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-blue-400">Médio</td>
                          <td className="py-2 px-2 text-center text-slate-500">Baixo</td>
                        </tr>
                        <tr className="border-b border-slate-700">
                          <td className="py-2 px-2 font-medium">Atitude/Competitividade</td>
                          <td className="py-2 px-2 text-center text-blue-400">Médio</td>
                          <td className="py-2 px-2 text-center text-blue-400">Médio</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                        </tr>
                        <tr className="border-b border-slate-700">
                          <td className="py-2 px-2 font-medium">Consistência</td>
                          <td className="py-2 px-2 text-center text-slate-500">N/A</td>
                          <td className="py-2 px-2 text-center text-slate-500">Baixo</td>
                          <td className="py-2 px-2 text-center text-blue-400">Médio</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-2 font-medium">Domínio de Função</td>
                          <td className="py-2 px-2 text-center text-slate-500">N/A</td>
                          <td className="py-2 px-2 text-center text-slate-500">N/A</td>
                          <td className="py-2 px-2 text-center text-blue-400">Médio</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 8 Dimensões CBF */}
                <div className="mb-6">
                  <h4 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                    <span className="text-lg">🏆</span> 8 Dimensões CBF Academy
                  </h4>
                  <div className="rounded-xl p-4 overflow-x-auto" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-left py-2 px-2 text-slate-400 font-medium">Dimensão CBF</th>
                          <th className="text-center py-2 px-2 text-cyan-400 font-medium">Sub-7/9</th>
                          <th className="text-center py-2 px-2 text-green-400 font-medium">Sub-11</th>
                          <th className="text-center py-2 px-2 text-yellow-400 font-medium">Sub-13</th>
                          <th className="text-center py-2 px-2 text-orange-400 font-medium">Sub-15</th>
                          <th className="text-center py-2 px-2 text-red-400 font-medium">Sub-17</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-300">
                        <tr className="border-b border-slate-700">
                          <td className="py-2 px-2 font-medium">Técnica</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-blue-400">Médio</td>
                          <td className="py-2 px-2 text-center text-blue-400">Médio</td>
                        </tr>
                        <tr className="border-b border-slate-700">
                          <td className="py-2 px-2 font-medium">Tática</td>
                          <td className="py-2 px-2 text-center text-slate-500">Baixo</td>
                          <td className="py-2 px-2 text-center text-blue-400">Médio</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                        </tr>
                        <tr className="border-b border-slate-700">
                          <td className="py-2 px-2 font-medium">Física</td>
                          <td className="py-2 px-2 text-center text-red-400">Ignorar</td>
                          <td className="py-2 px-2 text-center text-red-400">Ignorar</td>
                          <td className="py-2 px-2 text-center text-slate-500">Baixo</td>
                          <td className="py-2 px-2 text-center text-blue-400">Médio</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                        </tr>
                        <tr className="border-b border-slate-700">
                          <td className="py-2 px-2 font-medium">Psicológica</td>
                          <td className="py-2 px-2 text-center text-blue-400">Médio</td>
                          <td className="py-2 px-2 text-center text-blue-400">Médio</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                        </tr>
                        <tr className="border-b border-slate-700">
                          <td className="py-2 px-2 font-medium">Cognitiva</td>
                          <td className="py-2 px-2 text-center text-blue-400">Médio</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                        </tr>
                        <tr className="border-b border-slate-700">
                          <td className="py-2 px-2 font-medium">Competitiva</td>
                          <td className="py-2 px-2 text-center text-slate-500">Baixo</td>
                          <td className="py-2 px-2 text-center text-blue-400">Médio</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                        </tr>
                        <tr className="border-b border-slate-700">
                          <td className="py-2 px-2 font-medium">Social</td>
                          <td className="py-2 px-2 text-center text-blue-400">Médio</td>
                          <td className="py-2 px-2 text-center text-blue-400">Médio</td>
                          <td className="py-2 px-2 text-center text-blue-400">Médio</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-2 font-medium">Dinâmica</td>
                          <td className="py-2 px-2 text-center text-blue-400">Médio</td>
                          <td className="py-2 px-2 text-center text-blue-400">Médio</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 6 Dimensões Ofensivas */}
                <div className="mb-6">
                  <h4 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                    <span className="text-lg">⚔️</span> 6 Dimensões Ofensivas
                  </h4>
                  <div className="rounded-xl p-4 overflow-x-auto" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-left py-2 px-2 text-slate-400 font-medium">Dimensão Ofensiva</th>
                          <th className="text-center py-2 px-2 text-cyan-400 font-medium">Sub-7/9</th>
                          <th className="text-center py-2 px-2 text-green-400 font-medium">Sub-11</th>
                          <th className="text-center py-2 px-2 text-yellow-400 font-medium">Sub-13</th>
                          <th className="text-center py-2 px-2 text-orange-400 font-medium">Sub-15</th>
                          <th className="text-center py-2 px-2 text-red-400 font-medium">Sub-17</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-300">
                        <tr className="border-b border-slate-700">
                          <td className="py-2 px-2 font-medium">Penetração</td>
                          <td className="py-2 px-2 text-center text-slate-500">Baixo</td>
                          <td className="py-2 px-2 text-center text-blue-400">Médio</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                        </tr>
                        <tr className="border-b border-slate-700">
                          <td className="py-2 px-2 font-medium">Cobertura Ofensiva</td>
                          <td className="py-2 px-2 text-center text-slate-500">N/A</td>
                          <td className="py-2 px-2 text-center text-slate-500">Baixo</td>
                          <td className="py-2 px-2 text-center text-blue-400">Médio</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                        </tr>
                        <tr className="border-b border-slate-700">
                          <td className="py-2 px-2 font-medium">Espaço com Bola</td>
                          <td className="py-2 px-2 text-center text-blue-400">Médio</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                        </tr>
                        <tr className="border-b border-slate-700">
                          <td className="py-2 px-2 font-medium">Espaço sem Bola</td>
                          <td className="py-2 px-2 text-center text-slate-500">N/A</td>
                          <td className="py-2 px-2 text-center text-blue-400">Médio</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                        </tr>
                        <tr className="border-b border-slate-700">
                          <td className="py-2 px-2 font-medium">Mobilidade</td>
                          <td className="py-2 px-2 text-center text-slate-500">Baixo</td>
                          <td className="py-2 px-2 text-center text-blue-400">Médio</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-2 font-medium">Unidade Ofensiva</td>
                          <td className="py-2 px-2 text-center text-slate-500">N/A</td>
                          <td className="py-2 px-2 text-center text-slate-500">Baixo</td>
                          <td className="py-2 px-2 text-center text-blue-400">Médio</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 6 Dimensões Defensivas */}
                <div className="mb-6">
                  <h4 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                    <span className="text-lg">🛡️</span> 6 Dimensões Defensivas
                  </h4>
                  <div className="rounded-xl p-4 overflow-x-auto" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-left py-2 px-2 text-slate-400 font-medium">Dimensão Defensiva</th>
                          <th className="text-center py-2 px-2 text-cyan-400 font-medium">Sub-7/9</th>
                          <th className="text-center py-2 px-2 text-green-400 font-medium">Sub-11</th>
                          <th className="text-center py-2 px-2 text-yellow-400 font-medium">Sub-13</th>
                          <th className="text-center py-2 px-2 text-orange-400 font-medium">Sub-15</th>
                          <th className="text-center py-2 px-2 text-red-400 font-medium">Sub-17</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-300">
                        <tr className="border-b border-slate-700">
                          <td className="py-2 px-2 font-medium">Contenção</td>
                          <td className="py-2 px-2 text-center text-slate-500">Baixo</td>
                          <td className="py-2 px-2 text-center text-blue-400">Médio</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                        </tr>
                        <tr className="border-b border-slate-700">
                          <td className="py-2 px-2 font-medium">Cobertura Defensiva</td>
                          <td className="py-2 px-2 text-center text-slate-500">N/A</td>
                          <td className="py-2 px-2 text-center text-slate-500">Baixo</td>
                          <td className="py-2 px-2 text-center text-blue-400">Médio</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                        </tr>
                        <tr className="border-b border-slate-700">
                          <td className="py-2 px-2 font-medium">Equilíbrio/Recuperação</td>
                          <td className="py-2 px-2 text-center text-slate-500">N/A</td>
                          <td className="py-2 px-2 text-center text-slate-500">Baixo</td>
                          <td className="py-2 px-2 text-center text-blue-400">Médio</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                        </tr>
                        <tr className="border-b border-slate-700">
                          <td className="py-2 px-2 font-medium">Equilíbrio Defensivo</td>
                          <td className="py-2 px-2 text-center text-slate-500">N/A</td>
                          <td className="py-2 px-2 text-center text-slate-500">Baixo</td>
                          <td className="py-2 px-2 text-center text-blue-400">Médio</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                        </tr>
                        <tr className="border-b border-slate-700">
                          <td className="py-2 px-2 font-medium">Concentração</td>
                          <td className="py-2 px-2 text-center text-slate-500">Baixo</td>
                          <td className="py-2 px-2 text-center text-blue-400">Médio</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-2 font-medium">Unidade Defensiva</td>
                          <td className="py-2 px-2 text-center text-slate-500">N/A</td>
                          <td className="py-2 px-2 text-center text-slate-500">Baixo</td>
                          <td className="py-2 px-2 text-center text-blue-400">Médio</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                          <td className="py-2 px-2 text-center text-green-400">Alto</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Legenda */}
                <div className="rounded-lg p-4" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                  <p className="text-sm text-slate-400 mb-2"><strong>Legenda de Pesos:</strong></p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-1"><span className="text-green-400">●</span> Alto = Muito relevante para decisão</span>
                    <span className="flex items-center gap-1"><span className="text-blue-400">●</span> Médio = Considerar na decisão</span>
                    <span className="flex items-center gap-1"><span className="text-slate-500">●</span> Baixo = Pouco relevante</span>
                    <span className="flex items-center gap-1"><span className="text-red-400">●</span> Ignorar/N/A = Não usar para decidir</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-3">
                    <strong>Exemplo de uso:</strong> Se estou decidindo entre dois atletas Sub-13, devo dar mais peso para Tática, Cognitiva, Competitiva, Espaço sem Bola e Contenção do que para Física ou Técnica pura.
                  </p>
                </div>
              </div>

              {/* DECISÃO POR CATEGORIA */}
              <div>
                <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                  <Star className="w-6 h-6 text-amber-500" />
                  CENÁRIOS DE DECISÃO POR CATEGORIA
                </h3>
                <p className="text-slate-400 mb-4">Clique na categoria para ver os cenários de decisão específicos para aquela idade:</p>

                <div className="space-y-3">
                  {/* Sub-7/9 Decisão */}
                  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #475569' }}>
                    <button
                      onClick={() => setDecisaoCategoria(decisaoCategoria === 'sub7' ? null : 'sub7')}
                      className="w-full flex items-center justify-between p-4 transition-colors hover:opacity-80"
                      style={{ backgroundColor: '#1e293b' }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg text-white flex items-center justify-center font-bold text-lg" style={{ backgroundColor: '#06b6d4' }}>7/9</div>
                        <div className="text-left">
                          <p className="font-semibold text-white text-lg">Decisões no Sub-7 / Sub-9</p>
                          <p className="text-sm text-white">"Escolher potencial, não resultado" - Foco em indicadores precoces</p>
                        </div>
                      </div>
                      {decisaoCategoria === 'sub7' ? <ChevronDown className="w-6 h-6 text-white" /> : <ChevronRight className="w-6 h-6 text-white" />}
                    </button>
                    {decisaoCategoria === 'sub7' && (
                      <div className="p-5 space-y-5" style={{ backgroundColor: '#0f172a' }}>
                        {/* Contexto */}
                        <div className="bg-cyan-900/40 rounded-lg p-4 border border-cyan-700">
                          <h4 className="font-bold text-cyan-300 mb-2">🎯 CONTEXTO DAS DECISÕES NESTA IDADE</h4>
                          <p className="text-sm text-cyan-200">
                            Nesta idade, você <strong>NÃO está escolhendo quem vai ser profissional</strong> - está escolhendo
                            quem tem <strong>indicadores de potencial para desenvolver</strong>. A maioria das decisões aqui
                            são sobre: quem promover de turma, quem dar mais atenção, quem está no caminho certo.
                            <strong> NUNCA decida baseado em resultado de jogo ou tamanho físico.</strong>
                          </p>
                        </div>

                        {/* Cenários */}
                        <div>
                          <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                            <span className="text-xl">🤔</span> CENÁRIOS COMUNS DE DECISÃO
                          </h4>
                          <div className="space-y-4">
                            <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-medium text-slate-100 mb-2">"A" faz 5 gols por jogo, "B" mal toca na bola mas se movimenta bem</p>
                              <div className="bg-green-900/30 rounded p-3 border border-green-700">
                                <p className="text-sm text-green-300">
                                  <strong>Resposta:</strong> Provavelmente "B" tem mais potencial. "A" faz gols porque é maior/mais rápido.
                                  "B" que se movimenta bem já mostra inteligência espacial. Quando todos tiverem o mesmo tamanho,
                                  "B" vai saber jogar e "A" vai precisar aprender do zero.
                                </p>
                              </div>
                            </div>

                            <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-medium text-slate-100 mb-2">"A" é muito coordenado mas tímido, "B" é intenso mas descoordenado</p>
                              <div className="bg-green-900/30 rounded p-3 border border-green-700">
                                <p className="text-sm text-green-300">
                                  <strong>Resposta:</strong> "A". Coordenação é muito difícil de desenvolver depois.
                                  Timidez pode ser trabalhada com ambiente, confiança e tempo. "B" pode ter atitude,
                                  mas se não tem base motora, vai sofrer para executar qualquer coisa.
                                </p>
                              </div>
                            </div>

                            <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-medium text-slate-100 mb-2">"A" treina desde os 4 anos, "B" começou há 6 meses mas evolui rápido</p>
                              <div className="bg-green-900/30 rounded p-3 border border-green-700">
                                <p className="text-sm text-green-300">
                                  <strong>Resposta:</strong> Observe "B" com atenção. Se em 6 meses já está perto de quem treina há 3 anos,
                                  a velocidade de aprendizado é excepcional. Tempo de treino não significa qualidade.
                                  O que importa é a CURVA de evolução, não o ponto de partida.
                                </p>
                              </div>
                            </div>

                            <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-medium text-slate-100 mb-2">Pai pressiona para filho ser titular, mas o menino não tem nível</p>
                              <div className="bg-amber-900/30 rounded p-3 border border-amber-700">
                                <p className="text-sm text-amber-300">
                                  <strong>Resposta:</strong> Nunca ceda à pressão dos pais. Isso prejudica TODOS: o menino que não tem nível,
                                  os outros que merecem jogar, e o próprio pai que não está ajudando o filho. Seja honesto
                                  e mostre o que o menino precisa desenvolver.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* O que NÃO fazer */}
                        <div className="bg-red-900/30 rounded-lg p-4 border border-red-700">
                          <h4 className="font-bold text-red-300 mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" /> ERROS FATAIS DE DECISÃO NO SUB-7/9
                          </h4>
                          <ul className="text-sm text-red-200 space-y-2">
                            <li>• <strong>Escolher pelo tamanho</strong> - O maior hoje será "normal" amanhã</li>
                            <li>• <strong>Escolher pelo resultado</strong> - Gols nessa idade não significam nada</li>
                            <li>• <strong>Descartar o "fraquinho"</strong> - Pode ser maturação tardia com muito potencial</li>
                            <li>• <strong>Valorizar só quem aparece</strong> - O tímido coordenado pode explodir depois</li>
                            <li>• <strong>Ceder à pressão de pais</strong> - Decisão técnica é do técnico</li>
                          </ul>
                        </div>

                        {/* QUANDO ESTIVER EM DÚVIDA */}
                        <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 rounded-xl p-5 border border-cyan-600">
                          <h4 className="font-bold text-cyan-300 mb-4 flex items-center gap-2 text-lg">
                            <CheckCircle2 className="w-6 h-6" /> QUANDO ESTIVER EM DÚVIDA NO SUB-7/9
                          </h4>

                          <div className="space-y-4">
                            <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-semibold text-cyan-300 mb-2">📋 REQUISITOS MÍNIMOS (tem que ter pelo menos 3 de 5):</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <ul className="text-sm text-slate-300 space-y-1">
                                  <li>□ Coordenação natural (movimentos fluidos)</li>
                                  <li>□ Aprende rápido (mostra 1x e tenta)</li>
                                  <li>□ Curiosidade com a bola</li>
                                </ul>
                                <ul className="text-sm text-slate-300 space-y-1">
                                  <li>□ Usa os dois pés naturalmente</li>
                                  <li>□ Gosta de jogar (brilho nos olhos)</li>
                                </ul>
                              </div>
                            </div>

                            <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-semibold text-amber-300 mb-2">⚖️ CRITÉRIO DE DESEMPATE (quando dois têm os requisitos):</p>
                              <ol className="text-sm text-slate-300 space-y-1">
                                <li>1º Quem <strong>aprende mais rápido</strong></li>
                                <li>2º Quem tem <strong>coordenação mais natural</strong></li>
                                <li>3º Quem <strong>menos depende do físico</strong></li>
                              </ol>
                            </div>

                            <div className="rounded-lg p-4 bg-green-900/30 border border-green-600">
                              <p className="font-semibold text-green-300 mb-2">✅ DECISÃO RÁPIDA:</p>
                              <p className="text-sm text-green-200">
                                "Se eu tirar a vantagem física deste atleta, ainda sobra algo especial?"<br/>
                                <strong>SIM</strong> = vale a pena investir | <strong>NÃO</strong> = cuidado, pode ser só maturação precoce
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sub-11 Decisão */}
                  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #475569' }}>
                    <button
                      onClick={() => setDecisaoCategoria(decisaoCategoria === 'sub11' ? null : 'sub11')}
                      className="w-full flex items-center justify-between p-4 transition-colors hover:opacity-80"
                      style={{ backgroundColor: '#1e293b' }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg text-white flex items-center justify-center font-bold text-lg" style={{ backgroundColor: '#22c55e' }}>11</div>
                        <div className="text-left">
                          <p className="font-semibold text-white text-lg">Decisões no Sub-11</p>
                          <p className="text-sm text-white">"Quem pensa mais rápido?" - Foco em inteligência e velocidade de decisão</p>
                        </div>
                      </div>
                      {decisaoCategoria === 'sub11' ? <ChevronDown className="w-6 h-6 text-white" /> : <ChevronRight className="w-6 h-6 text-white" />}
                    </button>
                    {decisaoCategoria === 'sub11' && (
                      <div className="p-5 space-y-5" style={{ backgroundColor: '#0f172a' }}>
                        {/* Contexto */}
                        <div className="bg-green-900/40 rounded-lg p-4 border border-green-700">
                          <h4 className="font-bold text-green-300 mb-2">🎯 CONTEXTO DAS DECISÕES NESTA IDADE</h4>
                          <p className="text-sm text-green-200">
                            Esta é a <strong>"idade de ouro"</strong> - o que aprender agora fica para sempre.
                            As decisões aqui são sobre: quem tem <strong>visão de jogo emergente</strong>, quem
                            <strong> levanta a cabeça</strong>, quem <strong>pensa antes de agir</strong>.
                            Ainda não é hora de cobrar tática ou função - é hora de identificar quem ENTENDE o jogo.
                          </p>
                        </div>

                        {/* Nota Sub-10 vs Sub-11 */}
                        <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-600">
                          <h4 className="font-bold text-blue-300 mb-2 flex items-center gap-2">
                            <span>📝</span> NOTA: Decisões Sub-10 vs Sub-11
                          </h4>
                          <div className="text-sm text-blue-200 space-y-2">
                            <p><strong>Sub-10:</strong> Aceite mais inconsistência. O menino pode mostrar "lampejos" de visão mas ainda não sustenta.</p>
                            <p><strong>Sub-11:</strong> Cobre mais frequência. Se NUNCA levanta a cabeça, NUNCA orienta o toque, o potencial é limitado.</p>
                          </div>
                        </div>

                        {/* Cenários */}
                        <div>
                          <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                            <span className="text-xl">🤔</span> CENÁRIOS COMUNS DE DECISÃO
                          </h4>
                          <div className="space-y-4">
                            <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-medium text-slate-100 mb-2">"A" dribla muito bem, "B" passa a bola simples mas sempre certo</p>
                              <div className="bg-green-900/30 rounded p-3 border border-green-700">
                                <p className="text-sm text-green-300">
                                  <strong>Resposta:</strong> Depende. "A" dribla com OBJETIVO ou para aparecer? Se "A" dribla e progride o jogo, ótimo.
                                  Se dribla e perde ou volta, "B" é melhor. O que importa é: quem faz o time jogar melhor?
                                  Às vezes o "simples" é muito mais inteligente que o "bonito".
                                </p>
                              </div>
                            </div>

                            <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-medium text-slate-100 mb-2">"A" domina bem mas demora para decidir, "B" domina pior mas decide rápido</p>
                              <div className="bg-green-900/30 rounded p-3 border border-green-700">
                                <p className="text-sm text-green-300">
                                  <strong>Resposta:</strong> "B" tem mais potencial para o futebol moderno. Técnica de domínio pode ser refinada.
                                  Velocidade de decisão é muito mais difícil de ensinar. "A" pode virar um jogador "lento" de pensamento.
                                  "B" vai melhorar a técnica com treino, mas já pensa rápido.
                                </p>
                              </div>
                            </div>

                            <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-medium text-slate-100 mb-2">"A" só usa o pé direito mas é bom, "B" usa os dois mas é médio</p>
                              <div className="bg-green-900/30 rounded p-3 border border-green-700">
                                <p className="text-sm text-green-300">
                                  <strong>Resposta:</strong> Para o Sub-11, ainda dá para desenvolver os dois pés. Mas se "A" FOGE do pé esquerdo
                                  (muda de corpo, evita situações), isso é um problema. Se "B" usa os dois naturalmente,
                                  tem vantagem estrutural. Observe: "A" usa só o direito por OPÇÃO ou por MEDO?
                                </p>
                              </div>
                            </div>

                            <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-medium text-slate-100 mb-2">"A" é o melhor do time mas não evolui há 1 ano, "B" é mediano mas evolui todo mês</p>
                              <div className="bg-green-900/30 rounded p-3 border border-green-700">
                                <p className="text-sm text-green-300">
                                  <strong>Resposta:</strong> "B" é mais interessante para o longo prazo. "A" pode ter chegado no teto precoce.
                                  A pergunta é: "A" está estagnado porque já é bom ou porque não responde mais a treino?
                                  Se "B" continuar evoluindo, em 2 anos passa "A".
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Erros */}
                        <div className="bg-red-900/30 rounded-lg p-4 border border-red-700">
                          <h4 className="font-bold text-red-300 mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" /> ERROS FATAIS DE DECISÃO NO SUB-11
                          </h4>
                          <ul className="text-sm text-red-200 space-y-2">
                            <li>• <strong>Escolher o driblador</strong> - Drible sem objetivo não é talento</li>
                            <li>• <strong>Ignorar quem pensa</strong> - O "simples" que pensa vale mais que o "bonito" que não pensa</li>
                            <li>• <strong>Ainda valorizar físico</strong> - Nessa idade físico ainda não importa</li>
                            <li>• <strong>Cobrar tática demais</strong> - Ainda não é hora de função, é hora de visão</li>
                          </ul>
                        </div>

                        {/* QUANDO ESTIVER EM DÚVIDA */}
                        <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-xl p-5 border border-green-600">
                          <h4 className="font-bold text-green-300 mb-4 flex items-center gap-2 text-lg">
                            <CheckCircle2 className="w-6 h-6" /> QUANDO ESTIVER EM DÚVIDA NO SUB-11
                          </h4>

                          <div className="space-y-4">
                            <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-semibold text-green-300 mb-2">📋 REQUISITOS MÍNIMOS (tem que ter pelo menos 4 de 6):</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <ul className="text-sm text-slate-300 space-y-1">
                                  <li>□ Levanta a cabeça antes de receber</li>
                                  <li>□ Primeiro toque orientado</li>
                                  <li>□ Velocidade de decisão boa</li>
                                </ul>
                                <ul className="text-sm text-slate-300 space-y-1">
                                  <li>□ Tem mais de uma solução</li>
                                  <li>□ Usa os dois pés com intenção</li>
                                  <li>□ Aprende correção em 1-2 tentativas</li>
                                </ul>
                              </div>
                            </div>

                            <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-semibold text-amber-300 mb-2">⚖️ CRITÉRIO DE DESEMPATE (quando dois têm os requisitos):</p>
                              <ol className="text-sm text-slate-300 space-y-1">
                                <li>1º Quem <strong>pensa mais rápido</strong> (velocidade de decisão)</li>
                                <li>2º Quem <strong>faz o time jogar melhor</strong></li>
                                <li>3º Quem <strong>aparece quando o jogo aperta</strong></li>
                              </ol>
                            </div>

                            <div className="rounded-lg p-4 bg-green-900/30 border border-green-600">
                              <p className="font-semibold text-green-300 mb-2">✅ DECISÃO RÁPIDA:</p>
                              <p className="text-sm text-green-200">
                                "Ele pensa ANTES de agir ou pensa DEPOIS?"<br/>
                                <strong>ANTES</strong> = talento real, invista | <strong>DEPOIS</strong> = reativo, cuidado com expectativas
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sub-13 Decisão */}
                  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #475569' }}>
                    <button
                      onClick={() => setDecisaoCategoria(decisaoCategoria === 'sub13' ? null : 'sub13')}
                      className="w-full flex items-center justify-between p-4 transition-colors hover:opacity-80"
                      style={{ backgroundColor: '#1e293b' }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg text-white flex items-center justify-center font-bold text-lg" style={{ backgroundColor: '#eab308' }}>13</div>
                        <div className="text-left">
                          <p className="font-semibold text-white text-lg">Decisões no Sub-13</p>
                          <p className="text-sm text-white">"Quem joga sem bola?" - Foco em inteligência tática e execução sob pressão</p>
                        </div>
                      </div>
                      {decisaoCategoria === 'sub13' ? <ChevronDown className="w-6 h-6 text-white" /> : <ChevronRight className="w-6 h-6 text-white" />}
                    </button>
                    {decisaoCategoria === 'sub13' && (
                      <div className="p-5 space-y-5" style={{ backgroundColor: '#0f172a' }}>
                        {/* Contexto */}
                        <div className="bg-yellow-900/40 rounded-lg p-4 border border-yellow-700">
                          <h4 className="font-bold text-yellow-300 mb-2">🎯 CONTEXTO DAS DECISÕES NESTA IDADE</h4>
                          <p className="text-sm text-yellow-200">
                            Aqui o jogo muda. As decisões são sobre: quem <strong>mantém qualidade sob pressão</strong>,
                            quem <strong>entende o jogo coletivo</strong>, quem <strong>joga BEM sem a bola</strong>.
                            É a idade de transição - o menino que só sabia "eu e a bola" precisa aprender "eu, a bola e o time".
                            Quem não faz essa transição fica para trás.
                          </p>
                        </div>

                        {/* Nota Sub-12 vs Sub-13 */}
                        <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-600">
                          <h4 className="font-bold text-blue-300 mb-2 flex items-center gap-2">
                            <span>📝</span> NOTA: Decisões Sub-12 vs Sub-13
                          </h4>
                          <div className="text-sm text-blue-200 space-y-2">
                            <p><strong>Sub-12:</strong> Aceite erros sob pressão. A transição está começando. Valorize TENTATIVAS de jogar coletivo.</p>
                            <p><strong>Sub-13:</strong> Cobre execução sob pressão. Se apavora SEMPRE que marcam, se NUNCA joga sem bola, há limitação.</p>
                          </div>
                        </div>

                        {/* Cenários */}
                        <div>
                          <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                            <span className="text-xl">🤔</span> CENÁRIOS COMUNS DE DECISÃO
                          </h4>
                          <div className="space-y-4">
                            <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-medium text-slate-100 mb-2">"A" é tecnicamente superior mas perde qualidade quando marcado, "B" é técnico mediano mas resolve sob pressão</p>
                              <div className="bg-green-900/30 rounded p-3 border border-green-700">
                                <p className="text-sm text-green-300">
                                  <strong>Resposta:</strong> Para Sub-13+, "B" é mais valioso. O futebol profissional é 100% sob pressão.
                                  "A" vai sofrer porque nunca foi pressionado de verdade. "B" já sabe lidar. A pergunta é:
                                  "A" perde qualidade por NERVOSISMO ou por FALTA DE SOLUÇÃO? Se for nervosismo, dá para trabalhar.
                                </p>
                              </div>
                            </div>

                            <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-medium text-slate-100 mb-2">"A" toca 50x no jogo mas só lateraliza, "B" toca 20x mas tenta passes verticais</p>
                              <div className="bg-green-900/30 rounded p-3 border border-green-700">
                                <p className="text-sm text-green-300">
                                  <strong>Resposta:</strong> "B" tem mais potencial para construir jogo. "A" pode ter nota boa em "precisão de passe"
                                  mas não progride o jogo. "B" pode errar mais, mas TENTA jogar para frente. A INTENÇÃO de "B"
                                  é mais valiosa que a "segurança" de "A". Pergunte: "A" lateraliza por escolha tática ou por medo?
                                </p>
                              </div>
                            </div>

                            <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-medium text-slate-100 mb-2">"A" é ótimo com bola mas some sem ela, "B" é bom com bola E sem ela</p>
                              <div className="bg-green-900/30 rounded p-3 border border-green-700">
                                <p className="text-sm text-green-300">
                                  <strong>Resposta:</strong> "B" é claramente superior para Sub-13+. No futebol você fica SEM a bola 95% do tempo.
                                  "A" é um jogador "pela metade" - só existe em 5% do jogo. "B" contribui o tempo todo.
                                  Se "A" não aprender a jogar sem bola AGORA, nunca vai aprender.
                                </p>
                              </div>
                            </div>

                            <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-medium text-slate-100 mb-2">"A" é fisicamente dominante e resolve tudo na força, "B" é menor mas resolve no timing</p>
                              <div className="bg-green-900/30 rounded p-3 border border-green-700">
                                <p className="text-sm text-green-300">
                                  <strong>Resposta:</strong> "B" é aposta mais segura. "A" pode estar usando vantagem física temporária.
                                  Quando todos crescerem, "A" vai precisar aprender a jogar sem a vantagem.
                                  "B" já resolve de forma que vai funcionar em qualquer nível. Timing é talento, força é físico.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Erros */}
                        <div className="bg-red-900/30 rounded-lg p-4 border border-red-700">
                          <h4 className="font-bold text-red-300 mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" /> ERROS FATAIS DE DECISÃO NO SUB-13
                          </h4>
                          <ul className="text-sm text-red-200 space-y-2">
                            <li>• <strong>Só olhar COM a bola</strong> - 95% do jogo é sem ela</li>
                            <li>• <strong>Valorizar quem "não erra"</strong> - Pode ser só quem não arrisca</li>
                            <li>• <strong>Ainda ignorar físico totalmente</strong> - Começa a ter alguma relevância</li>
                            <li>• <strong>Descartar quem erra tentando</strong> - A INTENÇÃO importa</li>
                          </ul>
                        </div>

                        {/* Quando Estiver em Dúvida */}
                        <div className="bg-gradient-to-r from-yellow-900/50 to-amber-900/50 rounded-xl p-5 border border-yellow-600">
                          <h4 className="font-bold text-yellow-300 mb-4 flex items-center gap-2 text-lg">
                            <CheckCircle2 className="w-6 h-6" /> QUANDO ESTIVER EM DÚVIDA NO SUB-13
                          </h4>
                          <div className="space-y-4">
                            <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-semibold text-yellow-300 mb-2">📋 REQUISITOS MÍNIMOS (tem que ter pelo menos 3 de 5):</p>
                              <ul className="text-sm text-slate-200 space-y-1">
                                <li>☐ Mantém nível técnico MESMO sob marcação forte</li>
                                <li>☐ Joga BEM sem a bola (movimentação, posicionamento)</li>
                                <li>☐ Toma decisões corretas na maioria das vezes (6-7 de 10)</li>
                                <li>☐ Compete e não desiste quando o jogo fica difícil</li>
                                <li>☐ Entende e cumpre função tática básica da posição</li>
                              </ul>
                            </div>

                            <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-semibold text-amber-300 mb-2">⚖️ CRITÉRIOS DE DESEMPATE:</p>
                              <ol className="text-sm text-slate-200 space-y-1 list-decimal list-inside">
                                <li><strong>Resolve sob pressão</strong> - Quem joga melhor quando marcado forte?</li>
                                <li><strong>Jogo sem bola</strong> - Quem contribui mais nos 95% que não tem a bola?</li>
                                <li><strong>Mentalidade competitiva</strong> - Quem melhora quando o jogo aperta?</li>
                                <li><strong>Progressão vertical</strong> - Quem tenta jogar para frente (não só lateral)?</li>
                              </ol>
                            </div>

                            <div className="rounded-lg p-4 bg-green-900/30 border border-green-600">
                              <p className="font-semibold text-green-300 mb-2">✅ DECISÃO RÁPIDA:</p>
                              <p className="text-sm text-green-200">
                                Pergunte: <strong>"Se o marcador apertar este jogador, ele resolve ou trava?"</strong><br/>
                                Se a resposta for "resolve" → Provavelmente é talento para próxima fase<br/>
                                Se a resposta for "trava" → Pode ser dominância física ou falta de oposição de qualidade
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sub-15 Decisão */}
                  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #475569' }}>
                    <button
                      onClick={() => setDecisaoCategoria(decisaoCategoria === 'sub15' ? null : 'sub15')}
                      className="w-full flex items-center justify-between p-4 transition-colors hover:opacity-80"
                      style={{ backgroundColor: '#1e293b' }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg text-white flex items-center justify-center font-bold text-lg" style={{ backgroundColor: '#f97316' }}>15</div>
                        <div className="text-left">
                          <p className="font-semibold text-white text-lg">Decisões no Sub-15</p>
                          <p className="text-sm text-white">"Quem repete com consistência?" - Foco em função e regularidade</p>
                        </div>
                      </div>
                      {decisaoCategoria === 'sub15' ? <ChevronDown className="w-6 h-6 text-white" /> : <ChevronRight className="w-6 h-6 text-white" />}
                    </button>
                    {decisaoCategoria === 'sub15' && (
                      <div className="p-5 space-y-5" style={{ backgroundColor: '#0f172a' }}>
                        {/* Contexto */}
                        <div className="bg-orange-900/40 rounded-lg p-4 border border-orange-700">
                          <h4 className="font-bold text-orange-300 mb-2">🎯 CONTEXTO DAS DECISÕES NESTA IDADE</h4>
                          <p className="text-sm text-orange-200">
                            Aqui a cobrança muda. As decisões são sobre: quem <strong>domina a função da posição</strong>,
                            quem <strong>repete com consistência</strong>, quem <strong>compete em todos os jogos</strong>.
                            Não basta fazer bonito uma vez - precisa fazer 8 de 10 vezes. "Lampejos" não bastam mais.
                          </p>
                        </div>

                        {/* Nota Sub-14 vs Sub-15 */}
                        <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-600">
                          <h4 className="font-bold text-blue-300 mb-2 flex items-center gap-2">
                            <span>📝</span> NOTA: Decisões Sub-14 vs Sub-15
                          </h4>
                          <div className="text-sm text-blue-200 space-y-2">
                            <p><strong>Sub-14:</strong> Aceite inconsistência (3-4 de 10 está OK). Valorize quem ENTENDE a função mesmo errando.</p>
                            <p><strong>Sub-15:</strong> Cobre consistência (7-8 de 10). Quem ainda não sabe a função está atrasado.</p>
                          </div>
                        </div>

                        {/* Cenários */}
                        <div>
                          <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                            <span className="text-xl">🤔</span> CENÁRIOS COMUNS DE DECISÃO
                          </h4>
                          <div className="space-y-4">
                            <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-medium text-slate-100 mb-2">"A" faz jogadas incríveis mas só em 2 de 10 jogos, "B" faz jogadas boas em 8 de 10 jogos</p>
                              <div className="bg-green-900/30 rounded p-3 border border-green-700">
                                <p className="text-sm text-green-300">
                                  <strong>Resposta:</strong> "B" é mais valioso. No profissional você joga 60+ jogos por ano.
                                  "A" vai brilhar em 12 e desaparecer em 48. "B" vai contribuir em 48.
                                  Qual treinador prefere? Consistência ganha de brilho ocasional.
                                </p>
                              </div>
                            </div>

                            <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-medium text-slate-100 mb-2">"A" é completo mas não tem um diferencial claro, "B" tem um ponto forte excepcional mas é limitado no resto</p>
                              <div className="bg-green-900/30 rounded p-3 border border-green-700">
                                <p className="text-sm text-green-300">
                                  <strong>Resposta:</strong> Depende da posição. Atacante pode ser especialista (se finaliza muito bem, serve).
                                  Meia precisa ser mais completo. Lateral pode ser especialista ofensivo ou defensivo.
                                  Pergunte: "O diferencial de 'B' é ÚTIL para a posição?"
                                </p>
                              </div>
                            </div>

                            <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-medium text-slate-100 mb-2">"A" joga muito bem no Sub-15 mas não aguenta 90 min, "B" joga bem e aguenta o jogo todo</p>
                              <div className="bg-green-900/30 rounded p-3 border border-green-700">
                                <p className="text-sm text-green-300">
                                  <strong>Resposta:</strong> "B" está mais preparado. Futebol é 90 minutos + acréscimos + prorrogação.
                                  Se "A" cai aos 60 min, é meia jogador. A pergunta é: "A" cai por falta de preparo
                                  (corrigível) ou por limitação estrutural (preocupante)?
                                </p>
                              </div>
                            </div>

                            <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-medium text-slate-100 mb-2">"A" domina a função mas não lidera, "B" ainda aprende a função mas já lidera o grupo</p>
                              <div className="bg-amber-900/30 rounded p-3 border border-amber-700">
                                <p className="text-sm text-amber-300">
                                  <strong>Resposta:</strong> Ambos têm valor. "A" é mais seguro tecnicamente. "B" pode evoluir mais
                                  se a liderança for genuína. Para posições que exigem comunicação (zagueiro, volante, goleiro),
                                  "B" pode ter vantagem. Para posições individuais (ponta, atacante), "A" pode bastar.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Erros */}
                        <div className="bg-red-900/30 rounded-lg p-4 border border-red-700">
                          <h4 className="font-bold text-red-300 mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" /> ERROS FATAIS DE DECISÃO NO SUB-15
                          </h4>
                          <ul className="text-sm text-red-200 space-y-2">
                            <li>• <strong>Escolher pelo "lampejo"</strong> - Consistência é mais importante que brilho</li>
                            <li>• <strong>Aceitar quem não cumpre função</strong> - Função é obrigatório agora</li>
                            <li>• <strong>Ignorar o físico</strong> - Começa a ser relevante para algumas posições</li>
                            <li>• <strong>Não cobrar atitude</strong> - Competitividade é obrigatória</li>
                          </ul>
                        </div>

                        {/* Quando Estiver em Dúvida */}
                        <div className="bg-gradient-to-r from-orange-900/50 to-amber-900/50 rounded-xl p-5 border border-orange-600">
                          <h4 className="font-bold text-orange-300 mb-4 flex items-center gap-2 text-lg">
                            <CheckCircle2 className="w-6 h-6" /> QUANDO ESTIVER EM DÚVIDA NO SUB-15
                          </h4>
                          <div className="space-y-4">
                            <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-semibold text-orange-300 mb-2">📋 REQUISITOS MÍNIMOS (tem que ter pelo menos 4 de 6):</p>
                              <ul className="text-sm text-slate-200 space-y-1">
                                <li>☐ Domina a FUNÇÃO da posição (sabe o que fazer em cada situação)</li>
                                <li>☐ Entrega performance CONSISTENTE (7-8 de 10 jogos)</li>
                                <li>☐ Aguenta 90 minutos sem queda significativa de rendimento</li>
                                <li>☐ Compete de verdade - não desliga em jogos difíceis</li>
                                <li>☐ Tem pelo menos UM diferencial claro para a posição</li>
                                <li>☐ Demonstra capacidade de liderar ou seguir líderes</li>
                              </ul>
                            </div>

                            <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-semibold text-amber-300 mb-2">⚖️ CRITÉRIOS DE DESEMPATE:</p>
                              <ol className="text-sm text-slate-200 space-y-1 list-decimal list-inside">
                                <li><strong>Consistência</strong> - Quem entrega performance boa com mais frequência?</li>
                                <li><strong>Domínio da função</strong> - Quem sabe melhor o que a posição exige?</li>
                                <li><strong>Diferencial útil</strong> - O ponto forte é relevante para a posição?</li>
                                <li><strong>Capacidade física</strong> - Quem aguenta o jogo todo sem cair?</li>
                              </ol>
                            </div>

                            <div className="rounded-lg p-4 bg-green-900/30 border border-green-600">
                              <p className="font-semibold text-green-300 mb-2">✅ DECISÃO RÁPIDA:</p>
                              <p className="text-sm text-green-200">
                                Pergunte: <strong>"Este jogador cumpre a função da posição em 8 de cada 10 jogos?"</strong><br/>
                                Se a resposta for "sim" → Está no caminho certo para a próxima fase<br/>
                                Se a resposta for "não" → Ainda precisa evoluir antes de avançar
                              </p>
                            </div>

                            <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-semibold text-slate-200 mb-2">📊 CHECKLIST POR POSIÇÃO:</p>
                              <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                                <div><strong className="text-orange-300">Goleiro:</strong> Posicionamento + Saídas + Comunicação</div>
                                <div><strong className="text-orange-300">Zagueiro:</strong> Antecipação + Duelos + Saída de bola</div>
                                <div><strong className="text-orange-300">Lateral:</strong> Apoio + Cruzamento OU Marcação</div>
                                <div><strong className="text-orange-300">Volante:</strong> Cobertura + Distribuição + Liderança</div>
                                <div><strong className="text-orange-300">Meia:</strong> Visão + Último passe + Finalização</div>
                                <div><strong className="text-orange-300">Ponta:</strong> 1x1 + Finalização OU Assistência</div>
                                <div><strong className="text-orange-300">Centroavante:</strong> Finalização + Jogo aéreo + Presença</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sub-17 Decisão */}
                  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #475569' }}>
                    <button
                      onClick={() => setDecisaoCategoria(decisaoCategoria === 'sub17' ? null : 'sub17')}
                      className="w-full flex items-center justify-between p-4 transition-colors hover:opacity-80"
                      style={{ backgroundColor: '#1e293b' }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg text-white flex items-center justify-center font-bold text-lg" style={{ backgroundColor: '#ef4444' }}>17</div>
                        <div className="text-left">
                          <p className="font-semibold text-white text-lg">Decisões no Sub-17</p>
                          <p className="text-sm text-white">"Quem está pronto para subir?" - Foco em transferência para o profissional</p>
                        </div>
                      </div>
                      {decisaoCategoria === 'sub17' ? <ChevronDown className="w-6 h-6 text-white" /> : <ChevronRight className="w-6 h-6 text-white" />}
                    </button>
                    {decisaoCategoria === 'sub17' && (
                      <div className="p-5 space-y-5" style={{ backgroundColor: '#0f172a' }}>
                        {/* Contexto */}
                        <div className="bg-red-900/40 rounded-lg p-4 border border-red-700">
                          <h4 className="font-bold text-red-300 mb-2">🎯 CONTEXTO DAS DECISÕES NESTA IDADE</h4>
                          <p className="text-sm text-red-200">
                            Esta é a <strong>"vitrine final"</strong>. As decisões são sobre: quem <strong>pode subir AGORA</strong>,
                            quem <strong>precisa de mais tempo</strong>, quem <strong>não vai conseguir</strong>.
                            A pergunta é simples: "Se eu colocar no profissional amanhã, ele aguenta?"
                            Não há mais "vai melhorar" - o que ele É é o que vai.
                          </p>
                        </div>

                        {/* Nota Sub-16 vs Sub-17 */}
                        <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-600">
                          <h4 className="font-bold text-blue-300 mb-2 flex items-center gap-2">
                            <span>📝</span> NOTA: Decisões Sub-16 vs Sub-17
                          </h4>
                          <div className="text-sm text-blue-200 space-y-2">
                            <p><strong>Sub-16:</strong> Ainda pode ter oscilação. Valorize PICOS de performance como indicador de teto.</p>
                            <p><strong>Sub-17:</strong> Oscilação é inaceitável. Ele deve estar pronto ou muito próximo. Decisão é agora.</p>
                          </div>
                        </div>

                        {/* Cenários */}
                        <div>
                          <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                            <span className="text-xl">🤔</span> CENÁRIOS COMUNS DE DECISÃO
                          </h4>
                          <div className="space-y-4">
                            <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-medium text-slate-100 mb-2">"A" domina o Sub-17 mas desaparece quando joga com o Sub-20, "B" não é craque do Sub-17 mas se adapta bem ao Sub-20</p>
                              <div className="bg-green-900/30 rounded p-3 border border-green-700">
                                <p className="text-sm text-green-300">
                                  <strong>Resposta:</strong> "B" vai subir, "A" provavelmente não. O que "A" faz não TRANSFERE para cima.
                                  "B" já mostrou que funciona em nível superior. Não importa quem é "craque" da categoria -
                                  importa quem funciona no próximo nível.
                                </p>
                              </div>
                            </div>

                            <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-medium text-slate-100 mb-2">"A" tem mais talento puro mas problemas de comportamento, "B" tem menos talento mas é profissional exemplar</p>
                              <div className="bg-green-900/30 rounded p-3 border border-green-700">
                                <p className="text-sm text-green-300">
                                  <strong>Resposta:</strong> Depende do nível de talento de "A" e do tipo de problema. Se "A" é excepcional
                                  e os problemas são corrigíveis (atrasos, disciplina), pode valer o risco. Se "A" é apenas
                                  "bom" e os problemas são sérios (atitude, ego), "B" é aposta mais segura. O profissional
                                  tem MUITA pressão extra-campo.
                                </p>
                              </div>
                            </div>

                            <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-medium text-slate-100 mb-2">"A" é físico ideal mas técnico mediano, "B" é técnico bom mas físico limitado</p>
                              <div className="bg-amber-900/30 rounded p-3 border border-amber-700">
                                <p className="text-sm text-amber-300">
                                  <strong>Resposta:</strong> No Sub-17, físico JÁ importa. Mas depende da posição. Meia criativo pode ser
                                  menor. Zagueiro precisa de presença física. Lateral moderno precisa de resistência.
                                  Pergunte: "O físico de 'B' IMPEDE ele de jogar a posição ou só limita algumas ações?"
                                </p>
                              </div>
                            </div>

                            <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-medium text-slate-100 mb-2">"A" é formado no clube há 10 anos, "B" chegou há 2 anos mas é melhor jogador</p>
                              <div className="bg-green-900/30 rounded p-3 border border-green-700">
                                <p className="text-sm text-green-300">
                                  <strong>Resposta:</strong> Se "B" é melhor jogador, "B" joga. Lealdade ao clube é admirável mas não
                                  pode definir decisão técnica. O futebol não perdoa escolhas emocionais. "A" pode ter outras
                                  oportunidades ou posições. A decisão é: quem dá mais chance de resultado?
                                </p>
                              </div>
                            </div>

                            <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-medium text-slate-100 mb-2">Empresário/família pressiona para jogador subir, mas ele não está pronto</p>
                              <div className="bg-red-900/30 rounded p-3 border border-red-700">
                                <p className="text-sm text-red-300">
                                  <strong>Resposta:</strong> NUNCA ceda a pressão externa. Subir antes da hora DESTRÓI carreiras.
                                  O jogador vai sofrer, perder confiança, e pode nunca se recuperar. Seja honesto:
                                  "Ele precisa de mais X meses/anos para ter chance real." Proteja o jogador da pressa dos outros.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Erros */}
                        <div className="bg-red-900/30 rounded-lg p-4 border border-red-700">
                          <h4 className="font-bold text-red-300 mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" /> ERROS FATAIS DE DECISÃO NO SUB-17
                          </h4>
                          <ul className="text-sm text-red-200 space-y-2">
                            <li>• <strong>Confundir "craque do Sub-17" com "pronto pro profissional"</strong></li>
                            <li>• <strong>Ceder à pressão de empresários/família</strong></li>
                            <li>• <strong>Ignorar comportamento extra-campo</strong></li>
                            <li>• <strong>Não testar com categorias superiores</strong></li>
                            <li>• <strong>Achar que "vai melhorar depois"</strong> - No Sub-17, o que ele é, é o que é</li>
                          </ul>
                        </div>

                        {/* Quando Estiver em Dúvida */}
                        <div className="bg-gradient-to-r from-red-900/50 to-rose-900/50 rounded-xl p-5 border border-red-600">
                          <h4 className="font-bold text-red-300 mb-4 flex items-center gap-2 text-lg">
                            <CheckCircle2 className="w-6 h-6" /> QUANDO ESTIVER EM DÚVIDA NO SUB-17
                          </h4>
                          <div className="space-y-4">
                            <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-semibold text-red-300 mb-2">📋 REQUISITOS MÍNIMOS PARA PROFISSIONAL (tem que ter TODOS):</p>
                              <ul className="text-sm text-slate-200 space-y-1">
                                <li>☐ Domina COMPLETAMENTE a função da posição</li>
                                <li>☐ Entrega performance de alto nível em 9 de 10 jogos</li>
                                <li>☐ Aguenta ritmo profissional (intensidade + 90 min)</li>
                                <li>☐ Tem diferencial CLARO que agrega ao elenco principal</li>
                                <li>☐ Comportamento profissional dentro e fora de campo</li>
                                <li>☐ Compete e performa em jogos grandes/decisivos</li>
                              </ul>
                            </div>

                            <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-semibold text-amber-300 mb-2">⚖️ CRITÉRIOS DE DESEMPATE:</p>
                              <ol className="text-sm text-slate-200 space-y-1 list-decimal list-inside">
                                <li><strong>Diferencial único</strong> - Ele faz algo que ninguém no elenco principal faz?</li>
                                <li><strong>Mentalidade vencedora</strong> - Performa melhor em jogos grandes?</li>
                                <li><strong>Profissionalismo</strong> - Se comporta como profissional?</li>
                                <li><strong>Potencial de revenda</strong> - Tem perfil de mercado internacional?</li>
                              </ol>
                            </div>

                            <div className="rounded-lg p-4 bg-green-900/30 border border-green-600">
                              <p className="font-semibold text-green-300 mb-2">✅ DECISÃO RÁPIDA:</p>
                              <p className="text-sm text-green-200">
                                Pergunte: <strong>"Se eu colocar este jogador em 5 jogos do profissional, ele não vai passar vergonha?"</strong><br/>
                                Se a resposta for "não vai" → Está pronto para transição<br/>
                                Se a resposta for "vai" → Precisa de mais desenvolvimento na base
                              </p>
                            </div>

                            <div className="rounded-lg p-4 bg-purple-900/30 border border-purple-600">
                              <p className="font-semibold text-purple-300 mb-2">🔮 TESTE DO PROFISSIONAL:</p>
                              <p className="text-sm text-purple-200 mb-2">
                                Coloque o jogador para treinar/jogar com o profissional e observe:
                              </p>
                              <ul className="text-xs text-purple-200 space-y-1">
                                <li>• <strong>Ritmo:</strong> Consegue acompanhar a intensidade?</li>
                                <li>• <strong>Físico:</strong> Aguenta os duelos com jogadores adultos?</li>
                                <li>• <strong>Técnica:</strong> Mantém o nível sob pressão maior?</li>
                                <li>• <strong>Mentalidade:</strong> Encolhe ou cresce no desafio?</li>
                              </ul>
                              <p className="text-xs text-purple-300 mt-2">
                                <strong>Se ele se destacar no treino do profissional → É talento real. Se sumir → Era só rei da base.</strong>
                              </p>
                            </div>

                            <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                              <p className="font-semibold text-slate-200 mb-2">📊 CHECKLIST FINAL POR POSIÇÃO:</p>
                              <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                                <div><strong className="text-red-300">Goleiro:</strong> Liderança + Jogo com pés + Saídas + Defesas decisivas</div>
                                <div><strong className="text-red-300">Zagueiro:</strong> Liderança + Duelos aéreos + Antecipação + Saída jogando</div>
                                <div><strong className="text-red-300">Lateral:</strong> Motor + 1x1 + Cruzamento/passe + Posicionamento</div>
                                <div><strong className="text-red-300">Volante:</strong> Visão + Cobertura + Distribuição + Presença física</div>
                                <div><strong className="text-red-300">Meia:</strong> Criatividade + Finalização + Último passe + Inteligência</div>
                                <div><strong className="text-red-300">Ponta:</strong> 1x1 + Velocidade + Finalização + Assistência</div>
                                <div><strong className="text-red-300">Centroavante:</strong> Finalização + Movimentação + Presença + Jogo aéreo</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Checklist Final Universal */}
              <div>
                <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  CHECKLIST FINAL - ANTES DE QUALQUER DECISÃO
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <h4 className="font-semibold text-green-400 mb-3">✓ PERGUNTAS OBRIGATÓRIAS</h4>
                    <ul className="text-sm text-slate-300 space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Vi esse atleta em situações DIFERENTES (jogo fácil e difícil)?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Estou usando a RÉGUA CERTA para a idade dele?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Estou vendo POTENCIAL ou só performance atual?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>O contexto (time, treinador, modelo) favorece ou prejudica ele?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Ele APRENDE quando eu corrijo?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>O que ele faz TRANSFERE para o próximo nível?</span>
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-xl p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    <h4 className="font-semibold text-red-400 mb-3">✗ SINAIS DE ALERTA UNIVERSAIS</h4>
                    <ul className="text-sm text-slate-300 space-y-2">
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>Só rende quando o time é muito superior</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>Não aceita correção ou feedback</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>Depende 100% do físico para se destacar</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>Some quando o jogo aperta ou está perdendo</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>Ego desproporcional ao nível que entrega</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>Problemas de comportamento recorrentes</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Frase final */}
              <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-xl p-6 border border-amber-700">
                <p className="text-lg text-amber-300 text-center">
                  <strong>"Na dúvida entre dois, escolha o que aprende mais rápido.<br/>
                  O futebol muda constantemente, e quem aprende se adapta."</strong>
                </p>
                <p className="text-sm text-amber-400 text-center mt-3">
                  E lembre-se: uma decisão errada não é o fim do mundo. O importante é APRENDER com ela e melhorar a próxima.
                </p>
              </div>
            </div>
          )}

          {/* Tab Guia de Campo */}
          {activeTab === 'campo' && (
            <div className="space-y-6">
              {/* Introdução */}
              <div className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 rounded-xl p-6 border border-emerald-600">
                <h2 className="text-2xl font-bold text-emerald-300 mb-3 flex items-center gap-2">
                  <Eye className="w-7 h-7" /> Guia Prático de Observação em Campo
                </h2>
                <p className="text-emerald-200">
                  Este é o seu guia para quando estiver <strong>no treino</strong> ou <strong>assistindo um jogo</strong>.
                  Checklists práticos para usar na hora, com foco em observação objetiva e tomada de decisão.
                </p>
              </div>

              {/* SEÇÃO 1: Antes de Ir */}
              <div className="rounded-xl p-6" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-blue-500" />
                  ANTES DE IR - PREPARAÇÃO
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-lg p-4" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                    <h4 className="font-semibold text-blue-300 mb-3">📋 Informações para coletar ANTES:</h4>
                    <ul className="text-sm text-slate-200 space-y-2">
                      <li>☐ Nome completo e data de nascimento do atleta</li>
                      <li>☐ Categoria (Sub-7, 9, 11, 13, 15, 17)</li>
                      <li>☐ Posição que joga / quer jogar</li>
                      <li>☐ Histórico: clubes anteriores, seleção, destaques</li>
                      <li>☐ Contexto: é jogo oficial, treino, peneira?</li>
                      <li>☐ Nível da competição / oposição</li>
                    </ul>
                  </div>
                  <div className="rounded-lg p-4" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                    <h4 className="font-semibold text-blue-300 mb-3">🎒 O que levar:</h4>
                    <ul className="text-sm text-slate-200 space-y-2">
                      <li>☐ Celular carregado (filmagem + anotações)</li>
                      <li>☐ Caderno/bloco de notas de backup</li>
                      <li>☐ Lista de atletas a observar (se houver)</li>
                      <li>☐ Este guia de referência</li>
                      <li>☐ Número da camisa do atleta confirmado</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* SEÇÃO 2: Observação em TREINO */}
              <div className="rounded-xl p-6" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6 text-green-500" />
                  OBSERVAÇÃO EM TREINO
                </h3>

                <div className="bg-green-900/30 rounded-lg p-4 border border-green-700 mb-4">
                  <p className="text-sm text-green-200">
                    <strong>Vantagem do treino:</strong> Você vê o atleta em <strong>situações controladas</strong>, pode observar
                    <strong> comportamento fora do jogo</strong>, e ver como ele <strong>reage a instruções</strong>.
                    Desvantagem: não vê competitividade real.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg p-4" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                    <h4 className="font-semibold text-green-300 mb-3">⏱️ PRIMEIROS 10 MINUTOS - Impressão Geral</h4>
                    <ul className="text-sm text-slate-200 space-y-2">
                      <li>☐ <strong>Chegou no horário?</strong> Pontualidade = profissionalismo</li>
                      <li>☐ <strong>Como se aquece?</strong> Com intensidade ou "corpo mole"?</li>
                      <li>☐ <strong>Interage com colegas?</strong> Líder, seguidor, isolado?</li>
                      <li>☐ <strong>Presta atenção nas instruções?</strong> Olha pro treinador?</li>
                      <li>☐ <strong>Linguagem corporal?</strong> Animado, entediado, focado?</li>
                    </ul>
                  </div>

                  <div className="rounded-lg p-4" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                    <h4 className="font-semibold text-green-300 mb-3">⚽ DURANTE O TREINO - O Que Observar</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-200">
                      <div>
                        <p className="font-medium text-slate-100 mb-2">Técnica:</p>
                        <ul className="space-y-1">
                          <li>☐ Domínio de bola (primeiro toque)</li>
                          <li>☐ Qualidade do passe (curto/longo)</li>
                          <li>☐ Condução (cabeça levantada?)</li>
                          <li>☐ Finalização (técnica, não força)</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-slate-100 mb-2">Comportamento:</p>
                        <ul className="space-y-1">
                          <li>☐ Intensidade mantida ou cai?</li>
                          <li>☐ Aceita correção do treinador?</li>
                          <li>☐ Erra e reage como? (desiste/tenta de novo)</li>
                          <li>☐ Compete nos exercícios?</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg p-4" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                    <h4 className="font-semibold text-green-300 mb-3">🎮 NO RACHÃO/COLETIVO - Hora da Verdade</h4>
                    <ul className="text-sm text-slate-200 space-y-2">
                      <li>☐ <strong>Pede a bola?</strong> Quer participar ou se esconde?</li>
                      <li>☐ <strong>Toma decisões rápidas?</strong> Ou segura demais?</li>
                      <li>☐ <strong>Joga sem a bola?</strong> Se movimenta, cria espaço?</li>
                      <li>☐ <strong>Reage a erros dos outros?</strong> Reclama, incentiva, ignora?</li>
                      <li>☐ <strong>Muda quando está perdendo?</strong> Aumenta intensidade ou desliga?</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* SEÇÃO 3: Observação em JOGO */}
              <div className="rounded-xl p-6" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                  <Video className="w-6 h-6 text-amber-500" />
                  OBSERVAÇÃO EM JOGO/COMPETIÇÃO
                </h3>

                <div className="bg-amber-900/30 rounded-lg p-4 border border-amber-700 mb-4">
                  <p className="text-sm text-amber-200">
                    <strong>Vantagem do jogo:</strong> Você vê o atleta sob <strong>pressão real</strong>, com <strong>oposição de verdade</strong>,
                    em <strong>situações imprevisíveis</strong>. É aqui que separa quem JOGA de quem só TREINA bem.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg p-4" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                    <h4 className="font-semibold text-amber-300 mb-3">📍 POSICIONAMENTO - Onde Ficar</h4>
                    <ul className="text-sm text-slate-200 space-y-2">
                      <li>• <strong>Atrás do gol:</strong> Melhor para avaliar zagueiros, goleiros, movimentação de atacantes</li>
                      <li>• <strong>Linha do meio:</strong> Visão geral, bom para meias e volantes</li>
                      <li>• <strong>Lateral:</strong> Bom para avaliar laterais e pontas</li>
                      <li>• <strong>Dica:</strong> Troque de posição no intervalo para ver de outro ângulo</li>
                    </ul>
                  </div>

                  <div className="rounded-lg p-4" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                    <h4 className="font-semibold text-amber-300 mb-3">⏱️ PRIMEIROS 15 MINUTOS - Leitura Inicial</h4>
                    <ul className="text-sm text-slate-200 space-y-2">
                      <li>☐ <strong>Como entra em campo?</strong> Focado, nervoso, confiante?</li>
                      <li>☐ <strong>Primeiros toques na bola?</strong> Seguro ou nervoso?</li>
                      <li>☐ <strong>Posicionamento sem bola?</strong> Sabe onde ficar?</li>
                      <li>☐ <strong>Comunicação?</strong> Fala com os colegas, orienta?</li>
                      <li>☐ <strong>Nível da oposição?</strong> Está sendo testado de verdade?</li>
                    </ul>
                  </div>

                  <div className="rounded-lg p-4" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                    <h4 className="font-semibold text-amber-300 mb-3">⚽ DURANTE O JOGO - Checklist por Momento</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-200">
                      <div>
                        <p className="font-medium text-amber-200 mb-2">COM A BOLA:</p>
                        <ul className="space-y-1">
                          <li>☐ Primeiro toque (limpo ou sujo?)</li>
                          <li>☐ Olha antes de receber?</li>
                          <li>☐ Decisão (rápida/lenta, certa/errada)</li>
                          <li>☐ Execução sob pressão</li>
                          <li>☐ Tenta dificultar ou joga fácil?</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-amber-200 mb-2">SEM A BOLA:</p>
                        <ul className="space-y-1">
                          <li>☐ Movimentação (cria espaço?)</li>
                          <li>☐ Posicionamento (sabe onde ficar?)</li>
                          <li>☐ Marcação (intensidade, inteligência)</li>
                          <li>☐ Transição (reage rápido?)</li>
                          <li>☐ Leitura de jogo (antecipa?)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg p-4" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                    <h4 className="font-semibold text-amber-300 mb-3">🔥 MOMENTOS CRÍTICOS - Preste MUITA Atenção</h4>
                    <ul className="text-sm text-slate-200 space-y-2">
                      <li>☐ <strong>Quando toma gol:</strong> Desliga ou reage? Culpa outros ou assume?</li>
                      <li>☐ <strong>Quando faz gol:</strong> Comemora sozinho ou com o time?</li>
                      <li>☐ <strong>Quando erra:</strong> Abaixa a cabeça ou tenta consertar?</li>
                      <li>☐ <strong>Quando está ganhando fácil:</strong> Mantém intensidade ou relaxa?</li>
                      <li>☐ <strong>Quando está perdendo:</strong> Aumenta ou desiste?</li>
                      <li>☐ <strong>Final do jogo (últimos 10 min):</strong> Mantém nível ou cai fisicamente?</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* SEÇÃO 4: Ficha Rápida de Avaliação */}
              <div className="rounded-xl p-6" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-purple-500" />
                  FICHA RÁPIDA DE AVALIAÇÃO
                </h3>
                <p className="text-sm text-slate-400 mb-4">
                  Use esta ficha para anotar rapidamente suas observações durante ou logo após a observação.
                </p>

                <div className="rounded-lg p-5" style={{ backgroundColor: '#0f172a', border: '2px dashed #6366f1' }}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-purple-300 mb-1">DADOS BÁSICOS:</p>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>Atleta: _______________________</li>
                          <li>Categoria: _______ Posição: _______</li>
                          <li>Data: _______ Local: ____________</li>
                          <li>Tipo: [ ] Treino [ ] Jogo [ ] Peneira</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-purple-300 mb-1">NOTAS RÁPIDAS (1 a 5):</p>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>Técnica: ___</li>
                          <li>Inteligência/Decisão: ___</li>
                          <li>Físico/Motor: ___</li>
                          <li>Atitude/Mentalidade: ___</li>
                          <li>Potencial: ___</li>
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-purple-300 mb-1">PONTOS FORTES (3 principais):</p>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>1. _________________________</li>
                          <li>2. _________________________</li>
                          <li>3. _________________________</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-purple-300 mb-1">PONTOS A DESENVOLVER:</p>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>1. _________________________</li>
                          <li>2. _________________________</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-purple-300 mb-1">DECISÃO INICIAL:</p>
                        <p className="text-sm text-slate-300">
                          [ ] Sim, indicar &nbsp; [ ] Talvez, ver de novo &nbsp; [ ] Não indicar
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4" style={{ borderTop: '1px solid #475569' }}>
                    <p className="text-sm font-semibold text-purple-300 mb-1">OBSERVAÇÃO PRINCIPAL (1 frase):</p>
                    <p className="text-sm text-slate-300">_________________________________________________________________</p>
                  </div>
                </div>
              </div>

              {/* SEÇÃO 5: Checklist por Categoria - Resumo de Campo */}
              <div className="rounded-xl p-6" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                  <ClipboardList className="w-6 h-6 text-cyan-500" />
                  CHECKLIST DE CAMPO POR CATEGORIA
                </h3>
                <p className="text-sm text-slate-400 mb-4">
                  O que você PRECISA ver em cada categoria. Se não conseguir avaliar estes itens, a observação está incompleta.
                </p>

                <div className="space-y-4">
                  {/* Sub-7/9 Campo */}
                  <div className="rounded-lg p-4 border-l-4 border-cyan-500" style={{ backgroundColor: '#0f172a' }}>
                    <h4 className="font-bold text-cyan-300 mb-2">SUB-7/9 - O que PRECISO ver:</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-200">
                      <ul className="space-y-1">
                        <li>☐ Coordenação motora básica (corre bem, equilibra)</li>
                        <li>☐ Relação com a bola (gosta, brinca, explora)</li>
                        <li>☐ Entende o jogo? (vai pro gol, sabe o objetivo)</li>
                      </ul>
                      <ul className="space-y-1">
                        <li>☐ Quer jogar? (pede bola, se envolve)</li>
                        <li>☐ Reage a frustração (choro vs resiliência)</li>
                        <li>☐ Se diverte jogando?</li>
                      </ul>
                    </div>
                    <p className="text-xs text-cyan-400 mt-2"><strong>Pergunta-chave:</strong> "Ele gosta de jogar e entende o que está fazendo?"</p>
                  </div>

                  {/* Sub-11 Campo */}
                  <div className="rounded-lg p-4 border-l-4 border-green-500" style={{ backgroundColor: '#0f172a' }}>
                    <h4 className="font-bold text-green-300 mb-2">SUB-11 - O que PRECISO ver:</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-200">
                      <ul className="space-y-1">
                        <li>☐ Domínio técnico sob pressão leve</li>
                        <li>☐ Olha antes de receber (percepção)</li>
                        <li>☐ Toma decisões (certas ou erradas, mas decide)</li>
                      </ul>
                      <ul className="space-y-1">
                        <li>☐ Velocidade de raciocínio</li>
                        <li>☐ Criatividade (tenta coisas diferentes)</li>
                        <li>☐ Competitividade saudável</li>
                      </ul>
                    </div>
                    <p className="text-xs text-green-400 mt-2"><strong>Pergunta-chave:</strong> "Ele pensa rápido e tenta resolver os problemas do jogo?"</p>
                  </div>

                  {/* Sub-13 Campo */}
                  <div className="rounded-lg p-4 border-l-4 border-yellow-500" style={{ backgroundColor: '#0f172a' }}>
                    <h4 className="font-bold text-yellow-300 mb-2">SUB-13 - O que PRECISO ver:</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-200">
                      <ul className="space-y-1">
                        <li>☐ Técnica mantida sob marcação forte</li>
                        <li>☐ Jogo SEM a bola (movimentação inteligente)</li>
                        <li>☐ Entende função tática básica da posição</li>
                      </ul>
                      <ul className="space-y-1">
                        <li>☐ Compete de verdade (não desiste)</li>
                        <li>☐ Decisões acertadas (6-7 de 10)</li>
                        <li>☐ Resolve sob pressão (não trava)</li>
                      </ul>
                    </div>
                    <p className="text-xs text-yellow-400 mt-2"><strong>Pergunta-chave:</strong> "Quando apertam, ele resolve ou some?"</p>
                  </div>

                  {/* Sub-15 Campo */}
                  <div className="rounded-lg p-4 border-l-4 border-orange-500" style={{ backgroundColor: '#0f172a' }}>
                    <h4 className="font-bold text-orange-300 mb-2">SUB-15 - O que PRECISO ver:</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-200">
                      <ul className="space-y-1">
                        <li>☐ Domina a função da posição</li>
                        <li>☐ Consistência (bom em 8 de 10 jogos)</li>
                        <li>☐ Diferencial claro (o que ele faz de especial?)</li>
                      </ul>
                      <ul className="space-y-1">
                        <li>☐ Aguenta 90 minutos sem cair</li>
                        <li>☐ Compete em jogos difíceis</li>
                        <li>☐ Demonstra liderança ou segue bem</li>
                      </ul>
                    </div>
                    <p className="text-xs text-orange-400 mt-2"><strong>Pergunta-chave:</strong> "Ele entrega consistência e tem um diferencial?"</p>
                  </div>

                  {/* Sub-17 Campo */}
                  <div className="rounded-lg p-4 border-l-4 border-red-500" style={{ backgroundColor: '#0f172a' }}>
                    <h4 className="font-bold text-red-300 mb-2">SUB-17 - O que PRECISO ver:</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-200">
                      <ul className="space-y-1">
                        <li>☐ Nível profissional na função</li>
                        <li>☐ Entrega alta em 9 de 10 jogos</li>
                        <li>☐ Diferencial que agrega ao profissional</li>
                      </ul>
                      <ul className="space-y-1">
                        <li>☐ Ritmo e intensidade profissional</li>
                        <li>☐ Comportamento profissional (dentro e fora)</li>
                        <li>☐ Performa em jogos grandes</li>
                      </ul>
                    </div>
                    <p className="text-xs text-red-400 mt-2"><strong>Pergunta-chave:</strong> "Se jogar 5 jogos no profissional, passa vergonha ou se sustenta?"</p>
                  </div>
                </div>
              </div>

              {/* SEÇÃO 6: Bandeiras Verdes e Vermelhas */}
              <div className="rounded-xl p-6" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                  BANDEIRAS VERDES E VERMELHAS
                </h3>
                <p className="text-sm text-slate-400 mb-4">
                  Sinais que você deve notar IMEDIATAMENTE durante a observação.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Bandeiras Verdes */}
                  <div className="rounded-lg p-5 bg-green-900/30 border border-green-600">
                    <h4 className="font-bold text-green-300 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" /> BANDEIRAS VERDES (Bons Sinais)
                    </h4>
                    <ul className="text-sm text-green-200 space-y-2">
                      <li>✓ <strong>Pede a bola em momentos difíceis</strong> - Quer responsabilidade</li>
                      <li>✓ <strong>Olha antes de receber</strong> - Percepção acima da média</li>
                      <li>✓ <strong>Erra e tenta de novo</strong> - Mentalidade forte</li>
                      <li>✓ <strong>Melhora quando o jogo aperta</strong> - Competidor nato</li>
                      <li>✓ <strong>Joga bem COM e SEM bola</strong> - Inteligência tática</li>
                      <li>✓ <strong>Comunica com os colegas</strong> - Potencial de liderança</li>
                      <li>✓ <strong>Intensidade constante</strong> - Físico e mental preparado</li>
                      <li>✓ <strong>Resolve de formas diferentes</strong> - Repertório técnico</li>
                      <li>✓ <strong>Aceita correção do treinador</strong> - Treinável</li>
                      <li>✓ <strong>Primeiro a chegar, último a sair</strong> - Dedicação</li>
                    </ul>
                  </div>

                  {/* Bandeiras Vermelhas */}
                  <div className="rounded-lg p-5 bg-red-900/30 border border-red-600">
                    <h4 className="font-bold text-red-300 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" /> BANDEIRAS VERMELHAS (Atenção)
                    </h4>
                    <ul className="text-sm text-red-200 space-y-2">
                      <li>✗ <strong>Se esconde quando o jogo aperta</strong> - Falta coragem</li>
                      <li>✗ <strong>Só joga bem sem marcação</strong> - Não testado de verdade</li>
                      <li>✗ <strong>Erra e desiste</strong> - Mentalidade frágil</li>
                      <li>✗ <strong>Reclama de tudo e todos</strong> - Problema de atitude</li>
                      <li>✗ <strong>Só existe com a bola</strong> - Some sem ela</li>
                      <li>✗ <strong>Depende 100% do físico</strong> - Vantagem temporária</li>
                      <li>✗ <strong>Não aceita correção</strong> - Difícil de treinar</li>
                      <li>✗ <strong>Intensidade cai rápido</strong> - Problema físico ou mental</li>
                      <li>✗ <strong>Joga para si, não para o time</strong> - Individualista</li>
                      <li>✗ <strong>Trava sob pressão</strong> - Não vai evoluir</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 bg-amber-900/30 rounded-lg p-4 border border-amber-600">
                  <p className="text-sm text-amber-200">
                    <strong>⚠️ IMPORTANTE:</strong> Uma bandeira vermelha isolada não elimina o atleta.
                    Observe o PADRÃO. Se 3+ bandeiras vermelhas aparecem consistentemente, é um sinal sério.
                    Da mesma forma, 3+ bandeiras verdes são um forte indicador de talento.
                  </p>
                </div>
              </div>

              {/* SEÇÃO 7: Perguntas para fazer a si mesmo */}
              <div className="rounded-xl p-6" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-yellow-500" />
                  PERGUNTAS PARA FAZER A SI MESMO
                </h3>
                <p className="text-sm text-slate-400 mb-4">
                  Antes de finalizar sua avaliação, responda estas perguntas honestamente.
                </p>

                <div className="space-y-4">
                  <div className="rounded-lg p-4" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                    <h4 className="font-semibold text-yellow-300 mb-3">🔍 SOBRE A OBSERVAÇÃO:</h4>
                    <ul className="text-sm text-slate-200 space-y-2">
                      <li>• Vi tempo suficiente? (mínimo 30 min treino, 1 tempo de jogo)</li>
                      <li>• Vi em situação real? (oposição de qualidade, pressão verdadeira)</li>
                      <li>• Consegui avaliar COM e SEM a bola?</li>
                      <li>• Vi momentos de adversidade? (erro, gol contra, dificuldade)</li>
                      <li>• Preciso ver de novo antes de decidir?</li>
                    </ul>
                  </div>

                  <div className="rounded-lg p-4" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                    <h4 className="font-semibold text-yellow-300 mb-3">🎯 SOBRE O ATLETA:</h4>
                    <ul className="text-sm text-slate-200 space-y-2">
                      <li>• Ele se destaca entre os colegas? Em quê especificamente?</li>
                      <li>• O que ele faz que os outros não fazem?</li>
                      <li>• Consegui identificar o DIFERENCIAL dele?</li>
                      <li>• Os pontos fracos são CORRIGÍVEIS ou ESTRUTURAIS?</li>
                      <li>• Estou avaliando o POTENCIAL ou só o momento atual?</li>
                    </ul>
                  </div>

                  <div className="rounded-lg p-4" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                    <h4 className="font-semibold text-yellow-300 mb-3">⚖️ SOBRE MINHA DECISÃO:</h4>
                    <ul className="text-sm text-slate-200 space-y-2">
                      <li>• Estou sendo influenciado por algo externo? (aparência, biótipo, indicação)</li>
                      <li>• Estou comparando com a categoria certa?</li>
                      <li>• Estou avaliando pelo que VI ou pelo que me disseram?</li>
                      <li>• Se eu estiver errado, qual o impacto da decisão?</li>
                      <li>• Tenho informação suficiente para decidir AGORA?</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* SEÇÃO 8: Decisão Final em Campo */}
              <div className="rounded-xl p-6 bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-600">
                <h3 className="text-xl font-bold text-emerald-300 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6" />
                  DECISÃO FINAL EM CAMPO
                </h3>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="rounded-lg p-4 bg-green-900/40 border border-green-600 text-center">
                    <p className="font-bold text-green-300 text-lg mb-2">✅ SIM, INDICAR</p>
                    <ul className="text-xs text-green-200 text-left space-y-1">
                      <li>• Vi pelo menos 3 bandeiras verdes</li>
                      <li>• O diferencial é claro</li>
                      <li>• Cumpre requisitos mínimos da categoria</li>
                      <li>• Pontos fracos são corrigíveis</li>
                      <li>• Me surpreendeu positivamente</li>
                    </ul>
                  </div>

                  <div className="rounded-lg p-4 bg-amber-900/40 border border-amber-600 text-center">
                    <p className="font-bold text-amber-300 text-lg mb-2">🔄 VER DE NOVO</p>
                    <ul className="text-xs text-amber-200 text-left space-y-1">
                      <li>• Não vi tempo suficiente</li>
                      <li>• Oposição era muito fraca</li>
                      <li>• Resultado misto (bandeiras verdes e vermelhas)</li>
                      <li>• Preciso ver em outro contexto</li>
                      <li>• Quero confirmar impressão inicial</li>
                    </ul>
                  </div>

                  <div className="rounded-lg p-4 bg-red-900/40 border border-red-600 text-center">
                    <p className="font-bold text-red-300 text-lg mb-2">❌ NÃO INDICAR</p>
                    <ul className="text-xs text-red-200 text-left space-y-1">
                      <li>• Vi 3+ bandeiras vermelhas consistentes</li>
                      <li>• Não cumpre requisitos mínimos</li>
                      <li>• Pontos fracos são estruturais</li>
                      <li>• Não se destaca em nada</li>
                      <li>• Nível abaixo da categoria</li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-lg p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                  <p className="text-sm text-emerald-200">
                    <strong>💡 DICA FINAL:</strong> Se após observar você ainda está em dúvida, pergunte-se:
                    <strong> "Se eu NÃO indicar este atleta e ele brilhar em outro lugar, vou me arrepender?"</strong>
                    Se a resposta for "sim", vale ver de novo. Se for "não", provavelmente não é o atleta certo.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
