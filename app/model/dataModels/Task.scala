package model.dataModels

case class Task(id: Option[Int] = None, title: Option[String] = None, description: Option[String] = None,
                notes: Option[String] = None, is_category: Boolean = false, due_date: Int,
                business_id: Int, project_id: Int, parent_task_id: Option[Int] = None, is_completed: Boolean = false,
                modified_date: Option[Int] = None, created_date: Option[Int] = None)

case class TaskItem(id: Option[Int] = None, description: Option[String] = None, task_id: Int,
                    business_id: Int, project_id: Int, modified_date: Option[Int] = None, is_completed: Boolean = false,
                    created_date: Option[Int] = None)