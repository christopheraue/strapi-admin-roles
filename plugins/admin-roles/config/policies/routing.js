/*
 * This is a policy handling controller redirection. It only changes routes
 * having a custom controller an leaves every other one as it is.
 */

module.exports = async (ctx, next) => {
  if (!ctx.state.admin) return await next()
  if (ctx.state.admin.role === 'admin') return await next()
  const controller = strapi.plugins['admin-roles'].controllers[ctx.request.route.controller]
  const action = controller && controller[ctx.request.route.action]
  if (!action) return await next()
  await action(ctx)
}
