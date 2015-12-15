app.controller('usersCtrl', function ($scope, $modal, $filter, Data) {
    $scope.user = {};
    Data.get('users').then(function(data){
        $scope.users = data.data;
    });
    $scope.changeUserStatus = function(user){
        user.status = (user.status=="Active" ? "Inactive" : "Active");
        Data.put("users/"+user.user_id,{status:user.status});
    };
    $scope.deleteUser = function(user){
        if(confirm("Are you sure to remove the users")){
            Data.delete("users/"+user.user_id).then(function(result){
                $scope.users = _.without($scope.users, _.findWhere($scope.users, {id:user.user_id}));
            });
        }
    };
    $scope.open = function (p,size) {
        var modalInstance = $modal.open({
          templateUrl: 'partials/usersEdit.html',
          controller: 'usersEditCtrl',
          size: size,
          resolve: {
            item: function () {
              return p;
            }
          }
        });
        modalInstance.result.then(function(selectedObject) {
            if(selectedObject.save == "insert"){
                $scope.users.push(selectedObject);
                $scope.users = $filter('orderBy')($scope.users, 'user_id', 'reverse');
            }else if(selectedObject.save == "update"){
                p.user_id = selectedObject.user_id;
                p.name = selectedObject.name;
                p.password = selectedObject.password;
                p.email = selectedObject.email;                
                p.status = selectedObject.status;
                p.creation_time = selectedObject.creation_time;
            }
        });
    };
    
 $scope.columns = [
                    {text:"ID",predicate:"user_id",sortable:true,dataType:"number"},
                    {text:"Name",predicate:"name",sortable:true},
                    {text:"Password",predicate:"password",sortable:true},
                    {text:"Email",predicate:"email",sortable:true},
                    {text:"Status",predicate:"status",reverse:true,sortable:true,dataType:"number"},
                    {text:"Creation Time",predicate:"creation_time",sortable:true},                  
                    {text:"Action",predicate:"",sortable:false}
                ];

});


app.controller('usersEditCtrl', function ($scope, $modalInstance, item, Data) {

  $scope.user = angular.copy(item);
        
        $scope.cancel = function () {
            $modalInstance.dismiss('Close');
        };
        $scope.title = (item.id > 0) ? 'Edit Users' : 'Add User';
        $scope.buttonText = (item.id > 0) ? 'Update User' : 'Add New User';

        var original = item;
        $scope.isClean = function() {
            return angular.equals(original, $scope.user);
        }
        $scope.saveUser = function (user) {
            user.uid = $scope.uid;
            if(user.user_id > 0){       
                Data.put('users/'+user.user_id, user).then(function (result) {
                    if(result.status != 'error'){
                        var x = angular.copy(user);
                        x.save = 'update';
                        $modalInstance.close(x);
                    }else{
                        console.log(result);
                    }
                });
            }else{              
                user.status = 'Active';
                Data.post('users', user).then(function (result) {
                    if(result.status != 'error'){
                        var x = angular.copy(user);
                        x.save = 'insert';
                        x.id = result.data;
                        $modalInstance.close(x);
                    }else{
                        console.log(result);
                    }
                });
            }
        };
});
