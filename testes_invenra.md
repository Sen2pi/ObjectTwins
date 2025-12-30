# Relatório de Testes de Integração com Inven!RA
Data: 2025-12-30T17:24:51.836Z


### Teste: Obter Configuração (Inven!RA)
- **URL**: `/config`
- **Método**: GET
- **Status**: 200 OK
- **Duração**: 58ms
- **Resposta**: 
```html

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
   ... (truncated)
```

### Teste: Obter Parâmetros JSON
- **URL**: `/json-params`
- **Método**: GET
- **Status**: 200 OK
- **Duração**: 4ms
- **Resposta**: 
```json
{
  "activity_id": "objecttwins_v1",
  "environment_config": {
    "gravity": {
      "name": "gravity",
      "type": "number",
      "value": 9.8,
      "unit": "m/s²",
      "editable": true,
      "description": "Aceleração gravitacional do ambiente"
    },
    "friction_coefficient": {
      "name": "friction_coefficient",
      "type": "number",
      "value": 0.3,
      "editable": true,
      "range": [
        0,
        1
      ]
    },
    "time_scale": {
      "name": "time_scale",
      "type": "number",
      "value": 1,
      "editable": true,
      "presets": [
        "0.5",
        "1.0",
        "2.0",
        "4.0"
      ]
    },
    "max_simulation_time": {
      "name": "max_simulation_time",
      "type": "integer",
      "value": 300,
      "unit": "seconds"
    }
  },
  "object_creation": {
    "allowed_primitives": {
      "name": "allowed_primitives",
      "type": "array",
      "items": [
        "cube",
        "sphere",
        "cylinder",
        "custom_3d"
      ]
    },
    "max_objects_per_session": {
      "name": "max_objects_per_session",
      "type": "integer",
      "value": 20
    },
    "allow_3d_import": {
      "name": "allow_3d_import",
      "type": "boolean",
      "value": true
    },
    "supported_formats": {
      "name": "supported_formats",
      "type": "array",
      "items": [
        "gltf",
        "obj",
        "fbx"
      ]
    }
  },
  "materials_database": {
    "enabled": {
      "name": "enabled",
      "type": "boolean",
      "value": true
    },
    "predefined_materials": {
      "name": "predefined_materials",
      "type": "array",
      "items": [
        {
          "name": "pencil",
          "composition": {
            "wood": 0.37,
            "carbon": 0.6,
            "rubber": 0.03
          },
          "density": 1.8,
          "elasticity": 0.4,
          "resistance_mpa": 50
        },
        {
          "name": "steel",
          "composition": {
            "iron": 0.98,
            "carbon": 0.02
          },
          "density": 7.85,
          "elasticity": 0.3,
          "resistance_mpa": 400
        },
        {
          "name": "rubber",
          "composition": {
            "natural_rubber": 0.85,
            "sulfur": 0.15
          },
          "density": 0.92,
          "elasticity": 0.9,
          "resistance_mpa": 10
        }
      ]
    },
    "allow_custom_composition": {
      "name": "allow_custom_composition",
      "type": "boolean",
      "value": true
    }
  },
  "collision_simulation": {
    "enabled": {
      "name": "enabled",
      "type": "boolean",
      "value": true
    },
    "damage_model": {
      "name": "damage_model",
      "type": "string",
      "value": "linear_degradation"
    },
    "collision_detection_frequency": {
      "name": "collision_detection_frequency",
      "type": "integer",
      "value": 60
    },
    "record_collision_events": {
      "name": "record_collision_events",
      "type": "boolean",
      "value": true
    }
  },
  "data_export": {
    "enabled": {
      "name": "enabled",
      "type": "boolean",
      "value": true
    },
    "formats": {
      "name": "formats",
      "type": "array",
      "items": [
        "csv",
        "json"
      ]
    },
    "include_trajectories": {
      "name": "include_trajectories",
      "type": "boolean",
      "value": true
    },
    "include_collision_log": {
      "name": "include_collision_log",
      "type": "boolean",
      "value": true
    }
  }
}
```

### Teste: Obter Catálogo de Analíticas
- **URL**: `/analytics-list`
- **Método**: GET
- **Status**: 200 OK
- **Duração**: 2ms
- **Resposta**: 
```json
{
  "session_metadata": {
    "name": "session_metadata",
    "type": "object",
    "user_id_inven_ra": "string",
    "activity_instance_id": "string",
    "session_start_timestamp": "ISO8601",
    "session_end_timestamp": "ISO8601",
    "duration_minutes": "number"
  },
  "quantitativos": {
    "total_objects_created": {
      "name": "total_objects_created",
      "type": "integer",
      "value": "integer",
      "description": "Número total de twins criados na sessão"
    },
    "objects_by_material_category": {
      "name": "objects_by_material_category",
      "type": "object",
      "properties": {
        "steel": "integer",
        "wood": "integer",
        "rubber": "integer",
        "composite": "integer"
      }
    },
    "total_simulations_executed": {
      "name": "total_simulations_executed",
      "type": "integer",
      "value": "integer"
    },
    "average_simulation_duration_seconds": {
      "name": "average_simulation_duration_seconds",
      "type": "number",
      "value": "number",
      "unit": "seconds"
    },
    "total_collision_events_registered": {
      "name": "total_collision_events_registered",
      "type": "integer",
      "value": "integer"
    },
    "average_damage_percentage": {
      "name": "average_damage_percentage",
      "type": "number",
      "value": "number",
      "unit": "%",
      "description": "Degradação média nos twins por simulação"
    },
    "parameter_variance": {
      "name": "parameter_variance",
      "type": "object",
      "gravity_range_applied": [
        "min_value",
        "max_value"
      ],
      "friction_range_applied": [
        "min_value",
        "max_value"
      ],
      "time_scale_variations_count": "integer"
    },
    "materials_resistance_ranking": {
      "name": "materials_resistance_ranking",
      "type": "array",
      "items": {
        "material": "string",
        "avg_damage_received": "number",
        "simulation_count": "integer",
        "resistance_score": "number"
      }
    }
  },
  "qualitativos": {
    "individual_simulation_reports": {
      "name": "individual_simulation_reports",
      "type": "array",
      "items": {
        "simulation_id": "string",
        "timestamp": "ISO8601",
        "objects_involved": [
          {
            "object_id": "string",
            "primary_material": "string",
            "secondary_materials_percentage": "object",
            "initial_integrity": "number"
          }
        ],
        "collision_sequence": [
          {
            "event_id": "integer",
            "collision_timestamp": "number",
            "objects_colliding": [
              "object_id_1",
              "object_id_2"
            ],
            "damage_inflicted": {
              "object_id_1": "number",
              "object_id_2": "number"
            }
          }
        ],
        "final_status": {
          "surviving_objects": [
            "object_id"
          ],
          "destroyed_objects": [
            "object_id"
          ],
          "total_damage_accumulated": "number"
        },
        "material_performance_analysis": "string"
      }
    },
    "most_resistant_material_combination": {
      "name": "most_resistant_material_combination",
      "type": "object",
      "primary_material": "string",
      "secondary_materials": "object",
      "avg_damage_threshold": "number",
      "simulations_tested": "integer",
      "recommendation": "string"
    },
    "design_patterns_identified": {
      "name": "design_patterns_identified",
      "type": "array",
      "items": {
        "pattern_id": "string",
        "pattern_description": "string",
        "frequency": "integer",
        "example_objects": [
          "object_id"
        ]
      }
    },
    "data_extraction_for_research": {
      "name": "data_extraction_for_research",
      "type": "object",
      "dataset_filename": "string",
      "records_count": "integer",
      "variables_tracked": [
        "velocity",
        "acceleration",
        "collision_force",
        "material_degradation",
        "trajectory"
      ],
      "potential_research_applications": [
        "materials_engineering",
        "impact_dynamics",
        "design_optimization"
      ]
    }
  }
}
```

### Teste: Deploy da Atividade (Padrão)
- **URL**: `/deploy?activityID=test_std&gravity=9.8`
- **Método**: GET
- **Status**: 200 OK
- **Duração**: 2ms
- **Resposta**: 
```html
http://localhost:8080/user?activityID=test_std
```

### Teste: Deploy da Atividade (Com Colisões)
- **URL**: `/deploy?activityID=test_col&record_collision_events=true`
- **Método**: GET
- **Status**: 200 OK
- **Duração**: 1ms
- **Resposta**: 
```html
http://localhost:8080/user?activityID=test_col
```

### Teste: Obter Analíticas (Atividade Padrão)
- **URL**: `/analytics`
- **Método**: POST
- **Payload**: 
```json
{
  "activityID": "test_std"
}
```
- **Status**: 200 OK
- **Duração**: 12ms
- **Resposta**: 
```json
[
  {
    "inveniraStdID": 1001,
    "quantAnalytics": [
      {
        "name": "total_objects_created",
        "value": 0
      },
      {
        "name": "total_simulations_executed",
        "value": 0
      },
      {
        "name": "average_simulation_duration_seconds",
        "value": 0
      },
      {
        "name": "average_damage_percentage",
        "value": 0
      }
    ],
    "qualAnalytics": [
      {
        "individual_simulation_reports": []
      },
      {
        "most_resistant_material_combination": {}
      },
      {
        "design_patterns_identified": []
      },
      {
        "data_extraction_for_research": {}
      }
    ]
  },
  {
    "inveniraStdID": 1002,
    "quantAnalytics": [
      {
        "name": "total_objects_created",
        "value": 0
      },
      {
        "name": "total_simulations_executed",
        "value": 0
      },
      {
        "name": "average_simulation_duration_seconds",
        "value": 0
      },
      {
        "name": "average_damage_percentage",
        "value": 0
      }
    ],
    "qualAnalytics": [
      {
        "individual_simulation_reports": []
      },
      {
        "most_resistant_material_combination": {}
      },
      {
        "design_patterns_identified": []
      },
      {
        "data_extraction_for_research": {}
      }
    ]
  }
]
```

### Teste: Obter Analíticas (Atividade com Colisões)
- **URL**: `/analytics`
- **Método**: POST
- **Payload**: 
```json
{
  "activityID": "test_col"
}
```
- **Status**: 200 OK
- **Duração**: 2ms
- **Resposta**: 
```json
[
  {
    "inveniraStdID": 1001,
    "quantAnalytics": [
      {
        "name": "total_objects_created",
        "value": 0
      },
      {
        "name": "total_simulations_executed",
        "value": 0
      },
      {
        "name": "average_simulation_duration_seconds",
        "value": 0
      },
      {
        "name": "average_damage_percentage",
        "value": 0
      },
      {
        "name": "total_collision_events_registered",
        "value": 0
      }
    ],
    "qualAnalytics": [
      {
        "individual_simulation_reports": []
      },
      {
        "most_resistant_material_combination": {}
      },
      {
        "design_patterns_identified": []
      },
      {
        "data_extraction_for_research": {}
      }
    ]
  },
  {
    "inveniraStdID": 1002,
    "quantAnalytics": [
      {
        "name": "total_objects_created",
        "value": 0
      },
      {
        "name": "total_simulations_executed",
        "value": 0
      },
      {
        "name": "average_simulation_duration_seconds",
        "value": 0
      },
      {
        "name": "average_damage_percentage",
        "value": 0
      },
      {
        "name": "total_collision_events_registered",
        "value": 0
      }
    ],
    "qualAnalytics": [
      {
        "individual_simulation_reports": []
      },
      {
        "most_resistant_material_combination": {}
      },
      {
        "design_patterns_identified": []
      },
      {
        "data_extraction_for_research": {}
      }
    ]
  }
]
```
