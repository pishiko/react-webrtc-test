import './App.css';
import Peer from 'skyway-js';
import React,{useState,useRef} from 'react';

const peer = new Peer({
  key: process.env.REACT_APP_SKYWAY_KEY,
  debug:3,
})
function App() {
  const [myPeerId,setMyPeerId] = useState();
  const [theirPeerId,setTheirPeerId] = useState("");

  const myVideoRef = useRef();
  const theirVideoRef = useRef();

  peer.on('open',()=>{
    setMyPeerId(peer.id);
    navigator.mediaDevices.getUserMedia({video:true, audio:true})
    .then(stream => {
        myVideoRef.current.srcObject = stream;
        //videoElm.play();
      }).catch(error=>{
        console.error('mediaDevide.getUserMedia() error:',error);
        return;
      })
  })

  peer.on('call',mediaConnection => {
    mediaConnection.answer(myVideoRef.current.srcObject)

    mediaConnection.on('stream', stream => {
      theirVideoRef.current.srcObject = stream
      theirVideoRef.play();
    })
  })
  return (
    <div className="App">
      <header className="App-header">
      <video 
        ref={myVideoRef}
        width={"480px"}
        autoPlay muted playsInline
        ></video>
      <p>・{myPeerId}</p>
      <input 
        type="text"
        value={theirPeerId} 
        onChange={(event) => {setTheirPeerId(event.target.value)}}
        />
      <button onClick={makeCall}>Call</button>
      <video
        ref={theirVideoRef}
        width={"400px"}
        autoPlay muted playsInline
      ></video>
      </header>

    </div>
  );

  function makeCall(){
    const mediaConnection = peer.call(theirPeerId,myVideoRef.current.srcObject);
    mediaConnection.on('stream',stream => {
      theirVideoRef.current.srcObject = stream;
      theirVideoRef.current.play();
    })
    
  }
}


export default App;
