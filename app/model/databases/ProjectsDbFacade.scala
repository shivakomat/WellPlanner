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
      SQL("insert into Projects(name , event_type , brides_name, budget, event_date, grooms_name, business_id, modified_date, created_date) " +
        "values ({name} , {event_type} , {brides_name}, {budget}, {event_date}, {grooms_name}, {business_id}, {modified_date}, {created_date})")
        .on("name"  -> project.name,
          "event_type" -> project.event_type,
          "brides_name" -> project.brides_name,
          "grooms_name" -> project.grooms_name,
          "event_date" -> project.event_date,
          "budget" -> project.budget,
          "business_id" -> project.business_id,
          "modified_date" -> project.modified_date,
          "created_date" -> project.created_date)
        .executeInsert()
    }
  }

  def list(): Seq[Project] =
    db.withConnection { implicit connection =>
      SQL("select * from projects").as(parser.*)
    }

  def deleteByProjectIdAndBusinessId(projectId: Int, businessId: Int): Int =
    db.withConnection { implicit connection =>
      SQL("delete from projects where id = {project_id} and business_id = {business_id}")
        .on("project_id" -> projectId, "business_id" -> businessId)
        .executeUpdate()
    }
}
