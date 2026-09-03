// Coordenadas em percentual dentro do campo (x: 0=esquerda→100=direita, y: 0=ataque→100=defesa/gol).
// Pensado para campo em pé (retrato), goleiro embaixo, ataque em cima — melhor uso do espaço no celular.

export type SlotFormacao = {
  id: string
  label: string
  x: number
  y: number
}

export type Formacao = {
  id: string
  label: string
  slots: SlotFormacao[]
}

export const FORMACOES: Formacao[] = [
  {
    id: '4-3-3',
    label: '4-3-3',
    slots: [
      { id: 'gol', label: 'GOL', x: 50, y: 92 },
      { id: 'ld', label: 'LD', x: 84, y: 74 },
      { id: 'zd', label: 'ZAG', x: 62, y: 80 },
      { id: 'ze', label: 'ZAG', x: 38, y: 80 },
      { id: 'le', label: 'LE', x: 16, y: 74 },
      { id: 'vol', label: 'VOL', x: 50, y: 58 },
      { id: 'md', label: 'MC', x: 70, y: 46 },
      { id: 'me', label: 'MC', x: 30, y: 46 },
      { id: 'pd', label: 'PD', x: 80, y: 22 },
      { id: 'ca', label: 'CA', x: 50, y: 11 },
      { id: 'pe', label: 'PE', x: 20, y: 22 },
    ],
  },
  {
    id: '4-4-2',
    label: '4-4-2',
    slots: [
      { id: 'gol', label: 'GOL', x: 50, y: 92 },
      { id: 'ld', label: 'LD', x: 84, y: 74 },
      { id: 'zd', label: 'ZAG', x: 62, y: 80 },
      { id: 'ze', label: 'ZAG', x: 38, y: 80 },
      { id: 'le', label: 'LE', x: 16, y: 74 },
      { id: 'md', label: 'MD', x: 82, y: 50 },
      { id: 'mc1', label: 'MC', x: 58, y: 53 },
      { id: 'mc2', label: 'MC', x: 42, y: 53 },
      { id: 'me', label: 'ME', x: 18, y: 50 },
      { id: 'at1', label: 'ATA', x: 38, y: 15 },
      { id: 'at2', label: 'ATA', x: 62, y: 15 },
    ],
  },
  {
    id: '3-4-3',
    label: '3-4-3',
    slots: [
      { id: 'gol', label: 'GOL', x: 50, y: 92 },
      { id: 'zd', label: 'ZAG', x: 70, y: 80 },
      { id: 'zc', label: 'ZAG', x: 50, y: 83 },
      { id: 'ze', label: 'ZAG', x: 30, y: 80 },
      { id: 'ld', label: 'LD', x: 87, y: 52 },
      { id: 'mc1', label: 'MC', x: 58, y: 55 },
      { id: 'mc2', label: 'MC', x: 42, y: 55 },
      { id: 'le', label: 'LE', x: 13, y: 52 },
      { id: 'pd', label: 'PD', x: 78, y: 18 },
      { id: 'ca', label: 'CA', x: 50, y: 11 },
      { id: 'pe', label: 'PE', x: 22, y: 18 },
    ],
  },
  {
    id: '4-2-3-1',
    label: '4-2-3-1',
    slots: [
      { id: 'gol', label: 'GOL', x: 50, y: 92 },
      { id: 'ld', label: 'LD', x: 84, y: 74 },
      { id: 'zd', label: 'ZAG', x: 62, y: 80 },
      { id: 'ze', label: 'ZAG', x: 38, y: 80 },
      { id: 'le', label: 'LE', x: 16, y: 74 },
      { id: 'vol1', label: 'VOL', x: 38, y: 60 },
      { id: 'vol2', label: 'VOL', x: 62, y: 60 },
      { id: 'meid', label: 'MEI', x: 76, y: 38 },
      { id: 'meic', label: 'MEI', x: 50, y: 34 },
      { id: 'meie', label: 'MEI', x: 24, y: 38 },
      { id: 'ca', label: 'CA', x: 50, y: 11 },
    ],
  },
  {
    id: '3-5-2',
    label: '3-5-2',
    slots: [
      { id: 'gol', label: 'GOL', x: 50, y: 92 },
      { id: 'zd', label: 'ZAG', x: 70, y: 80 },
      { id: 'zc', label: 'ZAG', x: 50, y: 83 },
      { id: 'ze', label: 'ZAG', x: 30, y: 80 },
      { id: 'ld', label: 'LD', x: 90, y: 54 },
      { id: 'mc1', label: 'MC', x: 64, y: 52 },
      { id: 'mc2', label: 'MC', x: 50, y: 56 },
      { id: 'mc3', label: 'MC', x: 36, y: 52 },
      { id: 'le', label: 'LE', x: 10, y: 54 },
      { id: 'at1', label: 'ATA', x: 38, y: 15 },
      { id: 'at2', label: 'ATA', x: 62, y: 15 },
    ],
  },
]

export const getFormacao = (id: string): Formacao =>
  FORMACOES.find((f) => f.id === id) ?? FORMACOES[0]
