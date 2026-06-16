const { toJSON } = require('./serialize');

function formatUser(user) {
  const u = toJSON(user);
  u.joinedGroups = (user.joinedGroups || []).map(String);
  u.schemeRSVPs = (user.schemeRSVPs || []).map(String);
  u.readThreads = (user.readThreads || []).map(String);
  u.personalEmergencyContacts = (user.personalEmergencyContacts || []).map((c) => ({
    id: String(c._id),
    name: c.name,
    phone: c.phone,
  }));
  return u;
}

module.exports = { formatUser };
