package model.databases

import anorm.{Macro, RowParser, _}
import javax.inject.Inject
import model.dataModels.Task
import model.tools.AnormExtension._
import play.api.db.DBApi

@javax.inject.Singleton
class TasksDbFacade @Inject() (dbApi: DBApi) extends PostgresDatabase(dbApi) {

  val parser: RowParser[Task] = Macro.namedParser[Task]

  def addNewTask(task: Task): Option[Long] =
    db.withConnection { implicit connection =>
      SQL("insert into tasks(title , description , notes, is_category, is_completed," +
          " due_date, project_id, parent_task_id, business_id, modified_date, created_date) " +
          "values ({title} , {description} , {notes}, {is_category}, {is_completed}, {due_date}, {project_id}, {parent_task_id}, {business_id}," +
          " {modified_date}, {created_date})")
      .on("title"  -> task.title, "description" -> task.description, "notes" -> task.notes,
            "is_category" -> task.is_category, "is_completed" -> task.is_completed, "due_date" -> task.due_date, "project_id" -> task.project_id,
            "parent_task_id" -> task.parent_task_id, "business_id" -> task.business_id,
            "modified_date" -> task.modified_date, "created_date" -> task.created_date)
        .executeInsert()
    }

  def updateTaskInfo(updatedTask: Task): Int =
    db.withConnection { implicit connection =>
      SQL("update tasks set title = {title}, description  = {description}, notes = {notes}, is_category = {is_category}, is_completed = {is_completed}," +
        " due_date = {due_date}, project_id = {project_id}, parent_task_id = {parent_task_id}," +
        " business_id = {business_id}, modified_date = {modified_date}, created_date = {created_date} where id = {id}")
        .on("id" -> updatedTask.id, "title"  -> updatedTask.title, "description" -> updatedTask.description, "notes" -> updatedTask.notes,
                  "is_category" -> updatedTask.is_category, "is_completed" -> updatedTask.is_completed,
                  "due_date" -> updatedTask.due_date, "project_id" -> updatedTask.project_id,
                  "parent_task_id" -> updatedTask.parent_task_id, "business_id" -> updatedTask.business_id,
                  "modified_date" -> updatedTask.modified_date, "created_date" -> updatedTask.created_date)
        .executeUpdate()
    }

  def byTaskId(taskId : Long): Option[Task] =
    db.withConnection { implicit connection =>
      SQL(s"select * from tasks where id = {id}")
        .on("id" -> taskId)
        .as(parser.singleOpt)
    }

  def list(projectId: Long, businessId: Long): Seq[Task] =
    db.withConnection { implicit connection =>
      SQL("select * from tasks where business_id = {businessId} and project_id = {projectId}")
        .on( "projectId" -> projectId, "businessId" -> businessId)
        .as(parser.*)
    }


  def deleteTask(taskId: Long, projectId: Long, businessId: Long): Int = {
    db.withConnection { implicit connection =>
      SQL("delete from tasks where id = {taskId} and business_id = {businessId} and project_id = {projectId}")
        .on("taskId" -> taskId, "projectId" -> projectId, "businessId" -> businessId)
        .executeUpdate()
    }
  }

}