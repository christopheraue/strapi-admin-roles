/*
 * The 'admin' plugin just exists to trick strapi
 * into believing admin is a regular plugin whose
 * models can be used in relations of regular models.
 * This file is a no-op and just makes sure the plugin
 * is not empty and strapi actually loads it.
 */
module.exports = () => {}
