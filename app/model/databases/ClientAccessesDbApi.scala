package model.databases

import anorm.{Macro, RowParser, SQL}
import javax.inject.Inject
import model.dataModels.ClientAccess
import play.api.db.DBApi

class ClientAccessesDbApi @Inject() (dbApi: DBApi) extends PostgresDatabase(dbApi) {

  val clientsAccessParser: RowParser[ClientAccess] = Macro.namedParser[ClientAccess]

  def addAccess(access: ClientAccess): Option[Long] =
    db.withConnection { implicit connection =>
      SQL("insert into client_accesses(username , password, client_id, project_id, business_id, modified_date, created_date) " +
        "values ({username} , {password}, {client_id}, {project_id}, {business_id} , {modified_date}, {created_date})")
        .on("username" -> access.username, "password" -> access.password, "client_id" -> access.client_id,
          "project_id" -> access.project_id, "business_id" -> access.business_id, "modified_date" -> access.modified_date,
          "created_date" -> access.created_date)
        .executeInsert()
    }

  def byProject(client_id: Long, project_id: Long, business_id: Long): Option[ClientAccess] =
    db.withConnection { implicit connection =>
      SQL("select * from  client_accesses where client_id = {client_id} and project_id = {project_id} and business_id = {business_id}")
        .on("client_id" -> client_id, "project_id" -> project_id, "business_id" -> business_id)
        .as(clientsAccessParser.singleOpt)
    }

}