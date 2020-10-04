package model.dataModels

case class BudgetBreakdowns(id: Option[Int] = None,
                            parent_budget_id: Option[Int] = None,
                            project_id: Int,
                            business_id: Int,
                            title: String,
                            is_budget_header: Boolean = false,
                            estimate: Double,
                            actual: Double,
                            modified_date: Option[Int] = None,
                            created_date: Option[Int] = None)