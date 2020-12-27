package model.databases

import anorm.{Macro, RowParser, _}
import javax.inject.Inject
import model.dataModels.Client
import model.tools.AnormExtension._
import play.api.db.DBApi

@javax.inject.Singleton
class ClientsDB @Inject() (dbApi: DBApi) extends PostgresDatabase(dbApi) with ClientDBApi {

  val parser: RowParser[Client] = Macro.namedParser[Client]

  def addNewClient(client: Client): Option[Long] =
    db.withConnection { implicit connection =>
      SQL("insert into clients(name , event_type , event_date, phone_number, email, notes, budget, status, business_id, modified_date, created_date) " +
        "values ({name} , {event_type} , {event_date},{phone_number}, {email}, {notes}, {budget}, {status}, {business_id}, {modified_date}, {created_date})")
        .on("name"  -> client.name, "phone_number" -> client.phone_number, "event_type" -> client.event_type, "event_date" -> client.event_date, "email" -> client.email,
          "notes" -> client.notes, "budget" -> client.budget, "status" -> client.status, "business_id" -> client.business_id,
          "modified_date" -> client.modified_date, "created_date" -> client.created_date)
        .executeInsert()
    }

  def updateBasicClientInfo(updateClient: Client): Int =
    db.withConnection { implicit connection =>
      SQL("update clients set name = {name}, email = {email}," +
        " phone_number = {phone_number}, budget = {budget}, event_date = {event_date}, notes = {notes}, status = {status}, modified_date = {modified_date}" +
        " where id = {client_id} and business_id = {business_id}")
        .on("name" -> updateClient.name, "email" -> updateClient.email,"phone_number" -> updateClient.phone_number, "budget" -> updateClient.budget, "status" -> updateClient.status,
          "event_date" -> updateClient.event_date, "modified_date" -> updateClient.modified_date, "business_id" -> updateClient.business_id, "client_id" -> updateClient.id, "notes" -> updateClient.notes)
        .executeUpdate()
    }

  def updateClientNotes(clientId: Int, businessId: Int, newNotes: String, modifiedDate: Int): Int =
    db.withConnection { implicit connection =>
      SQL("update clients set notes = {new_notes}, modified_date = {modified_date}" +
        " where id = {client_id} and business_id = {business_id}")
        .on("modified_date" -> modifiedDate, "business_id" -> businessId, "client_id" -> clientId)
        .executeUpdate()
    }

  def byId(clientId: Long): Option[Client] =
    db.withConnection { implicit connection =>
      SQL(s"select * from clients where id = {clientId}")
        .on("clientId" -> clientId)
        .as(parser.singleOpt)
    }

  def list(): Seq[Client] =
    db.withConnection { implicit connection =>
      SQL("select * from clients").as(parser.*)
    }

  def deleteByClientIdAndBusinessId(clientId: Int, businessId: Int): Int =
    db.withConnection { implicit connection =>
        SQL("delete from clients where id = {client_id} and business_id = {business_id}")
          .on("client_id" -> clientId, "business_id" -> businessId)
      .executeUpdate()
    }
}
