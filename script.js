// here we are defining this function so that we can  take songs form songs folder using oath api of song 
function convertSecondsToMinutes(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);

    // Add leading zeros if necessary
    let minutesString = minutes < 10 ? '0' + minutes : minutes;
    let secondsString = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    return minutesString + ':' + secondsString;
}
let currfolder;
async function getsongs(folder) {
    currfolder=folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();

    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }


    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songul.innerHTML=""
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `
    <li>
    <img class="invert" src="img/music.svg" alt="">
    <div class="info">
        <div>${song.replaceAll("%20", " ")}</div>
        <div>song artist</div>
    </div>
    <div class="playnow">
        <span>play now</span>
        <img class="invert" src="img/play.svg" alt="">
    </div>
    
</li>`
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName('li')).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })
    return songs;
   
}


let currsong = new Audio();
let songs;
// currsong is declared as new audio only and is also declared as global so that inly 1 song play ata time and then we update src of this only and play this only

const playMusic = (track,pause=false) => {
    currsong.src = `/${currfolder}/` + track
    if(!pause){    currsong.play();
        play.src = "pause.svg"
    }
   
    document.querySelector(".songinfo").innerHTML = decodeURI(track.split(128)[0])
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}


async function displayAlbums(){
    let a= await fetch("http://127.0.0.1:5500/songs/")
    let response=await a.text()
    let div=document.createElement("div")
    div.innerHTML=response
    let anchors=div.getElementsByTagName("a")
    let cardcontainer=document.querySelector('.cardcontainer')
    let array=Array.from(anchors)
    for(let index=0;index<array.length;index++){
        const e=array[index]
        // console.log(e.href)
        if(e.href.includes("/songs/")){
            let folder=e.href.split("/").slice(-1)[0]
            let a= await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
    let response=await a.json()
   
    cardcontainer.innerHTML=cardcontainer.innerHTML+`<div data-folder="${folder}" class="card">
    <div class="play">
        
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" class="icon">
                <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="black" stroke-width="1.5" stroke-linejoin="round" />
            </svg>
      
        
    </div>
    <img src="/songs/${folder}/cover.jpg" alt="">
    <h2>${response.title}</h2>
    <p>${response.description}</p>
</div>`
    console.log(response)
        }
    }
    // console.log(folders)
    Array.from(document.getElementsByClassName("card")).forEach((e)=>{
        console.log(e)
        e.addEventListener("click",async item=>{
        
        songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
        playMusic(songs[0])
        console.log(item.currentTarget.dataset.folder)})
    })
}

// as async returns promise so we have to write and make main functiion and then do al other stuff
async function main() {

   await getsongs("songs/ncs")
    // console.log(songs)
playMusic(songs[0],true)
   
displayAlbums();

    let play = document.querySelector("#play")
    play.addEventListener("click", () => {
        if (currsong.paused) {
            currsong.play()
            play.src = "pause.svg"
        }
        else {
            currsong.pause()
            play.src = "play.svg"
        }
    })
currsong.addEventListener("timeupdate",()=>{
    // console.log(currsong.currentTime,currsong.duration)
    document.querySelector(".songtime").innerHTML=`${convertSecondsToMinutes(currsong.currentTime)} / ${convertSecondsToMinutes(currsong.duration)}`
    document.querySelector(".circle").style.left=(currsong.currentTime/currsong.duration)*100+"%";
})


document.querySelector(".seekbar").addEventListener("click",(e)=>{
    let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
    document.querySelector(".circle").style.left=percent+"%"
    currsong.currentTime=((currsong.duration)*percent)/100
})


document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left="0"
})

document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-120%"
})

let previous=document.querySelector("#prev")
let next=document.querySelector("#next")




previous.addEventListener("click",()=>{
    console.log("previous clicked")
let index=songs.indexOf(currsong.src.split("/").slice(-1)[0])
    
    if((index-1)>=0){
        playMusic(songs[index-1])
    }
})
next.addEventListener("click",()=>{
          console.log("next clicked")
    let index=songs.indexOf(currsong.src.split("/").slice(-1)[0])
    if((index+1)<songs.length){
        playMusic(songs[index+1])
    }
})


document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
console.log("setting volume to",e.target.value,"/ 100")
currsong.volume=parseInt(e.target.value)/100
})


document.querySelector(".volume").firstElementChild.addEventListener("click",(e)=>{
console.log(e.target.src)
    if(e.target.src.includes("volume.svg")){
        e.target.src=e.target.src.replaceAll("volume.svg","mute.svg")
        currsong.volume=0
        document.querySelector(".range").getElementsByTagName("input")[0].value=0
    }
    else{
        e.target.src=e.target.src.replaceAll("mute.svg","volume.svg")
        currsong.volume=.10
        document.querySelector(".range").getElementsByTagName("input")[0].value=10

    }
})
document.querySelector("")
}

main()
