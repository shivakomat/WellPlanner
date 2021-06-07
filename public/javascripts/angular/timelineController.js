var timeline_utils = {
    formatDueDate: function (allItems) {
        var items =  allItems;
        for (var i=0; i < items.length; i++) {
            items[i].parent.date_display = moment(items[i].parent.date, "YYYYMMDD").format("MMM-DD-YYYY");
            for(var j=0; j < items[i].subItems.length; j++) {
                items[i].subItems[j].date_display = moment(items[i].subItems[j].date, "YYYYMMDD").format("MMM-DD-YYYY")
            }
        }
        return items;
    }
};

app.controller('timelineController', function (TimelineItemsFactory, $http) {
    var timelineController = this;

    timelineController.timelines = [];
    timelineController.currentParentTimeline = {};
    timelineController.currentTimelineItem = {};
    timelineController.timelineItems = [];

    timelineController.currentTaskComments = [];

    function refresh(businessId, projectId) {
        allTimelines(businessId, projectId);
    }

    timelineController.setParentTimelineItemId = function (parentId) {
        console.log(parentId);
        timelineController.parentId = parentId;
    };

    timelineController.newTimelineItem = function(parentTimeline) {
        timelineController.currentParentTimeline = parentTimeline;
    };

    timelineController.editTimelineItem = function (timelineItem) {
        timelineController.currentTimelineItem = timelineItem;
    };

    timelineController.getAllTimelines = function (projectId, businessId) {
        allTimelines(businessId, projectId)
    };

    timelineController.removeTimelineItem = function (projectId, businessId, timelineItemId) {
        deleteTimelineItemBy(projectId, businessId, timelineItemId);
    };

    timelineController.completeTimelineItem = function (timelineItem) {
        console.log(timelineItem);
        if(timelineItem.is_completed === true) {
            updateTimelineItem(timelineItem,"Timeline task mark completed!!", "Good job!");
        } else {
            updateTimelineItem(timelineItem,"Timeline task not completed!!", "oh uh!");
        }
    };

    function updateTimelineItem(updatedTimelineItem, msg, msgDesc) {
        TimelineItemsFactory.updateTimelineItemBy(updatedTimelineItem, function mySuccess() {
            refresh(updatedTimelineItem.business_id, updatedTimelineItem.project_id);
            alerts.autoCloseAlert('success-message', msg, msgDesc);
        }, function myError() {
            alerts.autoCloseAlert('success-message', 'Error updating timeline item', 'Please try again!');
        });
    }

    function deleteTimelineItemBy(projectId, businessId, timelineItemId) {
        TimelineItemsFactory.deleteTimelineItemBy(projectId, businessId, timelineItemId, function mySuccess() {
            refresh(businessId, projectId);
            alerts.autoCloseAlert('success-message', 'Timeline item Deleted!!', '');
        }, function myError() {
            alerts.autoCloseAlert('title-and-text', 'Error timeline item', 'Please try again!');
        })
    }

    function allTimelines(businessId, projectId) {
        TimelineItemsFactory.allTimelineItems(businessId, projectId,
            function mySuccess (response) {
                timelineController.timelineItems = timeline_utils.formatDueDate(response.data.data);
            },
            function myError (response) { console.log(response.statusText) }
        )
    }
});

app.directive('newTimelineItemModal',  [NewTimelineItemModalDirective]);
function NewTimelineItemModalDirective() {
    return{
        template:  '<ng-include src="getNewTimelineItemModalTemplateUrl()"/>',
        scope: false,
        bindToController: {
            businessId: '=',
            projectId: '=',
            allTimelineItemsLists: '=',
            parentTimelineItemId: '=',
        },
        controller: NewTimelineItemModalController,
        controllerAs: 'newTimelineItemModalController'

    }
}

app.controller('newTimelineItemModalController', [NewTimelineItemModalController]);
function NewTimelineItemModalController(TimelineItemsFactory, $scope, templates) {
    var newTimelineItemModalController = this;

    newTimelineItemModalController.formData = {};

    $scope.getNewTimelineItemModalTemplateUrl = function () {
        return templates.newTimelineItemModal;
    };

    newTimelineItemModalController.createTimelineItem = function () {
        console.log(newTimelineItemModalController.formData);
        newTimelineItem()
    };

    function newTimelineItem() {
        var timelineItemsList = {};
        timelineItemsList = newTimelineItemModalController.formData;
        timelineItemsList.business_id = newTimelineItemModalController.businessId;
        timelineItemsList.project_id = newTimelineItemModalController.projectId;
        timelineItemsList.parent_id = newTimelineItemModalController.parentTimelineItemId;
        timelineItemsList.notes = "none";
        var reformattedEventDate = newTimelineItemModalController.eventDateDisplay.format('YYYYMMDD');
        timelineItemsList.date = parseInt(reformattedEventDate);
        timelineItemsList.duration = parseInt(timelineItemsList.duration);
        timelineItemsList.is_completed = false;
        console.log("Inside newTimelineItem ");
        console.log(timelineItemsList);

        TimelineItemsFactory.addTimelineItem(timelineItemsList, function mySuccess() {
            refresh(newTimelineItemModalController.businessId, newTimelineItemModalController.projectId);
            alerts.autoCloseAlert('success-message', 'New timeline item list has been created!!', 'Nice start!');
        }, function myError() {
            alerts.autoCloseAlert('success-message', 'Sorry, unable to create a new timeline list', 'Please try again!');
        });
    }

    function refresh(businessId, projectId) {
        newTimelineItemModalController.formData = {};
        allTimelineItems(businessId, projectId);
    }


    function allTimelineItems(businessId, projectId) {
        TimelineItemsFactory.allTimelineItems(businessId, projectId,
            function mySuccess (response) {
                newTimelineItemModalController.allTimelineItemsLists = timeline_utils.formatDueDate(response.data.data);
                console.log(newTimelineItemModalController.allTimelineItemsLists);
            },
            function myError (response) { console.log(response.statusText) }
        )
    }
}



app.directive('newTimelineItemListModal',  [NewTimelineItemListModalDirective]);
function NewTimelineItemListModalDirective() {
    return{
        template:  '<ng-include src="getNewTimelineItemListModalTemplateUrl()"/>',
        scope: false,
        bindToController: {
            businessId: '=',
            projectId: '=',
            allTimelineItemsLists: '='
        },
        controller: NewTimelineItemListModalController,
        controllerAs: 'newTimelineItemListModalController'

    }
}


app.controller('newTimelineItemListModalController', [NewTimelineItemListModalController]);
function NewTimelineItemListModalController(TimelineItemsFactory, $scope, templates) {
    var newTimelineItemListModalController = this;

    newTimelineItemListModalController.formData = {};

    $scope.getNewTimelineItemListModalTemplateUrl = function () {
        return templates.newTimelineItemListModal;
    };

    newTimelineItemListModalController.createTimelineItemList = function () {
        console.log(newTimelineItemListModalController.formData);
        newTimelineItemsList()
    };

    function newTimelineItemsList() {
        var timelineItemsList = {};
        timelineItemsList = newTimelineItemListModalController.formData;
        timelineItemsList.business_id = newTimelineItemListModalController.businessId;
        timelineItemsList.project_id = newTimelineItemListModalController.projectId;
        timelineItemsList.parent_id = null;
        timelineItemsList.duration = 0;
        timelineItemsList.contact = "none";
        timelineItemsList.category = "none";
        timelineItemsList.time = "none";
        timelineItemsList.notes = "none";
        timelineItemsList.is_completed = false;
        var reformattedEventDate = newTimelineItemListModalController.eventDateDisplay.format('YYYYMMDD');
        timelineItemsList.date = parseInt(reformattedEventDate);
        console.log(timelineItemsList);
        console.log("Inside newTimelineItemsList ");
        console.log(timelineItemsList);

        TimelineItemsFactory.addTimelineItem(timelineItemsList, function mySuccess() {
            refresh(newTimelineItemListModalController.businessId, newTimelineItemListModalController.projectId);
            alerts.autoCloseAlert('success-message', 'New timeline item list has been created!!', 'Nice start!');
        }, function myError() {
            alerts.autoCloseAlert('success-message', 'Sorry, unable to create a new timeline list', 'Please try again!');
        });
    }



    function refresh(businessId, projectId) {
        newTimelineItemListModalController.formData = {};
        allTimelineItems(businessId, projectId);
    }


    function allTimelineItems(businessId, projectId) {
        TimelineItemsFactory.allTimelineItems(businessId, projectId,
            function mySuccess (response) {
                newTimelineItemListModalController.allTimelineItemsLists = timeline_utils.formatDueDate(response.data.data);
                console.log(newTimelineItemListModalController.allTimelineItemsLists);
            },
            function myError (response) { console.log(response.statusText) }
        )
    }
}

app.directive('deleteTimelineItemListModal',  [DeleteTimelineItemListModalDirective]);
function DeleteTimelineItemListModalDirective() {
    return{
        template:  '<ng-include src="getDeleteTimeLineItemListTemplateUrl()"/>',
        scope: false,
        bindToController: {
            businessId: '=',
            projectId: '=',
            allTimelineItemsLists: '='
        },
        controller: DeleteTimelineItemListModalController,
        controllerAs: 'deleteTimelineItemListModalController'
    }
}


app.controller('deleteTimelineItemListModalController', [DeleteTimelineItemListModalController]);
function DeleteTimelineItemListModalController(TimelineItemsFactory, $scope, templates) {
    var deleteTimelineItemListModalController = this;
    deleteTimelineItemListModalController.formData = {};

    $scope.getDeleteTimeLineItemListTemplateUrl = function () {
        return templates.deleteTimelineItemListModal;
    };

    deleteTimelineItemListModalController.deleteTimelineItem = function () {
        deleteTimelineItem(deleteTimelineItemListModalController.businessId, deleteTimelineItemListModalController.projectId, deleteTimelineItemListModalController.formData.timelineToDelete.parent.id)
    };

    function deleteTimelineItem(businessId, projectId, timelineId) {
        TimelineItemsFactory.deleteTimelineItemBy(projectId, businessId, timelineId, function mySuccess() {
            refresh(businessId, projectId);
            alerts.autoCloseAlert('success-message', "Timeline List deleted successfully", "Nice!");
        }, function myError() {
            alerts.autoCloseAlert('success-message', 'Error deleting Timeline List', 'Please try again!');
        });
    }

    function refresh(businessId, projectId) {
        allTasks(businessId, projectId);
    }

    function allTasks(businessId, projectId) {
        TimelineItemsFactory.allTimelineItems(businessId, projectId,
            function mySuccess (response) {
                deleteTimelineItemListModalController.allTimelineItemsLists = timeline_utils.formatDueDate(response.data.data);
            },
            function myError (response) { console.log(response.statusText) }
        )
    }
}

