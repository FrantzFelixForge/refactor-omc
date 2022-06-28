const router = require(`express`).Router();
const oauth = require(`./oauth`);
const asanaUserRoutes = require(`./users`);
const asanaTaskRoutes = require(`./tasks`);
const asanaProjectRoutes = require(`./projects`);
const asanaWorkspaceRoutes = require(`./workspaces`);
const asanaTeamRoutes = require(`./teams`);
const asanaCustomFieldRoutes = require(`./customFields`);
const asanaWebhookRoutes = require(`./webhooks`);

router.use(`/oauth`, oauth);
router.use(`/users`, asanaUserRoutes);
router.use(`/tasks`, asanaTaskRoutes);
router.use(`/projects`, asanaProjectRoutes);
router.use(`/workspaces`, asanaWorkspaceRoutes);
router.use(`/teams`, asanaTeamRoutes);
router.use(`/customFields`, asanaCustomFieldRoutes);
router.use(`/webhooks`, asanaWebhookRoutes);

module.exports = router;
