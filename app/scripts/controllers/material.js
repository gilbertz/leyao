angular.module('nodejsAngularApp')
  .controller('MaterialCreateCtrl', function ($scope, $http, $location) {

    $scope.product = {
      price: 0,
      specification: 1
    };

    $scope.selectedWarehouses = []
    $scope.$on('uploadSuccess', function(event, data) {
      $scope.$apply(function(){
        console.log(data)
        $scope.product.thumb_id = data.image_id
        $scope.product.thumb = data.url
      })
    });

    $scope.selectAllWarehouses = function() {
      $scope.warehouses.forEach(function(w){
        w.select = true
      })
    }

    $scope.create = function () {
      $scope.product.url = [{"source": "JD", "url": $scope.product.jdUrl}, {"source": "Tmall", "url": $scope.product.tmallUrl}]
      $scope.warehouses.forEach(function(w) {
        if (w.select == true){
          $scope.selectedWarehouses.push([w.id, w.show])
        }
      })
      $scope.product.warehouses = $scope.selectedWarehouses
      $http.post('api/products/create', $scope.product)
        .success(function (data) {
          alert('创建成功');
        })
        .error(function(data){

          var error = ""
          if( Object.prototype.toString.call(data) == "[object Array]"){
            data.forEach(function(e){
              error += e.params[0] + " " + e.messages[0] + ";"
            })
          } else {
            error = data.error
          }

          alert("创建失败，原因：" + error)
        })
    }}).
    controller('MaterialUpdateCtrl', function($scope, $http, $routeParams){

      $scope.productId = $routeParams.productId;
      $scope.selectedWarehouseIds = []
      $scope.units = []
      $scope.$on('uploadSuccess', function(event, data) {
        $scope.$apply(function(){
          $scope.product.thumb_id = data.image_id
          $scope.product.thumb = data.url
        })
      });


      $scope.jdUrl = ""
      $scope.tmUrl = ""


      $scope.product = {}
        $http.get('api/products/' + $scope.productId)
          .success(function (data) {
            console.log(data)
            $scope.product = data
            $scope.units = data.units
            $scope.jdUrl =  decodeURIComponent(data.url[0]["url"])
            $scope.tmUrl =  decodeURIComponent(data.url[1]["url"])

        }).error(function(data){
            alert("加载商品信息失败，原因" + data.error)
        })
        $scope.page = $routeParams.page;

        $scope.selectAll = function(r) {
          $scope.product.warehouses.forEach(function(w) {
            w.has_product = r
          })
        }
        $scope.update = function(){
          $scope.selectedWarehouseIds = []
          $scope.product.url = [{"source": "JD", "url": encodeURIComponent($scope.jdUrl)}, {"source": "Tmall", "url": encodeURIComponent($scope.tmUrl)}]
          $scope.product.warehouses.forEach(function (w) {
            if (w.has_product == true){
              $scope.selectedWarehouseIds.push(w.id)
            }
          })
          $scope.product.warehouse_ids = $scope.selectedWarehouseIds
          $http.patch('api/products/' + $scope.productId, $scope.product)
            .success(function (data) {
              alert('更新成功');
            })
            .error(function(data) {
                alert("更新失败，原因：" + data.error)
            });
        }
    })
      .directive('imageUploader', function () {
        'use strict';

        return {

          restrict: 'EA',

          template: '<div id="image-upload-btn">选择图片</div>',

          replace: true,

          link: function (scope, element) {

            scope.uploading = false;

            scope.uploader = new WebUploader.Uploader({
              swf: '/assets/lib/webuploader/Uploader.swf',
              server: 'api/picture',
              pick: element,
              resize: false,
              fileSizeLimit: 5 * 1024 * 1024,
              fileSingleSizeLimit: 5 * 1024 * 1024,
              fileNumLimit: 5
            });

            var uploader = scope.uploader;

            uploader.on('beforeFileQueued', function (file) {
              console.log('inner beforeFileQueued', file);
              scope.$emit('beforeFileQueued', file);
            });

            uploader.on('error', function (type) {
              console.log(type);
              scope.$emit('error', type);
            });

            uploader.on('fileQueued', function (file) {
              console.log('inner fileQueued', file);
              uploader.upload();
            });

            uploader.on('uploadStart', function (file) {
              console.log('inner uploadStart', file);
              scope.$emit('uploadStart', file);
            });

            uploader.on('uploadProgress', function (file, percentage) {
              scope.$emit('uploadProgress', file, percentage);
            });

            uploader.on('uploadError', function (file, reason) {
              scope.$emit('uploadError', file, reason);
            });

            uploader.on('uploadSuccess', function (file, response) {
              var json = jQuery.parseJSON(response._raw);
              scope.$emit('uploadSuccess', json);
            });
          }
        };
  });
