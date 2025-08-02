package model.databases

import anorm.{Macro, RowParser, _}
import javax.inject.Inject
import model.dataModels.ClientDocument
import model.tools.AnormExtension._
import play.api.db.DBApi

/**
  * Provides CRUD operations for `client_documents` table.
  */
@javax.inject.Singleton
class ClientDocumentsDbFacade @Inject()(dbApi: DBApi) extends PostgresDatabase(dbApi) {

  private val parser: RowParser[ClientDocument] = Macro.namedParser[ClientDocument]

  /**
    * Insert a new document row and return generated id (if any).
    */
  def add(document: ClientDocument): Option[Long] =
    db.withConnection { implicit c =>
      SQL("""
          |INSERT INTO client_documents(client_id, filename, mime_type, file_size, file_path, uploaded_at)
          |VALUES ({client_id}, {filename}, {mime_type}, {file_size}, {file_path}, {uploaded_at})
          |""".stripMargin)
        .on(
          "client_id" -> document.client_id,
          "filename" -> document.filename,
          "mime_type" -> document.mime_type,
          "file_size" -> document.file_size,
          "file_path" -> document.file_path,
          "uploaded_at" -> document.uploaded_at
        ).executeInsert()
    }

  def listByClient(clientId: Int): Seq[ClientDocument] =
    db.withConnection { implicit c =>
      SQL("select * from client_documents where client_id = {client_id}")
        .on("client_id" -> clientId)
        .as(parser.*)
    }

  def byId(docId: Int): Option[ClientDocument] =
    db.withConnection { implicit c =>
      SQL("select * from client_documents where id = {id}")
        .on("id" -> docId)
        .as(parser.singleOpt)
    }

  def delete(docId: Int): Int =
    db.withConnection { implicit c =>
      SQL("delete from client_documents where id = {id}")
        .on("id" -> docId)
        .executeUpdate()
    }
}
