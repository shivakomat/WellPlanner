package model.databases

import anorm.{Macro, RowParser, SQL}
import javax.inject.Inject
import model.dataModels.ClientAccess
import play.api.db.DBApi

class ClientAccessesDbApi @Inject() (dbApi: DBApi) extends PostgresDatabase(dbApi) {

  val clientsAccessParser: RowParser[ClientAccess] = Macro.namedParser[ClientAccess]

  def addAccess(access: ClientAccess): Option[Long] =
    db.withConnection { implicit connection =>
      SQL("insert into client_accesses(username , password, email, logged_in, project_id, business_id, modified_date, created_date) " +
        "values ({username} , {password}, {email}, {logged_in}, {project_id}, {business_id} , {modified_date}, {created_date})")
        .on("username" -> access.username, "password" -> access.password, "email" -> access.email, "logged_in" -> access.logged_in,
          "project_id" -> access.project_id, "business_id" -> access.business_id, "modified_date" -> access.modified_date,
          "created_date" -> access.created_date)
        .executeInsert()
    }

  def byProject(project_id: Long, business_id: Long): Option[ClientAccess] =
    db.withConnection { implicit connection =>
      SQL("select * from  client_accesses where project_id = {project_id} and business_id = {business_id}")
        .on("project_id" -> project_id, "business_id" -> business_id)
        .as(clientsAccessParser.singleOpt)
    }

  def byUsername(username: String): Option[ClientAccess] =
    db.withConnection { implicit connection =>
      SQL("select * from client_accesses where username = {username}")
        .on("username" -> username)
        .as(clientsAccessParser.singleOpt)
    }

  def login(username: String, email: String, password: String): Option[ClientAccess] =
    db.withConnection { implicit connection =>
      SQL("select * from client_accesses where username = {username} and email = {email} and password = {password}")
        .on("username" -> username, "email" -> email, "password" -> password)
        .as(clientsAccessParser.singleOpt)
    }

  def updateClientAccess(updatedClientAccess: ClientAccess): Int =
    db.withConnection { implicit connection =>
      SQL("update client_accesses set username = {username}, password = {password}," +
        " email = {email}, modified_date = {modified_date} where project_id = {project_id} and business_id = {business_id}")
        .on("username" -> updatedClientAccess.username, "password"  -> updatedClientAccess.password, "email" -> updatedClientAccess.email,
          "modified_date" -> updatedClientAccess.modified_date, "project_id" -> updatedClientAccess.project_id, "business_id" -> updatedClientAccess.business_id)
        .executeUpdate()
    }

}