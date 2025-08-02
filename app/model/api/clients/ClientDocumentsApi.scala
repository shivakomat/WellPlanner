package model.api.clients

import java.nio.file.{Files, Path, Paths, StandardCopyOption}

import model.dataModels.ClientDocument
import model.databases.ClientDocumentsDbFacade
import model.tools.DateTimeNow
import play.api.db.DBApi

class ClientDocumentsApi(dbApi: DBApi, uploadBaseDir: String = "public/uploads") {

  private val docsDb = new ClientDocumentsDbFacade(dbApi)

  private def clientDir(clientId: Int): Path = Paths.get(uploadBaseDir, clientId.toString)

  /**
    * Saves the incoming file bytes to disk and a row in DB.
    * @return either an error message or the created ClientDocument.
    */
  def save(clientId: Int, filename: String, mimeType: String, fileSize: Long, tempFilePath: Path): Either[String, ClientDocument] = {
    try {
      val dir = clientDir(clientId)
      if (!Files.exists(dir)) Files.createDirectories(dir)
      val sanitizedName = filename.replaceAll("[^A-Za-z0-9_.-]", "_")
      val targetPath = dir.resolve(sanitizedName)
      Files.move(tempFilePath, targetPath, StandardCopyOption.REPLACE_EXISTING)

      val doc = ClientDocument(None, clientId, sanitizedName, mimeType, fileSize, targetPath.toString, DateTimeNow.getCurrent)
      val idOpt = docsDb.add(doc)
      idOpt match {
        case Some(id) =>
          Right(doc.copy(id = Some(id.toInt)))
        case None => Left("DB insertion failed")
      }
    } catch {
      case ex: Exception => Left(ex.getMessage)
    }
  }

  def list(clientId: Int): Seq[ClientDocument] = docsDb.listByClient(clientId)

  def byId(docId: Int): Option[ClientDocument] = docsDb.byId(docId)

  def delete(docId: Int): Boolean = docsDb.delete(docId) == 1
}
