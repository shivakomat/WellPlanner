package model.api.projects

case class NewWeddingProjectMessage(bride: String, groom: String, dueDate: String, budget: Double, businessId: Int)