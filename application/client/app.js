'use strict';

var app = angular.module('application', []);

app.controller('AppCtrl', function($scope, appFactory){
    $("#success_recharge").hide();
    $("#success_transaction").hide();
    $("#success_game").hide();
    $("#success_register").hide();
    $("#success_login").hide();
   $("#success_init").hide();
   $("#success_charge").hide();
   $("#success_initItem").hide();
   $("#success_purchaseItem").show();
   $("#success_invoke").hide();
   $("#success_query").hide();
   $("#success_querygame").hide();
   $("#success_queryitem").hide();
   $("#success_admin").hide();
   $("#success_delete").hide();

   $scope.registerUser = function() {
        $("#success_register").hide();
        appFactory.registerUser($scope.register, function(data) {
            $scope.register_status = "Registration " + data.message;
            $("#success_register").show();
        });
    }

    $scope.loginUser = function() {
        $("#success_login").hide();
        appFactory.loginUser($scope.login, function(data) {
            if (data.status === 'success') {
                if (data.isAdmin) {
                    window.location.href = '/admin.html';
                } else {
                    window.location.href = '/mainpage.html';
                }
            } else {
                $scope.login_status = "Login failed: " + data.message;
                $("#success_login").show();
            }
        });
    }

   $scope.initAB = function(){
       appFactory.initAB($scope.userinfo, function(data){
           if(data == "")
           $scope.init_ab = "success";
           $("#success_init").show();
       });
   }
   $scope.chargeAB = function(){
        appFactory.chargeAB($scope.charge, function(data){
            if(data == "")
            $scope.charge_ab = "success";
            $("#success_charge").show();
        });
    }
   $scope.initItemAB = function(){
        appFactory.initItemAB($scope.Item, function(data){
            if(data == "")
            $scope.initItem_ab = "success";
            $("#success_initItem").show();
        });
    }
    $scope.purchaseItemAB = function(){
        appFactory.purchaseItemAB($scope.purchase, function(data){
            if(data == "")
            $scope.purchase_ab = "success";
            $("#success_purchaseItem").show();
        });
    }
   $scope.invokeAB = function(){
        appFactory.invokeAB($scope.transfer, function(data){
            if(data == "")
            $scope.invoke_ab = "success";
            $("#success_invoke").show();
        });
    }
   $scope.queryAB = function(){
       appFactory.queryAB($scope.walletid, function(data){
           $scope.query_ab = data;
           $("#success_query").show();
       });
   }
   $scope.queryitemAB = function(){
        appFactory.queryitemAB($scope.itemId, function(data){
            $scope.queryitem_ab = data;
        });
    }
    $scope.querypurchaseAB = function(){
        appFactory.querypurchaseAB($scope.user, function(data){
            $scope.querypurchase_ab = data;
        });
    }
   $scope.adminAB = function(){
        appFactory.queryAB("5pandaadmin", function(data){
            $scope.admin_ab = data;
            $("#success_admin").show();
        });
    }
   $scope.deleteAB = () => {
    appFactory.deleteAb($scope.deleteId, (data) => {
        if(data == "")
        $scope.delete_ab = "success";
        $("#success_delete").show();
    });
   }

   $scope.sendPoints = function() {
    $("#success_transaction").hide();
    appFactory.sendPoints($scope.transaction, function(data) {
        $scope.transaction_status = data.message;
        $("#success_transaction").show();
        $scope.querygameAB(); // 송금 후 잔액 조회
    });
}

$scope.playGame = function() {
    $("#success_game").hide();
    appFactory.playGame($scope.game, function(data) {
        $scope.game_status = data.message;
        $("#success_game").show();
        $scope.querygameAB(); // 게임 후 잔액 조회
    });
}

$scope.userRechargePoints = function() {
    $("#success_recharge").hide();
    appFactory.userRechargePoints($scope.recharge, function(data) {
        $scope.recharge_status = data.message;
        $("#success_recharge").show();
        $scope.querygameAB(); // 충전 후 잔액 조회
    });
}

$scope.logout = function() {
    appFactory.logout(function() {
        window.location.href = '/login.html';
    });
}

$scope.querygameAB = function() {
    appFactory.querygameAB(function(data) {
        $scope.user_info = data.data;
        $("#success_querygame").show();
    });
}



// 로그인 후 바로 잔액 조회
$scope.querygameAB();
});
app.controller('AdminCtrl', function($scope, appFactory) {
    $("#success_recharge").hide();

    $scope.rechargePoints = function() {
        $("#success_recharge").hide();
        appFactory.rechargePoints($scope.recharge, function(data) {
            $scope.recharge_status = data.message;
            $("#success_recharge").show();
        });
    }

    $scope.logout = function() {
        appFactory.logout(function() {
            window.location.href = '/login.html';
        });
    }
});
app.controller('AdminCtrl', function($scope, appFactory) {
    $("#success_recharge").hide();

    $scope.rechargePoints = function() {
        $("#success_recharge").hide();
        appFactory.rechargePoints($scope.recharge, function(data) {
            $scope.recharge_status = data.message;
            $("#success_recharge").show();
        });
    }

    $scope.logout = function() {
        appFactory.logout(function() {
            window.location.href = '/login.html';
        });
    }
});
app.factory('appFactory', function($http){
      
    var factory = {};
 
    factory.initAB = function(data, callback){
        $http.get('/init?user='+data.user+'&userval='+data.userval).success(function(output){
            callback(output)
        });
    }
    factory.chargeAB = function(data, callback){
        $http.get('/charge?user='+data.user+'&userval='+data.userval).success(function(output){
            callback(output)
        });
    }
    factory.initItemAB = function(data, callback){
        $http.get('/initItem?itemName='+data.itemName+'&styleNum='+data.styleNum+'&brand='+data.brand+'&inventory='+data.inventory).success(function(output){
            callback(output)
        });
    }
    factory.purchaseItemAB = function(data, callback){
        $http.get('/purchaseItem?user='+data.user+'&itemId='+data.itemId).success(function(output){
            callback(output)
        });
    }
    factory.invokeAB = function(data, callback){
        $http.get('/invoke?sender='+data.sender+'&reciever='+data.reciever+'&value='+data.value).success(function(output){
            callback(output)
        });
    }
    factory.queryAB = function(name, callback){
        $http.get('/query?name='+name).success(function(output){
            callback(output)
        });
    }
    factory.queryitemAB = function(itemId, callback){
        $http.get('/queryitem?itemId='+itemId).success(function(output){
            callback(output)
        });
    }
    factory.querypurchaseAB = function(user, callback){
        $http.get('/querypurchase?user='+user).success(function(output){
            callback(output)
        });
    }
    factory.deleteAB = (name, callback) => {
        $http.get('/delete?name='+name).success((output) => {
            callback(output)
        })
    } 

    factory.sendPoints = function(data, callback) {
        $http.post('/send', data).then(function(response) {
            callback(response.data);
        });
    }

    factory.playGame = function(data, callback) {
        $http.post('/playGame', data).then(function(response) {
            callback(response.data);
        });
    }

    factory.rechargePoints = function(data, callback) {
        $http.post('/admin/recharge', data).then(function(response) {
            callback(response.data);
        });
    }

    factory.userRechargePoints = function(data, callback) {
        $http.post('/recharge', data).then(function(response) {
            callback(response.data);
        });
    }

    factory.logout = function(callback) {
        $http.get('/logout').then(function(response) {
            callback();
        });
    }

    factory.registerUser = function(data, callback) {
        $http.post('/register', data).success(function(output) {
            callback(output);
        });
    }

    factory.querygameAB = function(callback) {
        $http.get('/querygame').then(function(response) {
            callback(response.data);
        });
    }

    factory.loginUser = function(data, callback) {
        $http.post('/login', data).success(function(output) {
            callback(output);
        });
    }


    return factory;
 });
 