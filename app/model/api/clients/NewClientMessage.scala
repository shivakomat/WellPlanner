package model.api.clients

import model.dataModels.Client

case class NewClientMessage(clientId: Option[Int], customerName: String, phoneNumber: String, emailAddress: String,
                            eventType: String, eventDate: Int, budget: Double, notes: Option[String] = None, status: String, businessId: Int)

case class ClientMessage(client: Client, projectId: Option[Int] = None)
