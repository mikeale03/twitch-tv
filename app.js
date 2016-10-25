angular.module("MyApp",["ngAnimate"])
  .controller("myController", function($http) {
  ctrl=this;
  var users = [{"name":"ESL_SC2","logo":"https://static-cdn.jtvnw.net/jtv_user_pictures/esl_sc2-profile_image-d6db9488cec97125-300x300.jpeg"},
               {"name":"OgamingSC2","logo":"https://static-cdn.jtvnw.net/jtv_user_pictures/ogamingsc2-profile_image-9021dccf9399929e-300x300.jpeg"},
               {"name":"AdmiralBulldog","logo":"https://static-cdn.jtvnw.net/jtv_user_pictures/admiralbulldog-profile_image-888d5b80958e636f-300x300.jpeg"},
               {"name":"cretetion","logo":"https://static-cdn.jtvnw.net/jtv_user_pictures/cretetion-profile_image-12bae34d9765f222-300x300.jpeg"},
               {"name":"freecodecamp","logo":"https://static-cdn.jtvnw.net/jtv_user_pictures/freecodecamp-profile_image-d9514f2df0962329-300x300.png"},
               {"name":"storbeck","logo":"https://static-cdn.jtvnw.net/jtv_user_pictures/storbeck-profile_image-7ab13c2f781b601d-300x300.jpeg"},
               {"name":"noobs2ninjas","logo":"https://static-cdn.jtvnw.net/jtv_user_pictures/noobs2ninjas-profile_image-34707f847a73d934-300x300.png"},
               {"name":"brunofin","logo":"http://res.cloudinary.com/domarp-j/image/upload/v1461723271/NoProfPic_obve9q.jpg"}];

  var api ="https://api.twitch.tv/kraken/streams/";
  var allAccnts = [];
  ctrl.isLoading = true;
  ctrl.accnts = [];
  users.forEach(function(value) {
     $http({
          method:"GET",
          url:api+value.name,
          //transformRequest: angular.identity,
          headers:{'Client-ID': 'etiqq1i0rrz4yjkxb1l4cto1wxdt5ee'}
        }).then(function(data) {
          console.log(data);
          data.name = value.name;
          data.logo = value.logo;
          allAccnts.push(data);
          ctrl.isLoading = false;
        }, function(data) {
           console.log(data);
           allAccnts.push({ name:value.name,
                            logo:value.logo,
                            message:"Account not found!",
                          });
           ctrl.isLoading = false;
        });
  });
  ctrl.accnts = allAccnts;
  console.log(ctrl.accnts);

  ctrl.displayStat = function(a) {
    if(a.data) {
      if(a.data.stream) {
        return a.data.stream.channel.game + ": "+a.data.stream.channel.status;
      } else {
        return "OFFLINE!";
      }
    } else {
      return a.message;
    }
  }

  ctrl.displayOnline = function() {
    ctrl.accnts = [];
    allAccnts.forEach(function(value) {
      if(value.data && value.data.stream)
         ctrl.accnts.push(value);
    });
  }

  ctrl.displayOffline = function() {
    ctrl.accnts = [];
    allAccnts.forEach(function(value) {
      if(value.data && !value.data.stream)
        ctrl.accnts.push(value);
    });
  }

  ctrl.displayAll = function() {
    ctrl.accnts = allAccnts;
  }

  ctrl.refresh = function() {

    var l = ctrl.accnts.length;
    for(var i=0;i<l;i++) {

        (function(i) {
        $http({
          method:"GET",
          url:api+ctrl.accnts[i].name,
          //transformRequest: angular.identity,
          headers:{'Client-ID': 'etiqq1i0rrz4yjkxb1l4cto1wxdt5ee'}
        }).then(function(data) {
          if(data) {
            data.name = ctrl.accnts[i].name;
            data.logo = ctrl.accnts[i].logo;
            ctrl.accnts[i] = null;
            ctrl.accnts[i] = data;
          }
          //ctrl.apply();
        }, function(data) {

        });
      })(i);
    }
    console.log(ctrl.accnts);
  }

  ctrl.addChannel = function() {
    if(ctrl.inputChannel) {
      var pos = allAccnts.map(function(data) { return data.name.toLowerCase(); }).indexOf(ctrl.inputChannel.toLowerCase());
      if(pos === -1 ) {
        ctrl.isLoading = true;
        getChannel(ctrl.inputChannel);
      } else
        ctrl.msg = "channel is already added!";
    }
  }

  ctrl.deleteChannel = function(accnt) {
    if(ctrl.accnts === allAccnts) {
      var pos = allAccnts.map(function(data) { return data.name.toLowerCase(); }).indexOf(accnt.name.toLowerCase());
      allAccnts.splice(pos,1);
    } else {
      var pos = ctrl.accnts.map(function(data) { return data.name.toLowerCase(); }).indexOf(accnt.name.toLowerCase());
      ctrl.accnts.splice(pos,1);
      pos = allAccnts.map(function(data) { return data.name.toLowerCase(); }).indexOf(accnt.name.toLowerCase());
      allAccnts.splice(pos,1);
    }
   //console.log(ctrl.accnts)
   //console.log(allAccnts)

  }
  ctrl.showModal = function(accnt) {
    ctrl.channelToDelete = accnt.name;
    ctrl.showModal = true;
  }

  function getChannel(channel) {
    $http({
       method:"GET",
       url:api+channel,
       headers:{'Client-ID': 'etiqq1i0rrz4yjkxb1l4cto1wxdt5ee'}
    }).then(function(data) {
       console.log(data);
       data.name = channel;
       data.logo = data.data.stream ? data.data.stream.channel.logo :
                   "http://res.cloudinary.com/domarp-j/image/upload/v1461723271/NoProfPic_obve9q.jpg";
       users.push(data);
       allAccnts.push(data);
       ctrl.isLoading = false;
    }, function(data) {
       ctrl.msg = "Channel doesn't exist!";
       ctrl.isLoading = false;
    });
  }
});
