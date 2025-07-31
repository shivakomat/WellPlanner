package model.databases

import anorm.{Macro, RowParser, _}
import javax.inject.Inject
import model.dataModels.Project
import model.tools.AnormExtension._
import play.api.db.DBApi

@javax.inject.Singleton
class ProjectsDbFacade @Inject() (dbApi: DBApi) extends PostgresDatabase(dbApi) with ProjectsDbAPI {

  val parser: RowParser[Project] = Macro.namedParser[Project]

  def addNewProject(project: Project): Option[Long] = {
    db.withConnection { implicit connection =>
      SQL("insert into projects(name , event_type , brides_name, budget, event_date, grooms_name, client_id, business_id, modified_date, created_date, is_deleted) " +
        "values ({name} , {event_type} , {brides_name}, {budget}, {event_date}, {grooms_name}, {client_id}, {business_id}, {modified_date}, {created_date}, {is_deleted})")
        .on("name"  -> project.name,
          "event_type" -> project.event_type,
          "brides_name" -> project.brides_name,
          "grooms_name" -> project.grooms_name,
          "event_date" -> project.event_date,
          "budget" -> project.budget,
          "client_id" -> project.client_id,
          "business_id" -> project.business_id,
          "modified_date" -> project.modified_date,
          "created_date" -> project.created_date,
          "is_deleted" -> project.is_deleted)
        .executeInsert()
    }
  }

  def byId(projectId: Int, businessId: Int): Option[Project] =
    db.withConnection { implicit connection =>
      SQL(s"select * from projects where id = {id} and business_id = {businessId} and is_deleted = false")
        .on("id" -> projectId, "businessId" -> businessId)
        .as(parser.singleOpt)
    }


  def list(): Seq[Project] =
    db.withConnection { implicit connection =>
      SQL("select * from projects where is_deleted = false").as(parser.*)
    }

  def softDeleteByProjectIdAndBusinessId(projectId: Int, businessId: Int): Int =
    db.withConnection { implicit connection =>
      SQL("update projects set is_deleted = true where id = {project_id} and business_id = {business_id}")
        .on("project_id" -> projectId, "business_id" -> businessId)
        .executeUpdate()
    }
}
