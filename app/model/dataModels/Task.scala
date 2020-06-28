package model.dataModels

import org.joda.time.DateTime

case class Task(id: Option[Int] = None, title: Option[String] = None, description: Option[String] = None,
                notes: Option[String] = None, is_category: Boolean = false, due_date: Int,
                user_created_id: Int, business_id: Int, project_id: Int, parent_task_id: Option[Int] = None,
                modified_date: Option[Int] = None, created_date: Option[Int] = None)
