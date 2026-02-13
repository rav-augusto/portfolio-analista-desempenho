'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('m-ofensiva')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Navbar */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="navbar">
        <div className="nav-container">
          <a href="#home" className="nav-logo">
            <span className="logo-icon"><i className="fas fa-futbol"></i></span>
            <span className="logo-text">Augusto Nunes</span>
          </a>
          <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`} id="nav-menu">
            <li><a href="#home" className="nav-link" onClick={closeMobileMenu}>Inicio</a></li>
            <li><a href="#sobre" className="nav-link" onClick={closeMobileMenu}>Sobre</a></li>
            <li><a href="#competencias" className="nav-link" onClick={closeMobileMenu}>Competencias</a></li>
            <li><a href="#analises" className="nav-link" onClick={closeMobileMenu}>Analises</a></li>
            <li><a href="#metodologia" className="nav-link" onClick={closeMobileMenu}>Metodologia</a></li>
            <li><a href="#contato" className="nav-link" onClick={closeMobileMenu}>Contato</a></li>
          </ul>
          <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`} id="hamburger" onClick={toggleMobileMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-bg">
          <div className="hero-overlay"></div>
          <div className="field-lines"></div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-line">ANALISTA DE</span>
            <span className="title-line accent-text">DESEMPENHO</span>
          </h1>
          <p className="hero-subtitle">Transformando dados em vantagem competitiva para categorias de base</p>
          <div className="hero-cta">
            <a href="#analises" className="btn btn-primary">
              <i className="fas fa-chart-line"></i>
              Ver Analises
            </a>
            <a href="#contato" className="btn btn-secondary">
              <i className="fas fa-envelope"></i>
              Contato
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">4</span>
              <span className="stat-label">Momentos do Jogo</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">8</span>
              <span className="stat-label">Dimensoes CBF</span>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <i className="fas fa-chevron-down"></i>
        </div>
      </section>

      {/* Sobre Section */}
      <section className="section sobre" id="sobre">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Quem sou</span>
            <h2 className="section-title">Sobre Mim</h2>
          </div>
          <div className="sobre-grid">
            <div className="sobre-content">
              <div className="sobre-text">
                <p className="lead">Analista de Desempenho formado pela <strong>Confederacao Brasileira de Futebol</strong>, com foco especializado em categorias de base.</p>
                <p>Minha paixao pelo futebol vai alem das quatro linhas. Acredito que a analise de desempenho e fundamental para o desenvolvimento de jovens atletas, identificando talentos e potencializando suas caracteristicas individuais para o sucesso coletivo.</p>
              </div>
              <div className="sobre-highlights">
                <div className="highlight-item">
                  <i className="fas fa-graduation-cap"></i>
                  <div>
                    <h4>Formacao CBF</h4>
                    <p>Licenca B - Analise de Desempenho (2025)</p>
                  </div>
                </div>
                <div className="highlight-item">
                  <i className="fas fa-users"></i>
                  <div>
                    <h4>Foco</h4>
                    <p>Categorias de Base (Sub-12 a Sub-17)</p>
                  </div>
                </div>
                <div className="highlight-item">
                  <i className="fas fa-bullseye"></i>
                  <div>
                    <h4>Objetivo</h4>
                    <p>Desenvolvimento integral do atleta</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="sobre-image">
              <div className="image-frame">
                <Image
                  src="/images/foto-augusto.jpg.png"
                  alt="Augusto Nunes - Analista de Desempenho"
                  width={300}
                  height={400}
                  className="profile-photo"
                />
              </div>
              <div className="cbf-badge">
                <div className="cbf-icon"><i className="fas fa-award"></i></div>
                <span>Certificado CBF</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competencias Section */}
      <section className="section competencias" id="competencias">
        <div className="container">
          <div className="section-header light">
            <span className="section-tag">Habilidades</span>
            <h2 className="section-title">Competencias Tecnicas</h2>
          </div>

          <div className="competencias-grid">
            {/* Ferramentas */}
            <div className="competencia-card">
              <div className="card-icon">
                <i className="fas fa-tools"></i>
              </div>
              <h3>Ferramentas</h3>
              <ul className="tool-list">
                <li>
                  <span className="tool-name">OBS Studio</span>
                  <div className="skill-bar"><div className="skill-fill" style={{ width: '90%' }}></div></div>
                </li>
                <li>
                  <span className="tool-name">LongoMatch</span>
                  <div className="skill-bar"><div className="skill-fill" style={{ width: '75%' }}></div></div>
                </li>
                <li>
                  <span className="tool-name">DaVinci Resolve</span>
                  <div className="skill-bar"><div className="skill-fill" style={{ width: '70%' }}></div></div>
                </li>
                <li>
                  <span className="tool-name">Tactical-Board</span>
                  <div className="skill-bar"><div className="skill-fill" style={{ width: '85%' }}></div></div>
                </li>
                <li>
                  <span className="tool-name">Excel/Planilhas</span>
                  <div className="skill-bar"><div className="skill-fill" style={{ width: '95%' }}></div></div>
                </li>
              </ul>
            </div>

            {/* Analise de Jogo */}
            <div className="competencia-card featured">
              <div className="card-icon">
                <i className="fas fa-chess-board"></i>
              </div>
              <h3>Analise de Jogo</h3>
              <div className="moments-grid">
                <div className="moment-item">
                  <i className="fas fa-arrow-up"></i>
                  <span>Org. Ofensiva</span>
                </div>
                <div className="moment-item">
                  <i className="fas fa-shield-alt"></i>
                  <span>Org. Defensiva</span>
                </div>
                <div className="moment-item">
                  <i className="fas fa-exchange-alt"></i>
                  <span>Transicao Ofensiva</span>
                </div>
                <div className="moment-item">
                  <i className="fas fa-exchange-alt fa-flip-horizontal"></i>
                  <span>Transicao Defensiva</span>
                </div>
                <div className="moment-item full">
                  <i className="fas fa-flag"></i>
                  <span>Bolas Paradas</span>
                </div>
              </div>
            </div>

            {/* Metodologias */}
            <div className="competencia-card">
              <div className="card-icon">
                <i className="fas fa-book"></i>
              </div>
              <h3>Metodologias</h3>
              <div className="metodologia-list">
                <div className="metodologia-item">
                  <h4>Metodo PRAIA</h4>
                  <p>Planejar, Registrar, Analisar, Informar, Armazenar</p>
                </div>
                <div className="metodologia-item">
                  <h4>Sistema CBF</h4>
                  <p>8 dimensoes de observacao padronizadas</p>
                </div>
                <div className="metodologia-item">
                  <h4>PDI</h4>
                  <p>Plano de Desenvolvimento Individual</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dimensoes CBF */}
          <div className="dimensoes-section">
            <h3 className="subsection-title">Sistema de Observacao CBF - 8 Dimensoes</h3>
            <div className="dimensoes-grid">
              <div className="dimensao-card">
                <i className="fas fa-dumbbell"></i>
                <span>Forca</span>
              </div>
              <div className="dimensao-card">
                <i className="fas fa-bolt"></i>
                <span>Velocidade</span>
              </div>
              <div className="dimensao-card">
                <i className="fas fa-hands"></i>
                <span>Tecnica</span>
              </div>
              <div className="dimensao-card">
                <i className="fas fa-running"></i>
                <span>Dinamica</span>
              </div>
              <div className="dimensao-card">
                <i className="fas fa-brain"></i>
                <span>Inteligencia</span>
              </div>
              <div className="dimensao-card">
                <i className="fas fa-user-shield"></i>
                <span>1x1</span>
              </div>
              <div className="dimensao-card">
                <i className="fas fa-fire"></i>
                <span>Atitude</span>
              </div>
              <div className="dimensao-card">
                <i className="fas fa-star"></i>
                <span>Potencial</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analises Section */}
      <section className="section analises" id="analises">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Meu Trabalho</span>
            <h2 className="section-title">Analises Realizadas</h2>
            <p className="section-description">Confira alguns dos trabalhos de analise que realizei, demonstrando minha capacidade tecnica e metodologia de trabalho.</p>
          </div>

          <div className="analises-grid">
            {/* Analise 1 - Final Sub-16 Paranaense */}
            <div className="analise-card" onClick={() => setIsModalOpen(true)}>
              <div className="analise-image">
                <div className="analise-overlay">
                  <i className="fas fa-search-plus"></i>
                  <span>Ver Analise Completa</span>
                </div>
                <div className="analise-placeholder">
                  <i className="fas fa-futbol"></i>
                </div>
              </div>
              <div className="analise-content">
                <div className="analise-badge">
                  <i className="fas fa-trophy"></i>
                  <span>Final</span>
                </div>
                <h3>Campeonato Paranaense Sub-16</h3>
                <p className="analise-desc">Analise tecnico-tatica completa da final do campeonato estadual, incluindo os 4 momentos do jogo, bolas paradas e analise individual de destaques.</p>
                <div className="analise-meta">
                  <span><i className="fas fa-calendar"></i> 2025</span>
                  <span><i className="fas fa-users"></i> Sub-16</span>
                  <span><i className="fas fa-chart-bar"></i> Completa</span>
                </div>
                <div className="analise-tags">
                  <span className="tag">4 Momentos</span>
                  <span className="tag">Bolas Paradas</span>
                  <span className="tag">Individual</span>
                </div>
              </div>
            </div>

            {/* Analise 2 - Placeholder */}
            <div className="analise-card placeholder-card">
              <div className="analise-image">
                <div className="analise-placeholder empty">
                  <i className="fas fa-plus"></i>
                  <span>Em Breve</span>
                </div>
              </div>
              <div className="analise-content">
                <h3>Proxima Analise</h3>
                <p className="analise-desc">Novos trabalhos de analise serao adicionados conforme forem realizados durante o periodo de formacao e TCL.</p>
              </div>
            </div>

            {/* Analise 3 - Placeholder */}
            <div className="analise-card placeholder-card">
              <div className="analise-image">
                <div className="analise-placeholder empty">
                  <i className="fas fa-plus"></i>
                  <span>Em Breve</span>
                </div>
              </div>
              <div className="analise-content">
                <h3>Proxima Analise</h3>
                <p className="analise-desc">Espaco reservado para futuras analises de jogos, treinos ou scouting de adversarios.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de Analise Detalhada */}
      <div className={`modal ${isModalOpen ? 'active' : ''}`} id="analiseModal">
        <div className="modal-content">
          <button className="modal-close" onClick={() => setIsModalOpen(false)}>
            <i className="fas fa-times"></i>
          </button>

          <div className="modal-header">
            <div className="modal-badge">
              <i className="fas fa-trophy"></i>
              Campeonato Paranaense Sub-16 - FINAL
            </div>
            <h2>Analise Tecnico-Tatica</h2>
          </div>

          <div className="modal-body">
            {/* Match Info */}
            <div className="match-card-modal">
              <div className="match-teams">
                <div className="team">
                  <div className="team-logo"><i className="fas fa-shield-alt"></i></div>
                  <span>[Time A]</span>
                </div>
                <div className="match-result">
                  <span className="score">[X] x [X]</span>
                  <span className="match-date"><i className="fas fa-calendar"></i> [Data]</span>
                </div>
                <div className="team">
                  <div className="team-logo"><i className="fas fa-shield-alt"></i></div>
                  <span>[Time B]</span>
                </div>
              </div>
            </div>

            {/* Tabs da Analise */}
            <div className="modal-tabs">
              <button className={`modal-tab ${activeTab === 'm-ofensiva' ? 'active' : ''}`} onClick={() => setActiveTab('m-ofensiva')}>Org. Ofensiva</button>
              <button className={`modal-tab ${activeTab === 'm-defensiva' ? 'active' : ''}`} onClick={() => setActiveTab('m-defensiva')}>Org. Defensiva</button>
              <button className={`modal-tab ${activeTab === 'm-transicoes' ? 'active' : ''}`} onClick={() => setActiveTab('m-transicoes')}>Transicoes</button>
              <button className={`modal-tab ${activeTab === 'm-bolas' ? 'active' : ''}`} onClick={() => setActiveTab('m-bolas')}>Bolas Paradas</button>
              <button className={`modal-tab ${activeTab === 'm-individual' ? 'active' : ''}`} onClick={() => setActiveTab('m-individual')}>Individual</button>
            </div>

            <div className="modal-tab-content">
              {/* Organizacao Ofensiva */}
              <div className={`modal-pane ${activeTab === 'm-ofensiva' ? 'active' : ''}`} id="m-ofensiva">
                <div className="analysis-section">
                  <h4><i className="fas fa-chess-board"></i> Sistema de Jogo</h4>
                  <p className="system-display">[Ex: 1-4-3-3]</p>
                  <p>[Descricao das caracteristicas do sistema tatico utilizado]</p>
                </div>
                <div className="analysis-grid-modal">
                  <div className="analysis-box">
                    <h5>Construcao de Jogo</h5>
                    <ul>
                      <li><strong>Saida de bola:</strong> [Descricao]</li>
                      <li><strong>Participacao GK:</strong> [Descricao]</li>
                      <li><strong>Linhas de passe:</strong> [Descricao]</li>
                      <li><strong>Amplitude:</strong> [Descricao]</li>
                    </ul>
                  </div>
                  <div className="analysis-box">
                    <h5>Criacao de Chances</h5>
                    <ul>
                      <li><strong>Corredor central:</strong> [Descricao]</li>
                      <li><strong>Corredor direito:</strong> [Descricao]</li>
                      <li><strong>Corredor esquerdo:</strong> [Descricao]</li>
                    </ul>
                  </div>
                  <div className="analysis-box stats">
                    <h5>Estatisticas</h5>
                    <div className="stat-row">
                      <span>Finalizacoes totais</span>
                      <span className="stat-value">[X]</span>
                    </div>
                    <div className="stat-row">
                      <span>Finalizacoes no gol</span>
                      <span className="stat-value">[X]</span>
                    </div>
                    <div className="stat-row">
                      <span>Finalizacoes fora</span>
                      <span className="stat-value">[X]</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Organizacao Defensiva */}
              <div className={`modal-pane ${activeTab === 'm-defensiva' ? 'active' : ''}`} id="m-defensiva">
                <div className="analysis-grid-modal">
                  <div className="analysis-box">
                    <h5>Bloco Defensivo</h5>
                    <p className="system-display">[Alto/Medio/Baixo]</p>
                    <ul>
                      <li><strong>Compactacao:</strong> [Descricao]</li>
                      <li><strong>Referencia:</strong> [Bola/Homem/Mista]</li>
                    </ul>
                  </div>
                  <div className="analysis-box">
                    <h5>Tipo de Marcacao</h5>
                    <ul>
                      <li><strong>Marcacao:</strong> [Individual/Zona/Mista]</li>
                      <li><strong>Pressao:</strong> [Intensa/Moderada/Passiva]</li>
                      <li><strong>Coberturas:</strong> [Descricao]</li>
                      <li><strong>Linha defensiva:</strong> [Descricao]</li>
                    </ul>
                  </div>
                  <div className="analysis-box warning">
                    <h5>Vulnerabilidades</h5>
                    <ul>
                      <li>[Vulnerabilidade 1]</li>
                      <li>[Vulnerabilidade 2]</li>
                      <li>[Vulnerabilidade 3]</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Transicoes */}
              <div className={`modal-pane ${activeTab === 'm-transicoes' ? 'active' : ''}`} id="m-transicoes">
                <div className="transitions-grid">
                  <div className="transition-box offensive">
                    <h5><i className="fas fa-bolt"></i> Transicao Ofensiva</h5>
                    <ul>
                      <li><strong>Reacao ao ganho:</strong> [Descricao]</li>
                      <li><strong>Primeira acao:</strong> [Vertical/Seguranca]</li>
                      <li><strong>Velocidade:</strong> [Rapida/Lenta]</li>
                      <li><strong>Jogadores envolvidos:</strong> [Quantos sobem?]</li>
                    </ul>
                    <div className="mini-stats">
                      <div><span>[X]</span> Contra-ataques</div>
                      <div><span>[X]</span> Finalizados</div>
                      <div><span>[X]</span> Gols</div>
                    </div>
                  </div>
                  <div className="transition-box defensive">
                    <h5><i className="fas fa-hand-paper"></i> Transicao Defensiva</h5>
                    <ul>
                      <li><strong>Reacao a perda:</strong> [Descricao]</li>
                      <li><strong>Comportamento:</strong> [Pressao alta/Recuo]</li>
                      <li><strong>Tempo de reacao:</strong> [Imediato/Lento]</li>
                      <li><strong>Linhas de marcacao:</strong> [Compactas/Espacadas]</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bolas Paradas */}
              <div className={`modal-pane ${activeTab === 'm-bolas' ? 'active' : ''}`} id="m-bolas">
                <div className="setpieces-grid">
                  <div className="setpiece-box">
                    <h5><i className="fas fa-flag"></i> Escanteios Ofensivos</h5>
                    <ul>
                      <li><strong>Cobrador:</strong> [Jogador - Pe]</li>
                      <li><strong>Tipo:</strong> [1o pau/2o pau/Curto]</li>
                      <li><strong>Movimentacoes:</strong> [Descricao]</li>
                    </ul>
                  </div>
                  <div className="setpiece-box">
                    <h5><i className="fas fa-shield-alt"></i> Escanteios Defensivos</h5>
                    <ul>
                      <li><strong>Marcacao:</strong> [Individual/Zona/Mista]</li>
                      <li><strong>Posicao GK:</strong> [Descricao]</li>
                      <li><strong>Jogador 1o pau:</strong> [Numero]</li>
                      <li><strong>Jogador 2o pau:</strong> [Numero]</li>
                    </ul>
                  </div>
                  <div className="setpiece-box">
                    <h5><i className="fas fa-futbol"></i> Faltas e Penaltis</h5>
                    <ul>
                      <li><strong>Cobrador principal:</strong> [Jogador]</li>
                      <li><strong>Caracteristicas:</strong> [Descricao]</li>
                      <li><strong>Padroes:</strong> [Descricao]</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Analise Individual */}
              <div className={`modal-pane ${activeTab === 'm-individual' ? 'active' : ''}`} id="m-individual">
                <div className="players-grid-modal">
                  {/* Jogador 1 */}
                  <div className="player-card-modal">
                    <div className="player-header-modal">
                      <div className="player-number">[XX]</div>
                      <div>
                        <h5>[Nome do Jogador]</h5>
                        <span className="position">[Posicao]</span>
                      </div>
                    </div>
                    <div className="player-radar-modal">
                      <canvas id="modal-radar1" width="180" height="180"></canvas>
                    </div>
                    <div className="player-evaluation">
                      <div className="eval-item positive">
                        <strong>Pontos Fortes:</strong>
                        <span>[Descricao]</span>
                      </div>
                      <div className="eval-item negative">
                        <strong>A Desenvolver:</strong>
                        <span>[Descricao]</span>
                      </div>
                    </div>
                  </div>

                  {/* Jogador 2 */}
                  <div className="player-card-modal">
                    <div className="player-header-modal">
                      <div className="player-number">[XX]</div>
                      <div>
                        <h5>[Nome do Jogador]</h5>
                        <span className="position">[Posicao]</span>
                      </div>
                    </div>
                    <div className="player-radar-modal">
                      <canvas id="modal-radar2" width="180" height="180"></canvas>
                    </div>
                    <div className="player-evaluation">
                      <div className="eval-item positive">
                        <strong>Pontos Fortes:</strong>
                        <span>[Descricao]</span>
                      </div>
                      <div className="eval-item negative">
                        <strong>A Desenvolver:</strong>
                        <span>[Descricao]</span>
                      </div>
                    </div>
                  </div>

                  {/* Jogador 3 */}
                  <div className="player-card-modal">
                    <div className="player-header-modal">
                      <div className="player-number">[XX]</div>
                      <div>
                        <h5>[Nome do Jogador]</h5>
                        <span className="position">[Posicao]</span>
                      </div>
                    </div>
                    <div className="player-radar-modal">
                      <canvas id="modal-radar3" width="180" height="180"></canvas>
                    </div>
                    <div className="player-evaluation">
                      <div className="eval-item positive">
                        <strong>Pontos Fortes:</strong>
                        <span>[Descricao]</span>
                      </div>
                      <div className="eval-item negative">
                        <strong>A Desenvolver:</strong>
                        <span>[Descricao]</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metodologia Section */}
      <section className="section metodologia" id="metodologia">
        <div className="container">
          <div className="section-header light">
            <span className="section-tag">Como Trabalho</span>
            <h2 className="section-title">Metodologia PRAIA</h2>
          </div>

          <div className="metodologia-timeline">
            <div className="timeline-item">
              <div className="timeline-icon">
                <span>P</span>
              </div>
              <div className="timeline-content">
                <h3>Planejar</h3>
                <p>Definicao de objetivos, metricas e aspectos a serem observados antes de cada jogo ou treino.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon">
                <span>R</span>
              </div>
              <div className="timeline-content">
                <h3>Registrar</h3>
                <p>Captacao de video com equipamentos adequados e anotacoes em tempo real dos eventos relevantes.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon">
                <span>A</span>
              </div>
              <div className="timeline-content">
                <h3>Analisar</h3>
                <p>Revisao detalhada do material, identificacao de padroes, pontos fortes e aspectos a melhorar.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon">
                <span>I</span>
              </div>
              <div className="timeline-content">
                <h3>Informar</h3>
                <p>Criacao de relatorios em video e apresentacoes para comissao tecnica e atletas.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon">
                <span>A</span>
              </div>
              <div className="timeline-content">
                <h3>Armazenar</h3>
                <p>Organizacao e backup de todo material para consultas futuras e acompanhamento de evolucao.</p>
              </div>
            </div>
          </div>

          {/* O que posso oferecer */}
          <div className="ofertas-section">
            <h3 className="subsection-title">O que posso oferecer ao seu clube</h3>
            <div className="ofertas-grid">
              <div className="oferta-card">
                <div className="oferta-icon">
                  <i className="fas fa-binoculars"></i>
                </div>
                <h4>Analise de Adversarios</h4>
                <p>Relatorios em video com padroes taticos, pontos fortes e vulnerabilidades (3-5 jogos)</p>
              </div>
              <div className="oferta-card">
                <div className="oferta-icon">
                  <i className="fas fa-video"></i>
                </div>
                <h4>Filmagem de Treinos</h4>
                <p>Registro e organizacao de sessoes para analise posterior e arquivo historico</p>
              </div>
              <div className="oferta-card">
                <div className="oferta-icon">
                  <i className="fas fa-user-graduate"></i>
                </div>
                <h4>Feedback Individual</h4>
                <p>Compilados personalizados por atleta para acelerar a evolucao tecnico-tatica</p>
              </div>
              <div className="oferta-card">
                <div className="oferta-icon">
                  <i className="fas fa-chalkboard-teacher"></i>
                </div>
                <h4>Suporte Tatico</h4>
                <p>Pranchas taticas e cortes de video para prelecoes e reunioes tecnicas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contato Section */}
      <section className="section contato" id="contato">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Vamos conversar</span>
            <h2 className="section-title">Entre em Contato</h2>
          </div>

          <div className="contato-grid">
            <div className="contato-info">
              <h3>Vamos trabalhar juntos</h3>
              <p>Estou disponivel para novos projetos de analise de desempenho, com flexibilidade de horarios para atender as necessidades do seu clube.</p>

              <div className="contato-items">
                <div className="contato-item">
                  <i className="fas fa-envelope"></i>
                  <div>
                    <span className="label">Email</span>
                    <a href="mailto:rav.augusto@gmail.com">rav.augusto@gmail.com</a>
                  </div>
                </div>
                <div className="contato-item">
                  <i className="fas fa-phone"></i>
                  <div>
                    <span className="label">Telefone</span>
                    <a href="tel:+5543991127447">(43) 9 9112-7447</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="contato-cta">
              <div className="cta-card">
                <i className="fas fa-futbol"></i>
                <h3>Pronto para contribuir!</h3>
                <p>Busco uma oportunidade de aprendizado e contribuicao mutua. Vamos transformar dados em resultados juntos.</p>
                <a href="mailto:rav.augusto@gmail.com" className="btn btn-primary btn-lg">
                  <i className="fas fa-paper-plane"></i>
                  Enviar Mensagem
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <span className="logo-icon"><i className="fas fa-futbol"></i></span>
              <span className="logo-text">Augusto Nunes</span>
            </div>
            <p className="footer-text">Analista de Desempenho | Categorias de Base</p>
            <p className="footer-quote">&quot;Coletar, Analisar, Filtrar, Gerar Conhecimento e Aplicar&quot;</p>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 - Todos os direitos reservados</p>
          </div>
        </div>
      </footer>
    </>
  )
}
