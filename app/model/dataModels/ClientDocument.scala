package model.dataModels

case class ClientDocument(id: Option[Int] = None,
                          client_id: Int,
                          filename: String,
                          mime_type: String,
                          file_size: Long,
                          file_path: String,
                          uploaded_at: Long)
