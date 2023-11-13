var app = getApp();
const api = require('../../utils/API.js');

Page({
  data: {
    markers:[],
    polyline: {},
    longitude: 113.358292,
    latitude: 23.15827,
    myLongitude: 0,
    myLatitude: 0,
    tabs:[
      {
        id: '1',
        name: '教学楼',
        isActive: false,
      },
      {
        id: '2',
        name: '食堂',
        isActive: false,
      },
      {
        id: '3',
        name: '宿舍区',
        isActive: false,
      },
      {
        id: '4',
        name: '运动场',
        isActive: false,
      },
      {
        id: '5',
        name: '校门',
        isActive: false,
      },
      {
        id: '6',
        name: '其他',
        isActive: false,
      },
    ],
    scale:16,
  },

  onLoad(){
    const points = app.globalData.wholeLinePoints
    var polyline = [{
      points:points,
      width: 1,
      color: "#196221",
    }]
    // this.setData({polyline:polyline})

    this.mapCtx = wx.createMapContext('myMap')
    this.mapCtx.addGroundOverlay({
      id: 1,
      src: `/icons/images/map.png`,
      bounds: {
        southwest: {
          longitude: 113.343588,
          latitude: 23.150378,
        },
        northeast: {
          longitude: 113.372905,
          latitude: 23.164529,
        }
      },
      opacity: 0.8,
      success: (res) => {console.log('贴图成功')},
      fail: (err) => {
        console.log(err)
      }
    })
  },

  async getPOI(data){
    var that = this
    var type = data;
    if(type == 6)
      type=0
    await api.request({
      url: 'php/geiPOI.php',
      data:{
        type: type,
      },
      method: 'GET',
    }).then(res=>{
      // console.log(res)
      var markers = []
      const data = res.data.data
      for(var i=0;i<data.length;i++){
        var stmp = {
            id: Number(data[i].id),
            longitude: data[i].longitude,
            latitude: data[i].latitude,
            width: 40,
            height: 40,
            iconPath: '/icons/eat.png',
            callout:{
              color:'#000000',
              content:data[i].name,
              fontSize:16,
              borderRadius:5,
              padding: 7,
              bgColor:'#FFFFFF',
              textAlign:'center',
              display:"ALWAYS"
            },
        }
        switch(type){
          case 0:
            if(stmp.id===1)
              stmp.iconPath = '/icons/images/5_1_xzl.png';
            else
              stmp.iconPath = '/icons/build.png';
            break;
          case 1:
            switch(stmp.id){
              case 11:
                stmp.iconPath = '/icons/images/5_1_j1.png';
                break;
              case 12:
                stmp.iconPath = '/icons/images/5_1_j2.png';
                break;
              case 13:
                stmp.iconPath = '/icons/images/5_1_j3.png';
                break;
              case 14:
                stmp.iconPath = '/icons/images/5_1_j4.png';
                break;
              case 15:
                stmp.iconPath = '/icons/images/5_1_j5.png';
                break;
              case 16:
                stmp.iconPath = '/icons/images/5_1_j6.png';
                break;
            }
            break;
          case 2:
            stmp.iconPath = '/icons/eat.png';
            break;
          case 3:
            stmp.iconPath = '/icons/sleep.png';
            break;
          case 4:
            stmp.iconPath = '/icons/run.png';
            break;
          case 5:
            stmp.iconPath = '/icons/gate.png';
            break;
        }
        markers.push(stmp)
      }
      that.setData({markers:markers})
    })
    .catch(err=>{
      console.log(res)
    })
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

  clean(){
    let{tabs}=this.data;
    for(var i = 0;i<tabs.length;i++){
      tabs[i].isActive = false
    }
    this.setData({
      tabs,
      markers:[],
    })
  },

  changepoint(e){
    var latitude = e.currentTarget.dataset.latitude
    var longitude = e.currentTarget.dataset.longitude
    this.setData({
      latitude:latitude,
      longitude:longitude,
      scale:18,
    })
  },

  async controltap(e) {
    var that = this
    await wx.getLocation({
      type: 'gcj02',
    })
    .then(res=>{
      that.setData({
         longitude:res.longitude,
         latitude:res.latitude,
         myLatitude: res.latitude,
         myLongitude: res.longitude,
         scale: 18,
      })
    })
    .catch(err => {
      console.log(err)
    })
  },

  async goto(e){
    var that = this
    const markers = that.data.markers
    const id = e.currentTarget.dataset.id
    await wx.getLocation({
      type: 'wgs84',
    }).then(res=>{
      console.log(res)
      that.setData({
         myLatitude: res.latitude,
         myLongitude: res.longitude,
         scale: 15,
      })
    }).catch(err=>{
      console.log(err)
    })
    for(let i=0;i<markers.length;i++){
      if(markers[i].id===id){
        // wx.navigateTo({
        //   url: '/pages/navigation/navgation?marker=' + JSON.stringify(markers[i]) + '&myLatitude=' + that.data.myLatitude + '&myLongitude=' + that.data.myLongitude,
        // })
        let key = 'N7LBZ-JUJ67-SYBXG-PLYLI-WK3WT-DGFF4'
        let referer = 'map';
        // let startPoint = JSON.stringify({
        //     'name': '你的位置',
        //     'latitude': that.data.myLatitude,
        //     'longitude': that.data.myLongitude,
        // });
        let endPoint = JSON.stringify({
            'name': markers[i].callout.content,
            'latitude': markers[i].latitude,
            'longitude': markers[i].longitude,
        });
        wx.navigateTo({
            // url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint + '&startPoint=' + startPoint
            url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
        });
      }
    }
  }
});