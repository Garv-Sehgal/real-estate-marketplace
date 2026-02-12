const ROLES = {
    BUYER: 'buyer',
    TENANT: 'tenant',
    AGENT: 'agent',
    LANDLORD: 'landlord',
    STAFF: 'staff',
    ADMIN: 'admin',
    SUPER_ADMIN: 'super_admin'
};

const SELF_REGISTER_ROLES = [
    ROLES.BUYER,
    ROLES.TENANT,
    ROLES.AGENT,
    ROLES.LANDLORD
];

// Authority hierarchy
const ROLE_LEVEL = {
    buyer: 1,
    tenant: 1,
    landlord: 2,
    agent: 3,
    staff: 4,
    admin: 4,
    super_admin: 5
};

module.exports = {
    ROLES,
    ROLE_LEVEL,
    SELF_REGISTER_ROLES
};
