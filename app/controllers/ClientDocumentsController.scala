package controllers

import com.google.inject.Inject
import controllers.util.ResponseTypes.{errorResponse, successResponse}
import model.api.clients.ClientDocumentsApi
import play.api.Logger
import play.api.db.DBApi
import play.api.libs.Files.TemporaryFile
import play.api.libs.json.Json
import controllers.util.JsonFormats._
import play.api.mvc.{AbstractController, ControllerComponents, MultipartFormData, ResponseHeader, Result}

import java.io.File
import scala.concurrent.{ExecutionContext, Future}

class ClientDocumentsController @Inject()(dbApi: DBApi, cc: ControllerComponents)(implicit ec: ExecutionContext)
  extends AbstractController(cc) {

  private val logger = Logger(this.getClass)
  private val docsApi = new ClientDocumentsApi(dbApi)
  private val maxSize = 10 * 1024 * 1024 // 10 MB
  private val allowedTypes = Set("application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")

  def upload(clientId: Int) = Action(parse.multipartFormData(maxSize)).async { request =>
    request.body.file("file") match {
      case Some(filePart) if allowedTypes.contains(filePart.contentType.getOrElse("")) =>
        val tempPath = filePart.ref.path
        val result = docsApi.save(clientId, filePart.filename, filePart.contentType.get, filePart.fileSize, tempPath)
        result match {
          case Right(doc) => Future.successful(successResponse(CREATED, Json.toJson(doc), Seq("Uploaded successfully")))
          case Left(err)  => Future.successful(errorResponse(INTERNAL_SERVER_ERROR, Seq(err)))
        }
      case Some(_) => Future.successful(errorResponse(UNSUPPORTED_MEDIA_TYPE, Seq("Unsupported file type")))
      case None => Future.successful(errorResponse(BAD_REQUEST, Seq("No file part named 'file'")))
    }
  }

  def list(clientId: Int) = Action {
    val docs = docsApi.list(clientId)
    successResponse(OK, Json.toJson(docs), Seq("Processed successfully"))
  }

  def download(docId: Int) = Action {
    docsApi.byId(docId) match {
      case Some(doc) =>
        val file = new File(doc.file_path)
        if(file.exists()) Ok.sendFile(file, inline = true)
        else errorResponse(NOT_FOUND, Seq("File not found on disk"))
      case None => errorResponse(NOT_FOUND, Seq("Document not found"))
    }
  }

  def delete(docId: Int) = Action {
    docsApi.byId(docId) match {
      case Some(doc) =>
        val file = new File(doc.file_path)
        val dbDeleted = docsApi.delete(docId)
        if (dbDeleted) {
          if(file.exists()) file.delete()
          successResponse(OK, Json.obj("deleted" -> true), Seq("Deleted"))
        } else errorResponse(INTERNAL_SERVER_ERROR, Seq("DB delete failed"))
      case None => errorResponse(NOT_FOUND, Seq("Document not found"))
    }
  }
}
