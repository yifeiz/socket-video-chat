<template>
  <div class="video">
    <div class="video__partner">
      <!-- Loading component whilst we wait for the remote video track -->
      <rotate-square5
        v-if="!remoteStream"
        class="video__spinner"
      ></rotate-square5>
      <!-- Remote video -->
      <video id="remoteVideo" class="video__spinner" autoplay></video>
    </div>
    <!-- Local video -->
    <video id="localVideo" class="video__myself" autoplay></video>
  </div>
</template>

<script>
export default {
  props: [],// room (String), to(String), videoAnswer(Object)
  data: function() {}, // Media & Offer config, STUN ICE servers, RTC objec, streams & video
  async created() {
    await this.getUserMedia() // Get camera access

    this.createPeerConnection(); // Create RTCPeerConnection object
    this.addLocalStream(); // Add local video stream
    this.onIceCandidates(); // Add event listeners
    this.onAddStream();

    !this.videoAnswer.video ? // Handle logic
      this.callFriend() : // Caller
      this.handleAnser() // Callee
    }
  },
  methods: {
    // CALLER
    callFriend() {
      this.createOffer(); // Create offer
    },
    // CALLEE
    async handleAnser() {
      await this.setRemoteDescription(this.videoAnswer.remoteDesc); // Set remote description
      this.createAnswer(); // Create the answer
    },
    async getUserMedia() {
      if ("mediaDevices" in navigator) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia(this.constraints);
          this.myVideo.srcObject = stream;
          this.localStream = stream;
        } catch (error) {
          log(`getUserMedia error: ${error}`);
        }
      }
    },
    createPeerConnection() {
      this.pc = new RTCPeerConnection(this.configuration) // RTCPeerConnection object
    },
    async createOffer() {
      try {
        const offer = await this.pc.createOffer(this.offerOptions) // Create offer
        await this.pc.setLocalDescription(offer) // Add local description
        this.sendSignalingMessage(this.pc.localDescription, true) // Send signaling message
      } catch (error) {
        log(`Error creating the offer from ${this.username}. Error: ${error}`);
      }
    },
    async createAnswer() {
      try {
        const answer = await this.pc.createAnswer() // Create answer
        await this.pc.setLocalDescription(answer) // Add local description
        this.sendSignalingMessage(this.pc.localDescription, false) // Send signaling message
      } catch (error) {
        log(`Error creating the answer from ${this.username}. Error: ${error}`);
      }
    },
    sendSignalingMessage(desc, offer) { // Send the offer to the other peer
      this.$socket.emit("privateMessagePCSignaling", {
        desc,
        to: this.to,
        from: this.$store.state.username,
        room: this.room
      });
    },
    setRemoteDescription(remoteDesc) {
      this.pc.setRemoteDescription(remoteDesc);
    },
    addLocalStream(){
      this.pc.addStream(this.localStream)
    },
    addCandidate(candidate) {
      this.pc.addIceCandidate(candidate);
    },
    onIceCandidates() { // send any ice candidates to the other peer
      this.pc.onicecandidate = ({ candidate }) => {
        this.$socket.emit("privateMessagePCSignaling", {
          candidate,
          to: this.to,
          from: this.$store.state.username,
          room: this.room
        })
      }
    },
    onAddStream() { // Attach remote video track
      this.pc.onaddstream = (event) => {
        if(!this.remoteVideo.srcObject && event.stream){
          this.remoteStream = event.stream
          this.remoteVideo.srcObject = this.remoteStream ;
        }
      }
    }
  }
};
</script>
