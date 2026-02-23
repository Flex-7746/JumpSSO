module.exports = {
  uid: (v) => (v ? `uid_${v}` : undefined),
  grantId: (v) => (v ? `grant_${v}` : undefined),
};
