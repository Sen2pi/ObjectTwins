export default class ActivityInstance {
  constructor(activityID, type, config, analyticsTemplates) {
    this.activityID = String(activityID)
    this.type = String(type)
    this.config = config || {}
    this.analyticsTemplates = analyticsTemplates || { quant: [], qual: [] }
  }

  analyticsForStudent(inveniraStdID) {
    const quantAnalytics = this.analyticsTemplates.quant.map(a => ({ name: a.name, value: a.initial }))
    const qualAnalytics = this.analyticsTemplates.qual.map(a => ({ [a.name]: a.urlTemplate.replace('{APAnID}', `${this.activityID}:${inveniraStdID}`) }))
    return { inveniraStdID, quantAnalytics, qualAnalytics }
  }
}

