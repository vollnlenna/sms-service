/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const up = (pgm) => {
    pgm.createTable('devices', {
        id_device: {
            type: 'integer',
            primaryKey: true
        },
        name: {
            type: 'varchar(255)',
            notNull: true
        },
        phone_number: {
            type: 'varchar(20)',
            notNull: true
        },
        is_active: {
            type: 'boolean',
            notNull: true,
            default: true
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('now()')
        }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const down = (pgm) => {
    pgm.dropTable('devices');
};