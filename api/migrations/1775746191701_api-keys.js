/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const up = (pgm) => {
    pgm.createTable('api_keys', {
        id_api: {
            type: 'serial',
            primaryKey: true
        },
        id_device: {
            type: 'integer',
            notNull: true,
            references: 'devices(id_device)',
            onDelete: 'cascade'
        },
        key: {
            type: 'text',
            notNull: true,
            unique: true
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
    pgm.dropTable('api_keys');
};