<template>
  <div class="chat-dialog">
    <md-dialog>
      <div v-if="videoCall" class="chat-dialog__left">
        <VideoArea
          :room="showDialog.room"
          :to="showDialog.user"
          :videoAnswer="videoAnswer"
          @closeVideo="video(false)"
        >
        </VideoArea>
      </div>
      <div class="chat-dialog__right">
        <!-- Private chat UI -->
      </div>
    </md-dialog>
  </div>
</template>

<script>
export default {
  name: "ChatDialog",
  components: { ChatArea, VideoArea },
  props: { showDialog: Object },
  sockets: {
    // Signaling listener
    privateMessagePCSignaling: function({ desc, from, candidate }) {
      if (from !== this.$store.state.username) {
        // If it's not my message
        try {
          // RECEIVING A DESCRIPTION
          if (desc) {
            // Incoming call
            if (desc.type === "offer") {
              this.openChat(desc, from); // Open private chat
              // Answer
            } else if (desc.type === "answer") {
              this.videoAnswer = { ...this.videoAnswer, remoteDesc: desc };
            } else {
              console.log("Unsupported SDP type");
            }
            // RECEIVING A CANDIDATE
          } else if (candidate) {
            this.videoAnswer = { ...this.videoAnswer, candidate };
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
  methods: {
    openChat(description, from) {
      this.videoAnswer = {
        ...this.videoAnser,
        video: true,
        remoteDesc: description,
        from,
      };
      this.videoCall = true;
    },
  },
};
</script>
