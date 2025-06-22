
let songs;
let currFolder;



   let currentSong= new Audio()
   //converts seconds into the required format
   function formatTime(seconds) {
    if (isNaN(seconds) || seconds <0){
      return "00:00"
    }
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return (
    String(minutes).padStart(2, '0') + ':' + String(secs).padStart(2, '0')
  );
}


async function GetSongs(folder) {
    currFolder=folder;

let a =await fetch(`/Songs/${folder}/`)

 let respose = await a.text()
 console.log(respose)
 let div=document.createElement("div")
 div.innerHTML=respose;
 let as=div.getElementsByTagName("a")
  songs=[]

 for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith("mp3")){
        songs.push(element.href.split(`/${folder}/`)[1])
    }
 }
 // show all the songs in the play lists
 let songUL=document.querySelector(".songLists").getElementsByTagName("ul")[0];
 songUL.innerHTML=""
 for (const song of songs) {
    songUL.innerHTML=songUL.innerHTML + ` <li><img class="invert MusicLogo" src="img/music.svg.svg" alt="music logo">
                            <div class="songinfo ">
                                <div>${song.replaceAll("%20"  ," ")} </div>
                                <div> Zohaib </div>
                            </div>
                            <div class="PlayNow">

                                <span>Play Now</span>
                                <img class=" playButtonLogo" src="img/playButton.svg" alt="playLogo">
                            </div>
     </li>`;
     // attach event listeners to each list
  
     Array.from(document.querySelector(".songLists").getElementsByTagName("li") ).forEach(element => {
      element.addEventListener("click", e =>{
//solve this first
         console.log(element.querySelector(".songinfo").firstElementChild.innerHTML)
         playMusic(element.querySelector(".songinfo").firstElementChild.innerHTML.trim())
      })
     
     });


 }





return songs;



 }

 const playMusic = (track ,pause=false) => { 
currentSong.src=`/Songs/${currFolder}/`+track
if(!pause){ 
currentSong.play()
playB.src="img/paused.svg";
}
   document.querySelector(".songinfo-bar").innerText= track.replaceAll("%20", " ");
   document.querySelector(".songtime").innerHTML="00:00 / 00:00"
 }

async function DisplayAlbums() {
  let a =await fetch(`/Songs/`)

 let respose = await a.text()

 let div=document.createElement("div")
 div.innerHTML=respose;
 let anchors =div.getElementsByTagName("a")
 let cardcontainer=document.querySelector(".cardcontainer")
let array= Array.from(anchors)
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    
  
   if (e.href.includes("/Songs" ) && !e.href.includes(".htaccess")){ 
     let fold=(e.href.split("/").slice(-2)[0])
       let a =await fetch(`/Songs/${fold}/info.json`)
 let response = await a.json()
 console.log(response)
  cardcontainer.innerHTML=cardcontainer.innerHTML+ `    <div data-folder="${fold}" class="card">
                    <div class="play">
                        <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">

                            <circle cx="50" cy="50" r="50" fill="#1ED760" />


                            <polygon points="40,30 40,70 70,50" fill="black" />
                        </svg>
                    </div>

                    <img src="/Songs/${fold}/card.jpg" alt="card">
                    <h2>${response.title}</h2>
                    <P>${response.Description}</P>
                </div>`
     }
 }
   
     // load the playlist whenever the card is clicked
   Array.from(document.getElementsByClassName("card")).forEach( e => {
    e.addEventListener("click" ,async item => { 
        songs=await GetSongs(`${ item.currentTarget.dataset.folder}`)
         playMusic(songs[0], false); 
  

     })
   })



//


  // add an event listener to volume
  document.querySelector(".volume-container").getElementsByTagName("input")[0].addEventListener("change", (e) => { 
console.log(e, e.target, e.target.value )
currentSong.volume=parseInt(e.target.value)/100

   })
   // to mute the volume


   
   document.querySelector(".volume").addEventListener("click", () => {
     if (currentSong.volume=="1"){
      currentSong.volume="0"
      MuteNContinue.src="img/mute.svg"
      document.querySelector(".volume-container").getElementsByTagName("input")[0].value=0;
     }
     else {
currentSong.volume="1"
 MuteNContinue.src="img/volume.svg"
 document.querySelector(".volume-container").getElementsByTagName("input")[0].value=10;
     }

   }
   )
   //attach an event listener to each song 
playB.addEventListener("click", () => { 
   if (currentSong.paused){
      currentSong.play()
      playB.src="img/paused.svg";
     
      
   }
   else{
      currentSong.pause()
      playB.src="img/PLAY.svg"
   }
 })

   next.addEventListener("click", () => { 
let index=songs.indexOf(currentSong.src.split("/").slice(-1) [0])
console.log("next clicked")
if ((index+1) < songs.length ){
  playMusic(songs[index+1])
}

  })
        previous.addEventListener("click", () => {
  console.log("previous clicked") 
let index=songs.indexOf(currentSong.src.split("/").slice(-1)  [0])
if ((index-1) >= 0 ){
  playMusic(songs[index-1])
}

  })



}




async function Main() {
  


  

    //get the list of the songs
  await GetSongs("ncs")
  playMusic(songs[0],true)


 //display albums
 DisplayAlbums()

var audio = new Audio(`/Songs/${currFolder}/${songs[2]}`);
//  audio.play();    stopped during developing because the sound was annoying 
 audio.addEventListener("loadeddata", () => {
  let duration = audio.duration;
  console.log(audio.duration,audio.currentSrc,audio.currentTime)

  // The duration variable now holds the duration (in seconds) of the audio clip
});   

 // tells the time
 
 currentSong.addEventListener("timeupdate" , () => { 

   console.log(currentSong.currentTime , currentSong.duration)
   
   let Nancheck=document.querySelector(".songtime").innerHTML=`${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`
   document.querySelector(".circle").style.left=(currentSong.currentTime / currentSong.duration) *100 +"%"

     document.querySelector(".seekbar").addEventListener("click", e => { 
      let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
       document.querySelector(".circle").style.left=percent +"%"
       currentSong.currentTime=((currentSong.duration) *percent)/100
      })
   
 })
 // add an event lisitener to hamBurger icon
 let hamBurger=document.querySelector(".hamburger")
 hamBurger.addEventListener("click", () => { 
   document.querySelector(".left").style.left="0"
 }) 
 // adding event listener to  cross button 
 let C=document.querySelector(".cross")
 C.addEventListener("click", () => { 
   document.querySelector(".left").style.left="-100%"
 })
 // add an event listener to previous 



   // add an event listener to  next



}  




  
Main()






