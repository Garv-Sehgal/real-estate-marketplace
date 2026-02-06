const ROLES = {
    BUYER: 'buyer',
    TENANT: 'tenant',
    LANDLORD: 'landlord',
    AGENT: 'agent',
    ADMIN: 'admin',
    STAFF: 'staff',
    SUPER_ADMIN: 'super_admin'
};

const SELF_REGISTER_ROLES = [
    ROLES.BUYER,
    ROLES.TENANT,
    ROLES.LANDLORD,
    ROLES.AGENT
];

module.exports = {
    ROLES,
    SELF_REGISTER_ROLES
};
