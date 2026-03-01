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
]

export default function GuiaAvaliacaoPage() {
  const [activeTab, setActiveTab] = useState('carreira')
  const [categoriaAberta, setCategoriaAberta] = useState<string | null>('sub7')

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
      <div className="bg-slate-800 rounded-2xl shadow-sm border border-slate-700 mb-6">
        <div className="border-b border-slate-700">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-amber-500 border-b-2 border-amber-500 bg-amber-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
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
                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                    <h4 className="font-semibold text-green-400 mb-3">✓ Habilidades Técnicas</h4>
                    <ul className="text-sm text-slate-300 space-y-2">
                      <li>• Domínio de softwares de análise (Wyscout, Hudl, LongoMatch)</li>
                      <li>• Edição de vídeo (cortes, clipes, compilações)</li>
                      <li>• Conhecimento de estatística básica e visualização de dados</li>
                      <li>• Excel/Google Sheets avançado</li>
                      <li>• Apresentações claras e objetivas</li>
                    </ul>
                  </div>
                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                    <h4 className="font-semibold text-blue-400 mb-3">✓ Conhecimento de Jogo</h4>
                    <ul className="text-sm text-slate-300 space-y-2">
                      <li>• Compreensão tática profunda (sistemas, princípios)</li>
                      <li>• Leitura de padrões ofensivos e defensivos</li>
                      <li>• Entendimento de transições e bolas paradas</li>
                      <li>• Conhecimento das diferentes posições</li>
                      <li>• Visão crítica para identificar pontos fortes/fracos</li>
                    </ul>
                  </div>
                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                    <h4 className="font-semibold text-purple-400 mb-3">✓ Soft Skills</h4>
                    <ul className="text-sm text-slate-300 space-y-2">
                      <li>• Comunicação clara com comissão técnica</li>
                      <li>• Capacidade de síntese (menos é mais)</li>
                      <li>• Trabalho sob pressão e prazos</li>
                      <li>• Discrição e confidencialidade</li>
                      <li>• Proatividade e iniciativa</li>
                    </ul>
                  </div>
                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
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
                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center font-bold">1</div>
                      <h4 className="font-semibold text-slate-100">Comece Localmente</h4>
                    </div>
                    <p className="text-sm text-slate-400 ml-11">
                      Ofereça trabalho voluntário para times amadores, escolinhas ou categorias de base.
                      A experiência real é mais valiosa que qualquer curso.
                    </p>
                  </div>
                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center font-bold">2</div>
                      <h4 className="font-semibold text-slate-100">Documente Tudo</h4>
                    </div>
                    <p className="text-sm text-slate-400 ml-11">
                      Crie relatórios em PDF de jogos que você assistir. Análises de partidas da TV,
                      scouts de jogadores, relatórios de adversários. Tudo conta.
                    </p>
                  </div>
                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center font-bold">3</div>
                      <h4 className="font-semibold text-slate-100">Compartilhe Online</h4>
                    </div>
                    <p className="text-sm text-slate-400 ml-11">
                      LinkedIn, Twitter/X, Instagram. Poste análises táticas, threads, vídeos curtos.
                      Mostre seu olhar único. Seja consistente.
                    </p>
                  </div>
                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
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
                  <div className="bg-slate-700 rounded-lg p-3 text-center border border-slate-600">
                    <p className="font-semibold text-slate-100">Wyscout</p>
                    <p className="text-xs text-slate-400">Vídeo e dados</p>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-3 text-center border border-slate-600">
                    <p className="font-semibold text-slate-100">Hudl</p>
                    <p className="text-xs text-slate-400">Análise de vídeo</p>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-3 text-center border border-slate-600">
                    <p className="font-semibold text-slate-100">LongoMatch</p>
                    <p className="text-xs text-slate-400">Tagging gratuito</p>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-3 text-center border border-slate-600">
                    <p className="font-semibold text-slate-100">Sportscode</p>
                    <p className="text-xs text-slate-400">Elite/profissional</p>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-3 text-center border border-slate-600">
                    <p className="font-semibold text-slate-100">InStat</p>
                    <p className="text-xs text-slate-400">Dados e estatísticas</p>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-3 text-center border border-slate-600">
                    <p className="font-semibold text-slate-100">Tactical Pad</p>
                    <p className="text-xs text-slate-400">Diagramas táticos</p>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-3 text-center border border-slate-600">
                    <p className="font-semibold text-slate-100">Canva/Figma</p>
                    <p className="text-xs text-slate-400">Apresentações</p>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-3 text-center border border-slate-600">
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
                  <strong>Segredo:</strong> Voce nao analisa "futebol", voce analisa o futebol <em>daquele contexto</em>.
                  Cada categoria, cada modelo de jogo, cada adversario exige um olhar especifico.
                </p>
              </div>

              {/* Passo 0 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center text-sm font-bold">0</div>
                  <h3 className="text-lg font-semibold text-slate-100">Contexto do Jogo</h3>
                </div>
                <div className="bg-slate-700 rounded-xl p-4 ml-11">
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
                      <span><strong>Adversario</strong> (pressiona alto? bloco baixo? transicoes rapidas?)</span>
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
                  <h3 className="text-lg font-semibold text-slate-100">Filmagem Util</h3>
                  <Video className="w-5 h-5 text-slate-500" />
                </div>
                <div className="bg-slate-700 rounded-xl p-4 ml-11">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Plano aberto</strong> (pra ver espaco)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Se der: <strong>segundo angulo "meio-campo"</strong> (pra ver linhas e distancias)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Audio ajuda</strong> (comunicacao/treinador)</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Passo 2 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center text-sm font-bold">2</div>
                  <h3 className="text-lg font-semibold text-slate-100">Tagging (Marcacao de Lances)</h3>
                  <Target className="w-5 h-5 text-slate-500" />
                </div>
                <div className="bg-slate-700 rounded-xl p-4 ml-11">
                  <p className="text-sm text-slate-400 mb-3">Marque sempre em 3 camadas:</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-slate-800 rounded-lg p-3 border border-slate-600">
                      <p className="font-medium text-sm text-slate-100 mb-1">Acoes com bola</p>
                      <p className="text-xs text-slate-500">1v1, passe, conducao, finalizacao, cruzamento</p>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-3 border border-slate-600">
                      <p className="font-medium text-sm text-slate-100 mb-1">Acoes sem bola</p>
                      <p className="text-xs text-slate-500">Desmarque, cobertura, pressao, posicionamento</p>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-3 border border-slate-600">
                      <p className="font-medium text-sm text-slate-100 mb-1">Momentos do jogo</p>
                      <p className="text-xs text-slate-500">Org. ofensiva/defensiva, transicao, bola parada</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Passo 3 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center text-sm font-bold">3</div>
                  <h3 className="text-lg font-semibold text-slate-100">Clipes Curtos e "Ensinaveis"</h3>
                </div>
                <div className="bg-slate-700 rounded-xl p-4 ml-11">
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
                  <h3 className="text-lg font-semibold text-slate-100">Relatorio</h3>
                  <FileText className="w-5 h-5 text-slate-500" />
                </div>
                <div className="bg-slate-700 rounded-xl p-4 ml-11">
                  <p className="text-sm text-slate-400 mb-3">Base nao e relatorio gigante: e <strong>clareza</strong>.</p>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-amber-500 text-slate-900 flex items-center justify-center text-xs font-bold">5</span>
                      <span>pontos do time</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-amber-500 text-slate-900 flex items-center justify-center text-xs font-bold">3</span>
                      <span>pontos por setor (defesa/meio/ataque) ou por funcao</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-amber-500 text-slate-900 flex items-center justify-center text-xs font-bold">3</span>
                      <span>metas de treino "treinaveis" (o treinador consegue aplicar amanha)</span>
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
                  O sistema avalia atletas em <strong>20 dimensoes</strong> divididas em 3 grupos:
                  <span className="text-amber-400 font-medium"> CBF (8)</span>,
                  <span className="text-green-400 font-medium"> Ofensivas (6)</span> e
                  <span className="text-red-400 font-medium"> Defensivas (6)</span>.
                  Cada dimensao recebe nota de 1 a 5 e e comparada com benchmarks por categoria.
                </p>
              </div>

              {/* CBF - 8 dimensões */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30">
                    <span className="text-amber-400 font-bold">CBF</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-100">8 Dimensoes Tecnico-Comportamentais</h3>
                </div>
                <p className="text-sm text-slate-400 mb-4">Baseadas na metodologia da CBF Academy para formacao de jogadores de base.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Força */}
                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">💪</span>
                      <h4 className="font-semibold text-amber-400">Forca</h4>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">
                      Capacidade fisica de disputar bolas, manter posicao corporal, resistir a cargas e proteger a bola.
                    </p>
                    <div className="text-xs text-slate-400 space-y-1">
                      <p><span className="text-green-400 font-medium">Nota 5:</span> Domina fisicamente, vence todos os duelos</p>
                      <p><span className="text-blue-400 font-medium">Nota 3:</span> Adequado para idade, ganha alguns duelos</p>
                      <p><span className="text-orange-400 font-medium">Nota 1:</span> Muito fraco fisicamente, evita contato</p>
                    </div>
                    <div className="mt-3 p-2 bg-slate-800 rounded-lg">
                      <p className="text-xs text-slate-500"><strong>Por idade:</strong> U11-U12 foco em coordenacao, U15+ forca se torna mais relevante</p>
                    </div>
                  </div>

                  {/* Velocidade */}
                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">⚡</span>
                      <h4 className="font-semibold text-amber-400">Velocidade</h4>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">
                      Rapidez em sprints curtos, capacidade de aceleracao, mudancas de direcao e velocidade de reacao.
                    </p>
                    <div className="text-xs text-slate-400 space-y-1">
                      <p><span className="text-green-400 font-medium">Nota 5:</span> Explosivo, ganha corridas com folga</p>
                      <p><span className="text-blue-400 font-medium">Nota 3:</span> Velocidade adequada, acompanha o jogo</p>
                      <p><span className="text-orange-400 font-medium">Nota 1:</span> Muito lento, sempre atrasado nas jogadas</p>
                    </div>
                    <div className="mt-3 p-2 bg-slate-800 rounded-lg">
                      <p className="text-xs text-slate-500"><strong>Por idade:</strong> Pode variar muito com maturacao, nao supervalorizar em U11-U13</p>
                    </div>
                  </div>

                  {/* Técnica */}
                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">⚽</span>
                      <h4 className="font-semibold text-amber-400">Tecnica</h4>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">
                      Dominio de bola, qualidade de passes, dribles, conducao, primeiro toque e finalizacao.
                    </p>
                    <div className="text-xs text-slate-400 space-y-1">
                      <p><span className="text-green-400 font-medium">Nota 5:</span> Excelente com ambos os pes, domina sob pressao</p>
                      <p><span className="text-blue-400 font-medium">Nota 3:</span> Bom com pe dominante, adequado sob pressao</p>
                      <p><span className="text-orange-400 font-medium">Nota 1:</span> Dificuldade no dominio, perde bola facil</p>
                    </div>
                    <div className="mt-3 p-2 bg-slate-800 rounded-lg">
                      <p className="text-xs text-slate-500"><strong>Por idade:</strong> U11-U12 "Idade de Ouro" para desenvolver tecnica</p>
                    </div>
                  </div>

                  {/* Dinâmica */}
                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🔄</span>
                      <h4 className="font-semibold text-amber-400">Dinamica</h4>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">
                      Movimentacao constante, cobertura de espacos, capacidade de transicao e intensidade de jogo.
                    </p>
                    <div className="text-xs text-slate-400 space-y-1">
                      <p><span className="text-green-400 font-medium">Nota 5:</span> Sempre em movimento, cobre muito campo</p>
                      <p><span className="text-blue-400 font-medium">Nota 3:</span> Movimenta-se bem, participa do jogo</p>
                      <p><span className="text-orange-400 font-medium">Nota 1:</span> Estatico, espera a bola parado</p>
                    </div>
                    <div className="mt-3 p-2 bg-slate-800 rounded-lg">
                      <p className="text-xs text-slate-500"><strong>Por idade:</strong> Importante desde U11, indica atitude e entendimento do jogo</p>
                    </div>
                  </div>

                  {/* Inteligência */}
                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🧠</span>
                      <h4 className="font-semibold text-amber-400">Inteligencia</h4>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">
                      Leitura de jogo, tomada de decisao rapida, antecipacao de jogadas e visao de jogo.
                    </p>
                    <div className="text-xs text-slate-400 space-y-1">
                      <p><span className="text-green-400 font-medium">Nota 5:</span> Sempre decide certo, antecipa jogadas</p>
                      <p><span className="text-blue-400 font-medium">Nota 3:</span> Boas decisoes, ocasionais erros de leitura</p>
                      <p><span className="text-orange-400 font-medium">Nota 1:</span> Decisoes ruins, nao entende o jogo</p>
                    </div>
                    <div className="mt-3 p-2 bg-slate-800 rounded-lg">
                      <p className="text-xs text-slate-500"><strong>Por idade:</strong> U13+ comeca a ser mais importante, diferencial em todas idades</p>
                    </div>
                  </div>

                  {/* 1 contra 1 */}
                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">⚔️</span>
                      <h4 className="font-semibold text-amber-400">1 contra 1</h4>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">
                      Capacidade de vencer duelos individuais tanto no ataque (dribles, fintas) quanto na defesa (desarmes, bloqueios).
                    </p>
                    <div className="text-xs text-slate-400 space-y-1">
                      <p><span className="text-green-400 font-medium">Nota 5:</span> Vence maioria dos duelos, decisivo</p>
                      <p><span className="text-blue-400 font-medium">Nota 3:</span> Equilibrado, ganha e perde duelos</p>
                      <p><span className="text-orange-400 font-medium">Nota 1:</span> Evita duelos, sempre perde</p>
                    </div>
                    <div className="mt-3 p-2 bg-slate-800 rounded-lg">
                      <p className="text-xs text-slate-500"><strong>Por idade:</strong> U11 valorizar tentativa, U15+ valorizar efetividade</p>
                    </div>
                  </div>

                  {/* Atitude */}
                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🔥</span>
                      <h4 className="font-semibold text-amber-400">Atitude</h4>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">
                      Mentalidade competitiva, comprometimento, resiliencia, lideranca e comunicacao em campo.
                    </p>
                    <div className="text-xs text-slate-400 space-y-1">
                      <p><span className="text-green-400 font-medium">Nota 5:</span> Lider, nunca desiste, puxa o time</p>
                      <p><span className="text-blue-400 font-medium">Nota 3:</span> Comprometido, mantem foco</p>
                      <p><span className="text-orange-400 font-medium">Nota 1:</span> Desiste facil, reclama, se esconde</p>
                    </div>
                    <div className="mt-3 p-2 bg-slate-800 rounded-lg">
                      <p className="text-xs text-slate-500"><strong>Por idade:</strong> Fundamental em todas idades, diferencial para evolucao</p>
                    </div>
                  </div>

                  {/* Potencial */}
                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">📈</span>
                      <h4 className="font-semibold text-amber-400">Potencial</h4>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">
                      Projecao de evolucao futura baseada em margem de crescimento, caracteristicas fisicas e capacidade de aprendizado.
                    </p>
                    <div className="text-xs text-slate-400 space-y-1">
                      <p><span className="text-green-400 font-medium">Nota 5:</span> Altissimo potencial, aprende rapido</p>
                      <p><span className="text-blue-400 font-medium">Nota 3:</span> Bom potencial, evolui normalmente</p>
                      <p><span className="text-orange-400 font-medium">Nota 1:</span> Baixo potencial, teto visivel</p>
                    </div>
                    <div className="mt-3 p-2 bg-slate-800 rounded-lg">
                      <p className="text-xs text-slate-500"><strong>Por idade:</strong> Mais importante em U11-U13, U17 ja e mais "o que e"</p>
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
                  <h3 className="text-lg font-semibold text-slate-100">6 Dimensoes Ofensivas</h3>
                </div>
                <p className="text-sm text-slate-400 mb-4">Principios taticos da fase ofensiva do jogo.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Penetração */}
                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🎯</span>
                      <h4 className="font-semibold text-green-400">Penetracao</h4>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">
                      Capacidade de atacar espacos, progredir com bola em direcao ao gol e finalizar jogadas.
                    </p>
                    <div className="text-xs text-slate-400 space-y-1">
                      <p><span className="text-green-400 font-medium">Nota 5:</span> Ataca espacos com precisao, finaliza bem</p>
                      <p><span className="text-blue-400 font-medium">Nota 3:</span> Progride quando tem espaco claro</p>
                      <p><span className="text-orange-400 font-medium">Nota 1:</span> Nao busca profundidade, sempre joga para tras</p>
                    </div>
                  </div>

                  {/* Cobertura Ofensiva */}
                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🤝</span>
                      <h4 className="font-semibold text-green-400">Cobertura Ofensiva</h4>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">
                      Apoio aos companheiros no ataque, oferecendo opcoes de passe e criando linhas de passe.
                    </p>
                    <div className="text-xs text-slate-400 space-y-1">
                      <p><span className="text-green-400 font-medium">Nota 5:</span> Sempre oferece opcao, timing perfeito</p>
                      <p><span className="text-blue-400 font-medium">Nota 3:</span> Oferece apoio adequado</p>
                      <p><span className="text-orange-400 font-medium">Nota 1:</span> Nao se oferece, deixa companheiro sozinho</p>
                    </div>
                  </div>

                  {/* Espaço com Bola */}
                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">⚽</span>
                      <h4 className="font-semibold text-green-400">Espaco com Bola</h4>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">
                      Qualidade na posse de bola, criacao de jogadas, manutencao da bola e criacao de espacos.
                    </p>
                    <div className="text-xs text-slate-400 space-y-1">
                      <p><span className="text-green-400 font-medium">Nota 5:</span> Cria jogadas, mantem posse sob pressao</p>
                      <p><span className="text-blue-400 font-medium">Nota 3:</span> Boa manutencao em situacoes normais</p>
                      <p><span className="text-orange-400 font-medium">Nota 1:</span> Perde bola facil, sem criatividade</p>
                    </div>
                  </div>

                  {/* Espaço sem Bola */}
                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">👟</span>
                      <h4 className="font-semibold text-green-400">Espaco sem Bola</h4>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">
                      Movimentacao inteligente para receber, criar linhas de passe e desmarques.
                    </p>
                    <div className="text-xs text-slate-400 space-y-1">
                      <p><span className="text-green-400 font-medium">Nota 5:</span> Movimentacao constante e inteligente</p>
                      <p><span className="text-blue-400 font-medium">Nota 3:</span> Se movimenta quando percebe espaco</p>
                      <p><span className="text-orange-400 font-medium">Nota 1:</span> Estatico, espera a bola chegar</p>
                    </div>
                  </div>

                  {/* Mobilidade */}
                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🔀</span>
                      <h4 className="font-semibold text-green-400">Mobilidade</h4>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">
                      Capacidade de trocar posicoes, surpreender e desorganizar defesas adversarias.
                    </p>
                    <div className="text-xs text-slate-400 space-y-1">
                      <p><span className="text-green-400 font-medium">Nota 5:</span> Imprevisivel, troca posicoes com inteligencia</p>
                      <p><span className="text-blue-400 font-medium">Nota 3:</span> Algumas trocas de posicao efetivas</p>
                      <p><span className="text-orange-400 font-medium">Nota 1:</span> Sempre na mesma posicao, previsivel</p>
                    </div>
                  </div>

                  {/* Unidade Ofensiva */}
                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🔗</span>
                      <h4 className="font-semibold text-green-400">Unidade Ofensiva</h4>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">
                      Conexao com o coletivo no ataque, sincronismo com companheiros e combinacoes.
                    </p>
                    <div className="text-xs text-slate-400 space-y-1">
                      <p><span className="text-green-400 font-medium">Nota 5:</span> Joga junto, combina bem, sincronizado</p>
                      <p><span className="text-blue-400 font-medium">Nota 3:</span> Participa das jogadas coletivas</p>
                      <p><span className="text-orange-400 font-medium">Nota 1:</span> Joga sozinho, nao combina</p>
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
                  <h3 className="text-lg font-semibold text-slate-100">6 Dimensoes Defensivas</h3>
                </div>
                <p className="text-sm text-slate-400 mb-4">Principios taticos da fase defensiva do jogo.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Contenção */}
                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🛡️</span>
                      <h4 className="font-semibold text-red-400">Contencao</h4>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">
                      Capacidade de marcar, pressionar o portador da bola e retardar ataques adversarios.
                    </p>
                    <div className="text-xs text-slate-400 space-y-1">
                      <p><span className="text-green-400 font-medium">Nota 5:</span> Pressao intensa e inteligente, recupera bola</p>
                      <p><span className="text-blue-400 font-medium">Nota 3:</span> Marca adequadamente, faz pressao</p>
                      <p><span className="text-orange-400 font-medium">Nota 1:</span> Nao marca, da espaco ao adversario</p>
                    </div>
                  </div>

                  {/* Cobertura Defensiva */}
                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🤝</span>
                      <h4 className="font-semibold text-red-400">Cobertura Defensiva</h4>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">
                      Apoio aos companheiros na defesa, cobertura de espacos vulneraveis e dobras de marcacao.
                    </p>
                    <div className="text-xs text-slate-400 space-y-1">
                      <p><span className="text-green-400 font-medium">Nota 5:</span> Sempre da cobertura, posicionamento perfeito</p>
                      <p><span className="text-blue-400 font-medium">Nota 3:</span> Cobre quando necessario</p>
                      <p><span className="text-orange-400 font-medium">Nota 1:</span> Deixa companheiro sozinho, sem cobertura</p>
                    </div>
                  </div>

                  {/* Equilíbrio Recuperação */}
                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🔄</span>
                      <h4 className="font-semibold text-red-400">Equilibrio Recuperacao</h4>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">
                      Recomposicao rapida apos perda de bola, transicao defensiva e reacao a perda.
                    </p>
                    <div className="text-xs text-slate-400 space-y-1">
                      <p><span className="text-green-400 font-medium">Nota 5:</span> Transicao imediata, sempre volta</p>
                      <p><span className="text-blue-400 font-medium">Nota 3:</span> Volta na maioria das vezes</p>
                      <p><span className="text-orange-400 font-medium">Nota 1:</span> Nao volta, time sofre contra-ataque</p>
                    </div>
                  </div>

                  {/* Equilíbrio Defensivo */}
                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">⚖️</span>
                      <h4 className="font-semibold text-red-400">Equilibrio Defensivo</h4>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">
                      Posicionamento correto, organizacao tatica, compactacao e distancias entre linhas.
                    </p>
                    <div className="text-xs text-slate-400 space-y-1">
                      <p><span className="text-green-400 font-medium">Nota 5:</span> Sempre bem posicionado, organiza linha</p>
                      <p><span className="text-blue-400 font-medium">Nota 3:</span> Posicionamento adequado na maioria</p>
                      <p><span className="text-orange-400 font-medium">Nota 1:</span> Mal posicionado, cria buracos</p>
                    </div>
                  </div>

                  {/* Concentração */}
                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🎯</span>
                      <h4 className="font-semibold text-red-400">Concentracao</h4>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">
                      Atencao constante, antecipacao de jogadas e capacidade de interceptar passes.
                    </p>
                    <div className="text-xs text-slate-400 space-y-1">
                      <p><span className="text-green-400 font-medium">Nota 5:</span> Sempre atento, antecipa e intercepta</p>
                      <p><span className="text-blue-400 font-medium">Nota 3:</span> Mantem foco na maioria do jogo</p>
                      <p><span className="text-orange-400 font-medium">Nota 1:</span> Desatento, pego de surpresa</p>
                    </div>
                  </div>

                  {/* Unidade Defensiva */}
                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🔗</span>
                      <h4 className="font-semibold text-red-400">Unidade Defensiva</h4>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">
                      Conexao com o coletivo na defesa, comunicacao, coesao e trabalho em equipe defensivo.
                    </p>
                    <div className="text-xs text-slate-400 space-y-1">
                      <p><span className="text-green-400 font-medium">Nota 5:</span> Comunica, organiza, defende junto</p>
                      <p><span className="text-blue-400 font-medium">Nota 3:</span> Participa da organizacao defensiva</p>
                      <p><span className="text-orange-400 font-medium">Nota 1:</span> Defende sozinho, sem comunicacao</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Escala de notas */}
              <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Escala de Notas (1 a 5)</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <div className="text-center p-3 bg-red-900/30 rounded-lg border border-red-700">
                    <p className="text-2xl font-bold text-red-400">1</p>
                    <p className="text-xs text-red-300">Muito abaixo</p>
                    <p className="text-xs text-slate-400 mt-1">Deficiencia clara</p>
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
              {/* Sub-7/9 */}
              <div className="border border-slate-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleCategoria('sub7')}
                  className="w-full flex items-center justify-between p-4 bg-slate-700 hover:bg-slate-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold">7-9</div>
                    <div className="text-left">
                      <p className="font-semibold text-slate-100">Sub-7 / Sub-9</p>
                      <p className="text-xs text-slate-400">"Bola e coragem" - Formar gosto pelo jogo e base motora/tecnica</p>
                    </div>
                  </div>
                  {categoriaAberta === 'sub7' ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                </button>
                {categoriaAberta === 'sub7' && (
                  <div className="p-4 space-y-4 bg-slate-800">
                    <div>
                      <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Checklist
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-700 rounded-lg p-3">
                          <p className="font-medium text-sm text-slate-100 mb-2">Tecnico</p>
                          <ul className="text-sm text-slate-400 space-y-1">
                            <li>- Domina e conduz sem olhar toda hora</li>
                            <li>- Protege a bola (corpo entre bola e adversario)</li>
                            <li>- Usa os dois pes (mesmo que mal)</li>
                            <li>- Tenta drible (1v1) e muda direcao</li>
                          </ul>
                        </div>
                        <div className="bg-slate-700 rounded-lg p-3">
                          <p className="font-medium text-sm text-slate-100 mb-2">Tatico</p>
                          <ul className="text-sm text-slate-400 space-y-1">
                            <li>- Entende "atacar o gol" (progressao)</li>
                            <li>- Entende "defender o gol" (voltar)</li>
                            <li>- Reconhece companheiro livre</li>
                          </ul>
                        </div>
                        <div className="bg-slate-700 rounded-lg p-3">
                          <p className="font-medium text-sm text-slate-100 mb-2">Fisico</p>
                          <ul className="text-sm text-slate-400 space-y-1">
                            <li>- Coordenacao (freia/arranca/muda direcao)</li>
                            <li>- Equilibrio e agilidade</li>
                          </ul>
                        </div>
                        <div className="bg-slate-700 rounded-lg p-3">
                          <p className="font-medium text-sm text-slate-100 mb-2">Mental/Social</p>
                          <ul className="text-sm text-slate-400 space-y-1">
                            <li>- Nao se esconde do jogo</li>
                            <li>- Reage bem ao erro (tenta de novo)</li>
                            <li>- Curiosidade (quer aprender)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-900/30 rounded-lg p-3 border border-blue-700">
                      <p className="font-medium text-sm text-blue-300 mb-1 flex items-center gap-2">
                        <Eye className="w-4 h-4" /> Como olhar (segredo)
                      </p>
                      <p className="text-sm text-blue-200">
                        Procure <strong>comportamento</strong>, nao execucao perfeita. O talentoso nao e o que "acerta tudo".
                        E o que <strong>tenta, repete, nao tem medo</strong>.
                      </p>
                    </div>
                    <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-700">
                      <p className="font-medium text-sm text-purple-300 mb-1 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" /> Indicadores praticos
                      </p>
                      <ul className="text-sm text-purple-200 space-y-1">
                        <li>- Quantas vezes ele tenta 1v1?</li>
                        <li>- Quantas vezes recupera a bola por iniciativa?</li>
                        <li>- Depois de errar, ele volta pro jogo ou some?</li>
                      </ul>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-900/30 rounded-lg border border-green-700">
                      <Star className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm text-green-300">Talento aqui</p>
                        <p className="text-sm text-green-200">"Corajoso + curioso + coordenado"</p>
                        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Armadilha: escolher o maior/mais forte
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sub-11 */}
              <div className="border border-slate-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleCategoria('sub11')}
                  className="w-full flex items-center justify-between p-4 bg-slate-700 hover:bg-slate-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500 text-white flex items-center justify-center font-bold">11</div>
                    <div className="text-left">
                      <p className="font-semibold text-slate-100">Sub-11</p>
                      <p className="text-xs text-slate-400">"Cabeca levantada" - Transformar "eu e a bola" em "eu, a bola e o espaco"</p>
                    </div>
                  </div>
                  {categoriaAberta === 'sub11' ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                </button>
                {categoriaAberta === 'sub11' && (
                  <div className="p-4 space-y-4 bg-slate-800">
                    <div>
                      <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Checklist
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-700 rounded-lg p-3">
                          <p className="font-medium text-sm text-slate-100 mb-2">Tecnico</p>
                          <ul className="text-sm text-slate-400 space-y-1">
                            <li>- Primeiro toque orientado (nao so dominar)</li>
                            <li>- Passe curto com qualidade</li>
                            <li>- Conduz e levanta a cabeca</li>
                            <li>- Finaliza com intencao (colocar, nao so chutar forte)</li>
                          </ul>
                        </div>
                        <div className="bg-slate-700 rounded-lg p-3">
                          <p className="font-medium text-sm text-slate-100 mb-2">Tatico</p>
                          <ul className="text-sm text-slate-400 space-y-1">
                            <li>- Ocupa espacos (abre largura, da profundidade)</li>
                            <li>- Triangulos simples (apoio, linha de passe)</li>
                            <li>- Entende superioridade numerica basica (2v1)</li>
                            <li>- Reacao a perda da bola (5 seg de pressao ou retorno)</li>
                          </ul>
                        </div>
                        <div className="bg-slate-700 rounded-lg p-3 md:col-span-2">
                          <p className="font-medium text-sm text-slate-100 mb-2">Mental</p>
                          <ul className="text-sm text-slate-400 space-y-1">
                            <li>- Escolhe entre passe vs drible</li>
                            <li>- Entende "momento" (acelerar x pausar)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-900/30 rounded-lg p-3 border border-blue-700">
                      <p className="font-medium text-sm text-blue-300 mb-1 flex items-center gap-2">
                        <Eye className="w-4 h-4" /> Como olhar (segredo)
                      </p>
                      <p className="text-sm text-blue-200">
                        O que separa os melhores: <strong>tempo de decisao</strong> (ele decide mais rapido e melhor) e
                        <strong> variedade</strong> (ele tem mais de uma solucao).
                      </p>
                    </div>
                    <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-700">
                      <p className="font-medium text-sm text-purple-300 mb-1 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" /> Indicadores praticos
                      </p>
                      <ul className="text-sm text-purple-200 space-y-1">
                        <li>- Antes de receber: ele "escaneia" (olha ao redor)?</li>
                        <li>- Quando pressionado: ele se livra bem ou se apavora?</li>
                        <li>- Quando tem 2 opcoes: escolhe a mais logica?</li>
                      </ul>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-900/30 rounded-lg border border-green-700">
                      <Star className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm text-green-300">Talento aqui</p>
                        <p className="text-sm text-green-200">"Pensa cedo + executa simples"</p>
                        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Armadilha: achar que "driblador" e sempre o melhor
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sub-13 */}
              <div className="border border-slate-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleCategoria('sub13')}
                  className="w-full flex items-center justify-between p-4 bg-slate-700 hover:bg-slate-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500 text-white flex items-center justify-center font-bold">13</div>
                    <div className="text-left">
                      <p className="font-semibold text-slate-100">Sub-13</p>
                      <p className="text-xs text-slate-400">"Jogo comeca sem a bola" - Consolidar tecnica sob pressao + principios taticos</p>
                    </div>
                  </div>
                  {categoriaAberta === 'sub13' ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                </button>
                {categoriaAberta === 'sub13' && (
                  <div className="p-4 space-y-4 bg-slate-800">
                    <div>
                      <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Checklist
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-700 rounded-lg p-3">
                          <p className="font-medium text-sm text-slate-100 mb-2">Tecnico sob pressao</p>
                          <ul className="text-sm text-slate-400 space-y-1">
                            <li>- Primeiro toque para fugir da pressao</li>
                            <li>- Passe em apoio e passe vertical</li>
                            <li>- Conducao para atrair e soltar</li>
                            <li>- 1v1 com objetivo (progredir, nao show)</li>
                          </ul>
                        </div>
                        <div className="bg-slate-700 rounded-lg p-3">
                          <p className="font-medium text-sm text-slate-100 mb-2">Tatico (principios)</p>
                          <ul className="text-sm text-slate-400 space-y-1">
                            <li>- Amplitude e profundidade na fase ofensiva</li>
                            <li>- Entrelinhas (achar espaco entre meio e defesa)</li>
                            <li>- Pressao com direcao (forcar para lado)</li>
                            <li>- Cobertura e balanco defensivo</li>
                            <li>- Transicao defensiva: recompor por dentro</li>
                          </ul>
                        </div>
                        <div className="bg-slate-700 rounded-lg p-3 md:col-span-2">
                          <p className="font-medium text-sm text-slate-100 mb-2">Mental</p>
                          <ul className="text-sm text-slate-400 space-y-1">
                            <li>- Comunicacao simples ("vira", "homem", "tempo")</li>
                            <li>- Resiliencia apos erro</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-900/30 rounded-lg p-3 border border-blue-700">
                      <p className="font-medium text-sm text-blue-300 mb-1 flex items-center gap-2">
                        <Eye className="w-4 h-4" /> Como olhar (segredo)
                      </p>
                      <p className="text-sm text-blue-200">
                        No Sub-13, voce "enxerga" talento observando o que ele faz <strong>quando nao e protagonista</strong>.
                        Sem bola: ele gera linha de passe? fecha linha? da cobertura? <strong>Isso e raro e vale ouro.</strong>
                      </p>
                    </div>
                    <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-700">
                      <p className="font-medium text-sm text-purple-300 mb-1 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" /> Indicadores praticos
                      </p>
                      <ul className="text-sm text-purple-200 space-y-1">
                        <li>- Acoes uteis sem bola por minuto (desmarque + cobertura)</li>
                        <li>- Decisoes sob pressao (perde bola ou acha solucao?)</li>
                        <li>- Consegue cumprir funcao + ainda ser criativo?</li>
                      </ul>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-900/30 rounded-lg border border-green-700">
                      <Star className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm text-green-300">Talento aqui</p>
                        <p className="text-sm text-green-200">"Entende espaco + aprende rapido + compete"</p>
                        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Armadilha: punir quem tenta passe vertical e erra (olhe a intencao)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sub-15 */}
              <div className="border border-slate-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleCategoria('sub15')}
                  className="w-full flex items-center justify-between p-4 bg-slate-700 hover:bg-slate-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold">15</div>
                    <div className="text-left">
                      <p className="font-semibold text-slate-100">Sub-15</p>
                      <p className="text-xs text-slate-400">"Funcao e intensidade" - Aplicar modelo do treinador, repeticao e competitividade</p>
                    </div>
                  </div>
                  {categoriaAberta === 'sub15' ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                </button>
                {categoriaAberta === 'sub15' && (
                  <div className="p-4 space-y-4 bg-slate-800">
                    <div>
                      <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Checklist por funcao
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-slate-700 rounded-lg p-3">
                          <p className="font-medium text-sm text-slate-100 mb-2">Lateral</p>
                          <ul className="text-xs text-slate-400 space-y-1">
                            <li>- Timing de apoio</li>
                            <li>- Cobertura</li>
                            <li>- Cruzamento consciente</li>
                          </ul>
                        </div>
                        <div className="bg-slate-700 rounded-lg p-3">
                          <p className="font-medium text-sm text-slate-100 mb-2">Zagueiro</p>
                          <ul className="text-xs text-slate-400 space-y-1">
                            <li>- Linha alta?</li>
                            <li>- Cobertura</li>
                            <li>- Passe de ruptura</li>
                          </ul>
                        </div>
                        <div className="bg-slate-700 rounded-lg p-3">
                          <p className="font-medium text-sm text-slate-100 mb-2">Volante</p>
                          <ul className="text-xs text-slate-400 space-y-1">
                            <li>- Primeiro passe</li>
                            <li>- Orientacao corporal</li>
                            <li>- Cobertura central</li>
                          </ul>
                        </div>
                        <div className="bg-slate-700 rounded-lg p-3">
                          <p className="font-medium text-sm text-slate-100 mb-2">Meia</p>
                          <ul className="text-xs text-slate-400 space-y-1">
                            <li>- Receber entrelinhas</li>
                            <li>- Girar</li>
                            <li>- Acelerar jogo</li>
                          </ul>
                        </div>
                        <div className="bg-slate-700 rounded-lg p-3">
                          <p className="font-medium text-sm text-slate-100 mb-2">Ponta</p>
                          <ul className="text-xs text-slate-400 space-y-1">
                            <li>- Amplitude</li>
                            <li>- 1v1 objetivo</li>
                            <li>- Ataque ao espaco</li>
                          </ul>
                        </div>
                        <div className="bg-slate-700 rounded-lg p-3">
                          <p className="font-medium text-sm text-slate-100 mb-2">Centroavante</p>
                          <ul className="text-xs text-slate-400 space-y-1">
                            <li>- Apoios</li>
                            <li>- Ataque a profundidade</li>
                            <li>- Pressao inicial</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-700 rounded-lg p-3">
                        <p className="font-medium text-sm text-slate-100 mb-2">Fase defensiva</p>
                        <ul className="text-sm text-slate-400 space-y-1">
                          <li>- Compactacao (distancia entre linhas)</li>
                          <li>- Pressao coordenada</li>
                          <li>- Reacao pos-perda (gatilhos)</li>
                        </ul>
                      </div>
                      <div className="bg-slate-700 rounded-lg p-3">
                        <p className="font-medium text-sm text-slate-100 mb-2">Fisico/Mental</p>
                        <ul className="text-sm text-slate-400 space-y-1">
                          <li>- Repeticao de alta intensidade</li>
                          <li>- Competitividade com disciplina tatica</li>
                          <li>- Aceita correcao? Executa?</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-blue-900/30 rounded-lg p-3 border border-blue-700">
                      <p className="font-medium text-sm text-blue-300 mb-1 flex items-center gap-2">
                        <Eye className="w-4 h-4" /> Como olhar (segredo)
                      </p>
                      <p className="text-sm text-blue-200">
                        No Sub-15 o diferencial e: <strong>consistencia + disciplina</strong> (faz o correto 10x no jogo)
                        e nao "um lance genial".
                      </p>
                    </div>
                    <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-700">
                      <p className="font-medium text-sm text-purple-300 mb-1 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" /> Indicadores praticos
                      </p>
                      <ul className="text-sm text-purple-200 space-y-1">
                        <li>- Quantas vezes cumpre funcao sem bola corretamente</li>
                        <li>- Participacao em transicoes (ataque e defesa)</li>
                        <li>- Quedas de concentracao (minutos "sumido")</li>
                      </ul>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-900/30 rounded-lg border border-green-700">
                      <Star className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm text-green-300">Talento aqui</p>
                        <p className="text-sm text-green-200">"Rendimento repetivel"</p>
                        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Armadilha: escolher so por fisico/arranque
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sub-17 */}
              <div className="border border-slate-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleCategoria('sub17')}
                  className="w-full flex items-center justify-between p-4 bg-slate-700 hover:bg-slate-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500 text-white flex items-center justify-center font-bold">17</div>
                    <div className="text-left">
                      <p className="font-semibold text-slate-100">Sub-17</p>
                      <p className="text-xs text-slate-400">"Pronto para competir em alto nivel" - Performance, consistencia, decisoes sob pressao</p>
                    </div>
                  </div>
                  {categoriaAberta === 'sub17' ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                </button>
                {categoriaAberta === 'sub17' && (
                  <div className="p-4 space-y-4 bg-slate-800">
                    <div>
                      <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Checklist
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-700 rounded-lg p-3">
                          <p className="font-medium text-sm text-slate-100 mb-2">Performance por funcao</p>
                          <ul className="text-sm text-slate-400 space-y-1">
                            <li>- Executa em alta velocidade (tecnico + tatico)</li>
                            <li>- Decide bem sob pressao e cansaco</li>
                            <li>- Consegue mudar o jogo com decisoes</li>
                          </ul>
                        </div>
                        <div className="bg-slate-700 rounded-lg p-3">
                          <p className="font-medium text-sm text-slate-100 mb-2">Tatico</p>
                          <ul className="text-sm text-slate-400 space-y-1">
                            <li>- Reconhece gatilhos (pressao/saltar/temporizar)</li>
                            <li>- Joga com o tempo do jogo</li>
                            <li>- Inteligencia defensiva (falta tatica, proteger zona)</li>
                          </ul>
                        </div>
                        <div className="bg-slate-700 rounded-lg p-3">
                          <p className="font-medium text-sm text-slate-100 mb-2">Fisico</p>
                          <ul className="text-sm text-slate-400 space-y-1">
                            <li>- Intensidade sustentada</li>
                            <li>- Robustez (duelos, contato, recuperacao)</li>
                          </ul>
                        </div>
                        <div className="bg-slate-700 rounded-lg p-3">
                          <p className="font-medium text-sm text-slate-100 mb-2">Mental</p>
                          <ul className="text-sm text-slate-400 space-y-1">
                            <li>- Lideranca e comunicacao</li>
                            <li>- Frieza em jogo grande</li>
                            <li>- Responsabilidade sem a bola</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-900/30 rounded-lg p-3 border border-blue-700">
                      <p className="font-medium text-sm text-blue-300 mb-1 flex items-center gap-2">
                        <Eye className="w-4 h-4" /> Como olhar (segredo)
                      </p>
                      <p className="text-sm text-blue-200">
                        Aqui voce pergunta: <strong>"Se eu colocar esse cara num Sub-20 amanha, ele nao morre?"</strong>
                        Voce avalia <strong>transferencia</strong>: se o que ele faz serve em nivel acima.
                      </p>
                    </div>
                    <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-700">
                      <p className="font-medium text-sm text-purple-300 mb-1 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" /> Indicadores praticos
                      </p>
                      <ul className="text-sm text-purple-200 space-y-1">
                        <li>- Consistencia (2o tempo igual ao 1o)</li>
                        <li>- Tomada de decisao sob pressao</li>
                        <li>- Participacao em momentos-chave (pos-perda, ultima bola, transicao)</li>
                      </ul>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-900/30 rounded-lg border border-green-700">
                      <Star className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm text-green-300">Talento aqui</p>
                        <p className="text-sm text-green-200">"Confiavel + competitivo + inteligente"</p>
                        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Armadilha: confundir "muito intenso" com "inteligente"
                        </p>
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
              {/* Régua de Ouro */}
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  A Regua de Ouro (base inteira)
                </h3>
                <p className="text-sm text-slate-400 mb-4">Avalie 3 coisas e de nota 0-3 em cada:</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 rounded-xl p-4 border border-blue-700">
                    <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold mb-3">1</div>
                    <h4 className="font-semibold text-blue-300 mb-2">Percepcao</h4>
                    <p className="text-sm text-blue-200">Ele percebe o jogo antes? (escaneia, entende espaco)</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-900/50 to-green-800/50 rounded-xl p-4 border border-green-700">
                    <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center text-xl font-bold mb-3">2</div>
                    <h4 className="font-semibold text-green-300 mb-2">Decisao</h4>
                    <p className="text-sm text-green-200">Ele escolhe a solucao certa pro momento?</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 rounded-xl p-4 border border-purple-700">
                    <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center text-xl font-bold mb-3">3</div>
                    <h4 className="font-semibold text-purple-300 mb-2">Execucao</h4>
                    <p className="text-sm text-purple-200">Ele consegue fazer? (tecnica e fisico)</p>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-yellow-900/30 rounded-xl border border-yellow-700">
                  <p className="text-sm text-yellow-300">
                    <strong>Talento real na base e:</strong> Percepcao + Decisao acima da media.
                    <br />Execucao vem com treino e maturacao.
                  </p>
                </div>
              </div>

              {/* O que valorizo */}
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  O que mais valorizar em "diamante bruto"
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start gap-3 p-3 bg-slate-700 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-100">Aprende rapido</p>
                      <p className="text-sm text-slate-400">1 correcao e muda</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-700 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-100">Nao se esconde</p>
                      <p className="text-sm text-slate-400">Pede bola</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-700 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-100">Erra tentando jogar</p>
                      <p className="text-sm text-slate-400">Nao erra por preguica</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-700 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-100">Comportamento sem bola</p>
                      <p className="text-sm text-slate-400">Acima da idade</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Armadilhas */}
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Armadilhas comuns
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-red-900/30 rounded-lg border border-red-700">
                    <span className="text-red-400 font-bold">X</span>
                    <p className="text-sm text-red-200">Escolher o <strong>maior/mais forte</strong> (vantagem fisica passa)</p>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-900/30 rounded-lg border border-red-700">
                    <span className="text-red-400 font-bold">X</span>
                    <p className="text-sm text-red-200">Achar que <strong>driblador = melhor</strong> (drible sem objetivo)</p>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-900/30 rounded-lg border border-red-700">
                    <span className="text-red-400 font-bold">X</span>
                    <p className="text-sm text-red-200">Punir quem <strong>tenta passe vertical e erra</strong> (olhe a intencao)</p>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-900/30 rounded-lg border border-red-700">
                    <span className="text-red-400 font-bold">X</span>
                    <p className="text-sm text-red-200">Confundir <strong>"muito intenso" com "inteligente"</strong></p>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-900/30 rounded-lg border border-red-700">
                    <span className="text-red-400 font-bold">X</span>
                    <p className="text-sm text-red-200">Valorizar só quem <strong>aparece com bola</strong> (ignorar o trabalho sem bola)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Como Decidir */}
          {activeTab === 'decisao' && (
            <div className="space-y-8">
              {/* Intro */}
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-500/30">
                <h3 className="text-xl font-bold text-blue-400 mb-2">Por que escolher A e não B?</h3>
                <p className="text-slate-300">
                  Uma das perguntas mais difíceis na formação. Dois atletas podem ter notas parecidas,
                  mas <strong>contexto, potencial e perfil</strong> mudam tudo. Aqui está o framework para decidir.
                </p>
              </div>

              {/* Matriz de Decisão */}
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-500" />
                  Matriz de Decisão
                </h3>
                <div className="bg-slate-700 rounded-xl p-4 border border-slate-600 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left py-2 px-3 text-slate-400 font-medium">Critério</th>
                        <th className="text-center py-2 px-3 text-slate-400 font-medium">Peso</th>
                        <th className="text-left py-2 px-3 text-slate-400 font-medium">Pergunta-chave</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-300">
                      <tr className="border-b border-slate-600/50">
                        <td className="py-2 px-3 font-medium text-green-400">🧠 Inteligência de Jogo</td>
                        <td className="py-2 px-3 text-center"><span className="bg-green-900/50 px-2 py-1 rounded text-green-300">Alto</span></td>
                        <td className="py-2 px-3">Ele entende o jogo ou só executa?</td>
                      </tr>
                      <tr className="border-b border-slate-600/50">
                        <td className="py-2 px-3 font-medium text-green-400">📈 Margem de Evolução</td>
                        <td className="py-2 px-3 text-center"><span className="bg-green-900/50 px-2 py-1 rounded text-green-300">Alto</span></td>
                        <td className="py-2 px-3">Ele aprende rápido? Responde a feedback?</td>
                      </tr>
                      <tr className="border-b border-slate-600/50">
                        <td className="py-2 px-3 font-medium text-green-400">🔥 Atitude/Mentalidade</td>
                        <td className="py-2 px-3 text-center"><span className="bg-green-900/50 px-2 py-1 rounded text-green-300">Alto</span></td>
                        <td className="py-2 px-3">Ele compete? Não desiste? Lidera?</td>
                      </tr>
                      <tr className="border-b border-slate-600/50">
                        <td className="py-2 px-3 font-medium text-blue-400">⚽ Técnica</td>
                        <td className="py-2 px-3 text-center"><span className="bg-blue-900/50 px-2 py-1 rounded text-blue-300">Médio</span></td>
                        <td className="py-2 px-3">Domina fundamentos? Usa os dois pés?</td>
                      </tr>
                      <tr className="border-b border-slate-600/50">
                        <td className="py-2 px-3 font-medium text-blue-400">🎯 Efetividade Tática</td>
                        <td className="py-2 px-3 text-center"><span className="bg-blue-900/50 px-2 py-1 rounded text-blue-300">Médio</span></td>
                        <td className="py-2 px-3">Cumpre função? Joga pelo time?</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium text-orange-400">💪 Físico</td>
                        <td className="py-2 px-3 text-center"><span className="bg-orange-900/50 px-2 py-1 rounded text-orange-300">Variável*</span></td>
                        <td className="py-2 px-3">Adequado para idade? Vai crescer?</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-xs text-slate-500 mt-3">*Físico é variável: menos importante em U11-U13, mais relevante em U15+</p>
                </div>
              </div>

              {/* Cenários de Decisão */}
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  Cenários Comuns de Decisão
                </h3>
                <div className="space-y-4">
                  {/* Cenário 1 */}
                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl">🤔</span>
                      <div>
                        <h4 className="font-semibold text-slate-100">"A" é mais forte e rápido, "B" é mais inteligente</h4>
                        <p className="text-sm text-slate-400">Quem escolher para U13?</p>
                      </div>
                    </div>
                    <div className="bg-green-900/30 rounded-lg p-3 border border-green-700">
                      <p className="text-sm text-green-300">
                        <strong>Resposta:</strong> Geralmente "B". Força e velocidade mudam com maturação.
                        Inteligência de jogo é muito mais difícil de desenvolver. O atleta fisicamente dominante
                        em U13 pode ser "normal" em U17 quando os outros crescem.
                      </p>
                    </div>
                  </div>

                  {/* Cenário 2 */}
                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl">🤔</span>
                      <div>
                        <h4 className="font-semibold text-slate-100">"A" é tecnicamente melhor, "B" compete mais</h4>
                        <p className="text-sm text-slate-400">Quem escolher para decisão importante?</p>
                      </div>
                    </div>
                    <div className="bg-green-900/30 rounded-lg p-3 border border-green-700">
                      <p className="text-sm text-green-300">
                        <strong>Resposta:</strong> Depende do momento. Para jogos decisivos, atitude pesa muito.
                        Mas para formação de longo prazo, questione: "B" compete porque quer ou porque é limitado tecnicamente?
                        Se "A" tiver atitude razoável, pode ser melhor aposta.
                      </p>
                    </div>
                  </div>

                  {/* Cenário 3 */}
                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl">🤔</span>
                      <div>
                        <h4 className="font-semibold text-slate-100">"A" é completo mas normal, "B" é especialista mas brilhante</h4>
                        <p className="text-sm text-slate-400">Generalista vs Especialista?</p>
                      </div>
                    </div>
                    <div className="bg-green-900/30 rounded-lg p-3 border border-green-700">
                      <p className="text-sm text-green-300">
                        <strong>Resposta:</strong> No futebol moderno, especialistas com uma qualidade excepcional
                        têm espaço. Se "B" tem um diferencial claro (finalização, passe, 1v1), pode ter mais
                        chances no profissional. Mas precisa saber usar esse diferencial.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Perguntas Finais */}
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-500" />
                  Checklist Final de Decisão
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                    <h4 className="font-semibold text-amber-400 mb-3">Antes de decidir, pergunte:</h4>
                    <ul className="text-sm text-slate-300 space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Vi esse atleta em situações diferentes (jogo fácil e difícil)?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Estou comparando com a idade certa ou com minha expectativa?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>O contexto (time, treinador, modelo) favorece ou prejudica ele?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Estou vendo potencial ou só performance atual?</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                    <h4 className="font-semibold text-red-400 mb-3">Sinais de alerta:</h4>
                    <ul className="text-sm text-slate-300 space-y-2">
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>Só rende quando o time é superior</span>
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
                        <span>Joga só quando está bem, some quando está mal</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Frase final */}
              <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-xl p-6 border border-amber-700">
                <p className="text-lg text-amber-300 text-center">
                  <strong>"Na dúvida entre dois, escolha o que aprende mais rápido.<br/>
                  O futebol muda, e quem aprende se adapta."</strong>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
