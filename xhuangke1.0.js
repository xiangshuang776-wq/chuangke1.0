import React, { useState, useRef } from "react";

export default function App() {
  const [view, setView] = useState("creator"); 
  const [videoCount, setVideoCount] = useState(10); 
  const [lang, setLang] = useState("zh_tw");
  
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [accountStatus, setAccountStatus] = useState("unbound"); 
  const [userBalance, setUserBalance] = useState(0);
  const [isRedCreator, setIsRedCreator] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=MAKERPRO_SERVICE");

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("login"); 
  const [inputVal, setInputVal] = useState("");
  const [status, setStatus] = useState("idle");

  const timerRef = useRef(null);
  const handleLogoTouchStart = () => {
    timerRef.current = setTimeout(() => { setModalType("adminLogin"); setShowModal(true); }, 2000);
  };
  const handleLogoTouchEnd = () => clearTimeout(timerRef.current);

  const t = content[lang];

  const handleAction = () => {
    if (!isLoggedIn) { setModalType("login"); setShowModal(true); }
    else if (accountStatus === "unbound") { setModalType("bind"); setShowModal(true); }
    else if (accountStatus === "pending") { setModalType("pending"); setShowModal(true); }
    else { setModalType("task"); setShowModal(true); }
  };

  const executeLogic = (e) => {
    e.preventDefault();
    setStatus("processing");
    setTimeout(() => {
      if (modalType === "login") { setIsLoggedIn(true); setModalType("bind"); }
      else if (modalType === "bind") { setAccountStatus("pending"); setModalType("pending"); }
      else if (modalType === "adminLogin") {
        if (inputVal === "admin888") { setView("admin"); setShowModal(false); }
        else { alert(lang === 'en' ? "Wrong Password" : "密碼錯誤"); }
      } else if (modalType === "task") {
        setUserBalance(prev => prev + (isRedCreator ? 30 : 20));
        setStatus("success");
        setTimeout(() => { setShowModal(false); setStatus("idle"); }, 1500);
      }
      setStatus("idle"); setInputVal("");
    }, 1000);
  };

  return (
    <div style={styles.container}>
      <style>{`
        /* 手机端核心适配 */
        @media (max-width: 600px) {
          .hero-title { font-size: 32px !important; }
          .horizontal-grid { gap: 10px !important; }
          .square-card h3 { font-size: 11px !important; }
          .square-card .price-val { font-size: 22px !important; }
          .calc-res-box { flex-direction: column !important; }
        }

        .square-card { 
          aspect-ratio: 1/1; 
          display: flex; 
          flex-direction: column; 
          justify-content: center; 
          align-items: center; 
          text-align: center; 
          transition: 0.3s; 
          background: rgba(255,255,255,0.03); 
          border: 1px solid rgba(255,255,255,0.1); 
          min-width: 0; 
          flex: 1; 
          cursor: pointer;
        }
        
        .premium-btn {
          background: #fff;
          color: #000;
          border: none;
          padding: 6px 16px;
          border-radius: 40px;
          font-weight: 800;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.4s ease;
          box-shadow: 0 0 10px rgba(0,242,234,0.2);
        }
        .premium-btn:hover { background: #00f2ea; transform: scale(1.05); }

        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.95); backdrop-filter: blur(15px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: #111; border: 1px solid #222; padding: 30px; borderRadius: 24px; width: 85%; maxWidth: 350px; text-align:center; }
      `}</style>

      {view === "creator" ? (
        <>
          <nav style={styles.navbar}>
            <div style={styles.logo} onMouseDown={handleLogoTouchStart} onMouseUp={handleLogoTouchEnd} onTouchStart={handleLogoTouchStart} onTouchEnd={handleLogoTouchEnd}>
              MAKER<span style={{color:'#00f2ea'}}>PRO</span>
            </div>
            <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
              <div style={styles.langSwitch}>
                {['zh_tw', 'zh_cn', 'en'].map(l => (
                  <span key={l} onClick={()=>setLang(l)} style={{...styles.langItem, color: lang===l?'#00f2ea':'#555'}}>{l==='zh_tw'?'繁':l==='zh_cn'?'簡':'EN'}</span>
                ))}
              </div>
              <button className="premium-btn" onClick={handleAction}>
                {isLoggedIn ? (accountStatus==='pending' ? t.statusPending : t.nav[2]) : t.nav[2]}
              </button>
            </div>
          </nav>

          <header style={styles.hero}>
            <h1 className="hero-title" style={styles.heroTitle}>{t.hero[0]}<br /><span style={styles.gradientText}>{t.hero[1]}</span></h1>
            <p style={styles.heroSubtitle}>{t.subtitle}</p>
          </header>

          <section style={styles.section}>
            <div className="horizontal-grid" style={styles.horizontalGrid}>
              {[t.logic1.t1, t.logic1.t2, t.logic1.t3].map((item, i) => (
                <div key={i} className="square-card" onClick={handleAction} style={{borderRadius: '12px', padding: '10px'}}>
                  <div style={{fontSize: '8px', color: '#00f2ea', marginBottom: '4px'}}>STEP 0{i+1}</div>
                  <h3 style={{fontSize: '12px', marginBottom: '2px', whiteSpace: 'nowrap'}}>{item[0]}</h3>
                  <div className="price-val" style={{fontSize: '24px', fontWeight: '900'}}>{item[1]}</div>
                  <div style={{fontSize: '10px', color:'#666'}}>TWD</div>
                </div>
              ))}
            </div>
          </section>

          <section style={{...styles.section, margin:'40px auto'}}>
            <div style={styles.calcContainer}>
              <h2 style={{textAlign:'center', marginBottom:'20px', fontSize: '18px'}}>{t.calcTitle}</h2>
              <input type="range" min="1" max="20" value={videoCount} onChange={(e)=>setVideoCount(e.target.value)} style={{width:'100%', accentColor:'#00f2ea'}} />
              <div className="calc-res-box" style={{display:'flex', gap:'10px', marginTop:'20px'}}>
                <div style={styles.calcRes}>
                  <div style={{fontSize:'10px', opacity:0.5}}>{t.normal}</div>
                  <div style={{fontSize:'18px', fontWeight:'bold'}}>{videoCount * 2000} TWD</div>
                </div>
                <div style={{...styles.calcRes, border: '1px solid #00f2ea'}}>
                  <div style={{fontSize:'10px', color:'#00f2ea'}}>{t.pro}</div>
                  <div style={{fontSize:'18px', fontWeight:'bold', color:'#00f2ea'}}>{videoCount * 4800} TWD+</div>
                </div>
              </div>
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={{textAlign:'center', marginBottom:'20px', fontSize: '18px'}}>{t.logic2.title}</h2>
            <div style={styles.memberGrid}>
              {[t.logic2.lv1, t.logic2.lv2, t.logic2.lv3].map((lv, i) => (
                <div key={i} style={{...styles.memberCard, border: i===1?'1px solid #00f2ea':'1px solid #1a1a1a'}}>
                  <h3 style={{color: i===1?'#00f2ea':i===2?'#ff0050':'#fff', fontSize: '16px'}}>{lv[0]}</h3>
                  <div style={styles.lvPoint}>✓ {lv[2]}</div>
                  <div style={styles.lvPoint}>✓ {lv[3]}</div>
                  {i === 1 && <button onClick={()=>{if(!isLoggedIn) handleAction(); else setIsRedCreator(true)}} style={styles.upgradeBtn}>{isRedCreator ? 'ACTIVE' : t.upgradeBtnTxt}</button>}
                </div>
              ))}
            </div>
          </section>

          <div style={styles.walletBoxFloat}>Wallet: {userBalance} TWD</div>
        </>
      ) : (
        <div style={{padding:'30px'}}>
           <h2 style={{color:'#00f2ea'}}>Admin System</h2>
           <button onClick={()=>setView("creator")} style={{marginTop:'20px', padding:'10px 20px'}}>Exit</button>
           <input value={qrCodeUrl} onChange={(e) => setQrCodeUrl(e.target.value)} style={styles.modalInput} placeholder="QR URL" />
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 style={{marginBottom:'15px', fontSize:'18px'}}>{t.modals[modalType]?.title}</h2>
            {modalType === "service" ? (
              <img src={qrCodeUrl} alt="QR" style={{width:'150px', borderRadius:'10px', border:'2px solid #00f2ea'}} />
            ) : status === 'success' ? (
              <div style={{color:'#00f2ea'}}>✔ {t.successTxt}</div>
            ) : (
              <form onSubmit={executeLogic}>
                {modalType === "pending" ? <p style={{fontSize:'13px', color:'#888'}}>{t.modals.pending.desc}</p> : (
                  <>
                    <input required value={inputVal} onChange={e=>setInputVal(e.target.value)} type={modalType==="adminLogin"?"password":"text"} placeholder={t.modals[modalType]?.placeholder} style={styles.modalInput} />
                    <button type="submit" style={styles.modalBtn}>{status === 'processing' ? "..." : t.modals[modalType]?.btn}</button>
                  </>
                )}
              </form>
            )}
            <button type="button" onClick={()=>setShowModal(false)} style={styles.cancelBtn}>{t.closeBtn}</button>
          </div>
        </div>
      )}
    </div>
  );
}

const content = {
  zh_tw: {
    nav: ["任務", "等級", "加入創客"], hero: ["TikTok", "創客達人招募"],
    subtitle: "發佈一條視頻就有 20 台幣！播放獎金疊加。",
    calcTitle: "月收入收益模擬", calcLabel: "每日發佈數", normal: "見習月收益", pro: "紅創客月收益",
    statusPending: "審核中", upgradeBtnTxt: "立即升級", successTxt: "成功", closeBtn: "關閉",
    logic1: { t1: ["基礎獎勵", "20", ""], t2: ["中級獎", "40", ""], t3: ["爆款獎", "100+", ""] },
    logic2: { title: "成長體系", lv1: ["見習", "", "20 TWD/條", "5% 提成"], lv2: ["紅創客", "", "30 TWD/條", "10% 提成"], lv3: ["導師", "", "300+ 獎金", "15% 提成"] },
    modals: {
      login: { title: "登錄", placeholder: "手機/Email", btn: "下一步" },
      bind: { title: "綁定", placeholder: "TikTok Link", btn: "提交" },
      pending: { title: "審核中", desc: "賬號審核中，通過後開啟獎金" },
      task: { title: "提交任務", placeholder: "Video Link", btn: "領取獎金" },
      adminLogin: { title: "Admin", placeholder: "Password", btn: "Login" },
      service: { title: "客服", desc: "掃碼聯繫客服" }
    }
  },
  zh_cn: {
    nav: ["任务", "等级", "加入创客"], hero: ["TikTok", "创客达人招募"],
    subtitle: "发布一条视频就有 20 台币！播放奖金叠加。",
    calcTitle: "月收入收益模拟", calcLabel: "每日发布数", normal: "见习月收益", pro: "红创客月收益",
    statusPending: "审核中", upgradeBtnTxt: "立即升级", successTxt: "成功", closeBtn: "关闭",
    logic1: { t1: ["基础奖励", "20", ""], t2: ["中级奖", "40", ""], t3: ["爆款奖", "100+", ""] },
    logic2: { title: "成长体系", lv1: ["见习", "", "20 TWD/条", "5% 提成"], lv2: ["红创客", "", "30 TWD/条", "10% 提成"], lv3: ["导师", "", "300+ 奖金", "15% 提成"] },
    modals: {
      login: { title: "登录", placeholder: "手机/Email", btn: "下一步" },
      bind: { title: "绑定", placeholder: "TikTok Link", btn: "提交" },
      pending: { title: "审核中", desc: "账号审核中，通过后开启奖金" },
      task: { title: "提交任务", placeholder: "Video Link", btn: "领取奖金" },
      adminLogin: { title: "Admin", placeholder: "Password", btn: "Login" },
      service: { title: "客服", desc: "扫码联系客服" }
    }
  },
  en: {
    nav: ["Task", "Rank", "Join"], hero: ["TikTok", "Creator Hunt"],
    subtitle: "20 TWD per post! Bonuses included.",
    calcTitle: "Income Simulator", calcLabel: "Daily Posts", normal: "Trainee", pro: "Red Creator",
    statusPending: "Pending", upgradeBtnTxt: "Upgrade", successTxt: "OK", closeBtn: "Close",
    logic1: { t1: ["Basic", "20", ""], t2: ["Mid", "40", ""], t3: ["Viral", "100+", ""] },
    logic2: { title: "Levels", lv1: ["Trainee", "", "20/post", "5%"], lv2: ["Red", "", "30/post", "10%"], lv3: ["Mentor", "", "300+ Bonus", "15%"] },
    modals: {
      login: { title: "Login", placeholder: "Email", btn: "Next" },
      bind: { title: "Bind", placeholder: "TikTok Link", btn: "Submit" },
      pending: { title: "Review", desc: "Reviewing account..." },
      task: { title: "Submit", placeholder: "Video Link", btn: "Claim" },
      adminLogin: { title: "Admin", placeholder: "Password", btn: "Login" },
      service: { title: "Support", desc: "Scan for Help" }
    }
  }
};

const styles = {
  container: { backgroundColor: '#050505', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' },
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', borderBottom: '1px solid #111', sticky: 'top', background: '#050505', zIndex: 100 },
  logo: { fontSize: '18px', fontWeight: '900' },
  langSwitch: { display: 'flex', gap: '5px' },
  langItem: { fontSize: '10px', cursor: 'pointer', fontWeight: 'bold' },
  walletBoxFloat: { position:'fixed', top: '60px', right: '15px', background:'rgba(0,242,234,0.1)', padding:'4px 10px', borderRadius:'10px', fontSize:'10px', color:'#00f2ea', zIndex: 90 },
  hero: { textAlign: 'center', padding: '50px 15px 30px' },
  heroTitle: { fontWeight: '900', lineHeight: 1.1 },
  gradientText: { background: 'linear-gradient(90deg, #00f2ea, #fff, #ff0050)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  heroSubtitle: { color: '#666', margin: '10px auto', fontSize: '12px' },
  section: { maxWidth: '100%', padding: '0 15px' },
  horizontalGrid: { display: 'flex', gap: '8px', justifyContent: 'center' },
  calcContainer: { background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '20px' },
  calcRes: { flex: 1, padding: '15px', borderRadius: '10px', background: 'rgba(255,255,255,0.01)', textAlign:'center' },
  memberGrid: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  memberCard: { flex: 1, padding: '20px', background: '#0a0a0a', borderRadius: '15px', textAlign: 'center', minWidth: '140px' },
  lvPoint: { fontSize: '11px', color: '#777', margin: '5px 0' },
  upgradeBtn: { background: 'linear-gradient(90deg, #ff0050, #00f2ea)', border: 'none', color: '#fff', width:'100%', padding:'8px', borderRadius:'8px', marginTop:'10px', fontWeight:'bold', fontSize:'11px' },
  modalInput: { width: '100%', background: '#000', border: '1px solid #333', padding: '12px', borderRadius: '8px', color: '#fff', marginBottom: '15px', fontSize: '13px' },
  modalBtn: { width: '100%', background: '#fff', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' },
  cancelBtn: { background: 'none', color: '#444', border: 'none', width: '100%', marginTop: '10px', fontSize: '11px' }
};