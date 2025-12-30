export default class ActivityInstance {
  constructor(activityID, type, config, analyticsTemplates) {
    this.activityID = String(activityID)
    this.type = String(type)
    this.config = config || {}
    this.analyticsTemplates = analyticsTemplates || { quant: [], qual: [] }
  }

  analyticsForStudent(inveniraStdID) {
    const quantAnalytics = this.analyticsTemplates.quant.map(a => ({ name: a.name, value: a.initial }))
    
    const qualAnalytics = this.analyticsTemplates.qual.map(a => {
      if (a.urlTemplate) {
        return { [a.name]: a.urlTemplate.replace('{APAnID}', `${this.activityID}:${inveniraStdID}`) }
      }
      // If no urlTemplate, return the initial value or null
      return { [a.name]: a.initial || null }
    })
    
    return { inveniraStdID, quantAnalytics, qualAnalytics }
  }
}
