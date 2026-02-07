const ROLES = {
    BUYER: 'buyer',
    TENANT: 'tenant',
    AGENT: 'agent',
    LANDLORD: 'landlord',
    STAFF: 'staff',
    ADMIN: 'admin',
    SUPER_ADMIN: 'super_admin'
};

// Who can signup themselves
const SELF_REGISTER_ROLES = [
    ROLES.BUYER,
    ROLES.TENANT,
    ROLES.AGENT,
    ROLES.LANDLORD
];

// Optional — for future hierarchy
const ROLE_LEVEL = {
    buyer: 1,
    tenant: 1,
    agent: 2,
    landlord: 2,
    staff: 3,
    admin: 4,
    super_admin: 5
};

module.exports = {
    ROLES,
    ROLE_LEVEL,
    SELF_REGISTER_ROLES
};
