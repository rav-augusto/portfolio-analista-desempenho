'use client'

import { useState } from 'react'
import { Badge, Card, Modal, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui'
import { RadarChart } from '@/components/charts/RadarChart'
import { Calendar, Trophy, MapPin, Play, AlertTriangle, CheckCircle } from 'lucide-react'

// Dados mockados da analise
const analiseData = {
  competicao: 'Campeonato Paranaense Sub-16',
  fase: 'Final',
  timeA: 'Time A',
  timeB: 'Time B',
  placar: '2 x 1',
  data: '15/12/2025',
  local: 'Estadio Municipal',

  ofensiva: {
    sistema: '1-4-3-3',
    observacoes: 'Equipe apresentou boa organizacao na saida de bola, com participacao ativa do goleiro.',
    construcao: 'Saida pelo chao, com laterais projetados e volante como opcao de passe.',
    criacao: 'Criacao predominante pelo lado direito, explorando velocidade do ponta.',
    finalizacoes: { total: 12, gol: 4, fora: 5, bloqueadas: 3 }
  },

  defensiva: {
    bloco: 'Medio',
    marcacao: 'Zona mista',
    observacoes: 'Bloco defensivo bem postado, com linhas proximas.',
    vulnerabilidades: 'Espaco entre linhas quando adversario invertia o jogo.'
  },

  transicoes: {
    ofensiva: 'Transicoes rapidas explorando profundidade dos pontas.',
    defensiva: 'Reacao imediata a perda, com pressao na saida adversaria.',
    contraAtaques: { total: 5, finalizados: 3, gols: 1 }
  },

  bolasParadas: {
    escanteiosOf: 'Cobrancas na primeira trave com movimentacao cruzada.',
    escanteiosDef: 'Marcacao mista com goleiro na segunda trave.',
    faltas: 'Batedor principal com boa precisao nos cruzamentos.'
  },

  jogadores: [
    {
      numero: 10,
      nome: 'Gabriel Silva',
      posicao: 'Meia',
      notas: [3.5, 4.0, 4.5, 4.0, 4.5, 4.0, 3.5, 4.5],
      pontosFortes: ['Visao de jogo', 'Finalizacao'],
      aDesenvolver: ['Marcacao', 'Jogo aereo']
    },
    {
      numero: 9,
      nome: 'Lucas Santos',
      posicao: 'Atacante',
      notas: [4.0, 4.5, 3.5, 4.0, 3.5, 4.5, 4.0, 4.0],
      pontosFortes: ['Velocidade', 'Finalizacao'],
      aDesenvolver: ['Jogo de costas', 'Primeiro toque']
    },
    {
      numero: 7,
      nome: 'Pedro Costa',
      posicao: 'Ponta',
      notas: [3.0, 4.5, 4.0, 4.5, 4.0, 4.5, 4.0, 4.0],
      pontosFortes: ['Dribles', 'Velocidade'],
      aDesenvolver: ['Finalizacao', 'Jogo aereo']
    },
  ]
}

export function AnalisesSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <section id="analises" className="py-16 bg-white">
      <div style={{ width: '100%', maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold uppercase tracking-widest text-accent mb-2">
            Portfolio
          </span>
          <h2 className="font-display text-[clamp(2rem,5vw,3rem)] tracking-wider text-dark">
            ANALISES REALIZADAS
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto mt-4">
            Exemplos de trabalhos de analise de desempenho em jogos de categorias de base.
          </p>
        </div>

        {/* Grid de analises */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Card Ativo */}
          <Card
            hover
            className="cursor-pointer group overflow-hidden"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="relative h-48 bg-gradient-dark overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Trophy className="w-16 h-16 text-accent" />
              </div>
              <Badge variant="accent" className="absolute top-4 left-4">
                Final
              </Badge>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play className="w-12 h-12 text-white" />
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-dark mb-2">
                {analiseData.competicao}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Analise completa dos 4 momentos do jogo + bolas paradas
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge size="sm">4 Momentos</Badge>
                <Badge size="sm">Bolas Paradas</Badge>
                <Badge size="sm">Individual</Badge>
              </div>
            </div>
          </Card>

          {/* Cards Placeholder */}
          {[1, 2].map(i => (
            <Card key={i} hover={false} className="opacity-60">
              <div className="relative h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 font-medium">Em Breve</span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-400 mb-2">
                  Nova Analise
                </h3>
                <p className="text-sm text-gray-400">
                  Proxima analise sera adicionada em breve
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal de Analise */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={analiseData.competicao}
        size="xl"
      >
        {/* Info do jogo */}
        <div className="bg-gray-50 p-6 border-b">
          <div className="flex flex-wrap items-center justify-center gap-4 text-center">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-accent" />
              <span className="font-medium">{analiseData.fase}</span>
            </div>
            <span className="text-2xl font-bold text-dark">{analiseData.placar}</span>
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{analiseData.data}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <MapPin className="w-4 h-4" />
              <span>{analiseData.local}</span>
            </div>
          </div>
        </div>

        {/* Tabs de conteudo */}
        <div className="p-6">
          <Tabs defaultValue="ofensiva">
            <TabsList className="mb-6">
              <TabsTrigger value="ofensiva">Org. Ofensiva</TabsTrigger>
              <TabsTrigger value="defensiva">Org. Defensiva</TabsTrigger>
              <TabsTrigger value="transicoes">Transicoes</TabsTrigger>
              <TabsTrigger value="bolasparadas">Bolas Paradas</TabsTrigger>
              <TabsTrigger value="individual">Individual</TabsTrigger>
            </TabsList>

            {/* Tab Ofensiva */}
            <TabsContent value="ofensiva" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Sistema</h4>
                  <p className="text-xl font-bold text-primary">{analiseData.ofensiva.sistema}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Observacoes</h4>
                  <p className="text-gray-700">{analiseData.ofensiva.observacoes}</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Construcao</h4>
                  <p className="text-gray-700">{analiseData.ofensiva.construcao}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Criacao</h4>
                  <p className="text-gray-700">{analiseData.ofensiva.criacao}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-primary/10 p-4 rounded-lg text-center">
                  <span className="block text-2xl font-bold text-primary">{analiseData.ofensiva.finalizacoes.total}</span>
                  <span className="text-sm text-gray-500">Total</span>
                </div>
                <div className="bg-success/10 p-4 rounded-lg text-center">
                  <span className="block text-2xl font-bold text-success">{analiseData.ofensiva.finalizacoes.gol}</span>
                  <span className="text-sm text-gray-500">No Gol</span>
                </div>
                <div className="bg-warning/10 p-4 rounded-lg text-center">
                  <span className="block text-2xl font-bold text-warning">{analiseData.ofensiva.finalizacoes.fora}</span>
                  <span className="text-sm text-gray-500">Fora</span>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <span className="block text-2xl font-bold text-gray-600">{analiseData.ofensiva.finalizacoes.bloqueadas}</span>
                  <span className="text-sm text-gray-500">Bloqueadas</span>
                </div>
              </div>
            </TabsContent>

            {/* Tab Defensiva */}
            <TabsContent value="defensiva" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Bloco Defensivo</h4>
                  <p className="text-xl font-bold text-primary">{analiseData.defensiva.bloco}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Tipo de Marcacao</h4>
                  <p className="text-xl font-bold text-primary">{analiseData.defensiva.marcacao}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Observacoes</h4>
                <p className="text-gray-700">{analiseData.defensiva.observacoes}</p>
              </div>
              <div className="bg-danger/5 border-l-4 border-danger p-4 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-danger mb-1">Vulnerabilidades</h4>
                    <p className="text-gray-700">{analiseData.defensiva.vulnerabilidades}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab Transicoes */}
            <TabsContent value="transicoes" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Transicao Ofensiva</h4>
                  <p className="text-gray-700">{analiseData.transicoes.ofensiva}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Transicao Defensiva</h4>
                  <p className="text-gray-700">{analiseData.transicoes.defensiva}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-primary/10 p-4 rounded-lg text-center">
                  <span className="block text-2xl font-bold text-primary">{analiseData.transicoes.contraAtaques.total}</span>
                  <span className="text-sm text-gray-500">Contra-ataques</span>
                </div>
                <div className="bg-accent/10 p-4 rounded-lg text-center">
                  <span className="block text-2xl font-bold text-accent">{analiseData.transicoes.contraAtaques.finalizados}</span>
                  <span className="text-sm text-gray-500">Finalizados</span>
                </div>
                <div className="bg-success/10 p-4 rounded-lg text-center">
                  <span className="block text-2xl font-bold text-success">{analiseData.transicoes.contraAtaques.gols}</span>
                  <span className="text-sm text-gray-500">Gols</span>
                </div>
              </div>
            </TabsContent>

            {/* Tab Bolas Paradas */}
            <TabsContent value="bolasparadas" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Escanteios Ofensivos</h4>
                  <p className="text-gray-700">{analiseData.bolasParadas.escanteiosOf}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Escanteios Defensivos</h4>
                  <p className="text-gray-700">{analiseData.bolasParadas.escanteiosDef}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Faltas</h4>
                  <p className="text-gray-700">{analiseData.bolasParadas.faltas}</p>
                </div>
              </div>
            </TabsContent>

            {/* Tab Individual */}
            <TabsContent value="individual">
              <div className="grid md:grid-cols-3 gap-6">
                {analiseData.jogadores.map(jogador => (
                  <Card key={jogador.numero} className="overflow-hidden">
                    <div className="bg-gradient-dark p-4 text-white">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-accent">#{jogador.numero}</span>
                        <div>
                          <h4 className="font-semibold">{jogador.nome}</h4>
                          <span className="text-sm text-gray-300">{jogador.posicao}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <RadarChart data={jogador.notas} size={180} />
                      <div className="mt-4 space-y-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">Pontos fortes: </span>
                            <span className="text-gray-500">{jogador.pontosFortes.join(', ')}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">A desenvolver: </span>
                            <span className="text-gray-500">{jogador.aDesenvolver.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Modal>
    </section>
  )
}
