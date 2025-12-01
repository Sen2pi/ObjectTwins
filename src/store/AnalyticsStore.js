export default class AnalyticsStore {
  constructor() {
    this.activities = new Map()
    this.studentsByActivity = new Map()
  }

  registerActivityInstance(instance) {
    this.activities.set(instance.activityID, instance)
    if (!this.studentsByActivity.has(instance.activityID)) this.studentsByActivity.set(instance.activityID, new Set())
  }

  ensureStudent(activityID, inveniraStdID) {
    if (!this.studentsByActivity.has(activityID)) this.studentsByActivity.set(activityID, new Set())
    this.studentsByActivity.get(activityID).add(inveniraStdID)
  }

  seedStudents(activityID, ids) {
    ids.forEach(id => this.ensureStudent(activityID, id))
  }

  getAnalytics(activityID) {
    const instance = this.activities.get(activityID)
    if (!instance) return []
    const students = Array.from(this.studentsByActivity.get(activityID) || [])
    return students.map(id => instance.analyticsForStudent(id))
  }

  static getInstance() {
    if (!AnalyticsStore.__instance) AnalyticsStore.__instance = new AnalyticsStore()
    return AnalyticsStore.__instance
  }
}

