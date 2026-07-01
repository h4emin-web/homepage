import React, { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from './supabase'
import DataTable from './components/DataTable'
import AddRowModal from './components/AddRowModal'
import DailyLog from './components/DailyLog'
import EnglishTutor from './components/EnglishTutor'

export const CUSTOMER_SALESPERSON = {}
export const CATEGORIES = ['원료 수입', '샘플 테스팅']

const ALL_TABS = [...CATEGORIES, '업무일지', 'AI 전화영어']

const SITE_NAV_ITEMS = ['회사소개', '제품소개', '연구개발', '투자정보', '파트너', '인재채용', '지속가능경영']
const LANGUAGES = ['한국어', 'English', '中文(简)', '中文(繁)']

const NAV_MENU_GROUPS = [
  {
    title: '회사소개',
    columns: [{ heading: '회사소개', items: ['회사 현황', '경영진 인사말', '연혁', '조직도', '오시는 길'] }],
  },
  {
    title: '제품소개',
    columns: [{ heading: '제품소개', items: ['KDMF APIs', 'Excipients(품목신고)', '식품 원료', '화장품 원료', '도매원료'] }],
  },
  {
    title: '연구개발',
    columns: [{ heading: '연구개발', items: ['연구소 비전', '주요 연구성과', '특허 상황'] }],
  },
  {
    title: '투자정보',
    columns: [{ heading: '투자정보', items: ['실적 리포트', '비전&미션'] }],
  },
  {
    title: '파트너',
    columns: [{ heading: '파트너', items: ['국내 파트너사', '해외 파트너사', '관련 사이트'] }],
  },
  {
    title: '인재채용',
    columns: [{ heading: '인재채용', items: ['인재상', '채용공고', '채용절차', '직무소개', '복리후생'] }],
  },
  {
    title: '지속가능경영',
    columns: [{ heading: '지속가능경영', items: ['개인정보처리방침', '윤리경영', '협력사 지원'] }],
  },
]

const FULL_MENU_COLUMNS = [
  {
    title: '회사소개',
    items: ['회사 현황', '경영진 인사말', '연혁', '조직도', '오시는 길'],
  },
  {
    title: '제품소개',
    items: ['KDMF APIs', 'Excipients(품목신고)', '식품 원료', '화장품 원료', '도매원료'],
  },
  {
    title: '연구개발',
    items: ['연구소 비전', '주요 연구성과', '특허 상황'],
  },
  {
    title: '투자정보',
    items: ['실적 리포트', '비전&미션'],
  },
  {
    title: '파트너',
    items: ['국내 파트너사', '해외 파트너사', '관련 사이트'],
  },
  {
    title: '인재채용',
    items: ['인재상', '채용공고', '채용절차', '직무소개', '복리후생'],
  },
  {
    title: '지속가능경영',
    items: ['개인정보처리방침', '윤리경영', '협력사 지원'],
  },
]

const PRODUCT_GROUPS = [
  {
    eyebrow: 'DMF / Excipients',
    title: '원료의약품',
    description: 'KDMF APIs, 부형제, 중간체를 중심으로 제조사와 고객사의 요구 조건을 빠르게 연결합니다.',
    tone: 'blue',
    actions: [
      { label: 'KDMF APIs', tab: '원료 수입' },
      { label: 'Excipients', tab: '원료 수입' },
      { label: '도매원료', tab: '원료 수입' },
    ],
  },
  {
    eyebrow: 'Food / Cosmetic',
    title: '식품 · 화장품 원료',
    description: '건강기능식품, 식품 첨가물, 화장품 원료까지 카테고리별 제품 검토를 한 화면에서 시작합니다.',
    tone: 'green',
    actions: [
      { label: '식품 원료', tab: '샘플 테스팅' },
      { label: '화장품 원료', tab: '샘플 테스팅' },
    ],
  },
]

const HERO_MESSAGE_LINES = ['더 건강한 미래를 만듭니다', '고객 감동을 실현하는', '에이스바이오팜']

const FOOTER_NAV_GROUPS = [
  {
    title: '회사소개',
    items: ['회사 현황', '경영진 인사말', '연혁', '조직도', '오시는 길'],
  },
  {
    title: '제품소개',
    items: ['KDMF APIs', 'Excipients(품목신고)', '식품 원료', '화장품 원료', '도매원료'],
  },
  {
    title: '연구개발',
    items: ['연구소 비전', '주요 연구성과', '특허 상황'],
  },
  {
    title: '투자정보',
    items: ['실적 리포트', '비전&미션'],
  },
  {
    title: '파트너',
    items: ['국내 파트너사', '해외 파트너사', '관련 사이트'],
  },
  {
    title: '인재채용',
    items: ['인재상', '채용공고', '채용절차', '직무소개', '복리후생'],
  },
  {
    title: '지속가능경영',
    items: ['개인정보처리방침', '윤리경영', '협력사 지원'],
  },
]

function HomeLanding({ onEnterManagement }) {
  const scrollRef = useRef(null)
  const videoRef = useRef(null)
  const [heroCycleDuration, setHeroCycleDuration] = useState(10.4)
  const [heroAnimationKey, setHeroAnimationKey] = useState(0)
  const [solutionProgress, setSolutionProgress] = useState(0)
  const [solutionLocked, setSolutionLocked] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [siteSearch, setSiteSearch] = useState('')
  const [hoveredNav, setHoveredNav] = useState(null)

  const openFullMenu = () => {
    setHoveredNav(null)
    setLanguageOpen(false)
    setSearchOpen(false)
    setMenuOpen(true)
  }

  const toggleLanguage = () => {
    setHoveredNav(null)
    setSearchOpen(false)
    setMenuOpen(false)
    setLanguageOpen((open) => !open)
  }

  const openSearch = () => {
    setHoveredNav(null)
    setLanguageOpen(false)
    setMenuOpen(false)
    setSearchOpen(true)
  }

  const closeSearch = () => {
    setSearchOpen(false)
    setSiteSearch('')
  }

  const syncHeroVideoTiming = (event) => {
    const video = event.currentTarget
    const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 10.4
    setHeroCycleDuration(duration)
    video.currentTime = 0
    setHeroAnimationKey((key) => key + 1)
    video.play().catch(() => {})
  }

  useEffect(() => {
    const scroller = scrollRef.current
    if (!scroller) return

    const handleScroll = () => {
      const start = scroller.clientHeight * 0.92
      const distance = scroller.clientHeight * 0.58
      const progress = Math.max(0, Math.min(1, (scroller.scrollTop - start) / distance))
      setSolutionProgress(progress)
      if (progress > 0.72) {
        setSolutionLocked(true)
      }
    }

    handleScroll()
    scroller.addEventListener('scroll', handleScroll, { passive: true })
    return () => scroller.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToProducts = () => {
    const scroller = scrollRef.current
    if (!scroller) return
    scroller.scrollTo({ top: scroller.clientHeight * 1.08, behavior: 'smooth' })
  }

  const effectiveProgress = solutionLocked ? 1 : solutionProgress
  const headlineScale = 1 + effectiveProgress * (scrollRef.current?.clientWidth < 600 ? 0.54 : 2.12)
  const headlineOpacity = solutionLocked ? 0 : Math.max(0, 1 - Math.max(0, effectiveProgress - 0.48) / 0.32)
  const panelProgress = solutionLocked ? 1 : Math.max(0, Math.min(1, (effectiveProgress - 0.42) / 0.42))
  const hoveredMenu = NAV_MENU_GROUPS.find((group) => group.title === hoveredNav)

  return (
    <main className="home-shell" ref={scrollRef}>
      <header className="home-nav" onMouseLeave={() => setHoveredNav(null)}>
        <button className="home-logo" onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src="/acebiopharm-ci.png" alt="Ace BioPharm" />
        </button>
        <nav className="home-nav-links" aria-label="주요 메뉴">
          {SITE_NAV_ITEMS.map((item) => {
            const menu = NAV_MENU_GROUPS.find((group) => group.title === item)
            return (
              <div
                className="home-nav-item"
                key={item}
                onMouseEnter={() => {
                  setLanguageOpen(false)
                  setSearchOpen(false)
                  setMenuOpen(false)
                  setHoveredNav(item)
                }}
              >
                <button className={hoveredNav === item ? 'active' : ''} onFocus={() => setHoveredNav(item)}>
                  {item}
                </button>
                {hoveredNav === item && menu && (
                  <div className="nav-mega-panel">
                    <div className="nav-mega-inner" style={{ '--mega-columns': Math.min(menu.columns.length, 4) }}>
                      {menu.columns.map((column) => (
                        <section className="nav-mega-column" key={`${menu.title}-${column.heading}`}>
                          <h3>{column.heading}</h3>
                          <ul>
                            {column.items.map((subItem) => (
                              <li key={subItem}>
                                <button>{subItem}</button>
                              </li>
                            ))}
                          </ul>
                        </section>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </nav>
        <div className="home-nav-tools" aria-label="도구 메뉴">
          <button className="nav-icon globe" aria-label="언어 선택" onClick={toggleLanguage}>
            <span />
          </button>
          {languageOpen && (
            <div className="language-popover" role="menu">
              {LANGUAGES.map((language) => (
                <button key={language} role="menuitem" onClick={() => setLanguageOpen(false)}>
                  {language}
                </button>
              ))}
            </div>
          )}
          <button className="nav-icon search" aria-label="검색" onClick={openSearch}>
            <span />
          </button>
          <button className="nav-icon menu" aria-label="전체 메뉴" onClick={openFullMenu}>
            <span />
            <span />
            <span />
          </button>
        </div>
        {hoveredMenu && <div className="nav-mega-band" />}
      </header>

      {searchOpen && (
        <div className="search-overlay" role="search">
          <div className="search-overlay-inner">
            <label className="site-search-box">
              <input
                value={siteSearch}
                onChange={(event) => setSiteSearch(event.target.value)}
                placeholder="검색어를 입력하세요."
                autoFocus
              />
              <button type="button" className="site-search-submit" aria-label="검색 실행">
                <span />
              </button>
            </label>
            <button className="search-close-btn" onClick={closeSearch} aria-label="검색 닫기" />
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="full-menu-overlay" aria-modal="true" role="dialog" aria-label="전체 메뉴">
          <div className="full-menu-panel">
            <div className="full-menu-grid">
              {FULL_MENU_COLUMNS.map((column) => (
                <section className="full-menu-column" key={column.title}>
                  <h2>{column.title}</h2>
                  <ul className="full-menu-list">
                    {column.items.map((item) => (
                      <li key={item}>
                        <button>{item}</button>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
              <button className="full-menu-close" onClick={() => setMenuOpen(false)} aria-label="전체 메뉴 닫기" />
            </div>
          </div>
        </div>
      )}

      <section
        className="home-hero"
        style={{
          '--hero-cycle-duration': `${heroCycleDuration}s`,
          '--hero-line-gap': `${heroCycleDuration / HERO_MESSAGE_LINES.length}s`,
        }}
      >
        <video
          ref={videoRef}
          className="home-hero-video"
          src="/hero-video.mp4"
          muted
          playsInline
          autoPlay
          loop
          preload="auto"
          onLoadedMetadata={syncHeroVideoTiming}
          aria-label="Ace Bio Pharm background video"
        />
        <div className="home-hero-shade" />
        <div className="home-hero-message" aria-label="더 건강한 미래를 만듭니다. 고객 감동을 실현하는 에이스바이오팜">
          {HERO_MESSAGE_LINES.map((line, lineIndex) => (
            <p
              className="home-hero-message-line"
              key={`${heroAnimationKey}-${line}`}
              style={{ '--line-index': lineIndex }}
            >
              {line.split(' ').map((word, wordIndex) => (
                <span
                  className="home-hero-word"
                  key={`${line}-${word}`}
                  style={{ '--word-index': wordIndex }}
                >
                  {word}
                </span>
              ))}
            </p>
          ))}
        </div>
        <button className="home-scroll-hint" onClick={scrollToProducts} aria-label="제품소개 섹션으로 이동">
          <span />
        </button>
      </section>

      <section
        className="solution-section"
        style={{
          '--headline-scale': headlineScale,
          '--headline-opacity': headlineOpacity,
          '--panel-progress': panelProgress,
        }}
      >
        <div className="solution-copy" aria-label="We have the solution you need">
          <p className="solution-kicker">What we do</p>
          <h2>
            <span>We have the solution you need</span>
          </h2>
        </div>

        <div className="product-split" aria-label="제품소개">
          {PRODUCT_GROUPS.map((group) => (
            <article className={`product-panel ${group.tone}`} key={group.title}>
              <p>{group.eyebrow}</p>
              <h3>{group.title}</h3>
              <span>{group.description}</span>
              <div className="product-actions">
                {group.actions.map((action) => (
                  <button key={action.label} onClick={() => onEnterManagement(action.tab)}>
                    {action.label}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="home-footer">
        <div className="home-footer-menu">
          <div className="home-footer-menu-inner">
            {FOOTER_NAV_GROUPS.map((group) => (
              <section className="home-footer-column" key={group.title}>
                <h2>{group.title}</h2>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>
                      <button>{item}</button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
        <div className="home-footer-info">
          <div className="home-footer-info-inner">
            <div className="home-footer-copy">
              <button className="privacy-link">개인정보처리방침</button>
              <p>[06664] 서울 서초구 방배로20길 5 서명빌딩</p>
              <p>대표 : 민병규 / TEL : 02-579-1056 / FAX : 02-6008-3356 / E-mail : ace@acebiopharm.com</p>
              <p>Copyright © 2010 ABP company. All Rights Reserved.</p>
            </div>
            <div className="home-footer-badges" aria-label="인증 및 브랜드">
              <img src="/footer-cert-marks.png" alt="벤처확인기업, Hi Seoul, Ace BioPharm" />
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default function App() {
  const [showHome, setShowHome] = useState(true)
  const [activeTab, setActiveTab] = useState('원료 수입')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [search, setSearch] = useState('')

  const isLogTab = activeTab === '업무일지'
  const isEnglishTab = activeTab === 'AI 전화영어'

  const enterManagement = (tab = '원료 수입') => {
    setActiveTab(tab)
    setSearch('')
    setShowHome(false)
  }

  const fetchRows = useCallback(async () => {
    if (isLogTab || isEnglishTab) return
    setLoading(true)
    const { data, error } = await supabase
      .from('business_items')
      .select('*')
      .eq('category', activeTab)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('데이터 불러오기 오류:', error)
    } else {
      setRows(data || [])
    }
    setLoading(false)
  }, [activeTab, isLogTab, isEnglishTab])

  useEffect(() => {
    if (showHome || isLogTab || isEnglishTab) return
    fetchRows()

    const channel = supabase
      .channel('business_items_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'business_items' }, () => fetchRows())
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [fetchRows, isLogTab, isEnglishTab, showHome])

  const filteredRows = rows.filter((row) => {
    if (!search) return true
    const s = search.toLowerCase()
    return (
      row.item_name?.toLowerCase().includes(s) ||
      row.manufacturer?.toLowerCase().includes(s) ||
      row.distributor?.toLowerCase().includes(s) ||
      row.customer?.toLowerCase().includes(s) ||
      row.salesperson?.toLowerCase().includes(s) ||
      row.requester?.toLowerCase().includes(s) ||
      row.status?.toLowerCase().includes(s)
    )
  })

  const handleUpdate = async (id, field, value) => {
    const updateData = { [field]: value }
    if (field === 'customer') {
      updateData.salesperson = CUSTOMER_SALESPERSON[value] || ''
    }
    const { error } = await supabase.from('business_items').update(updateData).eq('id', id)
    if (error) {
      console.error('업데이트 오류:', error)
      alert('저장 실패: ' + error.message)
    } else {
      fetchRows()
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('삭제하시겠습니까?')) return
    const { error } = await supabase.from('business_items').delete().eq('id', id)
    if (error) {
      alert('삭제 실패: ' + error.message)
    } else {
      fetchRows()
    }
  }

  if (showHome) {
    return (
      <div className="app home-app">
        <HomeLanding onEnterManagement={enterManagement} />
      </div>
    )
  }

  return (
    <div className="app business-app">
      <header className="header">
        <div className="header-left">
          <button className="home-back-btn" onClick={() => setShowHome(true)} aria-label="메인으로 이동">
            Ace Bio Pharm
          </button>
          <h1>업무 관리</h1>
        </div>
        {!isLogTab && !isEnglishTab && (
          <div className="header-right">
            <input
              className="search-input"
              type="text"
              placeholder="검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
      </header>

      <div className="tabs">
        {ALL_TABS.map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''} ${tab === '업무일지' ? 'tab-log' : ''} ${tab === 'AI 전화영어' ? 'tab-english' : ''}`}
            onClick={() => {
              setActiveTab(tab)
              setSearch('')
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {isEnglishTab ? (
        <EnglishTutor />
      ) : isLogTab ? (
        <DailyLog />
      ) : (
        <>
          <div className="table-container">
            {loading ? (
              <div className="loading">불러오는 중...</div>
            ) : (
              <DataTable rows={filteredRows} onUpdate={handleUpdate} onDelete={handleDelete} />
            )}
          </div>

          <div className="footer">
            <button className="add-btn" onClick={() => setShowAddModal(true)}>
              + 새 항목 추가
            </button>
            <span className="count">{filteredRows.length}건</span>
          </div>

          {showAddModal && (
            <AddRowModal
              category={activeTab}
              onClose={() => setShowAddModal(false)}
              onSaved={fetchRows}
            />
          )}
        </>
      )}
    </div>
  )
}
