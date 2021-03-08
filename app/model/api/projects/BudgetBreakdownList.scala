package model.api.projects

import model.dataModels.{BudgetBreakdowns, Payment}


case class SubBreakDownWithPayments(breakdownItem: BudgetBreakdowns, payments: Seq[Payment])
case class BudgetBreakdownList(breakDown: BudgetBreakdowns, subBreakDowns: Seq[SubBreakDownWithPayments])
