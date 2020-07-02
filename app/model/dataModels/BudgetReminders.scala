package model.dataModels


case class BudgetReminders(id: Option[Int] = None,
                           budget_id: Int,
                           projectId: Int,
                           business_id: Int,
                           reminder_date: Int,
                           created_date: Option[Int] = None)

