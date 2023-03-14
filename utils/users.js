const users = [];

// Join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id); // for each user check this  
  
    if (index !== -1) { //if not found returns 1
      return users.splice(index, 1)[0]; // 0 -> instead of entire array return one user
    }
  }
  
  // Get room users
  function getRoomUsers(room) {
    return users.filter(user => user.room === room);
  }
  
  module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
  };