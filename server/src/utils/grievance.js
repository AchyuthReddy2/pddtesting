function makeTicketId() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `VC-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${String(Math.floor(Math.random() * 100)).padStart(2, '0')}`;
}

function progressGrievance(g) {
  if (!g.submittedAt || g.status === 'resolved') return g;
  const hours = (Date.now() - new Date(g.submittedAt).getTime()) / 3600000;
  const doc = g.toObject ? g.toObject() : { ...g };
  if (hours >= 48) {
    doc.status = 'resolved';
    doc.response = doc.response || 'Issue has been resolved by the panchayat.';
  } else if (hours >= 24) {
    doc.status = 'inProgress';
    doc.response = doc.response || 'Your complaint is being reviewed by the panchayat.';
  }
  return doc;
}

module.exports = { makeTicketId, progressGrievance };
