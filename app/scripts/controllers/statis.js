"use strict";

angular.module('nodejsAngularApp').controller('StatisCtrl',[
 '$scope', '$http', '$location',
  function ($scope, $http, $location, OAuth) {
    $scope.BusredpackChart = echarts.init(document.getElementById('BusredpackChart'));
    $scope.GetredpackChart = echarts.init(document.getElementById('GetredpackChart'));
    $scope.MyredpackChart = echarts.init(document.getElementById('MyredpackChart'));
    $http.get('/api/v1/statis/dgbs/1365567608')
      .success(function (data) {
          var categories_data=[];
          var data_data=[];
          var data_person=[];
          var data_new_person=[];
          var seed_redpack_num=[];
          var social_redpack_num=[];
          var feedback_redpack_num=[];
          var seed_redpack=[];
          var social_redpack=[];
          var feedback_redpack=[];

          angular.forEach(data.uv_sub_group, function (value) {
                    this.push(value.created_at)}, categories_data);

          angular.forEach(data.uv_sub_group, function (value) {
                    this.push(value.per_num)}, data_data);


          $scope.BusredpackOption = {
            title : {
              text: '巴士摇一摇',
            },
                    legend: {
                        padding: 5,
                        itemGap: 10,
                        data: ['浏览量']
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: categories_data
                        }
                    ],
                    yAxis: [                                    // 直角坐标系中纵轴数组
                        {
                            type: 'value',
                            axisLabel: {
                                formatter: '{value}次'
                            }
                        },
                    ],
                    series: [
                        {
                            name: '订单总量',                    // 系列名称
                            type: 'line',                       // 图表类型，折线图line、散点图scatter、柱状图bar、饼图pie、雷达图radar
                            data: data_data,
                            showAllSymbol: true
                        }
                   ]
                };

          $scope.GetredpackOption = {
            title : {
              text: '收到一个红包',
            },
                    legend: {
                        padding: 5,
                        itemGap: 10,
                        data: ['浏览量']
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: categories_data
                        }
                    ],
                    yAxis: [                                    // 直角坐标系中纵轴数组
                        {
                            type: 'value',
                            axisLabel: {
                                formatter: '{value}次'
                            }
                        },
                    ],
                    series: [
                        {
                            name: '订单总量',                    // 系列名称
                            type: 'line',                       // 图表类型，折线图line、散点图scatter、柱状图bar、饼图pie、雷达图radar
                            data: data_data,
                            showAllSymbol: true
                        }
                   ]
                };

         $scope.MyredpackOption = {
            title : {
              text: '我的红包',
            },
                    legend: {
                        padding: 5,
                        itemGap: 10,
                        data: ['浏览量']
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: categories_data
                        }
                    ],
                    yAxis: [                                    // 直角坐标系中纵轴数组
                        {
                            type: 'value',
                            axisLabel: {
                                formatter: '{value}次'
                            }
                        },
                    ],
                    series: [
                        {
                            name: '订单总量',                    // 系列名称
                            type: 'line',                       // 图表类型，折线图line、散点图scatter、柱状图bar、饼图pie、雷达图radar
                            data: data_data,
                            showAllSymbol: true
                        }
                   ]
                };

        
        $scope.BusredpackChart.setOption($scope.BusredpackOption);
        $scope.GetredpackChart.setOption($scope.GetredpackOption);
        $scope.MyredpackChart.setOption($scope.MyredpackOption);

        }).error(function (data, status, headers, config) {

            });


    }
]);
