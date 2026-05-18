const http = require('http');
const PORT = process.env.PORT || 3000;

let stockData = null;

const STOCK_INICIAL = {"items":[
  {"id":1,"pallet":1,"mat":"Galvanizada","esp":"0.5mm","med":"1200x2500","tipo":"Entera","qty":7},
  {"id":2,"pallet":1,"mat":"Galvanizada","esp":"0.8mm","med":"1200x1300","tipo":"Recorte","qty":6},
  {"id":3,"pallet":1,"mat":"Galvanizada","esp":"2mm","med":"1200x2500","tipo":"Entera","qty":1},
  {"id":4,"pallet":2,"mat":"Inox 304","esp":"0.5mm","med":"1250x2500","tipo":"Entera","qty":5},
  {"id":5,"pallet":2,"mat":"Inox 304","esp":"1.2mm","med":"1300x1300","tipo":"Recorte","qty":1},
  {"id":6,"pallet":2,"mat":"Inox 304","esp":"1mm","med":"1500","tipo":"—","qty":1},
  {"id":7,"pallet":3,"mat":"Inox 304","esp":"2mm","med":"—","tipo":"Entera","qty":3},
  {"id":8,"pallet":3,"mat":"Inox 304","esp":"2mm","med":"—","tipo":"Recorte grande","qty":1},
  {"id":9,"pallet":3,"mat":"Inox 304","esp":"2.5mm","med":"1500x2300","tipo":"Recorte","qty":1},
  {"id":10,"pallet":3,"mat":"Inox 316","esp":"2mm","med":"950x1500","tipo":"Recorte","qty":1},
  {"id":11,"pallet":3,"mat":"Inox 316","esp":"2mm","med":"1500x1500","tipo":"Recorte","qty":1},
  {"id":12,"pallet":4,"mat":"Inox 304","esp":"1.2mm","med":"—","tipo":"—","qty":3},
  {"id":13,"pallet":5,"mat":"Inox 304","esp":"4mm","med":"1000x1500","tipo":"Recorte","qty":1},
  {"id":14,"pallet":5,"mat":"Inox 304","esp":"5mm","med":"—","tipo":"—","qty":1},
  {"id":15,"pallet":5,"mat":"Inox 304","esp":"6mm","med":"900x1300","tipo":"Recorte","qty":1},
  {"id":16,"pallet":5,"mat":"Inox 304","esp":"10mm","med":"600x1100","tipo":"Recorte","qty":1},
  {"id":17,"pallet":6,"mat":"Acero Carbono","esp":"1.5mm","med":"—","tipo":"—","qty":1},
  {"id":18,"pallet":6,"mat":"Acero Carbono","esp":"2mm","med":"760x1500","tipo":"Recorte","qty":1},
  {"id":19,"pallet":6,"mat":"Acero Carbono","esp":"3mm","med":"1200x1500","tipo":"Recorte","qty":1},
  {"id":20,"pallet":6,"mat":"Acero Carbono","esp":"5mm","med":"1500x1500","tipo":"Recorte","qty":1},
  {"id":21,"pallet":6,"mat":"Acero Carbono","esp":"6mm","med":"200x1500","tipo":"Recorte","qty":1},
  {"id":22,"pallet":6,"mat":"Acero Carbono","esp":"6mm","med":"1100x1500","tipo":"Recorte","qty":1},
  {"id":23,"pallet":7,"mat":"Acero Corten","esp":"2mm","med":"—","tipo":"Entera","qty":1},
  {"id":24,"pallet":7,"mat":"Acero Corten","esp":"2mm","med":"1200x1500","tipo":"Recorte","qty":1},
  {"id":25,"pallet":7,"mat":"Acero Corten","esp":"3mm","med":"—","tipo":"Entera","qty":1},
  {"id":26,"pallet":7,"mat":"Acero Corten","esp":"3mm","med":"1470x1220","tipo":"Recorte","qty":1},
  {"id":27,"pallet":8,"mat":"Acero Carbono","esp":"1.5mm","med":"—","tipo":"Entera","qty":2},
  {"id":28,"pallet":8,"mat":"Acero Carbono","esp":"2mm","med":"—","tipo":"Entera","qty":4},
  {"id":29,"pallet":8,"mat":"Acero Descapado","esp":"1.5mm","med":"—","tipo":"Entera","qty":2},
  {"id":30,"pallet":8,"mat":"Acero Descapado","esp":"2mm","med":"—","tipo":"Entera","qty":2},
  {"id":31,"pallet":8,"mat":"Acero Descapado","esp":"2mm","med":"1000x2000","tipo":"Recorte","qty":1},
  {"id":32,"pallet":8,"mat":"Acero Descapado","esp":"3mm","med":"—","tipo":"Entera","qty":2},
  {"id":33,"pallet":8,"mat":"Acero Descapado","esp":"3mm","med":"2000x460","tipo":"Recorte","qty":1},
  {"id":34,"pallet":8,"mat":"Acero Descapado","esp":"3mm","med":"1220x1000","tipo":"Recorte","qty":1},
  {"id":35,"pallet":8,"mat":"Acero Descapado","esp":"3mm","med":"1225x920","tipo":"Recorte","qty":1},
  {"id":36,"pallet":8,"mat":"Acero Descapado","esp":"3mm","med":"2070x450","tipo":"Recorte","qty":1},
  {"id":37,"pallet":8,"mat":"Acero Descapado","esp":"3mm","med":"1220x655","tipo":"Recorte","qty":1},
  {"id":38,"pallet":8,"mat":"Acero Descapado","esp":"3mm","med":"2350x460","tipo":"Recorte","qty":1},
  {"id":39,"pallet":9,"mat":"Acero Carbono","esp":"6mm","med":"1500x1500","tipo":"Entera","qty":1},
  {"id":40,"pallet":9,"mat":"Acero Carbono","esp":"6mm","med":"—","tipo":"Entera","qty":1},
  {"id":41,"pallet":9,"mat":"Acero Carbono","esp":"8mm","med":"—","tipo":"Entera","qty":1},
  {"id":42,"pallet":9,"mat":"Acero Carbono","esp":"10mm","med":"—","tipo":"Entera","qty":1},
  {"id":43,"pallet":9,"mat":"Acero Carbono","esp":"12mm","med":"—","tipo":"Entera","qty":1}
],"nextId":44,"ts":1700000000000};

const HTML = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Stock de Chapas — Taller</title>
<style>
  :root {
    --bg:#f5f4f0;--surface:#ffffff;--surface2:#f0eeea;
    --border:#dddbd5;--border2:#c8c5be;
    --text:#1a1917;--text2:#6b6860;--text3:#9e9b94;
    --green-bg:#e6f4e6;--green-text:#1e5c1e;
    --amber-bg:#fef3db;--amber-text:#7a4f00;
    --red-bg:#fde8e8;--red-text:#8b1c1c;
    --inox-bg:#e2f0ee;--inox-text:#0f5c4a;
    --galv-bg:#e4edf8;--galv-text:#1a3f7a;
    --carb-bg:#ebebeb;--carb-text:#2a2a2a;
    --desc-bg:#ece8f8;--desc-text:#3a2070;
    --cort-bg:#fef0e0;--cort-text:#7a3a00;
    --radius:8px;--shadow:0 1px 3px rgba(0,0,0,.08);
  }
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',system-ui,sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
  .topbar{background:var(--text);color:#fff;padding:14px 28px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}
  .topbar-title{font-size:16px;font-weight:600;letter-spacing:.3px}
  .topbar-sub{font-size:12px;opacity:.5;margin-top:2px}
  .topbar-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  .btn-top{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);color:#fff;padding:7px 14px;border-radius:var(--radius);cursor:pointer;font-size:13px;font-weight:500;white-space:nowrap}
  .btn-top:hover{background:rgba(255,255,255,.22)}
  .btn-danger{background:rgba(255,80,80,.18);border-color:rgba(255,80,80,.3)}
  .sync-indicator{font-size:12px;opacity:.8;display:flex;align-items:center;gap:6px;padding:5px 12px;border-radius:20px;border:1px solid rgba(255,255,255,.2)}
  .sync-dot{width:8px;height:8px;border-radius:50%;background:#4caf50;flex-shrink:0}
  .sync-dot.syncing{background:#ff9800;animation:blink .4s infinite alternate}
  .sync-dot.error{background:#f44336}
  @keyframes blink{from{opacity:1}to{opacity:.2}}
  .main{max-width:1100px;margin:0 auto;padding:24px 20px}

  .banner-error{display:none;align-items:center;gap:10px;padding:12px 16px;border-radius:var(--radius);margin-bottom:16px;font-size:13px;font-weight:500;background:#fff3e0;color:#e65100;border:1px solid #ffb74d}

  .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
  .stat{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:14px 16px;box-shadow:var(--shadow)}
  .stat-num{font-size:26px;font-weight:700;line-height:1}
  .stat-lbl{font-size:11px;color:var(--text2);margin-top:4px;text-transform:uppercase;letter-spacing:.5px}
  .stat-warn .stat-num{color:#c07800}
  .stat-crit .stat-num{color:#b22020}

  .alert-crit{display:none;align-items:center;gap:12px;padding:13px 18px;border-radius:var(--radius);margin-bottom:16px;font-size:13px;font-weight:600;background:var(--red-bg);color:var(--red-text);border:1.5px solid #e04040;animation:pulse .9s ease-in-out infinite alternate}
  @keyframes pulse{from{opacity:1;box-shadow:0 0 0 0 rgba(220,50,50,.2)}to{opacity:.8;box-shadow:0 0 0 6px rgba(220,50,50,0)}}

  .toolbar{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:12px 16px;margin-bottom:16px;display:flex;gap:10px;flex-wrap:wrap;align-items:center;box-shadow:var(--shadow)}
  .search-wrap{flex:1;min-width:200px;position:relative}
  .search-wrap input{width:100%;height:34px;padding:0 10px 0 34px;border:1px solid var(--border);border-radius:var(--radius);font-size:13px;background:var(--surface2);color:var(--text)}
  .search-wrap input:focus{outline:none;border-color:var(--border2);background:#fff}
  .search-icon{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--text3);pointer-events:none}
  .filter-btns{display:flex;gap:5px;flex-wrap:wrap}
  .fbtn{height:30px;padding:0 12px;border-radius:20px;border:1px solid var(--border);background:none;cursor:pointer;font-size:12px;color:var(--text2);font-weight:500}
  .fbtn:hover{border-color:var(--border2);color:var(--text)}
  .fbtn.active{background:var(--text);color:#fff;border-color:var(--text)}

  .pallet-section{margin-bottom:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow)}
  .pallet-header{display:flex;align-items:center;gap:10px;padding:10px 16px;background:var(--surface2);border-bottom:1px solid var(--border)}
  .pallet-num{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
  .pallet-badge{font-size:11px;padding:2px 9px;border-radius:20px;font-weight:600}
  .pb-crit{background:var(--red-bg);color:var(--red-text)}
  .pb-warn{background:var(--amber-bg);color:var(--amber-text)}
  .pallet-count{margin-left:auto;font-size:11px;color:var(--text3)}
  table{width:100%;border-collapse:collapse}
  thead th{text-align:left;font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;padding:8px 14px;border-bottom:1px solid var(--border)}
  tbody tr{border-bottom:1px solid var(--border)}
  tbody tr:last-child{border-bottom:none}
  tbody tr:hover{background:var(--surface2)}
  tbody td{padding:9px 14px;font-size:13px;vertical-align:middle}
  .mat-tag{display:inline-block;padding:3px 8px;border-radius:5px;font-size:11px;font-weight:600}
  .mat-inox{background:var(--inox-bg);color:var(--inox-text)}
  .mat-galv{background:var(--galv-bg);color:var(--galv-text)}
  .mat-carb{background:var(--carb-bg);color:var(--carb-text)}
  .mat-desc{background:var(--desc-bg);color:var(--desc-text)}
  .mat-cort{background:var(--cort-bg);color:var(--cort-text)}
  .badge{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600}
  .badge-ok{background:var(--green-bg);color:var(--green-text)}
  .badge-warn{background:var(--amber-bg);color:var(--amber-text)}
  .badge-crit{background:var(--red-bg);color:var(--red-text)}
  .qty-wrap{display:flex;align-items:center;gap:6px}
  .qty-btn{width:24px;height:24px;border-radius:5px;border:1px solid var(--border);background:var(--surface2);cursor:pointer;font-size:15px;font-weight:700;color:var(--text2);display:flex;align-items:center;justify-content:center}
  .qty-btn:hover{background:var(--border);color:var(--text)}
  .qty-input{width:50px;height:28px;text-align:center;font-size:13px;font-weight:600;border-radius:5px;border:1px solid var(--border);background:var(--surface);color:var(--text)}
  .qty-input:focus{outline:none;border-color:var(--border2)}
  .qty-input.warn{border-color:#e0a020;background:var(--amber-bg);color:var(--amber-text)}
  .qty-input.crit{border-color:#e04040;background:var(--red-bg);color:var(--red-text)}
  .btn-del{background:none;border:none;cursor:pointer;color:var(--text3);padding:4px 6px;border-radius:5px;font-size:15px}
  .btn-del:hover{color:var(--red-text);background:var(--red-bg)}

  .add-section{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px 20px;margin-top:8px;box-shadow:var(--shadow)}
  .add-title{font-size:13px;font-weight:700;margin-bottom:14px;text-transform:uppercase;letter-spacing:.5px}
  .add-grid{display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end}
  .add-field{display:flex;flex-direction:column;gap:4px}
  .add-field label{font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.4px}
  .add-field select,.add-field input{height:34px;padding:0 10px;border:1px solid var(--border);border-radius:var(--radius);font-size:13px;background:var(--surface2);color:var(--text)}
  .add-field select:focus,.add-field input:focus{outline:none;border-color:var(--border2);background:#fff}
  .btn-add{height:34px;padding:0 18px;background:var(--text);color:#fff;border:none;border-radius:var(--radius);cursor:pointer;font-size:13px;font-weight:600;align-self:flex-end}
  .btn-add:hover{background:#333}
  .std-hint{font-size:11px;color:var(--text3);margin-top:8px;min-height:16px}

  .ref-section{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);margin-top:16px;box-shadow:var(--shadow);overflow:hidden}
  .ref-toggle{display:flex;align-items:center;gap:8px;padding:12px 18px;cursor:pointer;user-select:none}
  .ref-toggle:hover{background:var(--surface2)}
  .ref-toggle-title{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
  .ref-arrow{margin-left:auto;font-size:12px;color:var(--text3);transition:transform .2s}
  .ref-toggle.open .ref-arrow{transform:rotate(180deg)}
  .ref-body{display:none;padding:16px 18px;border-top:1px solid var(--border)}
  .ref-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
  .ref-card{background:var(--surface2);border-radius:var(--radius);padding:12px 14px;border:1px solid var(--border)}
  .ref-card-title{font-size:12px;font-weight:700;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--border)}
  .ref-inox .ref-card-title{color:var(--inox-text)}
  .ref-galv .ref-card-title{color:var(--galv-text)}
  .ref-carb .ref-card-title{color:var(--carb-text)}
  .ref-card ul{list-style:none}
  .ref-card li{font-size:11px;color:var(--text2);padding:3px 0;border-bottom:1px solid var(--border)}
  .ref-card li:last-child{border-bottom:none}
  .ref-sub{font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin:8px 0 4px}

  .empty{text-align:center;padding:32px;color:var(--text3);font-size:13px}
  .footer{text-align:center;font-size:11px;color:var(--text3);padding:24px}
  .toast{position:fixed;bottom:24px;right:24px;background:#1a1917;color:#fff;padding:10px 18px;border-radius:var(--radius);font-size:13px;font-weight:500;opacity:0;transform:translateY(10px);transition:all .3s;pointer-events:none;z-index:999}
  .toast.show{opacity:1;transform:translateY(0)}
  @media(max-width:700px){.stats{grid-template-columns:repeat(2,1fr)}.ref-grid{grid-template-columns:1fr}.topbar{padding:12px 16px}.main{padding:16px 12px}}
</style>
</head>
<body>

<div class="topbar">
  <div>
    <div class="topbar-title">📦 Stock de Chapas — Taller</div>
    <div class="topbar-sub">Inventario compartido · Accesible desde cualquier PC</div>
  </div>
  <div class="topbar-actions">
    <div class="sync-indicator">
      <span class="sync-dot" id="sync-dot"></span>
      <span id="sync-txt">Conectando...</span>
    </div>
    <button class="btn-top" onclick="exportCSV()">⬇ Exportar CSV</button>
    <button class="btn-top btn-danger" onclick="resetStock()">🗑 Reiniciar</button>
  </div>
</div>

<div class="main">

  <div id="banner-error" class="banner-error" style="display:flex">
    ⚠️ <span id="banner-error-txt">Conectando con el servidor... Abrí primero <b>INICIAR_SERVIDOR.bat</b> en esta PC.</span>
  </div>

  <div class="stats">
    <div class="stat"><div class="stat-num" id="s-total">—</div><div class="stat-lbl">Unidades en stock</div></div>
    <div class="stat"><div class="stat-num" id="s-pallets">—</div><div class="stat-lbl">Pallets</div></div>
    <div class="stat stat-warn"><div class="stat-num" id="s-warn">—</div><div class="stat-lbl">Stock bajo (≤2)</div></div>
    <div class="stat stat-crit"><div class="stat-num" id="s-crit">—</div><div class="stat-lbl">Sin stock</div></div>
  </div>

  <div id="alert-crit" class="alert-crit">
    <span style="font-size:20px;flex-shrink:0">🚨</span>
    <span id="alert-crit-text"></span>
  </div>

  <div class="toolbar">
    <div class="search-wrap">
      <span class="search-icon">🔍</span>
      <input type="text" id="search" placeholder="Buscar por material, espesor, medida..." oninput="render()">
    </div>
    <div class="filter-btns">
      <button class="fbtn active" data-f="all" onclick="setFilter(this)">Todas</button>
      <button class="fbtn" data-f="warn" onclick="setFilter(this)">Stock bajo</button>
      <button class="fbtn" data-f="crit" onclick="setFilter(this)">Sin stock</button>
      <button class="fbtn" data-f="Inox" onclick="setFilter(this)">Inox</button>
      <button class="fbtn" data-f="Galvanizada" onclick="setFilter(this)">Galvanizada</button>
      <button class="fbtn" data-f="Carbon" onclick="setFilter(this)">Carbono</button>
      <button class="fbtn" data-f="Corten" onclick="setFilter(this)">Corten</button>
    </div>
  </div>

  <div id="main-content"><div class="empty">Cargando stock...</div></div>

  <div class="add-section">
    <div class="add-title">➕ Agregar chapa al stock</div>
    <div class="add-grid">
      <div class="add-field"><label>Pallet</label>
        <select id="n-pallet" style="width:100px">
          <option value="1">Pallet 1</option><option value="2">Pallet 2</option><option value="3">Pallet 3</option>
          <option value="4">Pallet 4</option><option value="5">Pallet 5</option><option value="6">Pallet 6</option>
          <option value="7">Pallet 7</option><option value="8">Pallet 8</option><option value="9">Pallet 9</option>
        </select>
      </div>
      <div class="add-field"><label>Material</label>
        <select id="n-mat" style="width:160px" onchange="updateEspesores()">
          <option>Inox 304</option><option>Inox 316</option><option>Inox 430</option>
          <option>Galvanizada</option><option>Acero Carbono</option><option>Acero Descapado</option><option>Acero Corten</option>
        </select>
      </div>
      <div class="add-field"><label>Espesor</label><select id="n-esp" style="width:100px" onchange="updateMedidas()"></select></div>
      <div class="add-field"><label>Medida estándar</label><select id="n-med-std" style="width:150px"></select></div>
      <div class="add-field"><label>O medida libre</label><input id="n-med-custom" type="text" placeholder="ej: 800x1500" style="width:130px"></div>
      <div class="add-field"><label>Tipo</label>
        <select id="n-tipo" style="width:130px"><option>Entera</option><option>Recorte</option><option>Recorte grande</option></select>
      </div>
      <div class="add-field"><label>Cantidad</label><input id="n-qty" type="number" placeholder="0" min="0" style="width:70px"></div>
      <button class="btn-add" onclick="addRow()">➕ Agregar</button>
    </div>
    <div class="std-hint" id="std-hint"></div>
  </div>

  <div class="ref-section">
    <div class="ref-toggle" onclick="toggleRef(this)">
      <span>📐</span><span class="ref-toggle-title">Medidas estándar de referencia</span>
      <span class="ref-arrow">▼</span>
    </div>
    <div class="ref-body" id="ref-body">
      <div class="ref-grid">
        <div class="ref-card ref-inox">
          <div class="ref-card-title">Inox 304 / 316 / 430</div>
          <div class="ref-sub">Medidas (mm)</div>
          <ul><li>1000 × 2000</li><li>1220 × 2440</li><li>1250 × 2500</li><li>1500 × 3000</li><li>1000 × 3000</li><li>2000 × 4000</li></ul>
          <div class="ref-sub">Espesores (mm)</div>
          <ul><li>0.4 · 0.5 · 0.6 · 0.8</li><li>1.0 · 1.2 · 1.5</li><li>2.0 · 2.5 · 3.0</li><li>4.0 · 5.0 · 6.0</li><li>8.0 · 10 · 12</li></ul>
        </div>
        <div class="ref-card ref-galv">
          <div class="ref-card-title">Galvanizada (DX51D)</div>
          <div class="ref-sub">Medidas (mm)</div>
          <ul><li>1000 × 2000</li><li>1200 × 2400</li><li>1220 × 2440</li><li>1250 × 2500</li><li>1500 × 3000</li></ul>
          <div class="ref-sub">Espesores (mm)</div>
          <ul><li>0.4 · 0.5 · 0.6</li><li>0.8 · 1.0 · 1.2</li><li>1.5 · 2.0 · 2.5 · 3.0</li></ul>
        </div>
        <div class="ref-card ref-carb">
          <div class="ref-card-title">Carbono / Descapado / Corten</div>
          <div class="ref-sub">Medidas (mm)</div>
          <ul><li>1000 × 2000</li><li>1220 × 2440</li><li>1500 × 3000</li><li>2000 × 6000</li></ul>
          <div class="ref-sub">Espesores (mm)</div>
          <ul><li>0.6 · 0.8 · 1.0</li><li>1.2 · 1.5 · 2.0</li><li>3.0 · 4.0 · 5.0</li><li>6.0 · 8.0 · 10 · 12</li></ul>
        </div>
      </div>
    </div>
  </div>
  <div class="footer">Stock de Chapas Taller · Última modificación: <span id="fecha-mod">—</span></div>
</div>

<div class="toast" id="toast"></div>

<script>
const API = 'https://stock-chapas-taller.onrender.com';
const STD = {
  "Inox 304":       {esp:["0.4mm","0.5mm","0.6mm","0.8mm","1mm","1.2mm","1.5mm","2mm","2.5mm","3mm","4mm","5mm","6mm","8mm","10mm","12mm"],med:["1000x2000","1220x2440","1250x2500","1500x3000","1000x3000","2000x4000"]},
  "Inox 316":       {esp:["0.5mm","0.8mm","1mm","1.2mm","1.5mm","2mm","2.5mm","3mm","4mm","5mm","6mm","8mm","10mm","12mm"],med:["1000x2000","1220x2440","1250x2500","1500x3000","2000x4000"]},
  "Inox 430":       {esp:["0.4mm","0.5mm","0.6mm","0.8mm","1mm","1.2mm","1.5mm","2mm","3mm"],med:["1000x2000","1220x2440","1250x2500","1500x3000"]},
  "Galvanizada":    {esp:["0.4mm","0.5mm","0.6mm","0.8mm","1mm","1.2mm","1.5mm","2mm","2.5mm","3mm"],med:["1000x2000","1200x2400","1220x2440","1250x2500","1500x3000"]},
  "Acero Carbono":  {esp:["0.6mm","0.8mm","1mm","1.2mm","1.5mm","2mm","3mm","4mm","5mm","6mm","8mm","10mm","12mm"],med:["1000x2000","1220x2440","1500x3000","2000x6000"]},
  "Acero Descapado":{esp:["0.6mm","0.8mm","1mm","1.2mm","1.5mm","2mm","3mm","4mm","5mm","6mm","8mm","10mm","12mm"],med:["1000x2000","1220x2440","1500x3000","2000x6000"]},
  "Acero Corten":   {esp:["1.5mm","2mm","3mm","4mm","5mm","6mm","8mm","10mm","12mm"],med:["1000x2000","1220x2440","1500x3000","2000x6000"]},
};
const INICIAL = [
  {pallet:1,mat:"Galvanizada",esp:"0.5mm",med:"1200x2500",tipo:"Entera",qty:7},
  {pallet:1,mat:"Galvanizada",esp:"0.8mm",med:"1200x1300",tipo:"Recorte",qty:6},
  {pallet:1,mat:"Galvanizada",esp:"2mm",med:"1200x2500",tipo:"Entera",qty:1},
  {pallet:2,mat:"Inox 304",esp:"0.5mm",med:"1250x2500",tipo:"Entera",qty:5},
  {pallet:2,mat:"Inox 304",esp:"1.2mm",med:"1300x1300",tipo:"Recorte",qty:1},
  {pallet:2,mat:"Inox 304",esp:"1mm",med:"1500",tipo:"—",qty:1},
  {pallet:3,mat:"Inox 304",esp:"2mm",med:"—",tipo:"Entera",qty:3},
  {pallet:3,mat:"Inox 304",esp:"2mm",med:"—",tipo:"Recorte grande",qty:1},
  {pallet:3,mat:"Inox 304",esp:"2.5mm",med:"1500x2300",tipo:"Recorte",qty:1},
  {pallet:3,mat:"Inox 316",esp:"2mm",med:"950x1500",tipo:"Recorte",qty:1},
  {pallet:3,mat:"Inox 316",esp:"2mm",med:"1500x1500",tipo:"Recorte",qty:1},
  {pallet:4,mat:"Inox 304",esp:"1.2mm",med:"—",tipo:"—",qty:3},
  {pallet:5,mat:"Inox 304",esp:"4mm",med:"1000x1500",tipo:"Recorte",qty:1},
  {pallet:5,mat:"Inox 304",esp:"5mm",med:"—",tipo:"—",qty:1},
  {pallet:5,mat:"Inox 304",esp:"6mm",med:"900x1300",tipo:"Recorte",qty:1},
  {pallet:5,mat:"Inox 304",esp:"10mm",med:"600x1100",tipo:"Recorte",qty:1},
  {pallet:6,mat:"Acero Carbono",esp:"1.5mm",med:"—",tipo:"—",qty:1},
  {pallet:6,mat:"Acero Carbono",esp:"2mm",med:"760x1500",tipo:"Recorte",qty:1},
  {pallet:6,mat:"Acero Carbono",esp:"3mm",med:"1200x1500",tipo:"Recorte",qty:1},
  {pallet:6,mat:"Acero Carbono",esp:"5mm",med:"1500x1500",tipo:"Recorte",qty:1},
  {pallet:6,mat:"Acero Carbono",esp:"6mm",med:"200x1500",tipo:"Recorte",qty:1},
  {pallet:6,mat:"Acero Carbono",esp:"6mm",med:"1100x1500",tipo:"Recorte",qty:1},
  {pallet:7,mat:"Acero Corten",esp:"2mm",med:"—",tipo:"Entera",qty:1},
  {pallet:7,mat:"Acero Corten",esp:"2mm",med:"1200x1500",tipo:"Recorte",qty:1},
  {pallet:7,mat:"Acero Corten",esp:"3mm",med:"—",tipo:"Entera",qty:1},
  {pallet:7,mat:"Acero Corten",esp:"3mm",med:"1470x1220",tipo:"Recorte",qty:1},
  {pallet:8,mat:"Acero Carbono",esp:"1.5mm",med:"—",tipo:"Entera",qty:2},
  {pallet:8,mat:"Acero Carbono",esp:"2mm",med:"—",tipo:"Entera",qty:4},
  {pallet:8,mat:"Acero Descapado",esp:"1.5mm",med:"—",tipo:"Entera",qty:2},
  {pallet:8,mat:"Acero Descapado",esp:"2mm",med:"—",tipo:"Entera",qty:2},
  {pallet:8,mat:"Acero Descapado",esp:"2mm",med:"1000x2000",tipo:"Recorte",qty:1},
  {pallet:8,mat:"Acero Descapado",esp:"3mm",med:"—",tipo:"Entera",qty:2},
  {pallet:8,mat:"Acero Descapado",esp:"3mm",med:"2000x460",tipo:"Recorte",qty:1},
  {pallet:8,mat:"Acero Descapado",esp:"3mm",med:"1220x1000",tipo:"Recorte",qty:1},
  {pallet:8,mat:"Acero Descapado",esp:"3mm",med:"1225x920",tipo:"Recorte",qty:1},
  {pallet:8,mat:"Acero Descapado",esp:"3mm",med:"2070x450",tipo:"Recorte",qty:1},
  {pallet:8,mat:"Acero Descapado",esp:"3mm",med:"1220x655",tipo:"Recorte",qty:1},
  {pallet:8,mat:"Acero Descapado",esp:"3mm",med:"2350x460",tipo:"Recorte",qty:1},
  {pallet:9,mat:"Acero Carbono",esp:"6mm",med:"1500x1500",tipo:"Entera",qty:1},
  {pallet:9,mat:"Acero Carbono",esp:"6mm",med:"—",tipo:"Entera",qty:1},
  {pallet:9,mat:"Acero Carbono",esp:"8mm",med:"—",tipo:"Entera",qty:1},
  {pallet:9,mat:"Acero Carbono",esp:"10mm",med:"—",tipo:"Entera",qty:1},
  {pallet:9,mat:"Acero Carbono",esp:"12mm",med:"—",tipo:"Entera",qty:1},
];

let nextId=100, items=[], filter="all", saveTimer=null, conectado=false;

// ── SYNC CON SERVIDOR ─────────────────────────────────────────
function setSyncStatus(estado, msg) {
  const dot=document.getElementById("sync-dot"), txt=document.getElementById("sync-txt");
  dot.className="sync-dot"+(estado==="syncing"?" syncing":estado==="error"?" error":"");
  txt.textContent=msg; conectado=(estado==="ok");
  const banner=document.getElementById("banner-error");
  if(estado==="error"){ banner.style.display="flex"; document.getElementById("banner-error-txt").innerHTML=msg; }
  else banner.style.display="none";
}

async function cargarDesdeServidor() {
  try {
    setSyncStatus("syncing","Cargando...");
    const r=await fetch(API+"/stock",{signal:AbortSignal.timeout(3000)});
    if(!r.ok) throw new Error("Error HTTP "+r.status);
    const data=await r.json();
    if(data && data.items){
      items=data.items; nextId=data.nextId||100;
      actualizarFecha(data.ts);
    } else {
      // Primera vez: cargar stock inicial
      items=INICIAL.map(it=>({...it,id:nextId++}));
      await guardarEnServidor();
    }
    setSyncStatus("ok","Sincronizado ✓");
    render();
  } catch(e) {
    setSyncStatus("error","⚠️ Servidor no encontrado — Abrí <b>INICIAR_SERVIDOR.bat</b> primero");
    // Modo offline: intentar localStorage como fallback
    try {
      const raw=localStorage.getItem("stock_chapas_fallback");
      if(raw){const d=JSON.parse(raw);items=d.items||[];nextId=d.nextId||100;actualizarFecha(d.ts);}
      else {items=INICIAL.map(it=>({...it,id:nextId++}));}
    } catch(e2){}
    render();
    // Reintentar en 5 seg
    setTimeout(cargarDesdeServidor, 5000);
  }
}

async function guardarEnServidor() {
  const dot=document.getElementById("sync-dot"), txt=document.getElementById("sync-txt");
  dot.className="sync-dot syncing"; txt.textContent="Guardando...";
  clearTimeout(saveTimer);
  saveTimer=setTimeout(async()=>{
    const payload=JSON.stringify({items,nextId,ts:Date.now()});
    try {
      const r=await fetch(API+"/stock",{method:"POST",headers:{"Content-Type":"application/json"},body:payload,signal:AbortSignal.timeout(3000)});
      if(!r.ok) throw new Error();
      setSyncStatus("ok","Guardado en Z: ✓");
      actualizarFecha();
      // Guardar también fallback local
      localStorage.setItem("stock_chapas_fallback",payload);
    } catch(e) {
      setSyncStatus("error","⚠️ No se pudo guardar — abrí <b>INICIAR_SERVIDOR.bat</b>");
      localStorage.setItem("stock_chapas_fallback",payload);
    }
  },400);
}

// Recargar desde servidor cada 10 segundos (para ver cambios de otras PCs)
setInterval(async()=>{
  if(!conectado) return;
  try {
    const r=await fetch(API+"/stock",{signal:AbortSignal.timeout(3000)});
    const data=await r.json();
    if(data && data.ts && data.ts > (window._lastTs||0)){
      items=data.items; nextId=data.nextId||100; window._lastTs=data.ts;
      actualizarFecha(data.ts); render();
    }
  } catch(e){}
}, 10000);

function actualizarFecha(ts){
  const d=ts?new Date(ts):new Date();
  document.getElementById("fecha-mod").textContent=
    d.toLocaleDateString('es-UY',{day:'2-digit',month:'2-digit',year:'numeric'})+" "+
    d.toLocaleTimeString('es-UY',{hour:'2-digit',minute:'2-digit'});
  window._lastTs=ts||Date.now();
}

function resetStock(){
  if(!confirm("¿Borrar todo y volver al stock inicial?")) return;
  nextId=100; items=INICIAL.map(it=>({...it,id:nextId++}));
  guardarEnServidor(); render(); showToast("🔄 Stock reiniciado");
}

// ── UI HELPERS ────────────────────────────────────────────────
function showToast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2500);}
function updateEspesores(){const mat=document.getElementById("n-mat").value,sel=document.getElementById("n-esp");sel.innerHTML=(STD[mat]?.esp||[]).map(e=>\`<option>\${e}</option>\`).join("");updateMedidas();}
function updateMedidas(){const mat=document.getElementById("n-mat").value,esp=document.getElementById("n-esp").value,meds=STD[mat]?.med||[];document.getElementById("n-med-std").innerHTML=\`<option value="">— medida libre —</option>\`+meds.map(m=>\`<option value="\${m}">\${m} mm</option>\`).join("");document.getElementById("std-hint").textContent=mat&&esp?\`Medidas estándar para \${mat} \${esp}: \${meds.join(" · ")} mm\`:"";}
updateEspesores();
function getStatus(q){return q===0?"crit":q<=2?"warn":"ok"}
function matClass(m){const ml=m.toLowerCase();if(ml.includes("galvan"))return"mat-galv";if(ml.includes("inox"))return"mat-inox";if(ml.includes("corten"))return"mat-cort";if(ml.includes("descap"))return"mat-desc";return"mat-carb";}
function badgeHTML(q){const s=getStatus(q);if(s==="crit")return\`<span class="badge badge-crit">🔴 Sin stock</span>\`;if(s==="warn")return\`<span class="badge badge-warn">⚠️ Stock bajo</span>\`;return\`<span class="badge badge-ok">✅ OK</span>\`;}
function matches(it){const q=document.getElementById("search").value.toLowerCase();const txt=(it.mat+" "+it.esp+" "+it.med+" "+it.tipo).toLowerCase();if(!txt.includes(q))return false;if(filter==="warn")return getStatus(it.qty)==="warn";if(filter==="crit")return getStatus(it.qty)==="crit";if(filter==="all")return true;return it.mat.toLowerCase().includes(filter.toLowerCase());}

function render(){
  const pallets=[...new Set(items.map(x=>x.pallet))].sort((a,b)=>a-b);
  const cont=document.getElementById("main-content");
  let html="",any=false;
  pallets.forEach(p=>{
    const rows=items.filter(it=>it.pallet===p&&matches(it));
    if(!rows.length)return;any=true;
    const hasCrit=rows.some(x=>getStatus(x.qty)==="crit"),hasWarn=rows.some(x=>getStatus(x.qty)==="warn");
    html+=\`<div class="pallet-section"><div class="pallet-header"><span>📦</span><span class="pallet-num">Pallet \${p}</span>\${hasCrit?\`<span class="pallet-badge pb-crit">🔴 Sin stock</span>\`:""}\${hasWarn&&!hasCrit?\`<span class="pallet-badge pb-warn">⚠️ Stock bajo</span>\`:""}<span class="pallet-count">\${rows.length} ítem\${rows.length!==1?"s":""}</span></div>
    <table><thead><tr><th>Material</th><th>Espesor</th><th>Medidas</th><th>Tipo</th><th>Cantidad</th><th>Estado</th><th></th></tr></thead><tbody>
    \${rows.map(it=>{const s=getStatus(it.qty);return\`<tr><td><span class="mat-tag \${matClass(it.mat)}">\${it.mat}</span></td><td style="font-weight:600">\${it.esp}</td><td style="color:var(--text2);font-size:12px">\${it.med}</td><td style="color:var(--text2);font-size:12px">\${it.tipo}</td><td><div class="qty-wrap"><button class="qty-btn" onclick="changeQty(\${it.id},-1)">−</button><input class="qty-input \${s==="ok"?"":s}" type="number" min="0" value="\${it.qty}" onchange="updateQty(\${it.id},this.value)"><button class="qty-btn" onclick="changeQty(\${it.id},1)">+</button></div></td><td>\${badgeHTML(it.qty)}</td><td><button class="btn-del" onclick="deleteRow(\${it.id})">🗑</button></td></tr>\`;}).join("")}
    </tbody></table></div>\`;
  });
  if(!any)html=\`<div class="empty">No hay resultados</div>\`;
  cont.innerHTML=html;updateStats();
}

function changeQty(id,d){const it=items.find(x=>x.id===id);if(it){it.qty=Math.max(0,it.qty+d);render();guardarEnServidor();}}
function updateQty(id,v){const it=items.find(x=>x.id===id);if(it){it.qty=Math.max(0,parseInt(v)||0);render();guardarEnServidor();}}
function deleteRow(id){if(confirm("¿Eliminar esta chapa del stock?")){items=items.filter(x=>x.id!==id);render();guardarEnServidor();showToast("🗑 Chapa eliminada");}}
function addRow(){
  const p=parseInt(document.getElementById("n-pallet").value),m=document.getElementById("n-mat").value,e=document.getElementById("n-esp").value;
  const ms=document.getElementById("n-med-std").value,mc=document.getElementById("n-med-custom").value.trim(),med=mc||ms||"—";
  const t=document.getElementById("n-tipo").value,q=parseInt(document.getElementById("n-qty").value)||0;
  if(!m)return;
  items.push({id:nextId++,pallet:p,mat:m,esp:e||"—",med,tipo:t,qty:q});
  document.getElementById("n-med-custom").value="";document.getElementById("n-qty").value="";
  render();guardarEnServidor();showToast("✅ Chapa agregada al Pallet "+p);
}
function setFilter(btn){filter=btn.dataset.f;document.querySelectorAll(".fbtn").forEach(b=>b.classList.remove("active"));btn.classList.add("active");render();}
function updateStats(){
  const warn=items.filter(x=>getStatus(x.qty)==="warn"),crit=items.filter(x=>getStatus(x.qty)==="crit");
  document.getElementById("s-total").textContent=items.reduce((a,b)=>a+b.qty,0);
  document.getElementById("s-pallets").textContent=new Set(items.map(x=>x.pallet)).size;
  document.getElementById("s-warn").textContent=warn.length;
  document.getElementById("s-crit").textContent=crit.length;
  const bc=document.getElementById("alert-crit");
  if(crit.length>0){bc.style.display="flex";document.getElementById("alert-crit-text").textContent=\`SIN STOCK — Reponer urgente: \${crit.map(x=>x.mat+" "+x.esp+" (Pallet "+x.pallet+")").join(" · ")}\`;}
  else bc.style.display="none";
}
function toggleRef(el){const b=document.getElementById("ref-body"),open=b.style.display!=="block";b.style.display=open?"block":"none";el.classList.toggle("open",open);}
function exportCSV(){
  const lines=["Pallet,Material,Espesor,Medidas,Tipo,Cantidad,Estado"];
  items.forEach(it=>{const s=getStatus(it.qty)==="crit"?"Sin stock":getStatus(it.qty)==="warn"?"Stock bajo":"OK";lines.push(\`\${it.pallet},"\${it.mat}",\${it.esp},"\${it.med}","\${it.tipo}",\${it.qty},\${s}\`);});
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([lines.join("\\n")],{type:"text/csv"}));
  a.download="stock_chapas_"+new Date().toISOString().slice(0,10)+".csv";a.click();showToast("⬇ CSV exportado");
}

cargarDesdeServidor();
</script>
</body>
</html>
`;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(HTML);
    return;
  }
  if (req.method === 'GET' && req.url === '/stock') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(stockData || STOCK_INICIAL));
    return;
  }
  if (req.method === 'POST' && req.url === '/stock') {
    let b = '';
    req.on('data', c => b += c);
    req.on('end', () => {
      try {
        stockData = JSON.parse(b);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{"ok":true}');
      } catch(e) { res.writeHead(400); res.end('error'); }
    });
    return;
  }
  res.writeHead(404); res.end('not found');
});

server.listen(PORT, () => {
  console.log('Servidor Stock Chapas corriendo en puerto ' + PORT);
});
