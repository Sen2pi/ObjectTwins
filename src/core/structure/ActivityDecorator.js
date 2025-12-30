export default class ActivityDecorator {
  constructor(activityInstance) {
    this.activityInstance = activityInstance
  }

  get activityID() {
    return this.activityInstance.activityID
  }

  get type() {
    return this.activityInstance.type
  }

  get config() {
    return this.activityInstance.config
  }

  analyticsForStudent(inveniraStdID) {
    return this.activityInstance.analyticsForStudent(inveniraStdID)
  }
}
