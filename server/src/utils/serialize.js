/** Map Mongoose docs to API shape with string `id` */
function toJSON(doc) {
  if (!doc) return null;
  if (Array.isArray(doc)) return doc.map(toJSON);
  const o = doc.toObject ? doc.toObject() : { ...doc };
  if (o._id) {
    o.id = String(o._id);
    delete o._id;
  }
  if (o.__v !== undefined) delete o.__v;
  return o;
}

function formatRelativeTime(date) {
  const ms = Date.now() - new Date(date).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

module.exports = { toJSON, formatRelativeTime };
