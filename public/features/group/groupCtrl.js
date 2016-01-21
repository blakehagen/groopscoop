angular.module('groupScoop').controller('groupCtrl', function ($rootScope, $scope, groupService, socketService, userService, invitationService, $timeout, $stateParams, $location, $sanitize) {

    if (!$rootScope.user) {
        $location.path('/');
    };
   
    // // // // // // // // // // // // // // // // // // // // //
    // // GET GROUP DATA AFTER A GROUP IS SELECTED TO ENTER // //
    // // // // // // // // // // // // // // // // // // // // //
    
    //  var count = 10;
    // Get data of group that was clicked (via group service) //
    $scope.getGroupData = function (groupId) {

        groupService.getGroup(groupId /*,count*/).then(function (group) {
            // count += 11;
            // console.log('grp data ', group);
            $scope.groupData = group;
            // for (var i = 0; i < $scope.groupData.posts.length; i++) {
            //     console.log('$scope.groupData.posts.comments: ', $scope.groupData.posts[i].comments.length);
            // }


            $scope.groupData.groupNameUpperCase = group.groupName.toUpperCase();
            
            // Check if Members of Grp > 5 to show scroll icon //
            if ($scope.groupData.users.length > 5) {
                $scope.scrollMbr = true;
            } else {
                $scope.scrollMbr = false;
            };
        });
    };

    $scope.getGroupData($stateParams.id);
    
    // Check if groups > 5 to show scroll icon //
    if ($rootScope.user.groups.length > 5) {
        $scope.scrollGrps = true;
    } else {
        $scope.scrollGrps = false;
    };


    // console.log('authed user: ', $rootScope.user);
    $scope.authedUser = {
        id: $rootScope.user._id,
        img: $rootScope.user.google.image,
        name: $rootScope.user.google.name
    };
    
    // USER OBJECT INFO FOR USE WITH NEW POSTS //
    var user = {
        id: $rootScope.user._id,
        google: {
            name: $rootScope.user.google.name,
            image: $rootScope.user.google.image
        },
        groups: $rootScope.user.groups
    };

    $scope.toggleInput = function () {
        $scope.linkBox = !$scope.linkBox;
    };

    // POST NEW MESSAGE TO GROUP //
    $scope.postNew = function () {
        if (!$scope.newMessage) {
            return false;
        }
        $scope.postData = {
            postedBy: user.id,
            group: $scope.groupData._id,
            datePosted: moment().format('ddd MMM DD YYYY, h:mm a'),
            dateCreatedNonRead: new Date(),
            postContent: {
                message: $scope.newMessage,
                linkUrl: $scope.linkUrl
            }
        };

        // console.log($scope.postData);
        $scope.newMessage = '';
        $scope.linkUrl = '';
        $scope.linkBox = false;
        
        // SEND NEW POST TO DB //
        groupService.postNewMessage($scope.postData).then(function (response) {
            // console.log('response from server ', response);
            
            // TO UPDATE VIEW WHEN NEW POST //
            $scope.postData.postedBy = user;
            $scope.postData._id = response._id;
            $scope.postData.dateCreatedNonRead = response.dateCreatedNonRead;
            if (response.postContent.embedlyImg !== undefined) {
                $scope.postData.postContent.embedlyImg = response.postContent.embedlyImg;
                $scope.postData.postContent.embedlyType = response.postContent.embedlyType;
            }
            if ($scope.postData.postContent.embedlyImg) {
                if ($scope.postData.postContent.embedlyImg.toLowerCase().match(/\.(gif)/g)) {
                    $scope.postData.postContent.embedlyType = 'gif'
                }
            }
            // console.log('sending this data to socketIO ', $scope.postData);
            socketService.emit('sendNewPost', $scope.postData);
            // console.log('new post data: ', $scope.postData);
            $scope.postData = {};
        })
    };

    // Listening for New Posts //
    socketService.on('getNewPost', function (data) {
        // console.log('socketdata coming back from server after new post: ', data);
        if (data.group === $scope.groupData._id) {
            $scope.groupData.posts.push(data);
        }
        // console.log('array of posts after new post added: ', $scope.groupData.posts);
    });
    
    // Listening for New Invitations //
    socketService.on('invitationGet', function (data) {
        // console.log('invitation socket data coming back from server: ', data);
        if (data._id === $rootScope.user._id) {
            $rootScope.myInvites.unshift(data.invitations[data.invitations.length - 1]);
        }
    });
    
    // Listening for New Members of Grp //
    socketService.on('userAdded', function (data) {
        // console.log('invitation socket data coming back from server: ', data);
        if (data === $stateParams.id) {
            $scope.getGroupData($stateParams.id);
        }
    });
    
    
    // Invite Others (Getting users from DB to search) //
    $scope.redPlus = true;
    $scope.openInviteBox = function () {
        $scope.grayPlusToggle = !$scope.grayPlusToggle;
        $scope.inviteOthers = !$scope.inviteOthers;
        if ($scope.inviteOthers === true) {
            userService.searchUsers().then(function (usersFromDb) {
                $scope.allUsers = usersFromDb;
                // console.log('invite others: ', $scope.allUsers);
            })
        }
    };

    // Toggle Action to send the invite to selected user //
    $scope.selectedUserToInvite = function (selected) {
        if (selected) {
            // console.log(selected);
            $scope.sendThisUserInvite = selected.description.id;
            $scope.redPlus = false;
            $scope.redPlusToggle = true;
            $scope.grayPlusToggle = false;
        }
    };

    $scope.sendIndividualInvite = function () {
        // console.log($scope.sendThisUserInvite);
        invitationService.sendOneInvite($scope.sendThisUserInvite, $stateParams.id /*$rootScope.groupData._id */);
        invitationService.clearInputForInvite();
        $scope.showInviteSuccess = true;
        $scope.redPlusToggle = false;
        $scope.grayPlusToggle = false;
        $timeout(function () {
            $scope.inviteOthers = false;
            $scope.redPlus = true;
            $scope.showInviteSuccess = false;
        }, 800);
    };
    

    
    
    
  


    ///////////////////////////////////
    ////// NG-EMBED OPTIONS DATA //////
    ///////////////////////////////////
    $scope.options = {
        link: false,      //convert links into anchor tags 
        linkTarget: '_blank',   //_blank|_self|_parent|_top|framename 
        pdf: {
            embed: true                 //to show pdf viewer. 
        },
        image: {
            embed: true                //to allow showing image after the text gif|jpg|jpeg|tiff|png|svg|webp. 
        },
        audio: {
            embed: true                 //to allow embedding audio player if link to 
        },
        code: {
            highlight: false,        //to allow code highlighting of code written in markdown 
            //requires highligh.js (https://highlightjs.org/) as dependency. 
            lineNumbers: false        //to show line numbers 
        },
        basicVideo: true,     //to allow embedding of mp4/ogg format videos 
        gdevAuth: 'xxxxxxxx', // Google developer auth key for youtube data api 
        video: {
            embed: true,    //to allow youtube/vimeo video embedding 
            width: null,     //width of embedded player 
            height: null,     //height of embedded player 
            ytTheme: 'dark',   //youtube player theme (light/dark) 
            details: false,    //to show video details (like title, description etc.) 
        },
        tweetEmbed: true,
        tweetOptions: {
            //The maximum width of a rendered Tweet in whole pixels. Must be between 220 and 550 inclusive. 
            maxWidth: 550,
            //When set to true or 1 links in a Tweet are not expanded to photo, video, or link previews. 
            hideMedia: false,
            //When set to true or 1 a collapsed version of the previous Tweet in a conversation thread 
            //will not be displayed when the requested Tweet is in reply to another Tweet. 
            hideThread: false,
            //Specifies whether the embedded Tweet should be floated left, right, or center in 
            //the page relative to the parent element.Valid values are left, right, center, and none. 
            //Defaults to none, meaning no alignment styles are specified for the Tweet. 
            align: 'none',
            //Request returned HTML and a rendered Tweet in the specified. 
            //Supported Languages listed here (https://dev.twitter.com/web/overview/languages) 
            lang: 'en'
        },
        twitchtvEmbed: true,
        dailymotionEmbed: true,
        tedEmbed: true,
        dotsubEmbed: true,
        liveleakEmbed: true,
        soundCloudEmbed: true,
        soundCloudOptions: {
            height: 160, themeColor: 'f50000',   //Hex Code of the player theme color 
            autoPlay: false,
            hideRelated: false,
            showComments: true,
            showUser: true,
            showReposts: false,
            visual: false,         //Show/hide the big preview image 
            download: false          //Show/Hide download buttons 
        },
        spotifyEmbed: true,
        codepenEmbed: true,        //set to true to embed codepen 
        codepenHeight: 300,
        jsfiddleEmbed: true,        //set to true to embed jsfiddle 
        jsfiddleHeight: 300,
        jsbinEmbed: true,        //set to true to embed jsbin 
        jsbinHeight: 300,
        plunkerEmbed: true,        //set to true to embed plunker 
        githubgistEmbed: true,
        ideoneEmbed: true,        //set to true to embed ideone 
        ideoneHeight: 300
    };
    
    // // // // // // // // // // // // // // // // // // // /
    // // DESTROY SOCKET CONNECTIONS TO AVOID DUPLICATES // //
    // // // // // // // // // // // // // // // // // // // 
    
    $scope.$on('$destroy', function (event) {
        socketService.removeAllListeners();
        // console.log('$Destroy triggered!');
    });


});