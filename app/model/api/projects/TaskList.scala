package model.api.projects

import model.dataModels.{Task, TaskComment}

case class TaskList(parent: Task, subTasks: Seq[Task])

