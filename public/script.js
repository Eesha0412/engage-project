const socket=io('/');
const videoGrid=document.getElementById('video-grid');

const myPeer = new Peer(undefined,{
    path:'/peerjs',
    host:'/',
    port:'443',
})
const myV=document.createElement('video');
myV.muted=true;

let myVideo //global variable

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream =>{  // after we have given the permission stream the video 
    myVideo=stream;
    addVideoStream(myV,stream);

    myPeer.on('call', call => {
        call.answer(stream)
        const video=document.createElement('video')
        call.on('stream',userVideoStream =>{
            addVideoStream(video,userVideoStream)
        })
    })


    socket.on('user-connected',userId =>{
        setTimeout(()=> {
            connecttonewuser(userId,stream)
        },3000 )
    })
    
    let text = $('input')
    // console.log(text)

    $('html').keydown((e) =>{
        if(e.which==13 && text.val().length !==0){ // 13 is the value for enter key 
            socket.emit('message',text.val());
            text.val('')
        }
    })

    socket.on('createMessage',message =>{
        $('ul').append(`<li class="message"><b>user</b><br/>${message}</li>`);
        scrollToBottom()
    }) 
} )

myPeer.on('open', id =>{
    socket.emit('join-room',ROOM_ID,id);
}) 

const connecttonewuser= (userId,stream)=>{
    const call=myPeer.call(userId,stream)
    const video=document.createElement('video')
    call.on('stream', userVideoStream=> {
        addVideoStream(video,userVideoStream)
    })
}

const addVideoStream = (video,stream) => {
    video.srcObject=stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    videoGrid.append(video);
}

const scrollToBottom =() =>{
    let d=$('chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}

// enable start/stop video and mute button 

const muteUnmute= () => {
    const enabled=myVideo.getAudioTracks()[0].enabled;
    if(enabled){
        myVideo.getAudioTracks()[0].enabled=false;
        setUnmuteButton();
    }
    else{
        setMuteButton();
        myVideo.getAudioTracks()[0].enabled=true;
    }
}

const setMuteButton =() =>{
    const html=`
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
    `
    document.querySelector('.mute_button').innerHTML =html;
}
const setUnmuteButton =() =>{
    const html=`
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
    `
    document.querySelector('.mute_button').innerHTML =html;
}

const playStop =() => {
    let enabled=myVideo.getVideoTracks()[0].enabled;
    if(enabled){
        myVideo.getVideoTracks()[0].enabled=false;
        setPlayVideo();
    }
    else{
        setStopVideo();
        myVideo.getVideoTracks()[0].enabled=true;
    }
}

const setStopVideo =() =>{
    const html=`
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
    `
    document.querySelector('.video_button').innerHTML =html;
}
const setPlayVideo =() =>{
    const html=`
    <i class="stop fas fa-video-slash"></i>
    <span>Start Video</span>
    `
    document.querySelector('.video_button').innerHTML =html;
}

function close_window() {
    if (confirm("Close Window?")) {
      close();
    }
}






