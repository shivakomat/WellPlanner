package model.databases

import anorm.{Macro, RowParser, _}
import javax.inject.Inject
import model.dataModels.TaskComment
import play.api.db.DBApi
import model.tools.AnormExtension._

@javax.inject.Singleton
class TaskCommentsDbFacade @Inject() (dbApi: DBApi) extends PostgresDatabase(dbApi) {

  val parser: RowParser[TaskComment] = Macro.namedParser[TaskComment]

  def addNewTaskComment(taskComment: TaskComment): Option[Long] = {
    db.withConnection { implicit connection =>
      SQL("insert into task_comments (comment_text, task_id, user_created_id, project_id, business_id, modified_date, created_date) " +
        "values ({comment_text}, {task_id}, {user_created_id}, {project_id}, {business_id}, {modified_date}, {created_date})")
        .on("comment_text"  -> taskComment.comment_text, "task_id" -> taskComment.task_id, "user_created_id" -> taskComment.user_created_id, "project_id" -> taskComment.project_id,
          "business_id" -> taskComment.business_id, "modified_date" -> taskComment.modified_date, "created_date" -> taskComment.created_date)
        .executeInsert()
    }
  }

  def list(): Seq[TaskComment] =
    db.withConnection { implicit connection =>
      SQL("select * from task_comments").as(parser.*)
    }


  def byId(taskCommentId : Long): Option[TaskComment] =
    db.withConnection { implicit connection =>
      SQL(s"select * from task_comments where id = {id}")
        .on("id" -> taskCommentId)
        .as(parser.singleOpt)
    }

  def byTaskId(taskId : Long, businessId : Long, projectId: Long): Seq[TaskComment] =
    db.withConnection { implicit connection =>
      SQL(s"select * from task_comments where task_id = {id} and business_id = {business_id}" +
                 s" and project_id = {project_id}")
        .on("id" -> taskId, "business_id" -> businessId, "project_id" -> projectId)
        .as(parser.*)
    }

  def deleteTaskComment(taskCommentId: Long, taskId: Long, projectId: Long, businessId: Long): Int =
    db.withConnection { implicit connection =>
      SQL("delete from task_comments where id = {taskCommentId} and business_id = {business_id} and task_id = {taskId}")
        .on("taskCommentId" -> taskCommentId, "business_id" -> businessId, "taskId" -> taskId, "projectId" -> projectId)
        .executeUpdate()
    }

}