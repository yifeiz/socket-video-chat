const redis = require("redis");
const bluebird = require("bluebird");
const config = require("./../config/");

bluebird.promisifyAll(redis); // Using promises

function ChatRedis() {
  this.client = redis.createClient({ host: config.REDIS_HOST });
}
ChatRedis.prototype.addUser = function(room, socketId, userObject) {
  this.client.hsetAsync(room, socketId, JSON.stringify(userObject)).then(
    () =>
      console.debug(
        "addUser ",
        userObject.username + " added to the room " + room
      ),
    (err) => console.log("addUser", err)
  );
};
ChatRedis.prototype.getUser = function(room, socketId) {
  return this.client.hgetAsync(room, socketId).then(
    (res) => JSON.parse(res),
    (err) => {
      console.log("getUser ", err);
      return null;
    }
  );
};
// getUsers, delUser, setUser implementations

module.exports = new ChatRedis();
