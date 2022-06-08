const router = require(`express`).Router();
const oauth = require(`./oauth`);
const asanaUserRoutes = require(`./users`);
const asanaTaskRoutes = require(`./tasks`);

router.use(`/oauth`, oauth);
router.use(`/users`, asanaUserRoutes);
router.use(`/tasks`, asanaTaskRoutes);

module.exports = router;
