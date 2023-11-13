var app = getApp();
const api = require('../../utils/API.js');
var QQMapWX = require('../../utils/SDK/qqmap-wx-jssdk.js');

Page({
  data: {
    markers:[],
    polyline: {},
    longitude: 113.358292,
    latitude: 23.15827,
    tabs:[
      {
        id: '1',
        name: '驾车',
        isActive: true,
      },
      {
        id: '2',
        name: '步行',
        isActive: false,
      },
      {
        id: '3',
        name: '自行车',
        isActive: false,
      },
      {
        id: '4',
        name: '电动车',
        isActive: false,
      },
      {
        id: '5',
        name: '公共交通',
        isActive: false,
      },
    ],
    scale:13,
  },

  onLoad(e){
    let end = JSON.parse(e.marker)
    end.iconPath="/icons/end.png"
    let start = {
      id: 0,
      longitude: e.myLongitude,
      latitude: e.myLatitude,
      width: 40,
      height: 40,
      iconPath: '/icons/start.png',
      callout:{
        color:'#000000',
        content:'你的位置',
        fontSize:16,
        borderRadius:5,
        padding: 7,
        bgColor:'#FFFFFF',
        textAlign:'center',
        display:"ALWAYS"
      },
    }
    let markers = []
    markers.push(start)
    markers.push(end)
    this.setData({
      markers: markers,
      longitude: start.longitude,
      latitude: start.latitude,
    })
    this.goto(4)
  },

  
  tabsChange(e){
    const index=e.currentTarget.dataset.index-1;
    let{tabs}=this.data;
    for(var i = 0;i<tabs.length;i++){
      tabs[i].isActive = false
    }
    tabs[index].isActive = true
    this.setData({
      tabs,
    })
    this.getPOI(index+1)
  },

  async goto(type){
    var that = this
    if(type==4){
      that.gotoByTransit()
      return 
    }
    var qqmapsdk = new QQMapWX({
      key: 'N7LBZ-JUJ67-SYBXG-PLYLI-WK3WT-DGFF4'
    });
    const markers = that.data.markers
    var mode = ''
    switch(type){
      case 0:
        mode = 'driving'
        break;
      case 1:
        mode = 'walking'
        break;
      case 2:
        mode = 'bicycling'
        break;
      case 3:
        mode = 'ebicycling'
        break;
    }
    qqmapsdk.direction({
      mode: mode,
      from: {
        'latitude': markers[0].latitude,
        'longitude': markers[0].longitude,
      },
      to: {
        'latitude': markers[1].latitude,
        'longitude': markers[1].longitude,
      },
      success: function (res) {
        console.log(res);
        var coors = res.result.routes[0].polyline, pl = [];
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] })
        }
        that.setData({
          latitude:pl[0].latitude,
          longitude:pl[0].longitude,
          polyline: [{
            points: pl,
            color: '#FF0000DD',
            width: 4
          }]
        })
      },
      fail: function (error) {
        console.error(error);
      }
    });
  },

  async gotoByTransit(){
    var qqmapsdk = new QQMapWX({
      key: 'N7LBZ-JUJ67-SYBXG-PLYLI-WK3WT-DGFF4'
    });
    var that = this;
    var markers = that.data.markers
    qqmapsdk.direction({
      mode: 'transit',
      from: {
        'latitude': markers[0].latitude,
        'longitude': markers[0].longitude,
      },
      to: {
        'latitude': markers[1].latitude,
        'longitude': markers[1].longitude,
      },
      success: function (res) {
        console.log(res);
        var ret = res.result.routes[0];
        var count = ret.steps.length;
        var pl = [];
        var coors = [];
        for(var i = 0; i < count; i++) {
          if (ret.steps[i].mode == 'WALKING' && ret.steps[i].polyline) {
            coors.push(ret.steps[i].polyline);
          }
          if (ret.steps[i].mode == 'TRANSIT' && ret.steps[i].lines[0].polyline) {
            coors.push(ret.steps[i].lines[0].polyline);
          }
        }       
        var kr = 1000000;
        for (var i = 0 ; i < coors.length; i++){
          for (var j = 2; j < coors[i].length; j++) {
            coors[i][j] = Number(coors[i][j - 2]) + Number(coors[i][j]) / kr;
          }
        }
        var coorsArr = [];
        for (var i = 0 ; i < coors.length; i ++){
          coorsArr = coorsArr.concat(coors[i]);
        }
        for (var i = 0; i < coorsArr.length; i += 2) {
          pl.push({ latitude: coorsArr[i], longitude: coorsArr[i + 1] })
        }
        that.setData({
          latitude:pl[0].latitude,
          longitude:pl[0].longitude,
          polyline: [{
            points: pl,
            color: '#FF0000DD',
            width: 4
          }]
        })
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  }
})