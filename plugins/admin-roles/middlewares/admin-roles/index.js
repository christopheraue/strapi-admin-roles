/*
 * Inject a middleware into strapi's request handling so we can
 * redirect some of the content manager's controllers to our
 * custom ones.
 */

module.exports = strapi => {
  return {
    beforeInitialize() {
      const idx = strapi.config.middleware.load.before.indexOf('users-permissions')+1
      strapi.config.middleware.load.before.splice(idx, 0, 'admin-roles')
    },

    initialize() {
      strapi.plugins['content-manager'].config.routes.forEach(route => {
        const idx = route.config.policies.indexOf('plugins::users-permissions.permissions')+1
        route.config.policies.splice(idx, 0, 'plugins::admin-roles.routing')
      })
    }
  }
}
