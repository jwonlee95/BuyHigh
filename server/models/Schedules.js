module.exports = (sequelize, DataTypes) => {

    const Schedules = sequelize.define("Schedules", {
        start: {
            type: DataTypes.DATEONLY,
            defaultValue: sequelize.literal('CURDATE()'),
            allowNull: false,
        },
        end: {
            type: DataTypes.DATEONLY,
            defaultValue: sequelize.literal('DATE_ADD(CURDATE(), INTERVAL 3 DAY)'),
            allowNull: false,
        },
    }, {
        timestamps: false,
    });
    return Schedules;
}