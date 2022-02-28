module.exports = (sequelize, DataTypes) => {

    const Items = sequelize.define("Items", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        timestamps: false,
    });
    return Items;
}