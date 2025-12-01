import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { createActivityInstance } from "./src/core/factory/ActivityFactory.js";
import AnalyticsStore from "./src/store/AnalyticsStore.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const analyticsListPath = process.env.ANALYTICS_LIST_PATH || path.join(process.cwd(), "analytics_list_url.json");
const jsonParamsPath = process.env.JSON_PARAMS_PATH || path.join(process.cwd(), "json_params_url.json");

const activities = new Map();
const store = AnalyticsStore.getInstance();

app.get("/config", (req, res) => {
  const html = `
<div>
  <h3>ObjectTwins Configuração</h3>
  <form>
    <input type="hidden" name="activityKind" value="Modelagem3D" />
    <label>gravity</label>
    <input type="number" name="gravity" value="9.8" step="0.1" />
    <label>friction_coefficient</label>
    <input type="number" name="friction_coefficient" value="0.3" min="0" max="1" step="0.01" />
    <label>time_scale</label>
    <select name="time_scale">
      <option value="0.5">0.5</option>
      <option value="1.0" selected>1.0</option>
      <option value="2.0">2.0</option>
      <option value="4.0">4.0</option>
    </select>
    <label>max_simulation_time</label>
    <input type="number" name="max_simulation_time" value="300" />
    <label>allowed_primitives</label>
    <select name="allowed_primitives" multiple>
      <option value="cube" selected>cube</option>
      <option value="sphere" selected>sphere</option>
      <option value="cylinder">cylinder</option>
      <option value="custom_3d">custom_3d</option>
    </select>
    <label>max_objects_per_session</label>
    <input type="number" name="max_objects_per_session" value="20" />
    <label>allow_3d_import</label>
    <input type="checkbox" name="allow_3d_import" checked />
    <label>supported_formats</label>
    <select name="supported_formats" multiple>
      <option value="gltf" selected>gltf</option>
      <option value="obj" selected>obj</option>
      <option value="fbx">fbx</option>
    </select>
    <label>materials_database.enabled</label>
    <input type="checkbox" name="materials_database.enabled" checked />
    <label>allow_custom_composition</label>
    <input type="checkbox" name="allow_custom_composition" checked />
    <label>collision_simulation.enabled</label>
    <input type="checkbox" name="collision_simulation.enabled" checked />
    <label>damage_model</label>
    <input type="text" name="damage_model" value="linear_degradation" />
    <label>collision_detection_frequency</label>
    <input type="number" name="collision_detection_frequency" value="60" />
    <label>record_collision_events</label>
    <input type="checkbox" name="record_collision_events" checked />
    <label>data_export.enabled</label>
    <input type="checkbox" name="data_export.enabled" checked />
    <label>formats</label>
    <select name="formats" multiple>
      <option value="csv" selected>csv</option>
      <option value="json" selected>json</option>
    </select>
    <label>include_trajectories</label>
    <input type="checkbox" name="include_trajectories" checked />
    <label>include_collision_log</label>
    <input type="checkbox" name="include_collision_log" checked />
  </form>
</div>`;
  res.type("text/html").send(html);
});

app.get("/json-params", (req, res) => {
  try {
    const data = fs.readFileSync(jsonParamsPath, "utf-8");
    res.type("application/json").send(data);
  } catch (e) {
    res.status(500).json({ error: "json_params_url.json not found" });
  }
});

app.get("/json_params", (req, res) => {
  try {
    const data = fs.readFileSync(jsonParamsPath, "utf-8");
    res.type("application/json").send(data);
  } catch (e) {
    res.status(500).json({ error: "json_params_url.json not found" });
  }
});

app.get("/deploy", (req, res) => {
  const activityID = req.query.activityID;
  if (!activityID) {
    res.status(400).send("Missing activityID");
    return;
  }
  const type = String(req.query.activityKind || "Modelagem3D");
  const config = {
    gravity: req.query.gravity ?? 9.8,
    friction_coefficient: req.query.friction_coefficient ?? 0.3,
    time_scale: req.query.time_scale ?? 1.0
  };
  const instance = createActivityInstance(activityID, type, config);
  store.registerActivityInstance(instance);
  store.seedStudents(activityID, [1001, 1002]);
  const base = `${req.protocol}://${req.get("host")}`;
  const userUrl = `${base}/user?activityID=${encodeURIComponent(activityID)}`;
  res.type("text/plain").send(userUrl);
});

app.get("/user", (req, res) => {
  const activityID = req.query.activityID || "";
  res.type("text/html").send(
    `<div><h3>ObjectTwins Activity</h3><p>activityID=${activityID}</p></div>`
  );
});

app.post("/analytics", (req, res) => {
  const activityID = req.body?.activityID;
  if (!activityID) {
    res.status(400).json({ error: "Missing activityID" });
    return;
  }
  const list = store.getAnalytics(String(activityID));
  res.json(list);
});

app.get("/analytics-list", (req, res) => {
  try {
    const data = fs.readFileSync(analyticsListPath, "utf-8");
    res.type("application/json").send(data);
  } catch (e) {
    res.status(500).json({ error: "analytics_list_url.json not found" });
  }
});

app.get("/analytics_list", (req, res) => {
  try {
    const data = fs.readFileSync(analyticsListPath, "utf-8");
    res.type("application/json").send(data);
  } catch (e) {
    res.status(500).json({ error: "analytics_list_url.json not found" });
  }
});

app.get("/", (req, res) => {
  const base = `${req.protocol}://${req.get("host")}`;
  const html = `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>ObjectTwins Activity Provider</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    :root { --bg: #0e1117; --panel: #161b22; --text: #e6edf3; --muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --orange: #d29922; --red: #f85149; --blue: #58a6ff; }
    html, body { height: 100%; }
    body { margin: 0; background: linear-gradient(180deg, #0b0f14 0%, #0e1117 100%); color: var(--text); font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial; }
    .container { max-width: 1100px; margin: 0 auto; padding: 32px 20px; }
    .hero { display:flex; align-items:center; justify-content:space-between; gap:16px; }
    .title { font-size: 24px; font-weight: 700; letter-spacing: .2px; }
    .subtitle { font-size: 14px; color: var(--muted); }
    .badge { background: #1f6feb; color: #fff; border-radius: 999px; padding: 6px 12px; font-size: 12px; font-weight: 600; }
    .grid { display:grid; grid-template-columns: repeat(auto-fill,minmax(280px,1fr)); gap:16px; margin-top: 24px; }
    .card { background: var(--panel); border: 1px solid #30363d; border-radius: 12px; padding: 16px; box-shadow: 0 6px 12px rgba(0,0,0,.25); }
    .card h3 { margin:0 0 8px; font-size: 16px; }
    .path { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace; font-size: 13px; color: var(--text); }
    .desc { font-size: 13px; color: var(--muted); margin-top: 6px; }
    .actions { display:flex; gap:10px; margin-top: 12px; }
    .btn { border: 1px solid #30363d; background: #21262d; color: var(--text); border-radius: 8px; padding: 8px 12px; font-size: 13px; text-decoration: none; display:inline-flex; align-items:center; gap:8px; }
    .btn:hover { border-color:#8b949e; }
    .method { font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 999px; }
    .GET { background: rgba(63,185,80,.15); color: var(--green); border: 1px solid rgba(63,185,80,.4); }
    .POST { background: rgba(88,166,255,.15); color: var(--blue); border: 1px solid rgba(88,166,255,.4); }
    .section { margin-top: 28px; }
    .panel { background: var(--panel); border: 1px solid #30363d; border-radius: 12px; padding: 16px; }
    .row { display:flex; gap:12px; flex-wrap:wrap; align-items:center; }
    input[type="text"], input[type="number"], select, textarea { background:#0d1117; border:1px solid #30363d; color:var(--text); border-radius:8px; padding:8px 10px; font-size:13px; }
    label { font-size:12px; color: var(--muted); }
    pre { background:#0d1117; border:1px solid #30363d; color:#c9d1d9; border-radius:10px; padding:12px; overflow:auto; font-size:12px; }
    .footer { margin-top: 28px; font-size: 12px; color: var(--muted); }
  </style>
</head>
<body>
  <div class="container">
    <div class="hero">
      <div>
        <div class="title">ObjectTwins Activity Provider</div>
        <div class="subtitle">Hello World – ObjetTwins Webservice URL Test</div>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <div class="row"><span class="method GET">GET</span><h3>Config Page</h3></div>
        <div class="path">/config</div>
        <div class="desc">Página de configuração para recolha de parâmetros pela Inven!RA</div>
        <div class="actions"><a class="btn" href="${base}/config">Abrir</a></div>
      </div>

      <div class="card">
        <div class="row"><span class="method GET">GET</span><h3>JSON Params</h3></div>
        <div class="path">/json-params</div>
        <div class="desc">Lista de parâmetros configuráveis em formato JSON</div>
        <div class="actions"><a class="btn" href="${base}/json-params">Ver JSON</a></div>
      </div>

      <div class="card">
        <div class="row"><span class="method GET">GET</span><h3>Analytics Catalog</h3></div>
        <div class="path">/analytics-list</div>
        <div class="desc">Catálogo de analíticas disponíveis na atividade</div>
        <div class="actions"><a class="btn" href="${base}/analytics-list">Ver JSON</a></div>
      </div>

      <div class="card">
        <div class="row"><span class="method GET">GET</span><h3>Deploy</h3></div>
        <div class="path">/deploy?activityID=...</div>
        <div class="desc">Prepara e devolve o URL de acesso do utilizador</div>
        <div class="row" style="margin-top:8px;">
          <label>activityID</label>
          <input id="deploy-id" type="text" value="demo123" />
          <a class="btn" id="deploy-go">Abrir</a>
        </div>
      </div>

      <div class="card">
        <div class="row"><span class="method GET">GET</span><h3>User URL</h3></div>
        <div class="path">/user?activityID=...</div>
        <div class="desc">Página de acesso do utilizador à atividade</div>
        <div class="actions"><a class="btn" href="${base}/user?activityID=demo123">Abrir</a></div>
      </div>

      <div class="card">
        <div class="row"><span class="method POST">POST</span><h3>Analytics</h3></div>
        <div class="path">/analytics</div>
        <div class="desc">Devolve analíticas para um activityID</div>
        <div class="section panel">
          <div class="row">
            <label>activityID</label>
            <input id="an-id" type="text" value="demo123" />
            <a class="btn" id="an-run">Executar</a>
          </div>
          <div style="margin-top:10px;">
            <label>Payload</label>
            <pre>{"activityID":"demo123"}</pre>
            <label>Resposta</label>
            <pre id="an-out"></pre>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">Base: ${base}</div>
  </div>

  <script>
    const base = "${base}";
    const depBtn = document.getElementById('deploy-go');
    const depInput = document.getElementById('deploy-id');
    const anBtn = document.getElementById('an-run');
    const anInput = document.getElementById('an-id');
    const anOut = document.getElementById('an-out');
    if (depBtn) depBtn.addEventListener('click', () => {
      const id = encodeURIComponent(depInput.value || 'demo123');
      window.location.href = base + '/deploy?activityID=' + id;
    });
    if (anBtn) anBtn.addEventListener('click', async () => {
      const id = anInput.value || 'demo123';
      try {
        const r = await fetch(base + '/analytics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ activityID: id }) });
        const t = await r.text();
        anOut.textContent = t;
      } catch (e) { anOut.textContent = String(e); }
    });
  </script>
</body>
</html>`;
  res.type("text/html").send(html);
});

app.get("/index.html", (req, res) => {
  res.sendFile(path.join(process.cwd(), "index.html"));
});

app.get("/wiki.html", (req, res) => {
  res.sendFile(path.join(process.cwd(), "wiki.html"));
});

app.get("/analytics/page", (req, res) => {
  const id = req.query.APAnID || "";
  res.type("text/html").send(`<div><h3>Analytics Page</h3><p>APAnID=${id}</p></div>`);
});

const port = Number(process.env.PORT) || 8080;
app.listen(port, () => {});
