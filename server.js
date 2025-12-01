import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const analyticsListPath = process.env.ANALYTICS_LIST_PATH || path.join(process.cwd(), "analytics_list_url.json");
const jsonParamsPath = process.env.JSON_PARAMS_PATH || path.join(process.cwd(), "json_params_url.json");

const activities = new Map();
app.use(express.static(process.cwd()));

app.get("/config", (req, res) => {
  const html = `
<div>
  <h3>ObjectTwins Configuração</h3>
  <form>
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

app.get("/deploy", (req, res) => {
  const activityID = req.query.activityID;
  if (!activityID) {
    res.status(400).json({ error: "Missing activityID" });
    return;
  }
  if (!activities.has(activityID)) activities.set(activityID, { users: new Map() });
  const base = `${req.protocol}://${req.get("host")}`;
  const userUrl = `${base}/user?activityID=${encodeURIComponent(activityID)}`;
  res.json({ user_url: userUrl });
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
  const sample = [
    {
      inveniraStdID: 1001,
      quantAnalytics: [
        { name: "Acedeu à atividade", value: true },
        { name: "Download documento 1", value: true },
        { name: "Evolução pela atividade (%)", value: "33.3" }
      ],
      qualAnalytics: [
        { "Student activity profile": `${req.protocol}://${req.get("host")}/analytics/page?APAnID=11111111` },
        { "Actitivy Heat Map": `${req.protocol}://${req.get("host")}/analytics/page?APAnID=21111111` }
      ]
    },
    {
      inveniraStdID: 1002,
      quantAnalytics: [
        { name: "Acedeu à atividade", value: true },
        { name: "Download documento 1", value: false },
        { name: "Evolução pela atividade (%)", value: "10.0" }
      ],
      qualAnalytics: [
        { "Student activity profile": `${req.protocol}://${req.get("host")}/analytics/page?APAnID=11111112` },
        { "Actitivy Heat Map": `${req.protocol}://${req.get("host")}/analytics/page?APAnID=21111112` }
      ]
    }
  ];
  res.json(sample);
});

app.get("/analytics-list", (req, res) => {
  try {
    const data = fs.readFileSync(analyticsListPath, "utf-8");
    res.type("application/json").send(data);
  } catch (e) {
    res.status(500).json({ error: "analytics_list_url.json not found" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "index.html"));
});

app.get("/analytics/page", (req, res) => {
  const id = req.query.APAnID || "";
  res.type("text/html").send(`<div><h3>Analytics Page</h3><p>APAnID=${id}</p></div>`);
});

app.get("/healthz", (req, res) => { res.status(200).send("ok") });
const port = process.env.PORT || 3000;
app.listen(port, () => {});
