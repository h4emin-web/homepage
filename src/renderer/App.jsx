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

const SUB_PAGE_MAP = {
  '회사 현황': 'company',
  '경영진 인사말': 'greeting',
  '연혁': 'history',
}

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

const COMPANY_PROFILE_ROWS = [
  ['회사명', '에이스바이오팜 주식회사'],
  ['대표자', '민병규'],
  ['사업자등록번호', '214-87-62038'],
  ['설립일', '2004년 11월 23일'],
  ['주요품목', '의약품·화장품·식품 원료, 건강기능식품'],
  ['사업종목', '원료의약품 등의 도매업, 건강기능식품 제조업'],
  ['본점', '서울 서초구 방배로20길 5 서명빌딩 4,5,6층'],
  ['물류센터', '경기 화성시 향남읍 발안공단로 6길 10'],
  ['연구소', '대전 유성구 유성대로1662 대전바이오벤처타운 512,513호'],
  ['정제공장', '경기도 평택시 청북읍 드림산단4로 140'],
  ['종업원 수', '94명'],
  ['대표전화', '02-579-1056'],
]

const MANAGEMENT_GREETINGS = [
  {
    title: '대표이사',
    name: '민병규',
    englishName: 'Byoung-Gyu Min',
    photo: '/exec-ceo-min.jpg',
    photoSide: 'right',
    message: [
      '에이스바이오팜은 2004년 설립 이후 의약품 유통 혁신을 위해 열심히 달리고 있으며, 좋은 사람들이 모여 보람 있는 회사를 만들어가고 있습니다.',
      '아울러 사업분야인 원료 도매, 수출입, 개발 등에 있어 국내외 협력사들과 공동 성장하는 회사로 성장해 나갈 것입니다.',
      '앞으로도 끊임없이 도전하는 기업 정신, 화합하는 기업문화를 통해 고객 여러분의 무한 발전에 이바지할 것을 약속드립니다.',
    ],
  },
  {
    title: '마케팅 총괄이사, 사장',
    name: '김준기',
    englishName: 'Jun-Gi Kim',
    photo: '/exec-cmo-kim.jpg',
    photoSide: 'left',
    message: [
      '저희 에이스바이오팜은 전 임직원이 3가지 원칙(Good Quality, On Time Delivery, Satisfying Price)을 지켜 고객감동을 실현하는 것을 제1가치로 삼고 있습니다.',
      '고객 여러분께 제공할 솔루션 마련에 언제나 최선을 다함과 동시에, 의약품·화장품·식품 원료 업계 선도 기업으로 거듭나 고객 여러분의 든든한 동반자가 될 것을 약속드립니다.',
    ],
  },
  {
    title: '기술이사, 바이오연구소장',
    name: '장형욱',
    englishName: 'Hyung-Wook Jang',
    photo: '/exec-cto-jang.jpg',
    photoSide: 'right',
    message: [
      '에이스바이오팜 바이오연구소는 2015년 바이오 제품의 상용화 기술개발로 개편한 이후 인류 건강과 행복에 이바지 할 수 있는 세계 일등 바이오 소재 제품을 생산하기 위하여 끊임없이 도전하고 있습니다.',
      '저희 연구소는 독창적인 연구기술뿐만 아니라 상업적 생산 경험 및 우수한 마케팅 능력을 갖춤으로써, 세계를 무대로 의약품/화장품/식품원료 등 다양한 분야에서 높은 부가가치를 실현하고 있습니다.',
      '끊임없는 노력과 도전으로 양질의 바이오제품을 공급함으로써 고객 만족과 직원의 자긍심을 실현하고, 나아가 사회발전에 이바지하는 기업으로 성장 할 것을 약속드립니다.',
    ],
  },
]

const HISTORY_ERAS = [
  {
    id: '2021-2025',
    range: '2025 - 2021',
    headline: '끊임없이 도전하는 기업 정신',
    image: '/history-hq-building.jpg',
    years: [
      {
        year: '2025',
        items: [
          '매출 1,277억원 달성',
          'DMF 232 품목 등록 완료, 의약품 품목허가신고 5품목',
          '수출 US$3,069,364, 비타민K 등 미국·유럽 수출',
          '벤처기업 확인서(벤처투자유형) 발급',
        ],
      },
      {
        year: '2024',
        items: ['매출 1,210억 달성', 'DMF 18 품목 등록, 품목허가 2품목', '창립 20주년'],
      },
      {
        year: '2023',
        items: [
          '매출 1,080억 달성',
          'DMF 신규 12품목 등록, 의약품 품목허가신고 11품목',
          'Evonik社 Pharmaceutical Excipients 제품 런칭',
          '특허등록(제 10-2501636호, 페노피브린산 관련)',
        ],
      },
      {
        year: '2022',
        items: [
          '매출 1,003억 달성',
          'DMF 187 품목 등록 완료(신규 25건)',
          '본사 사옥 매입 이전(방배동, 08.14)',
          'Seppic社 제품 런칭',
        ],
      },
      {
        year: '2021',
        items: [
          '매출 863억원 달성',
          'DMF 162품목 등록',
          '상호명 변경(동진파마 → 에이스바이오팜)',
          '평택공장 개업(11.01)',
        ],
      },
    ],
  },
  {
    id: '2015-2020',
    range: '2020 - 2015',
    headline: '연구와 확장으로 다지는 성장의 기반',
    image: '/history-factory-building.jpg',
    years: [
      { year: '2020', items: ['매출 765억원 달성', 'DMF 114품목 등록'] },
      { year: '2019', items: ['매출 710억원 달성', '(주)에이스바이오텍 합병', '대전 바이오연구소 설립'] },
      { year: '2018', items: ['매출 580억원 달성', 'DMF 79품목 등록'] },
      { year: '2017', items: ['매출 550억원 달성', 'DMF 60품목 등록'] },
      { year: '2016', items: ['매출 500억원 달성', '본사 사옥 매입 이전(9월)'] },
      { year: '2015', items: ['매출 300억원 달성', 'DMF 40품목 등록'] },
    ],
  },
  {
    id: '2004-2014',
    range: '2014 - 2004',
    headline: '작은 도전에서 시작된 에이스바이오팜',
    image: null,
    years: [
      { year: '2014', items: ['매출 200억원 달성'] },
      { year: '2011', items: ['관계회사 에이스바이오텍 설립'] },
      { year: '2009', items: ['매출 110억원 달성'] },
      { year: '2004', items: ['회사설립(자본금 2억원)'] },
    ],
  },
]

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

function CompanyIntroPage() {
  return (
    <section className="company-page" aria-label="회사소개">
      <div className="company-page-header">
        <nav className="company-breadcrumb" aria-label="이동 경로">
          <span>Home</span>
          <span className="company-breadcrumb-sep">&gt;</span>
          <span>회사소개</span>
          <span className="company-breadcrumb-sep">&gt;</span>
          <span className="company-breadcrumb-current">회사 현황</span>
        </nav>
        <h1>We have the solution you need</h1>
      </div>
      <div className="company-hero-image" aria-hidden="true" />
      <div className="company-content">
        <aside className="company-statement">
          <p>바이오소재 전문기업</p>
        </aside>
        <div className="company-detail">
          <div className="company-intro-copy">
            <p>
              에이스바이오팜은 의약품, 식품, 화장품 원료의 안정적인 공급과 빠른 소싱을
              통해 고객사의 제품 개발과 생산을 연결합니다.
            </p>
            <p>
              국내외 제조사와 고객사의 요구 조건을 정확히 이해하고, KDMF APIs,
              Excipients, 식품 원료, 화장품 원료, 도매 원료까지 폭넓은 바이오소재
              솔루션을 제공합니다.
            </p>
          </div>
          <dl className="company-profile-table">
            {COMPANY_PROFILE_ROWS.map(([label, value]) => (
              <div className="company-profile-row" key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

function GreetingPage() {
  return (
    <section className="company-page greeting-page" aria-label="경영진 인사말">
      <div className="company-page-header">
        <nav className="company-breadcrumb" aria-label="이동 경로">
          <span>Home</span>
          <span className="company-breadcrumb-sep">›</span>
          <span>회사소개</span>
          <span className="company-breadcrumb-sep">›</span>
          <span className="company-breadcrumb-current">경영진 인사말</span>
        </nav>
        <h1>경영진 인사말</h1>
      </div>
      <div className="greeting-list">
        {MANAGEMENT_GREETINGS.map((person) => (
          <article className={`greeting-card greeting-photo-${person.photoSide}`} key={person.name}>
            <div className="greeting-photo">
              <img src={person.photo} alt={`${person.name} ${person.englishName}`} />
            </div>
            <div className="greeting-info">
              <p className="greeting-role">{person.title}</p>
              <h2 className="greeting-name">
                {person.name} <span className="greeting-english-name">{person.englishName}</span>
              </h2>
              <hr />
              {person.message.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function HistoryPage() {
  return (
    <section className="company-page history-page" aria-label="연혁">
      <div className="company-page-header">
        <nav className="company-breadcrumb" aria-label="이동 경로">
          <span>Home</span>
          <span className="company-breadcrumb-sep">›</span>
          <span>회사소개</span>
          <span className="company-breadcrumb-sep">›</span>
          <span className="company-breadcrumb-current">연혁</span>
        </nav>
        <h1>연혁</h1>
        <p className="history-lead">
          2004년부터 지금까지,
          <br />
          혁신을 통해 성장한 에이스바이오팜의 기록입니다
        </p>
      </div>

      {HISTORY_ERAS.map((era) => (
        <div className="history-era" key={era.id}>
          <div
            className={`history-era-banner ${era.image ? '' : 'history-era-banner-plain'}`}
            style={era.image ? { backgroundImage: `url(${era.image})` } : undefined}
          >
            <div className="history-era-banner-overlay">
              <div className="history-era-banner-inner">
                <span className="history-era-range">{era.range}</span>
                <h2>{era.headline}</h2>
              </div>
            </div>
          </div>
          <div className="history-era-years">
            {era.years.map((yearEntry) => (
              <div className="history-year-row" key={yearEntry.year}>
                <div className="history-year-label">{yearEntry.year}</div>
                <ul className="history-year-items">
                  {yearEntry.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

function HomeLanding({ onEnterManagement }) {
  const scrollRef = useRef(null)
  const videoRef = useRef(null)
  const [activeHomePage, setActiveHomePage] = useState('main')
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
      const start = scroller.clientHeight * 1.12
      const distance = scroller.clientHeight * 0.72
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

  const goToSubPage = (subItem) => {
    const page = SUB_PAGE_MAP[subItem]
    if (!page) return
    setActiveHomePage(page)
    setHoveredNav(null)
    setMenuOpen(false)
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const effectiveProgress = solutionLocked ? 1 : solutionProgress
  const headlineScale = 1 + effectiveProgress * (scrollRef.current?.clientWidth < 600 ? 0.54 : 2.12)
  const headlineOpacity = solutionLocked ? 0 : Math.max(0, 1 - Math.max(0, effectiveProgress - 0.48) / 0.32)
  const panelProgress = solutionLocked ? 1 : Math.max(0, Math.min(1, (effectiveProgress - 0.42) / 0.42))
  const hoveredMenu = NAV_MENU_GROUPS.find((group) => group.title === hoveredNav)

  return (
    <main
      className={`home-shell ${
        activeHomePage === 'company' || activeHomePage === 'greeting' || activeHomePage === 'history' ? 'company-mode' : ''
      }`}
      ref={scrollRef}
    >
      <header className="home-nav" onMouseLeave={() => setHoveredNav(null)}>
        <button
          className="home-logo"
          onClick={() => {
            setActiveHomePage('main')
            scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          <img src="/acebiopharm-ci.png" alt="Ace BioPharm" />
        </button>
        <nav className="home-nav-links" aria-label="주요 메뉴">
          {SITE_NAV_ITEMS.map((item, navIndex) => {
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
                <button
                  className={hoveredNav === item ? 'active' : ''}
                  onClick={() => {
                    if (navIndex === 0) {
                      setActiveHomePage('company')
                      setHoveredNav(null)
                      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                  }}
                  onFocus={() => setHoveredNav(item)}
                >
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
                                <button onClick={() => goToSubPage(subItem)}>{subItem}</button>
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
                        <button onClick={() => goToSubPage(item)}>{item}</button>
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

      {activeHomePage === 'company' ? (
        <CompanyIntroPage />
      ) : activeHomePage === 'greeting' ? (
        <GreetingPage />
      ) : activeHomePage === 'history' ? (
        <HistoryPage />
      ) : (
        <>
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
                  <button key={action.label} type="button">
                    {action.label}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
        </>
      )}

      <footer className="home-footer">
        <div className="home-footer-menu">
          <div className="home-footer-menu-inner">
            {FOOTER_NAV_GROUPS.map((group) => (
              <section className="home-footer-column" key={group.title}>
                <h2>{group.title}</h2>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>
                      <button onClick={() => goToSubPage(item)}>{item}</button>
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
