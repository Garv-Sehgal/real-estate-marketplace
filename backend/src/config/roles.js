/**
 * Central Role Configuration
 * Single source of truth for the entire authorization system
 */

const ROLES = {
    BUYER: 'buyer',
    TENANT: 'tenant',

    LANDLORD: 'landlord',
    AGENT: 'agent',

    STAFF: 'staff',
    ADMIN: 'admin',

    SUPER_ADMIN: 'super_admin'
};

/**
 * Roles allowed to self-register.
 * Internal roles must ALWAYS be created by the system.
 */
const SELF_REGISTER_ROLES = [
    ROLES.BUYER,
    ROLES.TENANT,
    ROLES.LANDLORD,
    ROLES.AGENT
];

/**
 * Role hierarchy (Power Levels)
 *
 * IMPORTANT:
 * - Hierarchy is for SYSTEM authority.
 * - Resource ownership should control marketplace actions.
 *
 * Higher number = higher authority.
 */

const ROLE_LEVEL = {
    [ROLES.BUYER]: 1,
    [ROLES.TENANT]: 1,

    // Marketplace suppliers (parallel authority)
    [ROLES.LANDLORD]: 2,
    [ROLES.AGENT]: 2,

    // Internal operators
    [ROLES.STAFF]: 3,
    [ROLES.ADMIN]: 3,

    // Absolute authority
    [ROLES.SUPER_ADMIN]: 4
};

module.exports = {
    ROLES,
    SELF_REGISTER_ROLES,
    ROLE_LEVEL
};
