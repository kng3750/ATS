/* ==========================================================================
   CareerAI Pro - Application Core Logic
   ========================================================================== */

// Global State
let state = {
  apiKey: 'BACKEND_ENV',
  activeTab: 'tab-fit',
  isGenerating: false
};

// Preset Data
const PRESETS = {
  fit: {
    1: {
      participant: "39세 여성, 경영지원/총무 7년 경력, 컴활 1급 보유, 자녀 육아로 인한 3년 경력 공백기. 공백 기간 중 봉사단체 회계 관리 재능기부 1년.",
      job: "[주식회사 글로벌테크] 경영지원팀 과장급 채용\n- 담당업무: 총무, 자산 및 비품 관리, 임직원 복리후생, 세금계산서 발행\n- 자격요건: 경영지원/총무 경력 5년 이상, 문서작성 우수자\n- 우대사항: 전산회계 자격증 소지자, Immediate Start 가능자"
    },
    2: {
      participant: "48세 여성, 대형마트 계산원 및 CS 고객응대 10년 근무. 2년 경력공백 (부모님 간병). 고객상담사 자격증 소지, 고객 친화적 성격.",
      job: "[스타유통] 고객만족센터 (CS) 매니저 모집\n- 담당업무: 고객 불만 접수 및 처리, 매장 CS 현장 관리, 신입 캐셔 교육\n- 자격요건: CS 또는 유통 매장 근무 경력 3년 이상\n- 우대사항: 장기 근무 가능자, 컴프레인 대처 능력 우수자"
    }
  },
  questions: {
    1: {
      experience: "중소기업 경영지원팀 7년 근무 (2014~2021).\n- 사내 자산 및 비품 구매/관리 담당\n- 임직원 100명 복리후생 및 행사 기획\n- 법인카드 경비 정산 및 증빙 서류 관리\n- 거래처 인프라 계약 갱신 및 관리"
    },
    2: {
      experience: "대형마트 계산원 및 고객만족팀 10년 근무 (2012~2022).\n- 매일 고객 결제 및 정산 업무 수행\n- 고객 교환/환불 처리 및 민원 응대\n- 신규 캐셔 멘토링 및 서비스 모니터링"
    }
  },
  strategy: {
    1: {
      job: "중견 IT기업 경영지원팀. 직무: 총무/자산관리. 우대사항: ERP 사용자, 전산회계, 세금계산서 발행 능통자, 소통 원활자.",
      seeker: "39세 여성, 총무 경력 7년, 육아 공백 3년, 컴활 1급 보유, 엑셀 활용 능숙, 공백기 중 지역사회 봉사단체 회계 재능기부."
    },
    2: {
      job: "프랜차이즈 본사 CS팀 매니저. 직무: 매장 고객 클레임 응대, 서비스 품질 관리. 우대사항: 유통/서비스 현장 경력 5년 이상.",
      seeker: "48세 여성, 대형마트 CS 및 계산원 10년 경력, 2년 간병 공백기, 고객상담사 자격증 보유."
    }
  },
  draft: {
    1: {
      info: "39세 여성, 지원 직무: 총무 및 경영지원",
      experience: "중소기업 총무팀 7년 근무 (사내 비품관리, 경비정산). 육아로 인한 3년 공백기 (지역 봉사단체 재무관리 수행).",
      strengths: "꼼꼼한 문서 정리 능력, 엑셀 마스터, 부서간 원활한 소통, 책임감"
    },
    2: {
      info: "48세 여성, 지원 직무: 대형마트 CS 서비스 매니저",
      experience: "대형마트 계산원 및 CS 10년 근무, 2년 공백기 (부모님 간병).",
      strengths: "경청 능력, 위기 대처 경력 10년, 뛰어난 정산 정확도, 높은 성실성"
    }
  },
  ats: {
    1: {
      basic: "김민지 / 39세 / 여성 / 대학교 졸업 (경영학 전공)",
      history: "(주)한성상사 총무팀 대리 (2014.03 ~ 2021.02) - 사내 비품 및 자산 관리, 월간 경비 정산, 임직원 복리후생 운영",
      gap: "자녀 양육 및 육아 (2021.03 ~ 2024.02) - 컴퓨터활용능력 1급 취득, 비영리단체 재무 재능기부",
      certs: "컴퓨터활용능력 1급, 전산회계 1급, 운전면허 1종보통"
    },
    2: {
      basic: "박순희 / 48세 / 여성 / 고등학교 졸업",
      history: "이마트 계산원 및 CS 매니저 (2012.05 ~ 2022.04) - 계산 및 포스 관리, 고객 클레임 1차 처리",
      gap: "가족 간병 및 재충전 (2022.05 ~ 2024.04) - 고객상담사 자격증 공부 및 취득",
      certs: "고객상담사 2급, 바리스타 2급"
    }
  },
  gap: {
    1: {
      info: "39세 여성, 지원 직무: 경영지원팀 총무 담당",
      experience: "중소기업 총무팀 7년 근무 (자산 관리 및 임직원 복지 운영)",
      reason: "육아로 인한 3년 공백기. 공백 기간 동안 자녀 양육과 더불어 지역 사회 봉사단체의 재무관리를 도우며 조직 관리감각 유지"
    },
    2: {
      info: "48세 여성, 지원 직무: 프랜차이즈 CS 매니저",
      experience: "대형마트 CS 및 계산원 10년 근무 (우수 사원 표창)",
      reason: "부모님 간병 2년 공백. 공백기 동안 타인에 대한 공감 능력 향상 및 고객상담사 자격증 취득으로 서비스 전문성 강화"
    }
  }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  checkFileProtocol();
  initTabs();
  initModal();
  loadApiKey();

  // Auto-detect server or env key background loop (every 3 seconds & window focus)
  setInterval(() => {
    // Keep checking if not connected to backend proxy
    if (state.apiKey !== 'BACKEND_ENV') {
      loadApiKey();
    }
  }, 3000);

  window.addEventListener('focus', () => {
    if (state.apiKey !== 'BACKEND_ENV') {
      loadApiKey();
    }
  });
});

// Check if index.html is opened directly via file:// protocol
function checkFileProtocol() {
  const isFileProtocol = window.location.protocol === 'file:' || window.location.origin === 'null';
  const banner = document.getElementById('fileProtocolBanner');
  if (banner) {
    if (isFileProtocol && state.apiKey !== 'BACKEND_ENV') {
      banner.style.display = 'flex';
    } else {
      banner.style.display = 'none';
    }
  }
}

// Initialize Tabs
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
      state.activeTab = tabId;
    });
  });
}

// Modal Handling
function initModal() {
  const modal = document.getElementById('settingsModal');
  const btnOpen = document.getElementById('btnSettingsModal');
  const btnClose = document.getElementById('btnCloseModal');
  const btnTest = document.getElementById('btnTestKey');

  btnOpen.addEventListener('click', () => modal.classList.add('active'));
  btnClose.addEventListener('click', () => modal.classList.remove('active'));
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  btnTest.addEventListener('click', async () => {
    btnTest.disabled = true;
    btnTest.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 감지 중...';
    await loadApiKey();
    btnTest.disabled = false;
    btnTest.innerHTML = '<i class="fa-solid fa-rotate-right"></i> 환경변수 재감지';
  });
}

// Check server-side environment configuration. The secret never enters the browser.
async function loadApiKey() {
  const envKeyStatus = document.getElementById('envKeyStatus');
  const isFileProtocol = window.location.protocol === 'file:' || window.location.origin === 'null';
  const healthUrl = isFileProtocol ? 'http://localhost:3001/api/health' : '/api/health';

  try {
    const backendRes = await fetch(healthUrl).catch(() => null);
    const data = backendRes && backendRes.ok ? await backendRes.json() : null;
    if (data && data.hasEnvKey === true) {
      state.apiKey = 'BACKEND_ENV';
      state.backendUrl = isFileProtocol ? 'http://localhost:3001' : '';
      updateStatusBadge('success', 'Gemini API 연결됨 (서버 환경변수)');
      if (envKeyStatus) {
        envKeyStatus.innerHTML = '<i class="fa-solid fa-check-circle" style="color:#10b981"></i> 서버 환경변수에 Gemini API 키가 안전하게 설정되어 있습니다.';
      }
      const banner = document.getElementById('fileProtocolBanner');
      if (banner) banner.style.display = 'none';
      return true;
    }
  } catch (err) {
    console.warn('API 상태 확인 실패:', err.message);
  }

  // If failed to detect
  state.apiKey = 'BACKEND_ENV';
  if (isFileProtocol) {
    updateStatusBadge('danger', 'file:// 직접열림 (서버 미실행)');
    if (envKeyStatus) {
      envKeyStatus.innerHTML = `
        <div style="color: #f59e0b; font-weight: 600; margin-bottom: 6px;">
          <i class="fa-solid fa-triangle-exclamation"></i> index.html 파일 직접 열림 감지 (file://)
        </div>
        <div style="font-size:0.88rem; color:#d1d5db; line-height: 1.5;">
          <code>npm start</code> 로컬 서버에서 서버 환경변수를 확인하고 있습니다.<br>
          백엔드 proxy 연결을 이용하시려면 <code>npm start</code> 구동 후 <a href="http://localhost:3001" target="_blank" style="color:#38bdf8; text-decoration:underline;">http://localhost:3001</a> 로 접속하세요.
        </div>
      `;
    }
  } else {
    updateStatusBadge('danger', 'API 키 미감지 (서버 실행 필요)');
    if (envKeyStatus) {
      envKeyStatus.innerHTML = '<i class="fa-solid fa-circle-xmark" style="color:#ef4444"></i> 서버 환경변수 미설정<br><span style="font-size:0.85rem; color:#9ca3af; margin-top:4px; display:inline-block;">터미널에서 <code>npm start</code> 구동 후 <strong>http://localhost:3001</strong>로 접속해 주세요.</span>';
    }
  }
  return false;
}

function updateStatusBadge(type, text) {
  const badge = document.getElementById('apiStatusBadge');
  const dot = badge.querySelector('.status-dot');
  const label = document.getElementById('apiStatusText');
  
  dot.className = `status-dot ${type}`;
  label.textContent = text;
}

// Preset Fill
function loadPreset(tabType, presetIndex) {
  const data = PRESETS[tabType]?.[presetIndex];
  if (!data) return;

  if (tabType === 'fit') {
    document.getElementById('fit-participant').value = data.participant;
    document.getElementById('fit-job').value = data.job;
  } else if (tabType === 'questions') {
    document.getElementById('questions-experience').value = data.experience;
  } else if (tabType === 'strategy') {
    document.getElementById('strategy-job').value = data.job;
    document.getElementById('strategy-seeker').value = data.seeker;
  } else if (tabType === 'draft') {
    document.getElementById('draft-info').value = data.info;
    document.getElementById('draft-experience').value = data.experience;
    document.getElementById('draft-strengths').value = data.strengths;
  } else if (tabType === 'ats') {
    document.getElementById('ats-basic').value = data.basic;
    document.getElementById('ats-history').value = data.history;
    document.getElementById('ats-gap').value = data.gap;
    document.getElementById('ats-certs').value = data.certs;
  } else if (tabType === 'gap') {
    document.getElementById('gap-info').value = data.info;
    document.getElementById('gap-experience').value = data.experience;
    document.getElementById('gap-reason').value = data.reason;
  }

  showToast(`예시 ${presetIndex === 1 ? 'A' : 'B'} 데이터가 채워졌습니다.`);
}

// Form Handlers
async function handleFormSubmit(event, type) {
  event.preventDefault();
  if (state.isGenerating) return;

  if (!state.apiKey) {
    const isFileProtocol = window.location.protocol === 'file:' || window.location.origin === 'null';
    if (isFileProtocol) {
      showToast('index.html 파일이 직접 열려 있습니다. npm start 실행 후 http://localhost:3001 로 접속해 주세요.', true);
    } else {
      showToast('Gemini API 키가 설정되지 않았습니다. [설정] 버튼을 눌러 키를 확인하세요.', true);
    }
    document.getElementById('settingsModal').classList.add('active');
    return;
  }

  const resultContainer = document.getElementById(`result-${type}`);
  let prompt = '';

  if (type === 'fit') {
    const part = document.getElementById('fit-participant').value.trim();
    const job = document.getElementById('fit-job').value.trim();
    if (!part || !job) return showToast('모든 입력 항목을 작성해 주세요.', true);

    prompt = `[채용공고 적합성 심층 분석 요청]
다음 참여자 정보와 채용공고를 분석하여, 취업 상담사와 구직자 모두가 활용할 수 있는 적합성 리포트를 작성해 주세요.

## 참여자 정보:
${part}

## 채용공고 요약:
${job}

## 출력 요구사항 (다음 4개 섹션으로 나누어 작성):
1. **부합하는 핵심 강점 (Match Points)**: 참여자의 경력, 자격증, 성향이 공고와 부합하는 점
2. **보완 필요 및 우려 사항 (Concern Points)**: 공백기, 자격요건 미달 등 보완해야 할 부분 및 리스크
3. **지원 시 강조해야 할 핵심 포인트 (Key Selling Points)**: 서류 및 면접 시 어필할 핵심 전략
4. **최종 지원 추천 여부 및 이유**: (강력 추천 / 조건부 추천 / 신중 지원 중 선택 + 추천 점수 (100점 만점) 및 이유 설명)`;

  } else if (type === 'questions') {
    const exp = document.getElementById('questions-experience').value.trim();
    if (!exp) return showToast('직무 경력을 입력해 주세요.', true);

    prompt = `[성과 수치 발굴 질문 생성 요청]
참여자가 자신의 직무 경력을 수치화(하루/주간 처리 건수, 담당 고객 수, 개선 비율, 담당 금액, 절감액 등)하여 이력서와 자소서에 명확한 성과로 작성할 수 있도록 돕는 **구체적인 질문 10개**를 생성해 주세요.

## 참여자 직무 경력:
${exp}

## 출력 요구사항:
- 질문 1부터 10까지 번호를 매겨 작성하세요.
- 질문마다 (예: 하루 평균 결제 건수는 얼마였나요?, 관리했던 비품 항목의 규모나 예산은 얼마였나요? 등) 답변을 유도하는 괄호 속 예시 가이드를 함께 제공해 주세요.`;

  } else if (type === 'strategy') {
    const job = document.getElementById('strategy-job').value.trim();
    const seeker = document.getElementById('strategy-seeker').value.trim();
    if (!job || !seeker) return showToast('모든 항목을 입력해 주세요.', true);

    prompt = `[채용공고 분석 및 맞춤 지원 전략 수립]
채용공고 내용과 내담자 현황을 바탕으로 다음 5가지 항목을 체계적으로 작성해 주세요.

## 채용공고 핵심 내용:
${job}

## 내담자 현황:
${seeker}

## 출력 요구사항:
1. **항목별 부합도 분석 (마크다운 표 형태)**:
   - 주요 직무 요건 / 요구 역량 / 우대사항별 부합도(O/△/X)와 간단 이유 표 작성
2. **강점 포인트 3가지**: 지원자가 자신 있게 어필할 대표 강점
3. **약점 보완 전략**: 공백기나 부족한 자격요건을 커버할 설득 전략
4. **맞춤형 이력서 키워드 5개**: 서류 작성 시 필수로 포함할 주요 핵심 단어 5개
5. **면접 예상 질문 5개 및 모범 답변 방향**: 예상 질문 5개와 답변 포인트 가이드`;

  } else if (type === 'draft') {
    const info = document.getElementById('draft-info').value.trim();
    const exp = document.getElementById('draft-experience').value.trim();
    const str = document.getElementById('draft-strengths').value.trim();
    if (!info || !exp) return showToast('필수 정보를 입력해 주세요.', true);

    prompt = `[자기소개서 항목별 초안 생성]
다음 입력 정보를 바탕으로 4개 항목의 자기소개서 초안을 작성해 주세요.

## 입력 정보:
- 지원자 기본정보 및 지원직무: ${info}
- 경력 및 주요 경험 (공백기 포함): ${exp}
- 강점 및 특별 경험: ${str}

## 작성 지침 (중요):
1. 총 4개 항목으로 구사하세요:
   - 항목 1: 지원 동기 및 직무 이해도 (250자 내외)
   - 항목 2: 주요 직무 역량 및 성과 (250자 내외)
   - 항목 3: 경력 공백기 또는 과제 극복 경험 (250자 내외)
   - 항목 4: 입사 후 포부 및 기여 방안 (250자 내외)
2. **경력 공백 서술 원칙**: 사과하거나 미안해하는 표현을 절대 쓰지 말고, 재충전/자격증 취득/공동체 활동 등 '성장의 언어' 및 '경험의 다양성'으로 자연스럽게 연결하세요.
3. 성과에는 수치(기간, 건수, 인원 등)나 구체적 경험을 포함하세요.
4. 문체는 진솔하고 전문적인 어조를 유지하세요.`;

  } else if (type === 'ats') {
    const basic = document.getElementById('ats-basic').value.trim();
    const history = document.getElementById('ats-history').value.trim();
    const gap = document.getElementById('ats-gap').value.trim();
    const certs = document.getElementById('ats-certs').value.trim();
    if (!basic || !history) return showToast('기본 정보와 경력 사항을 입력해 주세요.', true);

    prompt = `[경력보유자 맞춤형 ATS 이력서 초안 생성]
다음 인적사항 및 경력 정보를 바탕으로 채용 자동화 시스템(ATS) 필터링을 통과할 수 있는 성과 중심 이력서 초안을 작성해 주세요.

## 정보:
- 인적사항/학력: ${basic}
- 상세 경력: ${history}
- 공백기 사유/활동: ${gap}
- 자격증 및 기술: ${certs}

## 작성 규칙:
1. **핵심 역량 요약 (Core Competencies)**: ATS 통과용 직무 핵심 키워드 5~7개 제시
2. **경력 사항 (Professional Experience)**: 역순 배치, 담당 업무 및 수치화된 성과 중심으로 불렛포인트 표기
3. **경력 재구성 스토리 (Career Transition & Gap)**: 공백기를 감추지 않고 '경험의 다양화 및 역량 재충전 기간'으로 전문적 재구성
4. **자격증 및 학력 사항** 정리`;

  } else if (type === 'gap') {
    const info = document.getElementById('gap-info').value.trim();
    const exp = document.getElementById('gap-experience').value.trim();
    const reason = document.getElementById('gap-reason').value.trim();
    if (!info || !reason) return showToast('필수 항목을 입력해 주세요.', true);

    prompt = `[자기소개서 – 경력공백 극복 스토리텔링]
경력단절 및 공백기를 가진 지원자를 위한 따뜻하고 전문적인 자기소개서를 작성해 주세요.

## 정보:
- 지원자 및 지원직무: ${info}
- 기존 경력: ${exp}
- 공백기 사유 및 활동: ${reason}

## 작성 조건:
- 다음 4개 항목을 완성하세요:
  1. **성장 과정 및 직무 가치관**: 성실함과 전문성을 보여주는 성격 및 가치관
  2. **직무 관련 경험 및 역량 (공백기 극복 연결)**: 공백 기간 중 배운 점과 기존 경력을 융합한 직무 강점
  3. **지원 동기 및 직무 적합성**: 해당 직무에 다시 도전하는 진솔하고 확신에 찬 계기
  4. **입사 후 포부**: 조직에 빠르게 적응하고 기여할 현실적 목표
- **문체 지침**: 사과 표현 금지! 진솔하고 따뜻하되 프로페셔널한 신뢰감을 높이는 문조 사용.`;
  }

  // Render Spinner
  state.isGenerating = true;
  resultContainer.innerHTML = `
    <div class="spinner-container">
      <div class="spinner"></div>
      <p>AI가 분석 및 맞춤 서류를 생성하고 있습니다. 잠시만 기다려 주세요...</p>
    </div>
  `;

  try {
    const aiResultText = await callGeminiApi(prompt);
    // Render Markdown
    resultContainer.innerHTML = `<div class="result-content">${marked.parse(aiResultText)}</div>`;
  } catch (err) {
    console.error(err);
    resultContainer.innerHTML = `
      <div class="empty-state" style="color: #ef4444;">
        <i class="fa-solid fa-circle-exclamation"></i>
        <p>생성 중 오류가 발생했습니다.<br>${err.message || 'API 키 또는 네트워크 상태를 확인하세요.'}</p>
      </div>
    `;
    showToast('생성 실패: ' + (err.message || '오류 발생'), true);
  } finally {
    state.isGenerating = false;
  }
}

// Gemini API Call
async function callGeminiApi(promptText) {
  const endpoint = state.backendUrl ? `${state.backendUrl}/api/generate` : '/api/generate';
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: promptText })
  });
  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error || `Server Error ${res.status}`);
  }
  const data = await res.json();
  return data.text;
}

// Copy Result
function copyResult(resultId) {
  const container = document.getElementById(resultId);
  if (!container) return;

  const content = container.querySelector('.result-content');
  if (!content) {
    showToast('복사할 생성 결과가 없습니다.', true);
    return;
  }

  const plainText = content.innerText;
  navigator.clipboard.writeText(plainText).then(() => {
    showToast('결과가 클립보드에 복사되었습니다!');
  }).catch(() => {
    showToast('클립보드 복사에 실패했습니다.', true);
  });
}

// Toast Display Helper
function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${isError ? 'error' : ''} show`;

  setTimeout(() => {
    toast.className = 'toast';
  }, 3200);
}
