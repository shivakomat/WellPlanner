package model.dataModels

case class Payment(id: Option[Int] = None, budget_id: Int, business_id: Int, project_id: Int, payment_amount: Int,
                   payment_date: Int, modified_date: Option[Int] = None, created_date: Option[Int] = None)