
app.factory('TimelineItemsFactory', function TimelineItemsFactory ($http) {
    var getAllTimelineItems = function (businessId, projectId, successFunction, errorFunction) {
        $http({method: 'GET', url: '/businesses/'+ businessId + "/projects/" + projectId + "/timelineItems"}).then(successFunction, errorFunction)
    };

    var addTimelineItem = function (timelineItem, successFunction, errorFunction) {
        $http({method: 'POST', url: '/businesses/projects/timelineItems', data: timelineItem}).then(successFunction, errorFunction);
    };

    var deleteTimelineItem = function (projectId, businessId, timelineItemId, successFunction, errorFunction) {
        $http({method: 'DELETE', url: '/businesses/' + businessId + '/projects/' + projectId + '/timelineItems/' + timelineItemId}).then(successFunction, errorFunction);
    };

    var updateTimelineItemBy = function (updatedTimelineItem, successFunction, errorFunction) {
        $http({method: 'POST', url: '/businesses/projects/timelineItems/update', data: updatedTimelineItem}).then(successFunction, errorFunction);
    };

    return {
        allTimelineItems: getAllTimelineItems,
        addTimelineItem: addTimelineItem,
        deleteTimelineItemBy: deleteTimelineItem,
        updateTimelineItemBy: updateTimelineItemBy
    }
});