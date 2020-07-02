package model.dataModels

case class BudgetPayments(id: Option[Int] = None,
                          budget_id: Int,
                          projectId: Int,
                          business_id: Int,
                          amount_paid: Double,
                          payment_date: Int,
                          modified_date: Option[Int] = None,
                          create_date: Option[Int] = None)

