import ActivityInstance from '../ActivityInstance.js'
import CollisionDecorator from '../structure/CollisionDecorator.js'

export const createActivityInstance = (activityID, type, config) => {
  const t = String(type || 'Modelagem3D')
  let instance;

  // Common analytics based on the live schema
  // Note: 'total_collision_events_registered' is intentionally omitted here 
  // to be added by the CollisionDecorator when appropriate.
  const commonQuant = [
    { name: 'total_objects_created', initial: 0 },
    { name: 'total_simulations_executed', initial: 0 },
    { name: 'average_simulation_duration_seconds', initial: 0.0 },
    { name: 'average_damage_percentage', initial: 0.0 }
  ];

  const commonQual = [
    { name: 'individual_simulation_reports', initial: [] },
    { name: 'most_resistant_material_combination', initial: {} },
    { name: 'design_patterns_identified', initial: [] },
    { name: 'data_extraction_for_research', initial: {} }
  ];

  if (t === 'Modelagem3D') {
    instance = new ActivityInstance(activityID, t, config, {
      quant: commonQuant,
      qual: commonQual
    })
  } else if (t === 'AnaliseResultados') {
    instance = new ActivityInstance(activityID, t, config, {
      quant: commonQuant,
      qual: commonQual
    })
  } else {
    instance = new ActivityInstance(activityID, t, config, {
      quant: commonQuant,
      qual: commonQual
    })
  }

  // Apply Decorator if configured
  // The live schema has 'record_collision_events' in 'collision_simulation' group in json-params,
  // but usually passed flattened or as config object. 
  // The server.js extracts: record_collision_events: req.query.record_collision_events ...
  if (config && config.record_collision_events) {
    instance = new CollisionDecorator(instance)
  }

  return instance
}
