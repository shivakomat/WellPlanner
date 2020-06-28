package model.dataModels

case class TaskComment(id: Option[Int] = None, comment_text: Option[String] = None,
                       user_created_id: Int, task_id: Int, business_id: Int,
                       project_id: Int, modified_date: Option[Int] = None,
                       created_date: Option[Int] = None)