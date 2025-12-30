import ActivityDecorator from './ActivityDecorator.js'

export default class CollisionDecorator extends ActivityDecorator {
  constructor(activityInstance) {
    super(activityInstance)
  }

  analyticsForStudent(inveniraStdID) {
    const result = super.analyticsForStudent(inveniraStdID)
    
    // Add collision-related metrics
    // Matching the key from analytics_list_url.json
    
    if (result && result.quantAnalytics) {
        result.quantAnalytics.push({
            name: 'total_collision_events_registered',
            value: 0
        })
    }
    
    return result
  }
}
