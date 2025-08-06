// models/Goal.js
export class Goal {
  constructor(id, title, description, deadline, status, progress, userId) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.deadline = deadline;
    this.status = status; // ['not-started', 'in-progress', 'completed']
    this.progress = progress; // 0-100
    this.userId = userId;
    this.createdAt = new Date();
  }
}